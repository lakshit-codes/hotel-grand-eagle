"use client";
import React, { useState } from "react";
import { Testimonial } from "./types";
import { Btn, Ic, uid, Badge } from "./ui";

interface Props {
    testimonials: Testimonial[];
    onAdd: (t: Testimonial) => Promise<void>;
    onUpdate: (t: Testimonial) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const BLANK: Omit<Testimonial, "id" | "createdAt"> = {
    name: "", location: "", text: "", rating: 5, isActive: true, stayDate: ""
};

function StarRating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4, 5].map(n => (
                <span
                    key={n}
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                        fontSize: 26,
                        cursor: "pointer",
                        color: n <= (hovered || value) ? "#fbbf24" : "#e5e7eb",
                        transition: "color 0.1s",
                        userSelect: "none"
                    }}
                >★</span>
            ))}
        </div>
    );
}

function TestimonialModal({ testimonial: init, onSave, onClose }: {
    testimonial: Omit<Testimonial, "id" | "createdAt"> & { id?: string };
    onSave: (t: Testimonial) => void;
    onClose: () => void;
}) {
    const [f, setF] = useState({ ...init });
    
    const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setF(p => ({ ...p, [k]: e.target.value }));
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
                <div className="modal-header">
                    <span className="modal-title">{f.id ? "Edit Testimonial" : "Add Testimonial"}</span>
                    <button className="modal-close" onClick={onClose}><Ic.X /></button>
                </div>
                <div className="modal-body">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div>
                            <label className="field-label">Guest Name *</label>
                            <input className="inp" value={f.name} onChange={s("name")} placeholder="e.g. Aditi Sharma" />
                        </div>
                        <div>
                            <label className="field-label">Location</label>
                            <input className="inp" value={f.location} onChange={s("location")} placeholder="e.g. Delhi, India" />
                        </div>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        <div>
                            <label className="field-label">Rating</label>
                            <StarRating value={f.rating} onChange={n => setF(p => ({ ...p, rating: n }))} />
                        </div>
                        <div>
                            <label className="field-label">Stay Month / Date</label>
                            <input className="inp" type="month" value={f.stayDate} onChange={s("stayDate")} />
                        </div>
                    </div>

                    <div className="mb-12">
                        <label className="field-label">Testimonial Text *</label>
                        <textarea className="textarea" value={f.text} onChange={s("text")}
                            placeholder="Quote text..." style={{ minHeight: 120 }} />
                    </div>
                </div>
                <div className="modal-footer">
                    <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
                    <Btn disabled={!f.name.trim() || !f.text.trim()} onClick={() => {
                        onSave({
                            id: (f as Testimonial).id || uid(),
                            name: f.name.trim(),
                            location: (f.location || "").trim(),
                            text: f.text.trim(),
                            rating: f.rating,
                            stayDate: f.stayDate || "",
                            isActive: f.isActive,
                            createdAt: (init as Testimonial).createdAt || new Date().toISOString(),
                        });
                    }}>Save Testimonial</Btn>
                </div>
            </div>
        </div>
    );
}

export default function TestimonialsAdmin({ testimonials, onAdd, onUpdate, onDelete }: Props) {
    const [modal, setModal] = useState<(Omit<Testimonial, "id" | "createdAt"> & { id?: string }) | null>(null);
    const [delId, setDelId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleSave = async (t: Testimonial) => {
        setSaving(true);
        try {
            if (modal?.id) await onUpdate(t);
            else await onAdd(t);
            setModal(null);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            {modal && <TestimonialModal testimonial={modal} onSave={handleSave} onClose={() => setModal(null)} />}
            {delId && (
                <div className="modal-overlay" onClick={() => setDelId(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
                        <div className="modal-header">
                            <span className="modal-title">Delete Testimonial?</span>
                            <button className="modal-close" onClick={() => setDelId(null)}><Ic.X /></button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: 14 }}>Are you sure you want to remove this testimonial from the system?</p>
                        </div>
                        <div className="modal-footer">
                            <Btn variant="secondary" onClick={() => setDelId(null)}>Cancel</Btn>
                            <Btn onClick={async () => { setSaving(true); await onDelete(delId); setSaving(false); setDelId(null); }} disabled={saving} style={{ background: "#dc2626", borderColor: "#dc2626" }}>Delete</Btn>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-header">
                <div>
                    <div className="page-title">Guest Testimonials</div>
                    <div className="page-sub">{testimonials.length} reviews · shared across the hotel network</div>
                </div>
                <Btn onClick={() => setModal({ ...BLANK })}><Ic.Plus /> Add Testimonial</Btn>
            </div>

            {testimonials.length === 0 && (
                <div className="card" style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>No testimonials yet</div>
                    <div style={{ fontSize: 13 }}>Click "Add Testimonial" to share your first guest story.</div>
                </div>
            )}

            <div className="grid-3">
                {testimonials.map(t => (
                    <div key={t.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                        <div className="card-body" style={{ flex: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                                <div style={{ color: "#fbbf24", fontSize: 14 }}>{"★".repeat(t.rating)}<span style={{ color: "#d1d5db" }}>{"★".repeat(5 - t.rating)}</span></div>
                                {t.stayDate && (
                                    <div style={{ fontSize: 11, color: "#9ca3af" }}>
                                        {new Date(t.stayDate).toLocaleString("default", { month: "long", year: "numeric" })}
                                    </div>
                                )}
                            </div>
                            <blockquote style={{ fontSize: 13.5, color: "#4b5563", fontStyle: "italic", marginBottom: 16, borderLeft: "2px solid #e5e7eb", paddingLeft: 12, minHeight: 60 }}>
                                "{t.text}"
                            </blockquote>
                            <div style={{ marginBottom: 2, fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                            <div style={{ fontSize: 11, color: "#9ca3af" }}>{t.location}</div>
                        </div>
                        <div style={{ padding: "12px 16px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 8 }}>
                            <Btn size="sm" variant="secondary" onClick={() => setModal({ ...t })}><Ic.Edit /> Edit</Btn>
                            <Btn size="sm" variant="ghost" style={{ color: "#dc2626", marginLeft: "auto" }} onClick={() => setDelId(t.id)}><Ic.Trash /></Btn>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
