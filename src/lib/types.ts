export interface RepoEntry {
  id: string;
  name: string;
  fullName: string;
  url: string;
  homepage: string | null;
  description: string | null;
  aiSummary: string;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  size: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
}

export interface RepoStats {
  totalRepos: number;
  activeRepos: number;
  totalStars: number;
  topLanguages: [string, number][];
}

export interface RepoData {
  owner: string;
  generatedAt: string;
  generatedBy: string;
  stats: RepoStats;
  repos: RepoEntry[];
}
