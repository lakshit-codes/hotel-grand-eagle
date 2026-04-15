import React, { useState } from "react";
import { Ic, Btn, Badge, Confirm } from "./ui";
import type { CMSPage } from "./types";
import { PageEditor } from "./cms/PageEditor";
import AboutPageEditor from "./cms/AboutPageEditor";
import HomePageEditor from "./cms/HomePageEditor";
import LegalPageEditor from "./cms/LegalPageEditor";

interface PagesCMSProps {
    pages: CMSPage[];
    onAdd: (page: CMSPage) => void;
    onUpdate: (page: CMSPage) => void;
    onDelete: (id: string) => void;
}

function truncate(str: string, max: number) {
    if (!str) return "—";
    return str.length > max ? str.slice(0, max) + "…" : str;
}

function fmtDate(iso: string) {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return iso; }
}

export default function PagesCMS({ pages, onAdd, onUpdate, onDelete }: PagesCMSProps) {
    const [view, setView] = useState<"list" | "add" | "edit" | "about" | "home" | "legal">("list");
    const [target, setTarget] = useState<CMSPage | null>(null);
    const [delId, setDelId] = useState<string | null>(null);

    // Route "about" slug pages to the dedicated editor
    const openEdit = (page: CMSPage) => {
        setTarget(page);
        if (page.slug === "about") {
            setView("about");
        } else if (page.slug === "home") {
            setView("home");
        } else if (page.slug === "terms-and-conditions" || page.slug === "privacy-policy") {
            setTarget(page);
            setView("legal");
        } else {
            setView("edit");
        }
    };

    const openAdd = () => {
        setTarget(null);
        setView("add");
    };

    const openAbout = () => {
        const aboutPage = pages.find(p => p.slug === "about");
        setTarget(aboutPage || null);
        setView("about");
    };

    const openHome = () => {
        const homePage = pages.find(p => p.slug === "home");
        setTarget(homePage || null);
        setView("home");
    };

    if (view === "add") {
        return <PageEditor onSave={async (p) => { onAdd(p as CMSPage); setView("list"); }} onCancel={() => setView("list")} />;
    }
    if (view === "edit" && target) {
        return <PageEditor initialData={target} onSave={async (p) => { onUpdate(p as CMSPage); setView("list"); }} onCancel={() => setView("list")} />;
    }
    if (view === "about") {
        return (
            <AboutPageEditor
                initialData={target}
                onSave={async (p) => {
                    const updatedPage = p as CMSPage;
                    const existingIdx = pages.findIndex(x => x.slug === "about");
                    if (existingIdx >= 0) {
                        onUpdate({ ...pages[existingIdx], ...updatedPage });
                    } else {
                        onAdd(updatedPage);
                    }
                    setView("list");
                }}
                onCancel={() => setView("list")}
            />
        );
    }
    if (view === "home") {
        return (
            <HomePageEditor
                initialData={target}
                onSave={async (p) => {
                    const updatedPage = p as CMSPage;
                    const existingIdx = pages.findIndex(x => x.slug === "home");
                    if (existingIdx >= 0) {
                        onUpdate({ ...pages[existingIdx], ...updatedPage });
                    } else {
                        onAdd(updatedPage);
                    }
                    setView("list");
                }}
                onCancel={() => setView("list")}
            />
        );
    }
    if (view === "legal") {
        return (
            <LegalPageEditor
                initialData={target}
                onSave={async (p) => {
                    const updatedPage = p as CMSPage;
                    const existingIdx = pages.findIndex(x => x.slug === target?.slug);
                    if (existingIdx >= 0) {
                        onUpdate({ ...pages[existingIdx], ...updatedPage });
                    } else {
                        onAdd(updatedPage);
                    }
                    setView("list");
                }}
                onCancel={() => setView("list")}
            />
        );
    }

    const aboutPage = pages.find(p => p.slug === "about");
    const homePage = pages.find(p => p.slug === "home");

    return (
        <div>
            {delId && (
                <Confirm
                    title="Delete Page"
                    msg={`Delete "${pages.find((p) => p.id === delId)?.title}"? This cannot be undone.`}
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
                        </span>{" · "}
                        <span style={{ color: "#9ca3af" }}>
                            {pages.filter((p) => !p.isPublished).length} draft
                        </span>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <Btn variant="secondary" onClick={openHome} style={{ borderRadius: 9 }}>
                        🏠 Edit Home Page
                    </Btn>
                    <Btn variant="secondary" onClick={openAbout} style={{ borderRadius: 9 }}>
                        ✨ Edit About Page
                    </Btn>
                    <Btn 
                        variant="secondary" 
                        onClick={() => {
                            const p = pages.find(x => x.slug === "terms-and-conditions");
                            if (p) openEdit(p);
                        }} 
                        style={{ borderRadius: 9 }}
                    >
                        📜 Terms
                    </Btn>
                    <Btn 
                        variant="secondary" 
                        onClick={() => {
                            const p = pages.find(x => x.slug === "privacy-policy");
                            if (p) openEdit(p);
                        }} 
                        style={{ borderRadius: 9 }}
                    >
                        🔒 Privacy
                    </Btn>
                    <Btn onClick={openAdd} style={{ borderRadius: 9 }}>
                        <Ic.Plus /> Add New Page
                    </Btn>
                </div>
            </div>

            {/* Home Page Quick Card */}
            <div style={{
                background: "linear-gradient(135deg, #0c1445 0%, #1a1a2e 100%)",
                border: "1px solid rgba(99,179,237,0.25)",
                borderRadius: 12, padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 16, gap: 16,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(99,179,237,0.15)", border: "1px solid rgba(99,179,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                        🏠
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc" }}>Home Page</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                            / ·{" "}
                            <span style={{ color: homePage?.isPublished ? "#4ade80" : "#94a3b8" }}>
                                {homePage ? (homePage.isPublished ? "Published" : "Draft") : "Not configured yet"}
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {homePage?.isPublished && (
                        <a href="/" target="_blank" rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(255,255,255,0.08)", color: "#f8fafc", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
                            👁 View Live
                        </a>
                    )}
                    <button onClick={openHome} style={{ padding: "9px 18px", background: "#63b3ed", color: "#0c1445", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                        ✏️ Edit Content
                    </button>
                </div>
            </div>

            {/* About Page Quick Card */}
            <div style={{
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                border: "1px solid rgba(212,168,87,0.25)",
                borderRadius: 12, padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 20, gap: 16,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(212,168,87,0.15)", border: "1px solid rgba(212,168,87,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                        🏨
                    </div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc" }}>About Us Page</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                            /about ·{" "}
                            <span style={{ color: aboutPage?.isPublished ? "#4ade80" : "#94a3b8" }}>
                                {aboutPage ? (aboutPage.isPublished ? "Published" : "Draft") : "Not created yet"}
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {aboutPage?.isPublished && (
                        <a href="/about" target="_blank" rel="noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(255,255,255,0.08)", color: "#f8fafc", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>
                            👁 View Live
                        </a>
                    )}
                    <button onClick={openAbout} style={{ padding: "9px 18px", background: "#d4a857", color: "#0f172a", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                        ✏️ Edit Content
                    </button>
                </div>
            </div>

            {/* Legal Pages Quick Section */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                {["terms-and-conditions", "privacy-policy"].map(slug => {
                    const p = pages.find(x => x.slug === slug);
                    const isTerms = slug === "terms-and-conditions";
                    return (
                        <div key={slug} style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 12, padding: "16px 20px",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ fontSize: 18 }}>{isTerms ? "📜" : "🔒"}</div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{isTerms ? "Terms & Conditions" : "Privacy Policy"}</div>
                                    <div style={{ fontSize: 11, color: p?.isPublished ? "#4ade80" : "#94a3b8", marginTop: 2 }}>
                                        {p?.isPublished ? "Published" : "Draft"}
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => p && openEdit(p)}
                                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0", borderRadius: 6, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                            >
                                Edit
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Pages list */}
            {pages.length === 0 ? (
                <div className="card" style={{ padding: "60px 40px", textAlign: "center", color: "#9ca3af" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: "#374151" }}>No pages created yet</div>
                    <div style={{ fontSize: 13, marginBottom: 20 }}>
                        Create your first CMS page — e.g. Privacy Policy, Terms &amp; Conditions.
                    </div>
                    <Btn onClick={openAdd}><Ic.Plus /> Create First Page</Btn>
                </div>
            ) : (
                <div className="card">
                    {/* Table header */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 90px 80px 150px",
                        gap: 12, padding: "10px 20px",
                        borderBottom: "1px solid #f3f4f6",
                        fontSize: 11, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.06em", color: "#9ca3af",
                    }}>
                        <span>Title</span>
                        <span>Slug</span>
                        <span>Status</span>
                        <span>Updated</span>
                        <span style={{ textAlign: "right" }}>Actions</span>
                    </div>

                    {pages.map((page, i) => (
                        <div key={page.id} style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 90px 80px 150px",
                            gap: 12, padding: "14px 20px",
                            borderBottom: i < pages.length - 1 ? "1px solid #f9fafb" : "none",
                            alignItems: "center",
                        }}
                            onMouseEnter={e => (e.currentTarget.style.background = "#fafafa")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                            {/* Title */}
                            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 8,
                                    background: page.image ? "#f3f4f6" : "#f9fafb",
                                    border: "1px solid #e5e7eb", overflow: "hidden",
                                    flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                                }}>
                                    {page.image ? (
                                        <img src={page.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                                    ) : (page.slug === "about" ? "🏨" : (page.slug === "home" ? "🏠" : "📄"))}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {page.title}
                                    </div>
                                    {page.metaDescription && (
                                        <div style={{ fontSize: 12, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                                            {truncate(page.metaDescription, 55)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Slug */}
                            <div style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                /{page.slug}
                            </div>

                            {/* Status */}
                            <div>
                                <Badge color={page.isPublished ? "green" : "gray"}>
                                    {page.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </div>

                            {/* Updated */}
                            <div style={{ fontSize: 11, color: "#9ca3af" }}>{fmtDate(page.updatedAt)}</div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                {page.isPublished && (
                                    <a href={`/${page.slug}`} target="_blank" rel="noreferrer" title="View live page"
                                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 7, border: "1px solid #e5e7eb", color: "#2563eb", background: "#eff6ff", textDecoration: "none" }}>
                                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                )}
                                <Btn size="sm" variant="secondary" onClick={() => openEdit(page)} style={{ borderRadius: 8, fontWeight: 600 }}>
                                    <Ic.Edit /> Edit
                                </Btn>
                                <Btn size="sm" variant="danger" onClick={() => setDelId(page.id)} style={{ borderRadius: 8 }}>
                                    <Ic.Trash />
                                </Btn>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* How it works card */}
            <div className="card" style={{ marginTop: 20, padding: "20px 24px", background: "#0f172a", color: "#94a3b8", border: "none" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#475569", marginBottom: 14 }}>
                    How Pages CMS Works
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, fontSize: 13 }}>
                    {[
                        ["✨", "About Page", "Use the dedicated About Page editor to manage sections, text, images & quotes."],
                        ["📝", "Create a page", "Click 'Add New Page', add a title and your content for other pages."],
                        ["🔗", "Set a slug", "The slug is the URL path, e.g. /privacy or /terms."],
                        ["🌐", "Publish it", "Toggle Published to make the page live on your website."],
                    ].map(([icon, title, desc]) => (
                        <div key={String(title)} style={{ display: "flex", gap: 10 }}>
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
