import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://owenlee.xyz",
      lastModified: new Date("2026-07-24"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
