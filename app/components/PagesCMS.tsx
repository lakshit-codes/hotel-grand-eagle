import React, { useState } from "react";
import { Ic, Btn, Badge, Confirm, Inp, Field, Toggle, slugify, uid } from "./ui";
import type { CMSPage } from "./types";

interface PagesCMSProps {
    pages: CMSPage[];
    onAdd: (page: CMSPage) => void;
    onUpdate: (page: CMSPage) => void;
    onDelete: (id: string) => void;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function truncate(str: string, max: number) {
    if (!str) return "—";
    return str.length > max ? str.slice(0, max) + "…" : str;
}

function fmtDate(iso: string) {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch { return iso; }
}

import { PageEditor } from "./cms/PageEditor";

// ── Pages CMS List ──────────────────────────────────────────────────────────

export default function PagesCMS({ pages, onAdd, onUpdate, onDelete }: PagesCMSProps) {
    const [view, setView] = useState<"list" | "add" | "edit">("list");
    const [target, setTarget] = useState<CMSPage | null>(null);
    const [delId, setDelId] = useState<string | null>(null);

    if (view === "add") {
        return <PageEditor onSave={async (p) => { onAdd(p as CMSPage); setView("list"); }} onCancel={() => setView("list")} />;
    }
    if (view === "edit" && target) {
        return <PageEditor initialData={target} onSave={async (p) => { onUpdate(p as CMSPage); setView("list"); }} onCancel={() => setView("list")} />;
    }

    return (
        <div>
            {delId && (
                <Confirm
                    title="Delete Page"
                    msg={`Delete "${pages.find((p) => p.id === delId)?.title}"? This cannot be undone and will remove it from the website.`}
                    onOk={() => { onDelete(delId); setDelId(null); }}
                    onCancel={() => setDelId(null)}
                />
            )}

            {/* Header */}
            <div className="page-header">
                <div>
                    <div className="page-title">Pages CMS</div>
                    <div className="page-sub">
                        {pages.length} page{pages.length !== 1 ? "s" : ""} ·{" "}
                        <span style={{ color: "#16a34a", fontWeight: 600 }}>
                            {pages.filter((p) => p.isPublished).length} published
                        </span>
                        {" · "}
                        <span style={{ color: "#9ca3af" }}>
                            {pages.filter((p) => !p.isPublished).length} draft
                        </span>
                    </div>
                </div>
                <Btn onClick={() => setView("add")}>
                    <Ic.Plus /> Add New Page
                </Btn>
            </div>

            {/* Empty state */}
            {pages.length === 0 ? (
                <div
                    className="card"
                    style={{ padding: "60px 40px", textAlign: "center", color: "#9ca3af" }}
                >
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: "#374151" }}>
                        No pages created yet
                    </div>
                    <div style={{ fontSize: 13, marginBottom: 20 }}>
                        Create your first CMS page — e.g. About Us, Privacy Policy, Terms &amp; Conditions.
                    </div>
                    <Btn onClick={() => setView("add")}>
                        <Ic.Plus /> Create First Page
                    </Btn>
                </div>
            ) : (
                <div className="card">
                    {/* Table header */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 90px 120px 130px",
                            gap: 12,
                            padding: "10px 20px",
                            borderBottom: "1px solid #f3f4f6",
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "#9ca3af",
                        }}
                    >
                        <span>Page</span>
                        <span>Slug</span>
                        <span>Status</span>
                        <span>Updated</span>
                        <span style={{ textAlign: "right" }}>Actions</span>
                    </div>

                    {pages.map((page, i) => (
                        <div
                            key={page.id}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr 90px 120px 130px",
                                gap: 12,
                                padding: "14px 20px",
                                borderBottom: i < pages.length - 1 ? "1px solid #f9fafb" : "none",
                                alignItems: "center",
                                transition: "background .12s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            {/* Page name + image indicator */}
                            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 8,
                                        background: page.image ? "#f3f4f6" : "#f9fafb",
                                        border: "1px solid #e5e7eb",
                                        overflow: "hidden",
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 18,
                                    }}
                                >
                                    {page.image ? (
                                        <img
                                            src={page.image}
                                            alt=""
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        "📄"
                                    )}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontWeight: 700,
                                            fontSize: 14,
                                            color: "#111827",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {page.title}
                                    </div>
                                    {page.metaDescription && (
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "#9ca3af",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                marginTop: 2,
                                            }}
                                        >
                                            {truncate(page.metaDescription, 60)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Slug */}
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "#6b7280",
                                    fontFamily: "monospace",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                /{page.slug}
                            </div>

                            {/* Status badge */}
                            <div>
                                <Badge color={page.isPublished ? "green" : "gray"}>
                                    {page.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </div>

                            {/* Updated at */}
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>
                                {fmtDate(page.updatedAt)}
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                {page.isPublished && (
                                    <a
                                        href={`/${page.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        title="View live page"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 30,
                                            height: 30,
                                            borderRadius: 7,
                                            border: "1px solid #e5e7eb",
                                            color: "#2563eb",
                                            background: "#eff6ff",
                                            textDecoration: "none",
                                        }}
                                    >
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                )}
                                <Btn
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => { setTarget(page); setView("edit"); }}
                                >
                                    <Ic.Edit /> Edit
                                </Btn>
                                <Btn
                                    size="sm"
                                    variant="danger"
                                    onClick={() => setDelId(page.id)}
                                >
                                    <Ic.Trash />
                                </Btn>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Help card */}
            <div
                className="card"
                style={{
                    marginTop: 20,
                    padding: "20px 24px",
                    background: "#0f172a",
                    color: "#94a3b8",
                    border: "none",
                }}
            >
                <div
                    style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "#475569",
                        marginBottom: 14,
                    }}
                >
                    How Pages CMS Works
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 20,
                        fontSize: 13,
                    }}
                >
                    {[
                        ["📝", "Create a page", "Click 'Add New Page', add a title and your content."],
                        ["🔗", "Set a slug", "The slug is the URL path, e.g. /about-us or /privacy."],
                        ["🌐", "Publish it", "Toggle Published to make the page live on your website."],
                        ["🔍", "Set SEO meta", "Use the SEO tab to add meta title and description for Google."],
                    ].map(([icon, title, desc]) => (
                        <div key={title} style={{ display: "flex", gap: 10 }}>
                            <div style={{ fontSize: 20, flexShrink: 0 }}>{icon}</div>
                            <div>
                                <div style={{ fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{title}</div>
                                <div style={{ lineHeight: 1.5 }}>{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
