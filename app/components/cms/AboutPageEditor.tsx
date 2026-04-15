"use client";

import React, { useState, useRef, useEffect } from "react";
import type { CMSPage, AboutSection, TextImageSection, QuoteSection, AboutStat } from "../types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function uid() {
    return Math.random().toString(36).slice(2, 11);
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ msg, type, onDone }: { msg: string; type: "success" | "error"; onDone: () => void }) {
    useEffect(() => {
        const t = setTimeout(onDone, 3200);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <div style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 9999,
            background: type === "success" ? "#16a34a" : "#dc2626",
            color: "#fff", padding: "14px 22px", borderRadius: 10,
            fontSize: 14, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            display: "flex", alignItems: "center", gap: 10,
            animation: "slideInToast 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}>
            <span style={{ fontSize: 18 }}>{type === "success" ? "✓" : "✕"}</span>
            {msg}
        </div>
    );
}

// ── Image Upload Field ────────────────────────────────────────────────────────

function ImageField({ value, onChange, label = "Section Image" }: { value: string; onChange: (url: string) => void; label?: string }) {
    const [urlInput, setUrlInput] = useState("");
    const [uploading, setUploading] = useState(false);
    const [err, setErr] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    const applyUrl = () => {
        const u = urlInput.trim();
        if (!u) { setErr("Please enter a URL"); return; }
        onChange(u);
        setUrlInput("");
        setErr("");
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { setErr("Please select an image file"); return; }
        setUploading(true);
        setErr("");
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) {
                onChange(data.url);
            } else {
                setErr(data.error || "Upload failed");
            }
        } catch {
            setErr("Upload failed — check connection");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    return (
        <div style={{ marginBottom: 0 }}>
            <label style={labelStyle}>{label}</label>
            {value && (
                <div style={{ position: "relative", marginBottom: 10, borderRadius: 8, overflow: "hidden", height: 180, background: "#f1f5f9", border: "1px solid #e2e8f0" }}>
                    <img src={value} alt="Section" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <button onClick={() => onChange("")} title="Remove image"
                        style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 6, background: "#dc2626", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ✕
                    </button>
                </div>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input value={urlInput} onChange={e => { setUrlInput(e.target.value); setErr(""); }}
                    placeholder="Paste image URL (https://...)"
                    className="inp" style={{ flex: 2, minWidth: 180, fontSize: 13 }}
                    onKeyDown={e => e.key === "Enter" && applyUrl()}
                />
                <button onClick={applyUrl} style={smallBtnStyle}>+ Use URL</button>
                <label style={{ ...smallBtnStyle, cursor: "pointer", position: "relative" }}>
                    {uploading ? "Uploading…" : "📁 Upload"}
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
                </label>
            </div>
            {err && <div style={{ fontSize: 12, color: "#dc2626", marginTop: 5 }}>{err}</div>}
        </div>
    );
}

// ── Stat Row ──────────────────────────────────────────────────────────────────

function StatRow({ stat, onChange, onDelete }: { stat: AboutStat; onChange: (s: AboutStat) => void; onDelete: () => void }) {
    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <input value={stat.value} onChange={e => onChange({ ...stat, value: e.target.value })}
                placeholder="e.g. 24+" className="inp" style={{ width: 80, fontSize: 13 }} />
            <input value={stat.label} onChange={e => onChange({ ...stat, label: e.target.value })}
                placeholder="e.g. Years of Luxury" className="inp" style={{ flex: 1, fontSize: 13 }} />
            <button onClick={onDelete} style={{ ...smallBtnStyle, background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" }}>✕</button>
        </div>
    );
}

// ── Text+Image Section Form ───────────────────────────────────────────────────

function TextImageForm({ sec, onChange }: { sec: TextImageSection; onChange: (s: TextImageSection) => void }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                    <label style={labelStyle}>Heading</label>
                    <input value={sec.heading} onChange={e => onChange({ ...sec, heading: e.target.value })}
                        placeholder="e.g. Budget-Friendly Stay in Jaipur"
                        className="inp" style={{ width: "100%", fontSize: 13 }} />
                </div>
                <div>
                    <label style={labelStyle}>Subheading (optional)</label>
                    <input value={sec.subheading || ""} onChange={e => onChange({ ...sec, subheading: e.target.value })}
                        placeholder="Optional subheading"
                        className="inp" style={{ width: "100%", fontSize: 13 }} />
                </div>
            </div>

            <div>
                <label style={labelStyle}>Description / Paragraph</label>
                <textarea value={sec.description} onChange={e => onChange({ ...sec, description: e.target.value })}
                    placeholder="Write the section content here..."
                    className="textarea" style={{ width: "100%", minHeight: 100, fontSize: 13, resize: "vertical" }} />
            </div>

            <div>
                <label style={labelStyle}>
                    Gold Highlight Terms
                    <span style={{ fontWeight: 400, color: "#94a3b8", textTransform: "none", fontSize: 11, marginLeft: 6 }}>
                        (comma-separated — these will appear bold in gold on the website)
                    </span>
                </label>
                <input value={sec.highlightTerms} onChange={e => onChange({ ...sec, highlightTerms: e.target.value })}
                    placeholder="e.g. value-for-money hotel, air conditioning, JECC"
                    className="inp" style={{ width: "100%", fontSize: 13 }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end" }}>
                <ImageField value={sec.image} onChange={url => onChange({ ...sec, image: url })} />
                <div>
                    <label style={labelStyle}>Image Position</label>
                    <select value={sec.imagePosition} onChange={e => onChange({ ...sec, imagePosition: e.target.value as "left" | "right" })}
                        className="sel" style={{ fontSize: 13 }}>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                    </select>
                </div>
            </div>

            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Stats Block</label>
                    <button onClick={() => onChange({ ...sec, stats: [...sec.stats, { id: uid(), value: "", label: "" }] })}
                        style={smallBtnStyle}>+ Add Stat</button>
                </div>
                {sec.stats.length === 0 && (
                    <div style={{ fontSize: 12, color: "#94a3b8", padding: "8px 0" }}>No stats. Add one to show a number badge (e.g. "24+ Years of Luxury").</div>
                )}
                {sec.stats.map(s => (
                    <StatRow key={s.id} stat={s}
                        onChange={updated => onChange({ ...sec, stats: sec.stats.map(x => x.id === s.id ? updated : x) })}
                        onDelete={() => onChange({ ...sec, stats: sec.stats.filter(x => x.id !== s.id) })}
                    />
                ))}
            </div>
        </div>
    );
}

// ── Quote Section Form ────────────────────────────────────────────────────────

function QuoteForm({ sec, onChange }: { sec: QuoteSection; onChange: (s: QuoteSection) => void }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
                <label style={labelStyle}>Eyebrow Text</label>
                <input value={sec.eyebrow} onChange={e => onChange({ ...sec, eyebrow: e.target.value })}
                    placeholder="e.g. The Vision"
                    className="inp" style={{ width: "100%", fontSize: 13 }} />
            </div>
            <div>
                <label style={labelStyle}>Quote Text</label>
                <textarea value={sec.text} onChange={e => onChange({ ...sec, text: e.target.value })}
                    placeholder={`"We created Grand Eagle as a love letter to Jaipur..."`}
                    className="textarea" style={{ width: "100%", minHeight: 90, fontSize: 13, fontStyle: "italic", resize: "vertical" }} />
            </div>
        </div>
    );
}

// ── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({
    sec, idx, total, onChange, onDelete, onMove
}: {
    sec: AboutSection; idx: number; total: number;
    onChange: (s: AboutSection) => void;
    onDelete: () => void;
    onMove: (dir: "up" | "down") => void;
}) {
    const [open, setOpen] = useState(true);
    const typeLabels: Record<string, string> = { "text-image": "📄 Text + Image", "quote": "💬 Quote / Vision" };

    return (
        <div style={{
            border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: 12, overflow: "hidden"
        }}>
            {/* Card header */}
            <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "14px 18px", background: "#f8fafc",
                borderBottom: open ? "1px solid #e2e8f0" : "none",
                cursor: "pointer"
            }} onClick={() => setOpen(o => !o)}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", flex: 1 }}>
                    {typeLabels[sec.type] || sec.type}
                    {sec.type === "text-image" && sec.heading && (
                        <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: 8 }}>— {sec.heading.slice(0, 40)}{sec.heading.length > 40 ? "…" : ""}</span>
                    )}
                    {sec.type === "quote" && sec.text && (
                        <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: 8 }}>— {sec.text.slice(0, 40)}{sec.text.length > 40 ? "…" : ""}</span>
                    )}
                </span>
                <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => onMove("up")} disabled={idx === 0}
                        style={{ ...iconBtnStyle, opacity: idx === 0 ? 0.3 : 1 }} title="Move up">↑</button>
                    <button onClick={() => onMove("down")} disabled={idx === total - 1}
                        style={{ ...iconBtnStyle, opacity: idx === total - 1 ? 0.3 : 1 }} title="Move down">↓</button>
                    <button onClick={onDelete} style={{ ...iconBtnStyle, color: "#dc2626" }} title="Delete section">🗑</button>
                </div>
                <span style={{ color: "#94a3b8", fontSize: 13 }}>{open ? "▲" : "▼"}</span>
            </div>

            {/* Card body */}
            {open && (
                <div style={{ padding: "18px 20px" }}>
                    {sec.type === "text-image" && (
                        <TextImageForm sec={sec as TextImageSection} onChange={s => onChange(s)} />
                    )}
                    {sec.type === "quote" && (
                        <QuoteForm sec={sec as QuoteSection} onChange={s => onChange(s)} />
                    )}
                </div>
            )}
        </div>
    );
}

