import { Experience } from "@/components/Experience";
import repoData from "../../public/data/repos.json";
import type { RepoData } from "@/lib/types";

export default function Home() {
  return <Experience data={repoData as RepoData} />;
}
