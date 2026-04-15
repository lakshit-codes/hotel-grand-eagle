"use client";
import React, { useState } from "react";
import { Ic, Btn, Badge } from "../ui";
import type { CMSPage, LegalSection } from "../types";

interface LegalPageEditorProps {
    initialData: CMSPage | null;
    onSave: (page: Partial<CMSPage>) => Promise<void>;
    onCancel: () => void;
}

export default function LegalPageEditor({ initialData, onSave, onCancel }: LegalPageEditorProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
    const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false);
    const [sections, setSections] = useState<LegalSection[]>(
        (initialData?.sections as LegalSection[]) || []
    );
    const [saving, setSaving] = useState(false);

    const addSection = () => {
        const newSec: LegalSection = {
            id: `sec_${Date.now()}`,
            type: "legal-block",
            heading: "New Section Heading",
            description: "Detailed legal description goes here..."
        };
        setSections([...sections, newSec]);
    };

    const updateSection = (id: string, updates: Partial<LegalSection>) => {
        setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const deleteSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
    };

    const move = (idx: number, dir: number) => {
        const newArr = [...sections];
        const target = idx + dir;
        if (target < 0 || target >= newArr.length) return;
        [newArr[idx], newArr[target]] = [newArr[target], newArr[idx]];
        setSections(newArr);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave({
                ...initialData,
                title,
                subtitle,
                isPublished,
                sections,
                updatedAt: new Date().toISOString()
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ paddingBottom: 100 }}>
            {/* Header */}
            <div className="page-header" style={{ position: "sticky", top: 0, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", zIndex: 100, borderBottom: "1px solid #e5e7eb", margin: "-24px -24px 24px -24px", padding: "16px 24px" }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Btn variant="secondary" size="sm" onClick={onCancel}><Ic.Chev l /></Btn>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
                            Editing Legal Page: <span style={{ color: "var(--primary)" }}>{initialData?.slug}</span>
                        </h2>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
                    <Btn onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Btn>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* General Settings */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "#374151" }}>Page Branding</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Page Title</label>
                                <input className="inp" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Terms & Conditions" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Subtitle / Description</label>
                                <input className="inp" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="e.g. Rules & Regulations" />
                            </div>
                        </div>
                    </div>

                    {/* Sections Editor */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Content Sections ({sections.length})</h3>
                        <Btn size="sm" onClick={addSection}><Ic.Plus /> Add Legal Block</Btn>
                    </div>

                    {sections.length === 0 ? (
                        <div className="card" style={{ padding: 60, textAlign: "center", borderStyle: "dashed", color: "#6b7280" }}>
                            No content sections yet. Click "Add Legal Block" to start.
                        </div>
                    ) : (
                        sections.map((sec, idx) => (
                            <div key={sec.id} className="card" style={{ padding: 20 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #f3f4f6" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 24, height: 24, borderRadius: 12, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                                            {idx + 1}
                                        </div>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>Legal Block</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <Btn size="sm" variant="secondary" onClick={() => move(idx, -1)} disabled={idx === 0}><Ic.Chev u /></Btn>
                                        <Btn size="sm" variant="secondary" onClick={() => move(idx, 1)} disabled={idx === sections.length - 1}><Ic.Chev d /></Btn>
                                        <div style={{ width: 1, height: 24, background: "#e5e7eb", margin: "0 8px" }} />
                                        <Btn size="sm" variant="danger" onClick={() => deleteSection(sec.id)}><Ic.Trash /></Btn>
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: 12 }}>
                                    <label className="form-label">Heading</label>
                                    <input className="inp" value={sec.heading} onChange={e => updateSection(sec.id, { heading: e.target.value })} placeholder="e.g. 1. Acceptance of Terms" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description / Legal Text</label>
                                    <textarea 
                                        className="inp" 
                                        style={{ minHeight: 120, resize: "vertical" }} 
                                        value={sec.description} 
                                        onChange={e => updateSection(sec.id, { description: e.target.value })} 
                                        placeholder="Enter the full legal text for this section..." 
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Sidebar */}
                <div>
                    <div className="card" style={{ padding: 20, position: "sticky", top: 100 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Status & Setup</h3>
                        <div className="form-group">
                            <label className="form-label">Slug (URL)</label>
                            <input className="inp" disabled value={initialData?.slug} style={{ background: "#f9fafb" }} />
                        </div>
                        <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f3f4f6" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 13, fontWeight: 500 }}>Published Status</span>
                                <input type="checkbox" style={{ transform: "scale(1.2)" }} checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
                            </div>
                            <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>
                                {isPublished ? "Live on website" : "Hidden, only visible in admin"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
