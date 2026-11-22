import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.octaeducation.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/colleges`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/predictor`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/scholarship`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/credit-card`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const { data: colleges } = await supabase
      .from("colleges")
      .select("slug, created_at")
      .not("slug", "ilike", "%__%")
      .limit(5000);

    if (colleges && colleges.length > 0) {
      const dynamicRoutes: MetadataRoute.Sitemap = colleges
        .filter((c) => c.slug && !c.slug.startsWith("__"))
        .map((c) => ({
          url: `${baseUrl}/colleges/${c.slug}`,
          lastModified: c.created_at ? new Date(c.created_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.85,
        }));

      return [...staticRoutes, ...dynamicRoutes];
    }
  } catch (error) {
    console.error("Sitemap dynamic college fetching error:", error);
  }

  return staticRoutes;
}
