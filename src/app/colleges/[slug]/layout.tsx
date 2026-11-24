import type { Metadata, ResolvingMetadata } from "next";
import { supabase } from "@/lib/supabase";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug || "").trim().toLowerCase();

  // Fetch college basic info from Supabase for Dynamic SEO
  let college: any = null;
  try {
    const { data } = await supabase
      .from("colleges")
      .select("name, city, state, location, tuition_fees, rating, image_url, description")
      .eq("slug", cleanSlug)
      .limit(1)
      .maybeSingle();
    college = data;
  } catch (err) {
    console.error("SEO Metadata fetch error:", err);
  }

  if (!college) {
    const formattedName = cleanSlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      title: `${formattedName} - Admission 2026, Fees, Courses, Cutoff & Placement | Octa Education`,
      description: `Explore verified admission process, fee structure, placement packages, courses, and student reviews for ${formattedName} on Octa Education.`,
    };
  }

  let descObj: any = {};
  if (college.description) {
    try {
      descObj =
        typeof college.description === "string"
          ? JSON.parse(college.description)
          : college.description;
    } catch {}
  }

  const collegeName = college.name || cleanSlug;
  const city = college.city || "Delhi NCR";
  const state = college.state || "India";
  const rating = college.rating || 4.5;
  const highestPackage =
    descObj.highestPackage || descObj.highest_package || "Top Packages";
  const avgPackage = descObj.averagePackage || descObj.average_package || "";
  const tuitionFees =
    college.tuition_fees && college.tuition_fees !== "N/A"
      ? college.tuition_fees
      : "";

  const title = `${collegeName} (${city}) - Admission 2026, Fees, Placements, Cutoff & Ranking | Octa Education`;
  const description = `${collegeName}, ${city}, ${state} Admission 2026. Check verified fee structure (${tuitionFees || "Affordable"}), placement stats (${highestPackage}${avgPackage ? `, Avg: ${avgPackage}` : ""}), NIRF rank, courses, and student rating (${rating}/5) on Octa Education.`;
  const canonicalUrl = `https://www.octaeducations.com/colleges/${cleanSlug}`;
  const ogImage =
    college.image_url ||
    descObj.image ||
    "https://www.octaeducations.com/images/iitdelhi_real.jpg";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Octa Education",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: collegeName,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    keywords: [
      collegeName,
      `${collegeName} admission 2026`,
      `${collegeName} fees`,
      `${collegeName} placement packages`,
      `${collegeName} cutoff rank`,
      `colleges in ${city}`,
      `top colleges in ${state}`,
      "octa education",
      "bihar student credit card approved colleges",
    ],
  };
}

export default async function CollegeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug || "").trim().toLowerCase();

  // Fetch college data for Google Schema JSON-LD (Rich Snippets)
  let college: any = null;
  try {
    const { data } = await supabase
      .from("colleges")
      .select("name, city, state, location, rating, image_url, description")
      .eq("slug", cleanSlug)
      .limit(1)
      .maybeSingle();
    college = data;
  } catch {}

  const collegeName = college?.name || cleanSlug;
  const city = college?.city || "Delhi NCR";
  const state = college?.state || "India";
  const ratingValue = college?.rating || 4.5;
  const imageUrl =
    college?.image_url || "https://www.octaeducations.com/images/iitdelhi_real.jpg";

  // Google EducationalOrganization / CollegeOrUniversity Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: collegeName,
    url: `https://www.octaeducations.com/colleges/${cleanSlug}`,
    image: imageUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state,
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(ratingValue),
      bestRating: "5",
      worstRating: "1",
      ratingCount: "148",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
