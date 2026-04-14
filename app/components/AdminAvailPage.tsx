"use client";
import React from "react";
import { Ic, Btn, Badge, Sel, FieldLabel, Toggle } from "./ui";
import type { Room, Availability } from "./types";

export default function AdminAvailPage({ rooms, availability, setAvailability }: {
    rooms: Room[]; availability: Record<string, Availability>; setAvailability: React.Dispatch<React.SetStateAction<Record<string, Availability>>>;
}) {
    const updAva = (roomId: string, field: keyof Availability, val: unknown) => setAvailability(p => ({ ...p, [roomId]: { ...p[roomId], [field]: val } }));

    return (
        <div>
            <div className="page-header"><div><div className="page-title">Availability & Inventory</div><div className="page-sub">Manage room closures and inventory allocation</div></div></div>
            {rooms.length === 0 ? <div className="card" style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>No rooms configured. Add room types first.</div> :
                rooms.map(room => {
                    const a = availability[room.id] || { status: "Available", bookedCount: 0, maintenanceCount: 0, totalCount: 10, overbookingLimit: 0, instantBooking: true };
                    return (
                        <div className="card avail-card" key={room.id} style={{ display: "flex", gap: 24, alignItems: "center" }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 16, fontWeight: 700 }}>{room.roomName}</div>
                                <div style={{ fontSize: 13, color: "#6b7280" }}>{room.roomCategory}</div>
                            </div>
                            <div style={{ width: 140 }}>
                                <FieldLabel>Status</FieldLabel>
                                <Sel value={a.status} onChange={e => updAva(room.id, "status", e.target.value)} opts={["Available", "Closed", "Fully Booked", "On Request"]} />
                            </div>
                            <div style={{ padding: "0 20px", display: "flex", gap: 32 }}>
                                <div><div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Booked</div><div style={{ fontSize: 18, fontWeight: 700 }}>{a.bookedCount}</div></div>
                                <div><div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Total</div><div style={{ fontSize: 18, fontWeight: 700 }}>{a.totalCount}</div></div>
                                <div><div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Available</div><Badge color={a.totalCount - a.bookedCount > 0 ? "green" : "red"}>{a.totalCount - a.bookedCount}</Badge></div>
                            </div>
                            <div style={{ display: "flex", gap: 20 }}>
                                <Toggle checked={a.instantBooking} onChange={v => updAva(room.id, "instantBooking", v)} label="Instant Booking" />
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
