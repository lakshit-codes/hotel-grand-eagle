import { getPageModel } from "@/models";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CmsRenderer } from "@/components/cms/CmsRenderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const PageModel = await getPageModel();
  const page = await PageModel.findOne({ slug, isPublished: true });

  if (!page) return { title: "Page Not Found" };

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || "",
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || "",
    },
  };
}

export default async function DynamicCmsPage({ params }: PageProps) {
  const { slug } = await params;
  const PageModel = await getPageModel();
  const page = await PageModel.findOne({ slug, isPublished: true });

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <CmsRenderer content={page.content} />
    </main>
  );
}