// ── Add Section Menu ──────────────────────────────────────────────────────────

function AddSectionMenu({ onAdd, onClose }: { onAdd: (type: "text-image" | "quote") => void; onClose: () => void }) {
    return (
        <div style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 200,
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)", minWidth: 240, overflow: "hidden"
        }}>
            {[
                { type: "text-image" as const, icon: "📄", label: "Text + Image", desc: "Heading, paragraph, image, and stats" },
                { type: "quote" as const, icon: "💬", label: "Quote / Vision", desc: "Full-width pull quote with eyebrow" },
            ].map(s => (
                <button key={s.type} onClick={() => { onAdd(s.type); onClose(); }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 18px", width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.12s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{s.desc}</div>
                    </div>
                </button>
            ))}
        </div>
    );
}

// ── Default sections (mirrors the static About page) ─────────────────────────

const DEFAULT_SECTIONS: AboutSection[] = [
    {
        id: "sec_default_1",
        type: "text-image",
        heading: "Budget-Friendly Stay in Jaipur",
        subheading: "",
        description: "Hotel Grand Eagle is a value-for-money hotel offering clean, well-furnished rooms tailored for both business travelers and tourists. Each room is thoughtfully equipped with essentials such as air conditioning, private bathrooms, comfortable chairs, work desks, telephones, televisions, and 24/7 hot and cold water supply—everything you need for a comfortable yet affordable stay.\n\nLocated near JECC, major transport hubs, and local food joints, our hotel is perfect for budget-conscious travelers seeking convenience and accessibility. With a focus on cleanliness, functionality, and friendly service, Hotel Grand Eagle is the ideal pick for short or extended stays in Jaipur's Sitapura Industrial Area.",
        highlightTerms: "value-for-money hotel, air conditioning, private bathrooms, comfortable chairs, work desks, telephones, televisions, 24/7 hot and cold water supply, comfortable yet affordable stay, JECC, transport hubs, local food joints, budget-conscious travelers, cleanliness, functionality, friendly service, short or extended stays",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800",
        imagePosition: "right",
        stats: [{ id: "stat_1", value: "24+", label: "Years of Luxury" }],
    },
    {
        id: "sec_default_2",
        type: "quote",
        eyebrow: "The Vision",
        text: "\"We created Grand Eagle as a love letter to Jaipur — a space where guests don't just visit, they belong.\"",
    },
];

