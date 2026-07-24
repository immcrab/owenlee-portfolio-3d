"use client";

import { motion } from "framer-motion";
import type { RepoStats } from "@/lib/types";

export function Hero({ stats }: { stats: RepoStats }) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-indigo-300/80"
      >
        owenlee.xyz
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-7xl"
      >
        Owen Lee builds things
        <span className="block bg-gradient-to-r from-indigo-300 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent">
          in the browser, at night.
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-6 max-w-xl text-balance text-base text-slate-300 sm:text-lg"
      >
        Scroll to drift through {stats.activeRepos} public repositories from{" "}
        <a
          href="https://github.com/immcrab"
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-indigo-400/50 underline-offset-4 hover:text-white"
        >
          github.com/immcrab
        </a>
        , each one summarized live by Mistral AI.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-slate-400"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="h-9 w-5 rounded-full border border-slate-500/60 p-1">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-slate-300"
          />
        </div>
      </motion.div>
    </section>
  );
}
