import { Metadata } from "next";
import { supabase } from "@/lib/supabaseClient";
import CourseDetailClient from "./CourseDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!supabase) return {
    title: "Course Details | NLIT",
    description: "Premium learning packages offered by NLIT."
  };

  const { data: course, error } = await supabase
    .from("courses")
    .select("title, description, image_url")
    .eq("slug", slug)
    .single();

  if (error || !course) {
    return {
      title: "Course Package | NLIT",
      description: "Explore industry-recognized courses and certifications from NLIT."
    };
  }

  const title = `${course.title} | NLIT`;
  const description = course.description;
  const imageUrl = course.image_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: Props) {
  return <CourseDetailClient params={params} />;
}
