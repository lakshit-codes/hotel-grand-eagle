import React from "react";
import { notFound } from "next/navigation";
import { getDatabase } from "@/app/utils/getDatabase";
import type { Metadata } from "next";
import { CmsRenderer } from "@/app/components/cms/CmsRenderer";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const db = await getDatabase();
    const page = await db.collection("pages").findOne({ slug, isPublished: true });

    if (!page) {
        return { title: "Page Not Found | Hotel Grand Eagle" };
    }

    const metaTitle = page.metaTitle || `${page.title} | Hotel Grand Eagle`;
    const metaDesc =
        page.metaDescription ||
        `Read about ${page.title} at Hotel Grand Eagle – a premier luxury hotel.`;

    return {
        title: metaTitle,
        description: metaDesc,
        openGraph: {
            title: metaTitle,
            description: metaDesc,
            ...(page.image ? { images: [{ url: page.image }] } : {}),
        },
    };
}

export default async function DynamicCMSPage({ params }: PageProps) {
    const { slug } = await params;
    const db = await getDatabase();
    const page = await db.collection("pages").findOne({ slug, isPublished: true });

    if (!page) {
        notFound();
    }

    // Detect if content contains HTML tags
    const isHtml = /<[a-z][\s\S]*>/i.test(page.content || "");

    return (
        <div
            style={{
                background: "var(--midnight, #0a0a0a)",
                minHeight: "100vh",
                paddingTop: 140,
                paddingBottom: 100,
            }}
        >
            <div className="max-w" style={{ maxWidth: 900, margin: "0 auto", padding: "0 5%" }}>

                {/* Page Header */}
                <div style={{ marginBottom: 48, textAlign: "center" }}>
                    <div
                        className="section-eyebrow fade-in-up visible"
                        style={{ justifyContent: "center" }}
                    >
                        <span className="line" style={{ width: 40 }} />
                        <span>Hotel Grand Eagle</span>
                        <span className="line" style={{ width: 40 }} />
                    </div>
                    <h1
                        className="section-title fade-in-up visible"
                        style={{ fontSize: "clamp(32px, 6vw, 52px)", marginBottom: 0 }}
                    >
                        {page.title}
                    </h1>
                </div>

                {/* Banner Image */}
                {page.image && (
                    <div
                        className="fade-in-up visible"
                        style={{
                            borderRadius: 16,
                            overflow: "hidden",
                            marginBottom: 48,
                            border: "1px solid rgba(212,168,87,0.15)",
                            maxHeight: 420,
                        }}
                    >
                        <img
                            src={page.image}
                            alt={page.title}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    </div>
                )}

                {/* Content */}
                <div
                    className="fade-in-up visible"
                    style={{
                        background: "var(--charcoal, #1a1a1a)",
                        border: "1px solid rgba(212,168,87,0.12)",
                        borderRadius: 12,
                        padding: "48px clamp(24px, 5%, 64px)",
                        color: "var(--ivory-dim, #d4cfc8)",
                        fontSize: 16,
                        lineHeight: 1.85,
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    {Array.isArray(page.content) ? (
                        <div className="cms-block-content">
                            <CmsRenderer content={page.content} />
                        </div>
                    ) : isHtml ? (
                        // Safely render HTML content with hotel styling
                        <div
                            className="cms-content"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                            style={{
                                // Inline styles for HTML elements inside rendered content
                            }}
                        />
                    ) : (
                        // Plain text — preserve line breaks
                        page.content
                            .split(/\n\n+/)
                            .map((para: string, i: number) => (
                                <p
                                    key={i}
                                    style={{
                                        marginBottom: 20,
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {para}
                                </p>
                            ))
                    )}
                </div>

                {/* Back link */}
                <div style={{ marginTop: 48, textAlign: "center" }}>
                    <a
                        href="/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            color: "var(--gold, #d4a857)",
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: "none",
                            letterSpacing: "0.03em",
                        }}
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>

            {/* CMS content styles scoped to this page */}
            <style>{`
                .cms-content h1, .cms-content h2, .cms-content h3,
                .cms-content h4, .cms-content h5, .cms-content h6 {
                    color: #f5f0eb;
                    margin: 1.5em 0 0.6em;
                    line-height: 1.3;
                    font-family: 'Cormorant Garamond', serif;
                }
                .cms-content h1 { font-size: 2.2em; }
                .cms-content h2 { font-size: 1.7em; }
                .cms-content h3 { font-size: 1.4em; }
                .cms-content p {
                    margin: 0 0 1.2em;
                    line-height: 1.85;
                }
                .cms-content a {
                    color: #d4a857;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }
                .cms-content a:hover { color: #e8c46a; }
                .cms-content ul, .cms-content ol {
                    margin: 0.8em 0 1.4em 1.5em;
                    line-height: 1.85;
                }
                .cms-content li { margin-bottom: 0.4em; }
                .cms-content strong, .cms-content b { color: #f5f0eb; font-weight: 700; }
                .cms-content em, .cms-content i { font-style: italic; }
                .cms-content img {
                    max-width: 100%;
                    border-radius: 10px;
                    margin: 1.5em 0;
                    border: 1px solid rgba(212,168,87,0.12);
                }
                .cms-content blockquote {
                    border-left: 3px solid #d4a857;
                    margin: 1.5em 0;
                    padding: 0.5em 1.2em;
                    color: #a89878;
                    font-style: italic;
                }
                .cms-content hr {
                    border: none;
                    border-top: 1px solid rgba(212,168,87,0.2);
                    margin: 2em 0;
                }
                .cms-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5em 0;
                }
                .cms-content th, .cms-content td {
                    padding: 10px 14px;
                    border: 1px solid rgba(212,168,87,0.12);
                    text-align: left;
                }
                .cms-content th { color: #f5f0eb; font-weight: 700; background: rgba(212,168,87,0.06); }
            `}</style>
        </div>
    );
}
