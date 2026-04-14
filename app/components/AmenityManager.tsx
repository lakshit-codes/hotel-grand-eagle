"use client";
import React, { useState } from "react";
import { Ic, Btn, Inp, FieldLabel, Confirm, uid } from "./ui";
import type { AmenityCat } from "./types";

export default function AmenityManager({ amenityCats, setAmenityCats }: { amenityCats: AmenityCat[]; setAmenityCats: React.Dispatch<React.SetStateAction<AmenityCat[]>>; }) {
    const [newCat, setNewCat] = useState("");
    const [delCat, setDelCat] = useState<string | null>(null);

    const addCat = () => { if (!newCat.trim()) return; setAmenityCats(p => [...p, { id: uid(), name: newCat, facilities: [] }]); setNewCat(""); };
    const addFac = (catId: string, name: string) => { if (!name.trim()) return; setAmenityCats(p => p.map(c => c.id === catId ? { ...c, facilities: [...c.facilities, { id: uid(), name, icon: "Check" }] } : c)); };
    const delFac = (catId: string, facId: string) => setAmenityCats(p => p.map(c => c.id === catId ? { ...c, facilities: c.facilities.filter(f => f.id !== facId) } : c));
    const delCategory = (id: string) => setAmenityCats(p => p.filter(c => c.id !== id));

    return (
        <div>
            {delCat && <Confirm title="Delete Category" msg="Delete this category and all its amenities?" onOk={() => { delCategory(delCat); setDelCat(null); }} onCancel={() => setDelCat(null)} />}
            <div className="page-header"><div><div className="page-title">Amenity Manager</div><div className="page-sub">Define hotel facilities and room features</div></div><div style={{ display: "flex", gap: 8 }}><Inp value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category name..." onKeyDown={e => e.key === "Enter" && addCat()} /><Btn onClick={addCat}>+ Category</Btn></div></div>
            <div className="amen-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
                {amenityCats.map(cat => (
                    <div className="card" key={cat.id} style={{ display: "flex", flexDirection: "column" }}>
                        <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className="card-title">{cat.name}</span>
                            <Btn size="sm" variant="danger" onClick={() => setDelCat(cat.id)}><Ic.Trash /></Btn>
                        </div>
                        <div className="card-body" style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                <Inp size="sm" placeholder="Add facility..." onKeyDown={e => { if (e.key === "Enter") { addFac(cat.id, (e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value = ""; } }} style={{ flex: 1 }} />
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {cat.facilities.map(f => (
                                    <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f3f4f6", padding: "4px 10px", borderRadius: 20, fontSize: 12 }}>
                                        <span>{f.name}</span>
                                        <button onClick={() => delFac(cat.id, f.id)} style={{ padding: 0, border: "none", background: "none", color: "#9ca3af", cursor: "pointer", fontSize: 14 }}>✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
