import React, { useState } from "react";
import { Ic, Btn, Inp, Field, Confirm } from "./ui";
import type { GalleryImage } from "./types";

interface GalleryAdminProps {
    images: GalleryImage[];
    onAdd: (img: GalleryImage) => void;
    onUpdate: (img: GalleryImage) => void;
    onDelete: (id: string) => void;
    onReorder: (images: GalleryImage[]) => void;
}

export default function GalleryAdmin({ images, onAdd, onUpdate, onDelete, onReorder }: GalleryAdminProps) {
    const [url, setUrl] = useState("");
    const [label, setLabel] = useState("");
    const [delId, setDelId] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [editLabel, setEditLabel] = useState("");

    const handleAdd = () => {
        const trimUrl = url.trim();
        if (!trimUrl) return;
        const newImg: GalleryImage = {
            id: `gal_${Date.now()}`,
            url: trimUrl,
            label: label.trim(),
            order: images.length,
            createdAt: new Date().toISOString()
        };
        onAdd(newImg);
        setUrl("");
        setLabel("");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            if (!file.type.startsWith("image/")) return;
            const reader = new FileReader();
            reader.onload = ev => {
                const result = ev.target?.result as string;
                if (result) {
                    const newImg: GalleryImage = {
                        id: `gal_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                        url: result,
                        label: file.name.replace(/\.[^/.]+$/, ""),
                        order: images.length,
                        createdAt: new Date().toISOString()
                    };
                    onAdd(newImg);
                }
            };
            reader.readAsDataURL(file);
        });
        e.target.value = "";
    };

    const moveImage = (idx: number, dir: -1 | 1) => {
        const to = idx + dir;
        if (to < 0 || to >= images.length) return;
        const updated = [...images];
        [updated[idx], updated[to]] = [updated[to], updated[idx]];
        const reordered = updated.map((img, i) => ({ ...img, order: i }));
        onReorder(reordered);
    };

    const startEdit = (img: GalleryImage) => {
        setEditId(img.id);
        setEditLabel(img.label);
    };

    const saveEdit = () => {
        if (!editId) return;
        const img = images.find(i => i.id === editId);
        if (img) onUpdate({ ...img, label: editLabel });
        setEditId(null);
        setEditLabel("");
    };

    return (
        <div>
            {delId && <Confirm title="Delete Image" msg="Remove this image from the gallery?" onOk={() => { onDelete(delId); setDelId(null); }} onCancel={() => setDelId(null)} />}

            <div className="page-header">
                <div>
                    <div className="page-title">Gallery Manager ({images.length})</div>
                    <div className="page-sub">Manage images displayed on your website gallery</div>
                </div>
            </div>

            {/* Add image form */}
            <div className="card mb-16">
                <div className="card-header"><span className="card-title">Add Image</span></div>
                <div className="card-body">
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                        <Inp value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste image URL (https://...)" style={{ flex: 2, minWidth: 200 }} onKeyDown={e => e.key === "Enter" && handleAdd()} />
                        <Inp value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (optional)" style={{ flex: 1, minWidth: 140 }} onKeyDown={e => e.key === "Enter" && handleAdd()} />
                        <Btn size="sm" onClick={handleAdd}><Ic.Plus /> Add URL</Btn>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>
                            📁 Upload Files
                            <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: "none" }} />
                        </label>
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>💡 Add images via URL or upload from your computer. Use ◀▶ to reorder.</div>
                </div>
            </div>

            {/* Gallery grid */}
            {images.length === 0 ? (
                <div className="card" style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>No gallery images yet</div>
                    <div style={{ fontSize: 13 }}>Add your first image above to get started.</div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                            {images.map((img, idx) => (
                                <div key={img.id} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: "2px solid #e5e7eb", background: "#f9fafb" }}>
                                    <img src={img.url} alt={img.label || `Gallery ${idx + 1}`} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
                                        onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Ctext y='18' font-size='18'%3E🖼️%3C/text%3E%3C/svg%3E"; }} />
                                    
                                    {/* Reorder + Delete overlay */}
                                    <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: 2 }}>
                                        {idx > 0 && (
                                            <button onClick={() => moveImage(idx, -1)} title="Move left" style={{ width: 22, height: 22, borderRadius: 4, background: "rgba(0,0,0,.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>◀</button>
                                        )}
                                        {idx < images.length - 1 && (
                                            <button onClick={() => moveImage(idx, 1)} title="Move right" style={{ width: 22, height: 22, borderRadius: 4, background: "rgba(0,0,0,.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
                                        )}
                                        <button onClick={() => setDelId(img.id)} title="Delete" style={{ width: 22, height: 22, borderRadius: 4, background: "#dc2626", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                                    </div>

                                    {/* Order badge */}
                                    <div style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>#{idx + 1}</div>

                                    {/* Label */}
                                    <div style={{ padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                                        {editId === img.id ? (
                                            <div style={{ display: "flex", gap: 4, flex: 1 }}>
                                                <input value={editLabel} onChange={e => setEditLabel(e.target.value)} className="inp" style={{ flex: 1, fontSize: 11, padding: "3px 6px" }} onKeyDown={e => e.key === "Enter" && saveEdit()} autoFocus />
                                                <button onClick={saveEdit} style={{ fontSize: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer" }}>✓</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {img.label || "No label"}
                                                </span>
                                                <button onClick={() => startEdit(img)} title="Edit label" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#9ca3af", padding: 0 }}>✏️</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
