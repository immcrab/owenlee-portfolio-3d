"use client";

import { motion } from "framer-motion";
import type { RepoStats } from "@/lib/types";

export function Outro({ stats }: { stats: RepoStats }) {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center gap-10 px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl"
      >
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">That&rsquo;s the tour.</h2>
        <p className="mt-4 text-slate-300">
          {stats.activeRepos} public repos and counting &mdash; the rest live on GitHub, everything from
          browser games to Gorilla Tag mods to whatever I broke this week.
        </p>

        <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <Stat label="repos" value={stats.activeRepos} />
          <Stat label="stars" value={stats.totalStars} />
          <Stat label="languages" value={stats.topLanguages.length} />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/immcrab"
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full bg-white px-6 py-2.5 font-medium text-slate-900 transition hover:bg-indigo-200"
          >
            See everything on GitHub
          </a>
          <a
            href="mailto:frish454@gmail.com"
            className="rounded-full border border-white/20 px-6 py-2.5 font-medium text-white transition hover:border-white/50"
          >
            Say hi
          </a>
        </div>
      </motion.div>

      <footer className="mt-8 flex flex-col items-center gap-2 text-xs text-slate-500">
        <p>Built with Next.js, React Three Fiber, and Mistral AI.</p>
        <p>
          &copy; {new Date().getFullYear()} Owen Lee &middot;{" "}
          <a
            href="https://github.com/immcrab/owenlee-portfolio-3d"
            target="_blank"
            rel="noreferrer noopener"
            className="underline decoration-slate-600 hover:text-slate-300"
          >
            source for this site
          </a>
        </p>
      </footer>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-slate-400">{label}</div>
    </div>
  );
}
