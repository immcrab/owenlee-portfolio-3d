"use client";

import { useState } from "react";
import type { RepoEntry } from "@/lib/types";

export function JumpNav({ repos }: { repos: RepoEntry[] }) {
  const [open, setOpen] = useState(false);

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setOpen(false);
  }

  return (
    <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Jump to a repository"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md transition hover:border-white/40"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round" />
          <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
          <line x1="4" y1="18" x2="20" y2="18" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 max-h-[70svh] w-64 overflow-y-auto rounded-xl border border-white/10 bg-black/80 p-2 text-sm shadow-2xl backdrop-blur-xl">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setOpen(false);
            }}
            className="block rounded-lg px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            ↑ Top
          </a>
          {repos.map((repo) => (
            <button
              key={repo.id}
              type="button"
              onClick={() => jumpTo(`repo-${repo.name}`)}
              className="block w-full rounded-lg px-3 py-2 text-left text-slate-300 hover:bg-white/10 hover:text-white"
            >
              {repo.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
