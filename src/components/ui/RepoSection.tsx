"use client";

import { motion } from "framer-motion";
import { colorForLanguage } from "@/lib/languageColors";
import type { RepoEntry } from "@/lib/types";

export function RepoSection({ repo, index }: { repo: RepoEntry; index: number }) {
  const align = index % 2 === 0 ? "items-start text-left sm:pr-[45%]" : "items-end text-right sm:pl-[45%]";
  const color = colorForLanguage(repo.language, index);

  return (
    <section
      id={`repo-${repo.name}`}
      className={`flex min-h-[100svh] w-full flex-col justify-center px-6 ${align}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        transition={{ duration: 0.6 }}
        className="max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-slate-300">
            {String(index + 1).padStart(2, "0")}
          </span>
          {repo.language && (
            <span
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-slate-300"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              {repo.language}
            </span>
          )}
          {repo.stars > 0 && (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-300">★ {repo.stars}</span>
          )}
          {repo.forks > 0 && (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-slate-300">⑂ {repo.forks}</span>
          )}
        </div>

        <h2 className="text-2xl font-semibold text-white sm:text-3xl">{repo.name}</h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">{repo.aiSummary}</p>

        {repo.description && repo.description !== repo.aiSummary && (
          <p className="mt-2 text-xs italic text-slate-500">&ldquo;{repo.description}&rdquo;</p>
        )}

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full bg-white px-4 py-1.5 font-medium text-slate-900 transition hover:bg-indigo-200"
          >
            View source
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-full border border-white/20 px-4 py-1.5 font-medium text-white transition hover:border-white/50"
            >
              Live demo
            </a>
          )}
        </div>
      </motion.div>
    </section>
  );
}
