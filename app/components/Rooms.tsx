"use client";
import React, { useState, useMemo } from "react";
import { Btn, Badge, Inp, Field, Sel, Confirm, uid } from "./ui";
import type { Room } from "./types";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface RoomItem {
    id: string;
    roomNumber: string;
    roomTypeId: string;
    roomTypeName: string;
    floor: number;
    status: "available" | "occupied" | "cleaning" | "maintenance" | "out-of-order" | "blocked";
    isActive: boolean;
    features: string[];
    notes: string;
    lastCleaned: string;
    createdAt: string;
}

const STATUS_CONFIG: Record<RoomItem["status"], { label: string; color: string; bg: string; dot: string }> = {
    available: { label: "Available", color: "#166534", bg: "#dcfce7", dot: "#16a34a" },
    occupied: { label: "Occupied", color: "#1e40af", bg: "#dbeafe", dot: "#2563eb" },
    cleaning: { label: "Cleaning", color: "#92400e", bg: "#fef3c7", dot: "#f59e0b" },
    maintenance: { label: "Maintenance", color: "#7c3aed", bg: "#ede9fe", dot: "#7c3aed" },
    "out-of-order": { label: "Out of Order", color: "#991b1b", bg: "#fee2e2", dot: "#dc2626" },
    blocked: { label: "Blocked", color: "#374151", bg: "#f3f4f6", dot: "#9ca3af" },
};

const STATUS_OPTS = Object.entries(STATUS_CONFIG).map(([v, c]) => `${c.label} (${v})`);
const STATUS_VALUES = Object.keys(STATUS_CONFIG) as RoomItem["status"][];
const ALL_FEATURES = ["Corner Room", "Connecting Door", "Accessible", "City View Premium", "Extra Quiet", "Garden View", "Ground Floor", "Butler Service", "Private Terrace", "Panoramic View", "Extra King Bed"];

