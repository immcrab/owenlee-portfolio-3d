export const LANGUAGE_COLORS: Record<string, string> = {
  HTML: "#e34c26",
  CSS: "#563d7c",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  "C#": "#178600",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Shell: "#89e051",
};

const FALLBACK_PALETTE = ["#7dd3fc", "#a78bfa", "#f472b6", "#34d399", "#fb923c"];

export function colorForLanguage(language: string | null, seed: number): string {
  if (language && LANGUAGE_COLORS[language]) return LANGUAGE_COLORS[language];
  return FALLBACK_PALETTE[seed % FALLBACK_PALETTE.length];
}
