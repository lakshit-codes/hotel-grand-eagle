"use client";
import React, { useState } from "react";
import { NearbyPlace } from "./types";
import { Btn, Ic, uid } from "./ui";

interface Props {
    places: NearbyPlace[];
    onAdd: (p: NearbyPlace) => Promise<void>;
    onUpdate: (p: NearbyPlace) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const BLANK: Omit<NearbyPlace, "id" | "createdAt"> = {
    name: "", description: "", distance: "", image: "",
};

function PlaceModal({ place: init, onSave, onClose }: {
    place: Omit<NearbyPlace, "id" | "createdAt"> & { id?: string };
    onSave: (p: NearbyPlace) => void;
    onClose: () => void;
}) {
    const [f, setF] = useState({ ...init });
    const [uploading, setUploading] = useState(false);
    const [uploadErr, setUploadErr] = useState("");
    const s = (k: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setF(p => ({ ...p, [k]: e.target.value }));

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadErr("");
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (data.url) {
                setF(p => ({ ...p, image: data.url }));
            } else {
                setUploadErr(data.error || "Upload failed");
            }
        } catch {
            setUploadErr("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
                <div className="modal-header">
                    <span className="modal-title">{f.id ? "Edit Place" : "Add Nearby Place"}</span>
                    <button className="modal-close" onClick={onClose}><Ic.X /></button>
                </div>
                <div className="modal-body">
                    <div className="mb-12">
                        <label className="field-label">Name *</label>
                        <input className="inp" value={f.name} onChange={s("name")} placeholder="e.g. Chokhi Dhani" autoFocus />
                    </div>
                    <div className="mb-12">
                        <label className="field-label">Distance / Travel Time *</label>
                        <input className="inp" value={f.distance} onChange={s("distance")} placeholder="e.g. 5 mins drive" />
                    </div>
                    <div className="mb-12">
                        <label className="field-label">Description</label>
                        <textarea className="textarea" value={f.description} onChange={s("description")}
                            placeholder="Brief description of this place..." style={{ minHeight: 90 }} />
                    </div>
                    <div className="mb-12">
                        <label className="field-label">Image</label>
                        {/* File upload */}
                        <div style={{ marginBottom: 8 }}>
                            <label style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "7px 14px", border: "1px solid #d1d5db", borderRadius: 6,
                                cursor: uploading ? "not-allowed" : "pointer", fontSize: 13,
                                color: "#374151", background: uploading ? "#f9fafb" : "#fff",
                                transition: "background 0.2s"
                            }}>
                                {uploading ? "⏳ Uploading..." : "📁 Upload Image"}
                                <input type="file" accept="image/*" onChange={handleFileUpload}
                                    disabled={uploading} style={{ display: "none" }} />
                            </label>
                            <span style={{ marginLeft: 10, fontSize: 12, color: "#9ca3af" }}>or enter URL below</span>
                        </div>
                        {uploadErr && <div style={{ color: "#dc2626", fontSize: 12, marginBottom: 6 }}>{uploadErr}</div>}
                        <input className="inp" value={f.image} onChange={s("image")} placeholder="https://... (paste image URL)" />
                        {f.image && (
                            <img src={f.image} alt="preview" onError={e => (e.currentTarget.style.display = "none")}
                                style={{ marginTop: 8, width: "100%", height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }} />
                        )}
                    </div>
                </div>
                <div className="modal-footer">
                    <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
                    <Btn disabled={!f.name.trim() || !f.distance.trim() || uploading} onClick={() => {
                        onSave({
                            id: (f as NearbyPlace).id || uid(),
                            name: f.name.trim(),
                            description: f.description.trim(),
                            distance: f.distance.trim(),
                            image: f.image.trim(),
                            createdAt: (init as NearbyPlace).createdAt || new Date().toISOString(),
                        });
                    }}>Save Place</Btn>
                </div>
            </div>
        </div>
    );
}

export default function NearbyAdmin({ places, onAdd, onUpdate, onDelete }: Props) {
    const [modal, setModal] = useState<(Omit<NearbyPlace, "id" | "createdAt"> & { id?: string }) | null>(null);
    const [delId, setDelId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleSave = async (p: NearbyPlace) => {
        setSaving(true);
        try {
            if (modal?.id) await onUpdate(p);
            else await onAdd(p);
            setModal(null);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setSaving(true);
        try {
            await onDelete(id);
        } finally {
            setSaving(false);
            setDelId(null);
        }
    };

    const DEFAULT_IMG = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=60";

    return (
        <div>
            {modal && <PlaceModal place={modal} onSave={handleSave} onClose={() => setModal(null)} />}
            {delId && (
                <div className="modal-overlay" onClick={() => setDelId(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                        <div className="modal-header">
                            <span className="modal-title">Delete Place?</span>
                            <button className="modal-close" onClick={() => setDelId(null)}><Ic.X /></button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: 14, color: "#374151" }}>
                                Are you sure you want to delete this nearby place? This cannot be undone.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <Btn variant="secondary" onClick={() => setDelId(null)}>Cancel</Btn>
                            <Btn onClick={() => handleDelete(delId)} disabled={saving}
                                style={{ background: "#dc2626", borderColor: "#dc2626" }}>
                                Delete
                            </Btn>
                        </div>
                    </div>
                </div>
            )}

            <div className="page-header">
                <div>
                    <div className="page-title">Nearby Places</div>
                    <div className="page-sub">{places.length} place{places.length !== 1 ? "s" : ""} · shown on the public website</div>
                </div>
                <Btn onClick={() => setModal({ ...BLANK })}>
                    <Ic.Plus /> Add Place
                </Btn>
            </div>

            {places.length === 0 && (
                <div style={{
                    textAlign: "center", padding: "64px 24px", background: "#fff",
                    borderRadius: 12, border: "1px dashed #d1d5db", color: "#9ca3af"
                }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>No nearby places yet</div>
                    <div style={{ fontSize: 13 }}>Click "Add Place" to add attractions visible on the website.</div>
                </div>
            )}

            <div className="grid-3">
                {places.map(place => (
                    <div key={place.id} className="card" style={{ overflow: "hidden", padding: 0 }}>
                        <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#f3f4f6" }}>
                            <img
                                src={place.image || DEFAULT_IMG}
                                alt={place.name}
                                onError={e => { e.currentTarget.src = DEFAULT_IMG; }}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div style={{
                                position: "absolute", top: 10, right: 10,
                                background: "rgba(255,255,255,0.95)", padding: "3px 10px",
                                borderRadius: 20, fontSize: 11, fontWeight: 700, color: "#0f1623"
                            }}>
                                {place.distance}
                            </div>
                        </div>
                        <div style={{ padding: "14px 16px" }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "#111827" }}>{place.name}</div>
                            <div style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.5, minHeight: 36 }}>
                                {place.description || <span style={{ color: "#d1d5db", fontStyle: "italic" }}>No description</span>}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, padding: "0 16px 14px", borderTop: "1px solid #f3f4f6", paddingTop: 12 }}>
                            <Btn size="sm" variant="secondary" onClick={() => setModal({ ...place })}>
                                <Ic.Edit /> Edit
                            </Btn>
                            <Btn size="sm" variant="ghost" onClick={() => setDelId(place.id)}
                                style={{ color: "#dc2626", marginLeft: "auto" }}>
                                <Ic.X /> Delete
                            </Btn>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
