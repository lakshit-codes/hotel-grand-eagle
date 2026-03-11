"use client";
import React, { useMemo } from "react";
import { Booking, Customer, HousekeepingTask, MaintenanceItem, Room, Availability } from "./types";
import { Badge, Ic, statusColor, fmtDate, fmt } from "./ui";

interface Props {
    hotel: { name: string; city: string; country: string; starRating: number };
    rooms: Room[];
    availability: Record<string, Availability>;
    bookings: Booking[];
    customers: Customer[];
    hkTasks: HousekeepingTask[];
    maintenance: MaintenanceItem[];
    onNav: (page: string) => void;
}

export default function Dashboard({ hotel, rooms, availability, bookings, customers, hkTasks, maintenance, onNav }: Props) {
    const today = new Date().toISOString().slice(0, 10);

    const stats = useMemo(() => {
        let inv = 0, avail = 0;
        rooms.forEach(r => {
            const a = availability[r.id];
            if (!a) return;
            inv += a.totalRooms; avail += a.availableRooms;
        });
        const occ = inv > 0 ? Math.round(((inv - avail) / inv) * 100) : 0;
        const arrivals = bookings.filter(b => b.checkIn === today && b.status === "confirmed");
        const departures = bookings.filter(b => b.checkOut === today && b.status === "checked-in");
        const inHouse = bookings.filter(b => b.status === "checked-in");
        const revenue = bookings.filter(b => b.checkIn.slice(0, 7) === today.slice(0, 7)).reduce((s, b) => s + b.grandTotal, 0);
        const dirtyRooms = hkTasks.filter(t => t.status === "dirty").length;
        const openMaint = maintenance.filter(m => m.status === "open" || m.status === "in-progress").length;
        return { inv, avail, occ, arrivals, departures, inHouse, revenue, dirtyRooms, openMaint };
    }, [rooms, availability, bookings, hkTasks, maintenance, today]);

    const occColor = stats.occ >= 90 ? "#dc2626" : stats.occ >= 60 ? "#d97706" : "#16a34a";

    const kpis = [
        { label: "Occupancy", value: `${stats.occ}%`, color: occColor, sub: `${stats.avail} rooms available` },
        { label: "In-House Guests", value: stats.inHouse.length, color: "#111827", sub: `${stats.inHouse.reduce((s, b) => s + b.adults + b.children, 0)} persons` },
        { label: "Arrivals Today", value: stats.arrivals.length, color: "#2563eb", sub: "Pending check-in" },
        { label: "Departures Today", value: stats.departures.length, color: "#d97706", sub: "Expected checkout" },
        { label: "Monthly Revenue", value: `$${fmt(stats.revenue)}`, color: "#16a34a", sub: "This month" },
    ];

    const recentBookings = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
    const customerMap = useMemo(() => {
        const m: Record<string, Customer> = {};
        customers.forEach(c => { m[c.id] = c; });
        return m;
    }, [customers]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Dashboard</div>
                    <div className="page-sub">{hotel.name} &middot; {hotel.city}, {hotel.country} &middot; Today: {fmtDate(today)}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-md btn-primary" onClick={() => onNav("checkin")}>
                        <Ic.CheckIn /> Quick Check-in
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid-kpi mb-20">
                {kpis.map(k => (
                    <div className="kpi-card" key={k.label}>
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
                        <div className="kpi-sub">{k.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid-2 mb-16" style={{ alignItems: "start" }}>
                {/* Arrivals today */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">🚪 Arrivals Today ({stats.arrivals.length})</span>
                        <button className="btn btn-sm btn-outline" onClick={() => onNav("checkin")}><Ic.CheckIn /> Check-in</button>
                    </div>
                    {stats.arrivals.length === 0
                        ? <div className="card-body text-gray text-center" style={{ padding: "24px 20px" }}>No arrivals scheduled for today.</div>
                        : stats.arrivals.map(b => {
                            const c = customerMap[b.customerId];
                            return (
                                <div className="breakdown-row" key={b.id}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{b.guestName}</div>
                                        <div style={{ fontSize: 12, color: "#6b7280" }}>{b.bookingRef} &middot; {b.roomTypeName} &middot; {b.nights}N</div>
                                    </div>
                                    {c?.vip && <Badge color="purple">VIP</Badge>}
                                    <Badge color={statusColor[b.status]}>{b.status}</Badge>
                                </div>
                            );
                        })}
                </div>

                {/* Departures today */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">🧳 Departures Today ({stats.departures.length})</span>
                    </div>
                    {stats.departures.length === 0
                        ? <div className="card-body text-gray text-center" style={{ padding: "24px 20px" }}>No departures scheduled for today.</div>
                        : stats.departures.map(b => (
                            <div className="breakdown-row" key={b.id}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{b.guestName}</div>
                                    <div style={{ fontSize: 12, color: "#6b7280" }}>{b.bookingRef} &middot; Room {b.roomNumber} &middot; {b.roomTypeName}</div>
                                </div>
                                <Badge color="amber">Due out</Badge>
                            </div>
                        ))}
                </div>
            </div>

            <div className="grid-2 mb-16" style={{ alignItems: "start" }}>
                {/* Alerts */}
                <div className="card">
                    <div className="card-header"><span className="card-title">⚠️ Alerts & Notices</span></div>
                    <div className="card-body" style={{ padding: 0 }}>
                        {stats.dirtyRooms > 0 && (
                            <div className="breakdown-row" style={{ gap: 10 }}>
                                <span style={{ fontSize: 18 }}>🧹</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{stats.dirtyRooms} rooms need cleaning</div>
                                    <div style={{ fontSize: 12, color: "#6b7280" }}>Housekeeping action required</div>
                                </div>
                                <button className="btn btn-sm btn-secondary" onClick={() => onNav("housekeeping")}>View</button>
                            </div>
                        )}
                        {stats.openMaint > 0 && (
                            <div className="breakdown-row" style={{ gap: 10 }}>
                                <span style={{ fontSize: 18 }}>🔧</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>{stats.openMaint} maintenance issues open</div>
                                    <div style={{ fontSize: 12, color: "#6b7280" }}>Requires attention</div>
                                </div>
                                <button className="btn btn-sm btn-secondary" onClick={() => onNav("maintenance")}>View</button>
                            </div>
                        )}
                        {stats.dirtyRooms === 0 && stats.openMaint === 0 && (
                            <div className="card-body text-gray text-center">All operations running smoothly ✅</div>
                        )}
                    </div>
                </div>

                {/* Room Breakdown */}
                <div className="card">
                    <div className="card-header"><span className="card-title">🏨 Room Breakdown</span></div>
                    {rooms.map(r => {
                        const a = availability[r.id];
                        const av = a?.availableRooms ?? 0, tot = a?.totalRooms ?? 0;
                        const occ = tot > 0 ? Math.round(((tot - av) / tot) * 100) : 0;
                        const c = occ >= 90 ? "#dc2626" : occ >= 60 ? "#d97706" : "#16a34a";
                        return (
                            <div className="breakdown-row" key={r.id}>
                                <span style={{ flex: 1, fontWeight: 600 }}>{r.roomName}</span>
                                <span style={{ color: "#6b7280", fontSize: 12 }}>{av}/{tot}</span>
                                <div style={{ width: 80, height: 5, background: "#e5e7eb", borderRadius: 3, overflow: "hidden" }}>
                                    <div style={{ width: `${occ}%`, height: "100%", background: c, borderRadius: 3 }} />
                                </div>
                                <span style={{ color: c, fontWeight: 700, width: 40, textAlign: "right" }}>{occ}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent bookings */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">📋 Recent Bookings</span>
                    <button className="btn btn-sm btn-secondary" onClick={() => onNav("bookings")}>View All</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr><th>Ref</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Guests</th><th>Meal</th><th>Status</th><th>Total</th></tr>
                    </thead>
                    <tbody>
                        {recentBookings.map(b => (
                            <tr key={b.id}>
                                <td style={{ fontWeight: 600, color: "#2563eb" }}>{b.bookingRef}</td>
                                <td>{b.guestName}</td>
                                <td style={{ fontSize: 12 }}>{b.roomTypeName}</td>
                                <td style={{ fontSize: 12 }}>{fmtDate(b.checkIn)}</td>
                                <td style={{ fontSize: 12 }}>{fmtDate(b.checkOut)}</td>
                                <td style={{ fontSize: 12 }}>{b.adults}A{b.children > 0 ? ` ${b.children}C` : ""}</td>
                                <td><Badge color="indigo">{b.mealPlanCode}</Badge></td>
                                <td><Badge color={statusColor[b.status]}>{b.status}</Badge></td>
                                <td style={{ fontWeight: 600 }}>${fmt(b.grandTotal)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