// ── Main Component ────────────────────────────────────────────────────────────

interface AboutPageEditorProps {
    initialData?: CMSPage | null;
    onSave: (page: Partial<CMSPage>) => Promise<void>;
    onCancel: () => void;
}

export default function AboutPageEditor({ initialData, onSave, onCancel }: AboutPageEditorProps) {
    const [title, setTitle] = useState(initialData?.title || "A legacy of excellence");
    const [subtitle, setSubtitle] = useState(initialData?.subtitle || "Our Heritage");
    const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
    const [sections, setSections] = useState<AboutSection[]>(
        initialData?.sections && initialData.sections.length > 0
            ? (initialData.sections as AboutSection[])
            : DEFAULT_SECTIONS
    );
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [delConfirm, setDelConfirm] = useState<string | null>(null);
    const addBtnRef = useRef<HTMLDivElement>(null);

    // Close add menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (addBtnRef.current && !addBtnRef.current.contains(e.target as Node)) {
                setShowAddMenu(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const addSection = (type: "text-image" | "quote") => {
        if (type === "text-image") {
            const s: TextImageSection = {
                id: uid(), type: "text-image",
                heading: "", subheading: "", description: "",
                highlightTerms: "", image: "", imagePosition: "right", stats: [],
            };
            setSections(prev => [...prev, s]);
        } else {
            const s: QuoteSection = { id: uid(), type: "quote", eyebrow: "", text: "" };
            setSections(prev => [...prev, s]);
        }
    };

    const updateSection = (id: string, updated: AboutSection) =>
        setSections(prev => prev.map(s => s.id === id ? updated : s));

    const deleteSection = (id: string) => {
        setSections(prev => prev.filter(s => s.id !== id));
        setDelConfirm(null);
    };

    const moveSection = (idx: number, dir: "up" | "down") => {
        setSections(prev => {
            const arr = [...prev];
            const to = dir === "up" ? idx - 1 : idx + 1;
            if (to < 0 || to >= arr.length) return arr;
            [arr[idx], arr[to]] = [arr[to], arr[idx]];
            return arr;
        });
    };

    const handleSave = async () => {
        if (!title.trim()) { setToast({ msg: "Page title is required", type: "error" }); return; }
        setSaving(true);
        try {
            const payload: Partial<CMSPage> = {
                id: initialData?.id || `pg_about_${Date.now()}`,
                title: title.trim(),
                subtitle: subtitle.trim(),
                slug: "about",
                sections,
                content: [],
                isPublished,
                createdAt: initialData?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Always use PUT upsert for the about page
            const res = await fetch("/api/pages", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Save failed");
            }

            const data = await res.json();
            await onSave(data.page || payload);
            setToast({ msg: "About page saved successfully!", type: "success" });
        } catch (e: any) {
            setToast({ msg: e.message || "Failed to save. Please try again.", type: "error" });
        } finally {
            setSaving(false);
        }
    };


    return (
        <div style={{ paddingBottom: 60 }}>
            {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

            {/* Delete confirm modal */}
            {delConfirm && (
                <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "#fff", borderRadius: 14, padding: 32, maxWidth: 380, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Delete Section?</div>
                        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>This will permanently remove the section from the About page.</div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => deleteSection(delConfirm)} style={{ flex: 1, padding: "10px 0", background: "#dc2626", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Delete</button>
                            <button onClick={() => setDelConfirm(null)} style={{ flex: 1, padding: "10px 0", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={onCancel} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#475569", fontWeight: 600 }}>
                        ← Back
                    </button>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#1e293b" }}>About Page Editor</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Slug: /about · Changes are reflected on the website</div>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Published toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>
                        <div onClick={() => setIsPublished(v => !v)} style={{
                            width: 40, height: 22, borderRadius: 99, background: isPublished ? "#16a34a" : "#cbd5e1",
                            position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0
                        }}>
                            <div style={{
                                position: "absolute", top: 3, left: isPublished ? 21 : 3,
                                width: 16, height: 16, borderRadius: "50%", background: "#fff",
                                transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                            }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: isPublished ? "#16a34a" : "#94a3b8" }}>
                            {isPublished ? "Published" : "Draft"}
                        </span>
                    </div>
                    <button onClick={handleSave} disabled={saving}
                        style={{ padding: "10px 24px", background: saving ? "#94a3b8" : "#1e293b", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s" }}>
                        {saving ? "⏳ Saving…" : "💾 Save About Page"}
                    </button>
                </div>
            </div>

            {/* Page Meta Card */}
            <div style={cardStyle}>
                <div style={cardHeaderStyle}>
                    <span style={cardTitleStyle}>📌 Page Identity</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Shown at the top of the About page</span>
                </div>
                <div style={{ padding: "18px 22px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Page Title <span style={{ color: "#dc2626" }}>*</span></label>
                        <input value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. A legacy of excellence"
                            className="inp" style={{ width: "100%", fontSize: 15, fontWeight: 600 }} />
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                            Supports italic with <em>_em text_</em> wrapping
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Eyebrow / Subtitle</label>
                        <input value={subtitle} onChange={e => setSubtitle(e.target.value)}
                            placeholder="e.g. Our Heritage"
                            className="inp" style={{ width: "100%", fontSize: 13 }} />
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Shown in gold above the title</div>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#64748b" }}>
                        Page Sections ({sections.length})
                    </div>
                    <div ref={addBtnRef} style={{ position: "relative" }}>
                        <button onClick={() => setShowAddMenu(v => !v)}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                            + Add Section ▾
                        </button>
                        {showAddMenu && <AddSectionMenu onAdd={addSection} onClose={() => setShowAddMenu(false)} />}
                    </div>
                </div>

                {sections.length === 0 && (
                    <div style={{ border: "2px dashed #e2e8f0", borderRadius: 12, padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: "#64748b" }}>No sections yet</div>
                        <div style={{ fontSize: 13, marginBottom: 16 }}>Click "Add Section" to build your About page content.</div>
                    </div>
                )}

                {sections.map((sec, idx) => (
                    <SectionCard
                        key={sec.id}
                        sec={sec}
                        idx={idx}
                        total={sections.length}
                        onChange={updated => updateSection(sec.id, updated)}
                        onDelete={() => setDelConfirm(sec.id)}
                        onMove={dir => moveSection(idx, dir)}
                    />
                ))}
            </div>

            {/* Help box */}
            <div style={{ marginTop: 24, background: "#0f172a", borderRadius: 12, padding: "22px 24px", color: "#94a3b8" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#475569", marginBottom: 14 }}>
                    💡 How the About Page CMS Works
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18, fontSize: 12 }}>
                    {[
                        ["📄", "Text + Image", "Add headings, paragraphs, and an image. List highlight terms to display in gold."],
                        ["💬", "Quote", "A full-width pull quote with an eyebrow label above it."],
                        ["📊", "Stats Block", "Add metric cards like '24+ Years of Luxury' inside any Text+Image section."],
                        ["💾", "Save", "Click Save to update the live website. Toggle Published/Draft to control visibility."],
                    ].map(([icon, title, desc]) => (
                        <div key={String(title)} style={{ display: "flex", gap: 10 }}>
                            <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                            <div>
                                <div style={{ fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{title}</div>
                                <div style={{ lineHeight: 1.5 }}>{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes slideInToast {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const cardStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden",
};

const cardHeaderStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 22px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc",
};

const cardTitleStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.08em", color: "#475569",
};

const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 10, fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.1em",
    color: "#64748b", marginBottom: 6,
};

const smallBtnStyle: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "7px 12px", fontSize: 12, fontWeight: 600,
    background: "#f1f5f9", color: "#475569",
    border: "1px solid #e2e8f0", borderRadius: 7, cursor: "pointer",
};

const iconBtnStyle: React.CSSProperties = {
    width: 28, height: 28, border: "1px solid #e2e8f0", borderRadius: 6,
    background: "#f8fafc", color: "#64748b", cursor: "pointer", fontSize: 13,
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
};
