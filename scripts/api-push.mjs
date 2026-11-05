#!/usr/bin/env node
/**
 * 通过 GitHub REST API 推送本地提交（当 github.com:443 不可达时使用）
 * 用法：node scripts/api-push.mjs <owner/repo> <commit-sha> <branch>
 */
import { execFileSync } from "node:child_process";

const [repo, commitSha, branch] = process.argv.slice(2);
if (!repo || !commitSha || !branch) {
  console.error("用法: node api-push.mjs owner/repo <sha> <branch>");
  process.exit(1);
}

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!token) {
  console.error("缺少 GH_TOKEN 环境变量");
  process.exit(1);
}

const API = "https://api.github.com";

async function api(path, method = "GET", body) {
  const res = await fetch(API + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
}

// 1. 递归列出提交涉及的全部文件
const files = git("ls-tree", "-r", "--full-tree", commitSha).split("\n").filter(Boolean);
console.log(`提交包含 ${files.length} 个文件`);

// 2. 逐个上传 blob（已存在的会被 GitHub 去重，不报错）
const blobShas = new Map();
let uploaded = 0;
for (const line of files) {
  const [meta, path] = line.split("\t");
  const [mode, type, sha] = meta.split(" ");
  if (type !== "blob") continue;

  const content = git("cat-file", "-p", sha); // 二进制安全由 --full-tree + cat-file 保证
  const b64 = Buffer.from(
    execFileSync("git", ["cat-file", "blob", sha], { encoding: "buffer", maxBuffer: 64 * 1024 * 1024 })
  ).toString("base64");

  try {
    const created = await api(`/repos/${repo}/git/blobs`, "POST", {
      content: b64,
      encoding: "base64",
    });
    blobShas.set(path, { sha: created.sha, mode, type });
    uploaded++;
    if (uploaded % 20 === 0) console.log(`  已上传 ${uploaded} 个 blob…`);
  } catch (err) {
    console.error(`上传失败: ${path}`);
    throw err;
  }
}
console.log(`blob 上传完成: ${uploaded} 个`);

// 3. 按目录结构组装 tree（逐层创建，父目录用子 tree 的 sha 引用）
const root = {};
for (const [path, info] of blobShas) {
  const parts = path.split("/");
  let node = root;
  for (let i = 0; i < parts.length - 1; i++) {
    node[parts[i]] = node[parts[i]] || { children: {} };
    node = node[parts[i]].children;
  }
  node[parts[parts.length - 1]] = info;
}

async function buildTree(node) {
  const entries = [];
  for (const [name, val] of Object.entries(node)) {
    if (val.children) {
      const sub = await buildTree(val.children);
      entries.push({ path: name, mode: "040000", type: "tree", sha: sub });
    } else {
      entries.push({ path: name, mode: val.mode, type: "blob", sha: val.sha });
    }
  }
  const res = await api(`/repos/${repo}/git/trees`, "POST", { tree: entries });
  return res.sha;
}

const treeSha = await buildTree(root);
console.log(`tree 创建完成: ${treeSha}`);

// 4. 复用本地提交信息创建远程提交
const commitMsg = git("log", "-1", "--format=%B", commitSha);
const parents = git("log", "-1", "--format=%P", commitSha).split(" ").filter(Boolean);

const newCommit = await api(`/repos/${repo}/git/commits`, "POST", {
  message: commitMsg,
  tree: treeSha,
  parents,
});
console.log(`commit 创建完成: ${newCommit.sha}`);

// 5. 更新分支引用
await api(`/repos/${repo}/git/refs/heads/${branch}`, "PATCH", {
  sha: newCommit.sha,
  force: false,
});
console.log(`分支 ${branch} 已更新到 ${newCommit.sha}`);
