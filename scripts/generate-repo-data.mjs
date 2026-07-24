#!/usr/bin/env node
/**
 * Regenerates public/data/repos.json.
 *
 * Fetches immcrab's public, non-fork, non-archived repositories, ranks them,
 * pulls a handful of representative files from each, and asks Mistral to
 * write a short description grounded in the actual file contents.
 *
 * Env vars:
 *   MISTRAL_API_KEY   required to generate AI summaries (falls back to the
 *                     repo's own GitHub description when missing)
 *   GITHUB_TOKEN      optional, raises the GitHub API rate limit
 *   GITHUB_USER       defaults to "immcrab"
 *   MAX_REPOS         defaults to 30
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const GITHUB_USER = process.env.GITHUB_USER || "immcrab";
const MAX_REPOS = Number(process.env.MAX_REPOS || 30);
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || "mistral-small-latest";

const OUT_PATH = path.join(process.cwd(), "public", "data", "repos.json");

const ghHeaders = {
  Accept: "application/vnd.github+json",
  "User-Agent": "owenlee-portfolio-3d-generator",
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

async function ghJson(url) {
  const res = await fetch(url, { headers: ghHeaders });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} for ${url}: ${await res.text()}`);
  }
  return res.json();
}

async function fetchAllRepos() {
  const repos = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await ghJson(
      `https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=updated&direction=desc&per_page=100&page=${page}`
    );
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

function isLikelyJunk(name) {
  const n = name.toLowerCase();
  if (/^[a-z0-9]{1,6}$/.test(n)) return true;
  if (/^(asd|sdas|dsa|test|hhhh|xxx)/.test(n)) return true;
  return false;
}

function rankRepo(r) {
  let score = 0;
  if (r.description) score += 5;
  if (r.homepage) score += 3;
  score += (r.stargazers_count || 0) * 2;
  score += r.forks_count || 0;
  if (r.language) score += 1;
  if ((r.size || 0) > 3000) score += 1;
  if (isLikelyJunk(r.name)) score -= 10;
  return score;
}

async function fetchRepoTree(owner, repo, branch) {
  try {
    const data = await ghJson(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
    );
    return (data.tree || []).filter((n) => n.type === "blob");
  } catch {
    return [];
  }
}

function pickInterestingFiles(tree) {
  const priority = [
    /^readme(\.md|\.txt)?$/i,
    /^package\.json$/i,
    /^pyproject\.toml$/i,
    /^requirements\.txt$/i,
    /index\.(js|ts|jsx|tsx|html)$/i,
    /^main\.(py|js|ts|go|rs|cs)$/i,
    /^app\.(js|ts|py)$/i,
  ];
  const scored = tree
    .filter((n) => n.size && n.size < 20000)
    .map((n) => {
      const rank = priority.findIndex((re) => re.test(n.path.split("/").pop()));
      return { node: n, rank: rank === -1 ? 99 : rank };
    })
    .sort((a, b) => a.rank - b.rank || a.node.size - b.node.size);
  return scored.slice(0, 5).map((s) => s.node);
}

async function fetchFileContent(owner, repo, filePath) {
  try {
    const data = await ghJson(
      `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`
    );
    if (data.encoding === "base64" && data.content) {
      return Buffer.from(data.content, "base64").toString("utf-8").slice(0, 2000);
    }
  } catch {
    /* skip unreadable files */
  }
  return "";
}

async function summarizeWithMistral(repo, fileBlurb) {
  if (!MISTRAL_API_KEY) return repo.description || "No description available yet.";

  const prompt = [
    `Repository: ${repo.full_name}`,
    repo.description ? `GitHub description: ${repo.description}` : "",
    repo.language ? `Primary language: ${repo.language}` : "",
    repo.topics?.length ? `Topics: ${repo.topics.join(", ")}` : "",
    fileBlurb ? `\nFile excerpts:\n${fileBlurb}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: MISTRAL_MODEL,
      temperature: 0.4,
      max_tokens: 100,
      messages: [
        {
          role: "system",
          content:
            "You write short, punchy 1-2 sentence project blurbs for a developer's 3D portfolio site, grounded in the actual file contents given. No fluff, no emoji, no quotes.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    console.warn(`Mistral API error for ${repo.full_name}: ${res.status}`);
    return repo.description || "No description available yet.";
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || repo.description || "No description available yet.";
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log(`Fetching repos for ${GITHUB_USER}...`);
  const all = await fetchAllRepos();
  const candidates = all.filter((r) => !r.fork && !r.archived);
  candidates.forEach((r) => (r._score = rankRepo(r)));
  candidates.sort((a, b) => b._score - a._score || new Date(b.updated_at) - new Date(a.updated_at));
  const selected = candidates.slice(0, MAX_REPOS);

  console.log(`Selected ${selected.length} repos, generating summaries...`);
  const results = [];
  for (const repo of selected) {
    let fileBlurb = "";
    try {
      const tree = await fetchRepoTree(GITHUB_USER, repo.name, repo.default_branch);
      const files = pickInterestingFiles(tree);
      const parts = [];
      for (const f of files) {
        const content = await fetchFileContent(GITHUB_USER, repo.name, f.path);
        if (content) parts.push(`--- ${f.path} ---\n${content}`);
      }
      fileBlurb = parts.join("\n\n").slice(0, 6000);
    } catch (err) {
      console.warn(`Could not read files for ${repo.name}:`, err.message);
    }

    const aiSummary = await summarizeWithMistral(repo, fileBlurb);
    results.push({
      id: repo.full_name,
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      homepage: repo.homepage || null,
      description: repo.description || null,
      aiSummary,
      language: repo.language || null,
      topics: repo.topics || [],
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      size: repo.size || 0,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
    });
    console.log(`  ✓ ${repo.name}`);
    await sleep(300);
  }

  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(
    OUT_PATH,
    JSON.stringify(
      {
        owner: GITHUB_USER,
        generatedAt: new Date().toISOString(),
        generatedBy: MISTRAL_API_KEY ? MISTRAL_MODEL : "fallback (no MISTRAL_API_KEY set)",
        repos: results,
      },
      null,
      2
    )
  );
  console.log(`Wrote ${results.length} repos to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
