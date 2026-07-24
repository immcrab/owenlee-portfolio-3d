"use client";

import dynamic from "next/dynamic";
import { ScrollProvider } from "@/components/providers/ScrollProvider";
import { Hero } from "@/components/ui/Hero";
import { RepoSection } from "@/components/ui/RepoSection";
import { Outro } from "@/components/ui/Outro";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { JumpNav } from "@/components/ui/JumpNav";
import type { RepoData } from "@/lib/types";

const Scene = dynamic(() => import("@/components/canvas/Scene").then((mod) => mod.Scene), {
  ssr: false,
});

export function Experience({ data }: { data: RepoData }) {
  const sectionCount = data.repos.length + 2;

  return (
    <ScrollProvider sectionCount={sectionCount}>
      <Scene repos={data.repos} />
      <ProgressBar />
      <JumpNav repos={data.repos} />

      <main id="top" className="relative">
        <Hero stats={data.stats} />
        {data.repos.map((repo, i) => (
          <RepoSection key={repo.id} repo={repo} index={i} />
        ))}
        <Outro stats={data.stats} />
      </main>
    </ScrollProvider>
  );
}
