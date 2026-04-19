"use client";
import React, { useState, useMemo } from "react";
import { Ic, Btn, Badge, Inp, Field, FieldLabel, Sel, NumInp, CurrencyInput, Toggle, Confirm, uid, clamp, slugify } from "./ui";
import type { RoomItem, Room, AmenityCat } from "./types";

// ── Room Form ─────────────────────────────────────────────────────────────────
const BLANK_ROOM: Room = { id: "", roomName: "", slug: "", roomCategory: "Deluxe", bedType: "King", maxOccupancy: 2, roomSize: 30, view: "City View", smokingPolicy: "Non-Smoking", balconyAvailable: false, roomTheme: "Modern", soundproofingLevel: "Standard", inRoomWorkspace: false, entertainmentOptions: "Smart TV", bathroomType: "Walk-in Shower", floorPreference: "Any", basePrice: 10000, extraBedPrice: 0, refundable: true, currency: "INR", amenityIds: [], images: [], roomNumbers: [] };

function RoomForm({ initial, amenityCats, onSave, onCancel }: { initial?: Room; amenityCats: AmenityCat[]; onSave: (r: Room) => void; onCancel: () => void; }) {
    const [f, setF] = useState<Room>(() => initial ? { ...initial } : { ...BLANK_ROOM, id: uid() });
    const [imgUrl, setImgUrl] = useState("");
    const [imgErr, setImgErr] = useState("");
    const s = (field: keyof Room) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF(p => ({ ...p, [field]: e.target.value, ...(field === "roomName" ? { slug: slugify(e.target.value) } : {}) }));
    const sn = (field: keyof Room, mn: number, mx: number) => (e: React.ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [field]: clamp(Number(e.target.value), mn, mx) }));
    const sb = (field: keyof Room) => (val: boolean) => setF(p => ({ ...p, [field]: val }));
    const facilityMap = useMemo(() => { const m: Record<string, string> = {}; amenityCats.forEach(c => c.facilities.forEach(f => { m[f.id] = f.name; })); return m; }, [amenityCats]);
    const toggleAmen = (id: string) => setF(p => ({ ...p, amenityIds: p.amenityIds.includes(id) ? p.amenityIds.filter(x => x !== id) : [...p.amenityIds, id] }));

    const addImgUrl = () => {
        const u = imgUrl.trim();
        if (!u) return;
        if (!u.startsWith("http") && !u.startsWith("data:")) { setImgErr("Please enter a valid URL (starting with http) or upload a file."); return; }
        setF(p => ({ ...p, images: [...p.images, u] }));
        setImgUrl(""); setImgErr("");
    };
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            if (!file.type.startsWith("image/")) return;
            const reader = new FileReader();
            reader.onload = ev => {
                const result = ev.target?.result as string;
                if (result) setF(p => ({ ...p, images: [...p.images, result] }));
            };
            reader.readAsDataURL(file);
        });
        e.target.value = ""; // reset so same file can be re-selected
    };
    const removeImg = (idx: number) => setF(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
    const moveImg = (from: number, to: number) => {
        if (to < 0 || to >= f.images.length) return;
        setF(p => { const imgs = [...p.images];[imgs[from], imgs[to]] = [imgs[to], imgs[from]]; return { ...p, images: imgs }; });
    };

    const ROOM_CATS = ["Standard", "Superior", "Deluxe", "Premium", "Junior Suite", "Suite", "Grand Suite", "Penthouse", "Villa", "Studio"];
    const BED_TYPES = ["Single", "Twin", "Double", "Queen", "King", "Super King", "Bunk Bed"];
    const VIEWS = ["City View", "Garden View", "Pool View", "Ocean View", "Mountain View", "Courtyard View", "Panoramic", "Street View"];
    const THEMES = ["Classic", "Modern", "Art Deco", "Minimalist", "Colonial", "Boutique", "Contemporary", "Industrial", "Tropical", "Scandinavian"];
    const SOUNDPROOF = ["Standard", "Enhanced", "Premium", "Maximum"];
    const BATHROOMS = ["Shower Only", "Walk-in Shower", "Rain Shower", "Rain Shower + Tub", "Soaking Tub", "Spa Bathroom", "Shared"];
    const ENTERTAIN = ["Smart TV", "Smart TV + Sound System", "Home Theatre", "Tablet + Smart TV", "Gaming Console + TV"];
    const FLOORS = ["Any", "Ground Floor", "Lower Floor", "Mid Floor", "Upper Floor", "Top Floor", "Penthouse Level"];
    const SMOKING = ["Non-Smoking", "Smoking", "Designated Area"];

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}><Btn variant="ghost" size="sm" onClick={onCancel}><Ic.Back /> Back</Btn><h2 style={{ fontSize: 18, fontWeight: 700 }}>{initial ? "Edit Room Type" : "Add Room Type"}</h2></div>
            <div className="card mb-16"><div className="card-header"><span className="card-title">Room Identity</span></div><div className="card-body">
                <div className="grid-3" style={{ marginBottom: 16 }}><Field label="Room Name *"><Inp value={f.roomName} onChange={s("roomName")} placeholder="e.g. Deluxe King Room" /></Field><Field label="Slug (auto)"><Inp value={f.slug} onChange={s("slug")} /></Field><Field label="Room Category"><Sel value={f.roomCategory} onChange={s("roomCategory")} opts={ROOM_CATS} /></Field></div>
                <div className="grid-3" style={{ marginBottom: 16 }}><Field label="Bed Type"><Sel value={f.bedType} onChange={s("bedType")} opts={BED_TYPES} /></Field><Field label="Room Theme"><Sel value={f.roomTheme} onChange={s("roomTheme")} opts={THEMES} /></Field><Field label="View"><Sel value={f.view} onChange={s("view")} opts={VIEWS} /></Field></div>
                <div className="grid-4"><Field label="Max Occupancy"><NumInp value={f.maxOccupancy} onChange={sn("maxOccupancy", 1, 20)} min={1} max={20} /></Field><Field label="Room Size (m²)"><NumInp value={f.roomSize} onChange={sn("roomSize", 5, 2000)} min={5} /></Field><Field label="Floor Preference"><Sel value={f.floorPreference} onChange={s("floorPreference")} opts={FLOORS} /></Field><Field label="Smoking Policy"><Sel value={f.smokingPolicy} onChange={s("smokingPolicy")} opts={SMOKING} /></Field></div>
            </div></div>
            <div className="card mb-16"><div className="card-header"><span className="card-title">Room Specifications</span></div><div className="card-body">
                <div className="grid-3" style={{ marginBottom: 16 }}><Field label="Soundproofing"><Sel value={f.soundproofingLevel} onChange={s("soundproofingLevel")} opts={SOUNDPROOF} /></Field><Field label="Bathroom Type"><Sel value={f.bathroomType} onChange={s("bathroomType")} opts={BATHROOMS} /></Field><Field label="Entertainment"><Sel value={f.entertainmentOptions} onChange={s("entertainmentOptions")} opts={ENTERTAIN} /></Field></div>
                <div style={{ display: "flex", gap: 32 }}><Toggle checked={f.balconyAvailable} onChange={sb("balconyAvailable")} label="Balcony Available" /><Toggle checked={f.inRoomWorkspace} onChange={sb("inRoomWorkspace")} label="In-Room Workspace" /></div>
            </div></div>
            <div className="card mb-16"><div className="card-header"><span className="card-title">Pricing</span></div><div className="card-body">
                <div className="grid-4"><Field label="Currency"><div style={{ padding: "8px 10px", fontSize: 13, fontWeight: 600 }}>INR (₹)</div></Field><Field label={`Base Price (₹)`}><CurrencyInput currency="INR" value={f.basePrice} onChange={sn("basePrice", 0, 9999999)} /></Field><Field label={`Extra Bed (₹)`}><CurrencyInput currency="INR" value={f.extraBedPrice} onChange={sn("extraBedPrice", 0, 9999999)} /></Field><Field label="Cancellation"><div style={{ paddingTop: 6 }}><Toggle checked={f.refundable} onChange={sb("refundable")} label={f.refundable ? "Refundable" : "Non-Refundable"} /></div></Field></div>
            </div></div>
            <div className="card mb-20"><div className="card-header"><span className="card-title">Amenities</span><span style={{ fontSize: 13, color: "#6b7280" }}>{f.amenityIds.length} selected</span></div><div className="card-body"><div className="amen-picker">{amenityCats.map(cat => (<div className="amen-pick-cat" key={cat.id}><div className="amen-pick-cat-name">{cat.name}</div><div className="amen-pick-pills">{cat.facilities.map(fc => { const on = f.amenityIds.includes(fc.id); return (<button key={fc.id} onClick={() => toggleAmen(fc.id)} className={`amen-pill ${on ? "on" : "off"}`}>{fc.name}</button>); })}</div></div>))}</div></div></div>

            {/* Images */}
            <div className="card mb-20">
                <div className="card-header">
                    <span className="card-title">Room Photos <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>({f.images.length} image{f.images.length !== 1 ? "s" : ""})</span></span>
                </div>
                <div className="card-body">
                    {/* Hero */}
                    {f.images.length > 0 && (
                        <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden", position: "relative", height: 200, background: "#0f1623" }}>
                            <img src={f.images[0]} alt="Room hero" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Ctext y='18' font-size='18'%3E🖼️%3C/text%3E%3C/svg%3E"; }} />
                            <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>HERO PHOTO</div>
                        </div>
                    )}
                    {/* Thumbnail strip */}
                    {f.images.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 8, marginBottom: 16 }}>
                            {f.images.map((img, idx) => (
                                <div key={idx} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: idx === 0 ? "2px solid #2563eb" : "2px solid #e5e7eb", height: 80 }}>
                                    <img src={img} alt={`Room ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24'%3E%3Ctext y='18' font-size='18'%3E🖼️%3C/text%3E%3C/svg%3E"; }} />
                                    <div style={{ position: "absolute", top: 2, right: 2, display: "flex", gap: 2 }}>
                                        {idx > 0 && <button onClick={() => moveImg(idx, idx - 1)} title="Move left" style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(0,0,0,.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>◀</button>}
                                        {idx < f.images.length - 1 && <button onClick={() => moveImg(idx, idx + 1)} title="Move right" style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(0,0,0,.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>}
                                        <button onClick={() => removeImg(idx)} title="Remove" style={{ width: 18, height: 18, borderRadius: 4, background: "#dc2626", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                                    </div>
                                    {idx === 0 && <div style={{ position: "absolute", bottom: 2, left: 2, fontSize: 9, fontWeight: 700, color: "#fff", background: "#2563eb", padding: "1px 5px", borderRadius: 4 }}>HERO</div>}
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Upload & URL input */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                        <input value={imgUrl} onChange={e => { setImgUrl(e.target.value); setImgErr(""); }} placeholder="Paste image URL (https://...)" className="inp" style={{ flex: 1, minWidth: 200 }} onKeyDown={e => e.key === "Enter" && addImgUrl()} />
                        <Btn size="sm" variant="secondary" onClick={addImgUrl}>+ Add URL</Btn>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>
                            📁 Upload Files
                            <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: "none" }} />
                        </label>
                    </div>
                    {imgErr && <div style={{ fontSize: 12, color: "#dc2626", marginBottom: 8 }}>{imgErr}</div>}
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>💡 First image is the hero photo shown in lists. Use ◀▶ to reorder. Accepts JPEG, PNG, WebP.</div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}><Btn size="lg" onClick={() => onSave(f)} disabled={!f.roomName.trim()}>{initial ? "Update Room" : "Create Room"}</Btn><Btn variant="secondary" size="lg" onClick={onCancel}>Cancel</Btn></div>
        </div>
    );
}

export function RoomManagement({ rooms, amenityCats, onAdd, onEdit, onDelete }: { rooms: Room[]; amenityCats: AmenityCat[]; onAdd: (r: Room) => void; onEdit: (r: Room) => void; onDelete: (id: string) => void; }) {
    const [view, setView] = useState<"list" | "add" | "edit">("list"); const [target, setTarget] = useState<Room | null>(null); const [delId, setDelId] = useState<string | null>(null);
    const facilityMap = useMemo(() => { const m: Record<string, string> = {}; amenityCats.forEach(c => c.facilities.forEach(f => { m[f.id] = f.name; })); return m; }, [amenityCats]);
    if (view === "add") return <RoomForm amenityCats={amenityCats} onSave={r => { onAdd(r); setView("list"); }} onCancel={() => setView("list")} />;
    if (view === "edit" && target) return <RoomForm initial={target} amenityCats={amenityCats} onSave={r => { onEdit(r); setView("list"); }} onCancel={() => setView("list")} />;
    return (
        <div>
            {delId && <Confirm title="Delete Room Type" msg={`Delete "${rooms.find(r => r.id === delId)?.roomName}"?`} onOk={() => { onDelete(delId); setDelId(null); }} onCancel={() => setDelId(null)} />}
            <div className="page-header"><div><div className="page-title">Room Types ({rooms.length})</div><div className="page-sub">Manage room configurations</div></div><Btn onClick={() => setView("add")}><Ic.Plus /> Add Room Type</Btn></div>
            {rooms.map(room => (
                <div className="card room-card" key={room.id}>
                    <div className="room-card-header">
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}><span className="room-name">{room.roomName}</span><Badge color="blue">{room.roomCategory}</Badge><Badge color="gray">{room.bedType}</Badge>{room.refundable ? <Badge color="green">Refundable</Badge> : <Badge color="amber">Non-Refundable</Badge>}{room.balconyAvailable && <Badge color="purple">Balcony</Badge>}{room.inRoomWorkspace && <Badge color="gray">Workspace</Badge>}</div></div>
                        <div className="room-actions"><Btn size="sm" variant="secondary" onClick={() => { setTarget(room); setView("edit"); }}><Ic.Edit />Edit</Btn><Btn size="sm" variant="danger" onClick={() => setDelId(room.id)}><Ic.Trash /></Btn></div>
                    </div>
                    <div className="room-attrs"><span className="room-attr">👥 Max {room.maxOccupancy}</span><span className="room-attr">📐 {room.roomSize} m²</span><span className="room-attr">🪟 {room.view}</span><span className="room-attr">🏢 {room.floorPreference}</span><span className="room-attr">💰 {room.currency} {room.basePrice.toLocaleString()}/night</span><span className="room-attr">🚿 {room.bathroomType}</span><span className="room-attr">🚿 {room.soundproofingLevel}</span><span className="room-attr">🎭 {room.roomTheme}</span></div>
                    {room.roomNumbers && room.roomNumbers.length > 0 && <div style={{ padding: "6px 20px 10px", fontSize: 12, color: "#6b7280" }}>Rooms: {room.roomNumbers.join(", ")}</div>}
                    {room.amenityIds.length > 0 && <div className="room-amenities">{room.amenityIds.slice(0, 8).map(id => <Badge key={id} color="gray">{facilityMap[id] || id}</Badge>)}{room.amenityIds.length > 8 && <Badge color="gray">+{room.amenityIds.length - 8} more</Badge>}</div>}
                </div>
            ))}
        </div>
    );
}

export default RoomManagement;