// ── Room Card ─────────────────────────────────────────────────────────────────
function RoomCard({ room, onEdit, onDelete }: { room: RoomItem; onEdit: (r: RoomItem) => void; onDelete: (id: string) => void }) {
    const sc = STATUS_CONFIG[room.status];
    return (
        <div
            style={{
                background: "#fff",
                border: `2px solid ${sc.dot}30`,
                borderRadius: 10,
                padding: "10px 12px",
                position: "relative",
                transition: "box-shadow .15s, transform .15s",
                cursor: "pointer",
                minWidth: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,.1)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}
            onClick={() => onEdit(room)}
        >
            {/* Room Number */}
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", letterSpacing: -0.5 }}>{room.roomNumber}</div>
            {/* Status badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: sc.bg, borderRadius: 20, padding: "2px 8px", marginTop: 4, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, textTransform: "uppercase", letterSpacing: 0.5 }}>{sc.label}</span>
            </div>
            {/* Room type */}
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{room.roomTypeName}</div>
            {/* Features */}
            {room.features.length > 0 && (
                <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {room.features.join(" · ")}
                </div>
            )}
            {/* Actions */}
            <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 2 }} onClick={e => e.stopPropagation()}>
                <button
                    onClick={() => onDelete(room.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 3, borderRadius: 4, color: "#dc2626", opacity: 0.5 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.5"; }}
                    title="Delete room"
                >✕</button>
            </div>
        </div>
    );
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function RoomModal({ room, rooms: roomTypes, onSave, onClose }: {
    room: Partial<RoomItem> | null;
    rooms: Room[];
    onSave: (r: RoomItem) => void;
    onClose: () => void;
}) {
    const isNew = !room?.id;
    const [f, setF] = useState<Partial<RoomItem>>(room ?? {
        roomNumber: "", roomTypeId: roomTypes[0]?.id ?? "", roomTypeName: roomTypes[0]?.roomName ?? "",
        floor: 1, status: "available", isActive: true, features: [], notes: "", lastCleaned: new Date().toISOString().slice(0, 10),
    });
    const set = (k: keyof RoomItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setF(p => ({ ...p, [k]: e.target.value }));

    const toggleFeature = (feat: string) => setF(p => {
        const cur = p.features ?? [];
        return { ...p, features: cur.includes(feat) ? cur.filter(x => x !== feat) : [...cur, feat] };
    });

    const handleRoomType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const rt = roomTypes.find(r => r.id === e.target.value);
        setF(p => ({ ...p, roomTypeId: e.target.value, roomTypeName: rt?.roomName ?? "" }));
    };

    const save = () => {
        if (!f.roomNumber?.trim()) return;
        const doc: RoomItem = {
            id: f.id || `room_${f.roomNumber}`,
            roomNumber: f.roomNumber!.trim(),
            roomTypeId: f.roomTypeId || roomTypes[0]?.id || "",
            roomTypeName: f.roomTypeName || roomTypes.find(r => r.id === f.roomTypeId)?.roomName || "",
            floor: Number(f.floor) || Math.floor(parseInt(f.roomNumber || "100") / 100),
            status: f.status as RoomItem["status"] || "available",
            isActive: f.isActive ?? true,
            features: f.features ?? [],
            notes: f.notes ?? "",
            lastCleaned: f.lastCleaned || new Date().toISOString().slice(0, 10),
            createdAt: f.createdAt || new Date().toISOString(),
        };
        onSave(doc);
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{isNew ? "➕ Add Room" : `✏️ Edit Room ${f.roomNumber}`}</div>
                    <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9ca3af" }}>×</button>
                </div>
                <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                        <Field label="Room Number *">
                            <Inp value={f.roomNumber ?? ""} onChange={set("roomNumber")} placeholder="e.g. 101" disabled={!isNew} />
                        </Field>
                        <Field label="Floor">
                            <Inp type="number" value={String(f.floor ?? 1)} onChange={set("floor")} placeholder="1" min="1" max="99" />
                        </Field>
                        <Field label="Room Type *">
                            <select value={f.roomTypeId ?? ""} onChange={handleRoomType}
                                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: "#fff" }}>
                                {roomTypes.map(rt => <option key={rt.id} value={rt.id}>{rt.roomName}</option>)}
                            </select>
                        </Field>
                        <Field label="Status">
                            <select value={f.status ?? "available"} onChange={set("status")}
                                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: "#fff" }}>
                                {STATUS_VALUES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                            </select>
                        </Field>
                    </div>
                    <Field label="Last Cleaned">
                        <Inp type="date" value={f.lastCleaned ?? ""} onChange={set("lastCleaned")} />
                    </Field>
                    <div style={{ marginTop: 14, marginBottom: 6 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Special Features</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {ALL_FEATURES.map(feat => {
                                const on = (f.features ?? []).includes(feat);
                                return (
                                    <button key={feat} onClick={() => toggleFeature(feat)}
                                        style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: on ? "2px solid #2563eb" : "2px solid #e5e7eb", background: on ? "#eff6ff" : "#f9fafb", color: on ? "#1d4ed8" : "#6b7280", transition: "all .12s" }}>
                                        {on ? "✓ " : ""}{feat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <Field label="Notes" style={{ marginTop: 14 }}>
                        <textarea value={f.notes ?? ""} onChange={set("notes")} rows={2}
                            placeholder="Any special notes about this room..."
                            style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, resize: "vertical", fontFamily: "inherit" }} />
                    </Field>
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20, paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
                        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
                        <Btn onClick={save}>{isNew ? "Add Room" : "Save Changes"}</Btn>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RoomsPage({ inventory: roomsList, rooms: roomTypes, onAdd, onUpdate, onDelete, onDeleteFloor }: {
    inventory: RoomItem[];
    rooms: Room[];
    onAdd: (r: RoomItem) => void;
    onUpdate: (r: RoomItem) => void;
    onDelete: (id: string) => void;
    onDeleteFloor: (floor: number) => void;
}) {
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterFloor, setFilterFloor] = useState("all");
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState<Partial<RoomItem> | null | false>(false);
    const [confirm, setConfirm] = useState<{ id?: string; num?: string; floor?: number } | null>(null);

    // Derived data
    const floors = useMemo(() => [...new Set(roomsList.map(r => r.floor))].sort((a, b) => a - b), [roomsList]);
    const statusCounts = useMemo(() => STATUS_VALUES.reduce((acc, s) => ({ ...acc, [s]: roomsList.filter(r => r.status === s).length }), {} as Record<string, number>), [roomsList]);

    const filtered = useMemo(() => roomsList.filter(r => {
        if (filterType !== "all" && r.roomTypeId !== filterType) return false;
        if (filterStatus !== "all" && r.status !== filterStatus) return false;
        if (filterFloor !== "all" && String(r.floor) !== filterFloor) return false;
        if (search && !r.roomNumber.includes(search) && !r.roomTypeName.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    }), [roomsList, filterType, filterStatus, filterFloor, search]);

    // Group by floor
    const byFloor = useMemo(() => {
        const map = new Map<number, RoomItem[]>();
        filtered.forEach(r => {
            if (!map.has(r.floor)) map.set(r.floor, []);
            map.get(r.floor)!.push(r);
        });
        return [...map.entries()].sort((a, b) => a[0] - b[0]);
    }, [filtered]);

    const handleSave = (r: RoomItem) => {
        if (modal && (modal as RoomItem).id) {
            onUpdate(r);
        } else {
            onAdd(r);
        }
        setModal(false);
    };

    const handleDelete = (id: string) => {
        const room = roomsList.find(r => r.id === id);
        setConfirm({ id, num: room?.roomNumber ?? id });
    };

    return (
        <div>
            {modal !== false && (
                <RoomModal room={modal} rooms={roomTypes} onSave={handleSave} onClose={() => setModal(false)} />
            )}
            {confirm && (
                <Confirm
                    title={confirm.floor !== undefined ? "Delete Floor" : "Delete Room"}
                    msg={confirm.floor !== undefined 
                        ? `Remove all rooms on Floor ${confirm.floor}? This cannot be undone.`
                        : `Remove room ${confirm.num} from inventory? This cannot be undone.`
                    }
                    onOk={() => { 
                        if (confirm.floor !== undefined) {
                            onDeleteFloor(confirm.floor);
                        } else if (confirm.id) {
                            onDelete(confirm.id);
                        }
                        setConfirm(null); 
                    }}
                    onCancel={() => setConfirm(null)}
                />
            )}

            {/* Header */}
            <div className="page-header">
                <div>
                    <div className="page-title">Rooms</div>
                    <div className="page-sub">{roomsList.length} rooms across {floors.length} floor{floors.length !== 1 ? "s" : ""} · <span style={{ color: "#16a34a", fontWeight: 600 }}>● Live DB</span></div>
                </div>
                <Btn onClick={() => setModal({})}>＋ Add Room</Btn>
            </div>

            {/* Status overview strip */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                {STATUS_VALUES.map(s => {
                    const sc = STATUS_CONFIG[s];
                    return (
                        <div key={s} onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
                            style={{ background: filterStatus === s ? sc.bg : "#f9fafb", border: `1.5px solid ${filterStatus === s ? sc.dot : "#e5e7eb"}`, borderRadius: 10, padding: "8px 14px", cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc.dot }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: filterStatus === s ? sc.color : "#374151" }}>{sc.label}</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: filterStatus === s ? sc.color : "#111827" }}>{statusCounts[s] ?? 0}</span>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search room number..."
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, minWidth: 180 }} />
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: "#fff" }}>
                    <option value="all">All Types</option>
                    {roomTypes.map(r => <option key={r.id} value={r.id}>{r.roomName}</option>)}
                </select>
                <select value={filterFloor} onChange={e => setFilterFloor(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: "#fff" }}>
                    <option value="all">All Floors</option>
                    {floors.map(f => <option key={f} value={String(f)}>Floor {f}</option>)}
                </select>
                {(filterType !== "all" || filterStatus !== "all" || filterFloor !== "all" || search) && (
                    <button onClick={() => { setFilterType("all"); setFilterStatus("all"); setFilterFloor("all"); setSearch(""); }}
                        style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, background: "#fff", cursor: "pointer", color: "#6b7280" }}>
                        ✕ Clear filters
                    </button>
                )}
                <span style={{ marginLeft: "auto", fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center" }}>
                    Showing {filtered.length} of {roomsList.length} rooms
                </span>
            </div>

            {/* Floor-by-floor grid */}
            {byFloor.length === 0 && (
                <div className="card" style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🏨</div>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No rooms found</div>
                    <div style={{ fontSize: 13 }}>Try adjusting your filters, or click + Add Room to create one.</div>
                </div>
            )}

            {byFloor.map(([floor, roomsOnFloor]) => (
                <div key={floor} style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#374151" }}>Floor {floor}</div>
                        <button
                            onClick={() => setConfirm({ floor })}
                            style={{ background: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 4, color: "#dc2626", fontSize: 11, opacity: 0.4, transition: "opacity .2s", border: "1px solid transparent" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.borderColor = "#fee2e2"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0.4"; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; (e.currentTarget as HTMLElement).style.background = "none"; }}
                            title={`Delete all rooms on floor ${floor}`}
                        >
                            🗑️ Delete Floor
                        </button>
                        <div style={{ height: 1, flex: 1, background: "#e5e7eb" }} />
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>{roomsOnFloor.length} room{roomsOnFloor.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
                        {roomsOnFloor.map(room => (
                            <RoomCard key={room.id} room={room} onEdit={r => setModal(r)} onDelete={handleDelete} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
