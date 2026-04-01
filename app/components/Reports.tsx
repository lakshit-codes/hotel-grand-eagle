"use client";
import React, { useState, useMemo } from "react";
import { Booking, Room, MealPlan, HousekeepingTask } from "./types";
import { fmtDate, fmt } from "./ui";

interface Props {
    bookings: Booking[];
    rooms: Room[];
    mealPlans: MealPlan[];
    hkTasks: HousekeepingTask[];
}

const TODAY = new Date().toISOString().slice(0, 10);
function addDays(d: string, n: number) { const dt = new Date(d + "T00:00:00"); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); }

/** Last 7 months including current */
function getMonthOptions() {
    const opts: { label: string; from: string; to: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const from = d.toISOString().slice(0, 10);
        const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        const to = last.toISOString().slice(0, 10);
        const label = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
        opts.push({ label, from, to });
    }
    return opts;
}
const MONTH_OPTIONS = getMonthOptions();

export default function ReportsPage({ bookings, rooms, mealPlans, hkTasks }: Props) {
    const [tab, setTab] = useState<"occupancy" | "arrivals" | "inhouse" | "revenue" | "cancellations" | "nightaudit">("occupancy");
    const [dateFrom, setDateFrom] = useState(addDays(TODAY, -30));
    const [dateTo, setDateTo] = useState(TODAY);
    const [nightAuditDone, setNightAuditDone] = useState(false);
    const [activeMonth, setActiveMonth] = useState<string | null>(null); // null = custom range

    const applyMonth = (from: string, to: string, key: string) => {
        setDateFrom(from);
        setDateTo(to);
        setActiveMonth(key);
    };

    // ── Occupancy ──────────────────────────────────────────────────────────────
    const occupancyData = useMemo(() => {
        return rooms.map(r => {
            const relevantBookings = bookings.filter(b => b.roomTypeId === r.id && b.status !== "cancelled" && b.status !== "no-show" && b.checkIn <= dateTo && b.checkOut >= dateFrom);
            let totalOccupiedNights = 0;
            relevantBookings.forEach(b => { totalOccupiedNights += b.nights; });
            const days = Math.max(1, Math.round((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86400000));
            const totalRooms = r.roomNumbers?.length ?? 0;
            const occupancyPct = totalRooms > 0 ? Math.min(100, Math.round((totalOccupiedNights / (totalRooms * days)) * 100)) : 0;
            const revenue = relevantBookings.reduce((s, b) => s + b.totalRoomCost, 0);
            return { room: r, bookings: relevantBookings.length, nights: totalOccupiedNights, pct: occupancyPct, revenue };
        });
    }, [rooms, bookings, dateFrom, dateTo]);

    // ── Arrivals / Departures next 7 days ─────────────────────────────────────
    const next7Days = useMemo(() => Array.from({ length: 8 }, (_, i) => addDays(TODAY, i)), []);
    const arrivalsMap = useMemo(() => {
        const m: Record<string, Booking[]> = {};
        next7Days.forEach(d => { m[d] = bookings.filter(b => b.checkIn === d && (b.status === "confirmed" || b.status === "pending")); });
        return m;
    }, [bookings, next7Days]);
    const departuresMap = useMemo(() => {
        const m: Record<string, Booking[]> = {};
        next7Days.forEach(d => { m[d] = bookings.filter(b => b.checkOut === d && b.status === "checked-in"); });
        return m;
    }, [bookings, next7Days]);

    // ── In-house ──────────────────────────────────────────────────────────────
    const inHouse = useMemo(() => Array.isArray(bookings) ? bookings.filter(b => b.status === "checked-in").sort((a, b) => (a?.checkOut || "").localeCompare(b?.checkOut || "")) : [], [bookings]);

    // ── Revenue ───────────────────────────────────────────────────────────────
    const revData = useMemo(() => {
        // Use date-overlap so bookings spanning month boundaries are correctly included
        const relevant = bookings.filter(b => b.status !== "cancelled" && b.status !== "no-show" && b.checkIn <= dateTo && b.checkOut >= dateFrom);
        const bySource: Record<string, number> = {};
        const byMeal: Record<string, number> = {};
        const byRoom: Record<string, number> = {};
        relevant.forEach(b => {
            bySource[b.bookingSource] = (bySource[b.bookingSource] ?? 0) + b.grandTotal;
            const mp = mealPlans.find(m => m.id === b.mealPlanId);
            const mpLabel = mp ? mp.code : "EP";
            byMeal[mpLabel] = (byMeal[mpLabel] ?? 0) + b.totalMealCost;
            byRoom[b.roomTypeName] = (byRoom[b.roomTypeName] ?? 0) + b.totalRoomCost;
        });
        const total = relevant.reduce((s, b) => s + b.grandTotal, 0);
        const roomTotal = relevant.reduce((s, b) => s + b.totalRoomCost, 0);
        const mealTotal = relevant.reduce((s, b) => s + b.totalMealCost, 0);
        return { total, roomTotal, mealTotal, bySource, byMeal, byRoom, count: relevant.length };
    }, [bookings, mealPlans, dateFrom, dateTo]);

    // ── Cancellations ─────────────────────────────────────────────────────────
    const cancData = useMemo(() => {
        const total = bookings.filter(b => b.checkIn <= dateTo && b.checkOut >= dateFrom);
        const cancelled = total.filter(b => b.status === "cancelled" || b.status === "no-show");
        const lostRevenue = cancelled.reduce((s, b) => s + b.grandTotal, 0);
        const cancRate = total.length > 0 ? Math.round((cancelled.length / total.length) * 100) : 0;
        return { cancelled, lostRevenue, cancRate, totalCount: total.length };
    }, [bookings, dateFrom, dateTo]);

    // ── Night Audit ────────────────────────────────────────────────────────────
    const nightAuditData = useMemo(() => {
        const arrivals = bookings.filter(b => b.checkIn === TODAY && b.status === "confirmed");
        const departures = bookings.filter(b => b.checkOut === TODAY && b.status === "checked-in");
        const noShows = bookings.filter(b => b.checkIn < TODAY && b.status === "confirmed");
        const todayRevenue = bookings.filter(b => b.checkIn === TODAY && (b.status === "checked-in" || b.status === "confirmed")).reduce((s, b) => s + b.grandTotal, 0);
        const cleanRooms = hkTasks.filter(t => t.status === "clean").length;
        const dirtyRooms = hkTasks.filter(t => t.status === "dirty").length;
        return { arrivals, departures, noShows, todayRevenue, cleanRooms, dirtyRooms };
    }, [bookings, hkTasks]);

    /** Month pills + custom date range filter */
    const dateFilter = (
        <div>
            {/* Month pills */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginRight: 4 }}>Period:</span>
                {MONTH_OPTIONS.map(m => (
                    <button key={m.from} onClick={() => applyMonth(m.from, m.to, m.from)}
                        style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${activeMonth === m.from ? "#E4C581" : "#e5e7eb"}`, background: activeMonth === m.from ? "#fcf8ed" : "#fff", color: activeMonth === m.from ? "#b45309" : "#6b7280", fontWeight: activeMonth === m.from ? 700 : 400, fontSize: 12, cursor: "pointer" }}>
                        {m.label}
                    </button>
                ))}
                <button onClick={() => setActiveMonth(null)}
                    style={{ padding: "4px 12px", borderRadius: 20, border: `1.5px solid ${activeMonth === null ? "#E4C581" : "#e5e7eb"}`, background: activeMonth === null ? "#fcf8ed" : "#fff", color: activeMonth === null ? "#b45309" : "#6b7280", fontWeight: activeMonth === null ? 700 : 400, fontSize: 12, cursor: "pointer" }}>
                    Custom
                </button>
            </div>
            {/* Custom date range */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
                <div><label className="field-label">From</label><input type="date" className="inp" value={dateFrom} max={dateTo} onChange={e => { if (e.target.value <= dateTo) { setDateFrom(e.target.value); setActiveMonth(null); } }} style={{ width: 160 }} /></div>
                <div><label className="field-label">To</label><input type="date" className="inp" value={dateTo} min={dateFrom} onChange={e => { if (e.target.value >= dateFrom) { setDateTo(e.target.value); setActiveMonth(null); } }} style={{ width: 160 }} /></div>
            </div>
        </div>
    );

    const barColor = ["#3b82f6", "#8b5cf6", "#16a34a", "#d97706", "#ef4444", "#14b8a6"];

    return (
        <div>
            <div className="page-header">
                <div><div className="page-title">Reports & Night Audit</div><div className="page-sub">Occupancy · Arrivals/Departures · Revenue · Night Audit</div></div>
            </div>

            {/* Tab nav */}
            <div style={{ display: "flex", gap: 0, background: "#f3f4f6", padding: 4, borderRadius: 10, marginBottom: 20, flexWrap: "wrap" }}>
                {([
                    { id: "occupancy", label: "📊 Occupancy" },
                    { id: "arrivals", label: "📅 Arrivals & Deps" },
                    { id: "inhouse", label: "🛏️ In-House List" },
                    { id: "revenue", label: "💰 Revenue" },
                    { id: "cancellations", label: "📤 Cancellations" },
                    { id: "nightaudit", label: "🌙 Night Audit" },
                ] as const).map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn ${tab === t.id ? "active" : ""}`} style={{ flex: "unset", padding: "9px 18px" }}>{t.label}</button>
                ))}
            </div>

            {/* ── Occupancy ──────────────────────────────────────── */}
            {tab === "occupancy" && (<>
                {dateFilter}
                <div className="grid-3 mb-16">
                    {occupancyData.map((d, i) => (
                        <div key={d.room.id} className="card" style={{ borderTop: `4px solid ${barColor[i % barColor.length]}` }}>
                            <div className="card-body">
                                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{d.room.roomName}</div>
                                <div style={{ fontSize: 36, fontWeight: 800, color: barColor[i % barColor.length], lineHeight: 1 }}>{d.pct}%</div>
                                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Occupancy rate</div>
                                <div style={{ height: 6, background: "#f0f0f0", borderRadius: 3, margin: "10px 0", overflow: "hidden" }}>
                                    <div style={{ width: `${d.pct}%`, height: "100%", background: barColor[i % barColor.length], borderRadius: 3, transition: "width .5s" }} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#6b7280" }}>
                                    <span>{d.bookings} bookings · {d.nights} nights</span>
                                    <span style={{ fontWeight: 700, color: "#16a34a" }}>₹{fmt(d.revenue)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="card">
                    <div className="card-header"><span className="card-title">Summary</span></div>
                    <div className="card-body">
                        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", fontSize: 14 }}>
                            <div><div style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Total Bookings</div><div style={{ fontWeight: 700, fontSize: 22 }}>{occupancyData.reduce((s, d) => s + d.bookings, 0)}</div></div>
                            <div><div style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Total Nights Sold</div><div style={{ fontWeight: 700, fontSize: 22 }}>{occupancyData.reduce((s, d) => s + d.nights, 0)}</div></div>
                            <div><div style={{ color: "#9ca3af", fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>Room Revenue</div><div style={{ fontWeight: 700, fontSize: 22, color: "#16a34a" }}>₹{fmt(occupancyData.reduce((s, d) => s + d.revenue, 0))}</div></div>
                        </div>
                    </div>
                </div>
            </>)}

            {/* ── Arrivals & Departures ──────────────────────────── */}
            {tab === "arrivals" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "#2563eb" }}>🚪 Arrivals — Next 7 Days</div>
                        {next7Days.map(d => (
                            <div key={d} style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4, textTransform: "uppercase" }}>{fmtDate(d)}{d === TODAY ? " (TODAY)" : ""} — {arrivalsMap[d].length} arrivals</div>
                                {arrivalsMap[d].length === 0 && <div style={{ fontSize: 12.5, color: "#d1d5db", padding: "8px 12px", background: "#fafafa", borderRadius: 7 }}>No arrivals</div>}
                                {arrivalsMap[d].map(b => (
                                    <div key={b.id} style={{ padding: "9px 12px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 4, fontSize: 13 }}>
                                        <div style={{ fontWeight: 600 }}>{b.guestName} {b.coGuests?.length > 0 && <span style={{ fontSize: 11, color: "#7c3aed" }}>+{b.coGuests.length}</span>}</div>
                                        <div style={{ color: "#6b7280", fontSize: 12 }}>{b.bookingRef} · {b.roomTypeName}{b.roomNumber ? ` · Rm ${b.roomNumber}` : ""} · {b.mealPlanCode}</div>
                                        {b.earlyCheckIn && <div style={{ fontSize: 11, color: "#7c3aed" }}>🌅 Early CI: {b.earlyCheckInTime}</div>}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "#d97706" }}>🧳 Departures — Next 7 Days</div>
                        {next7Days.map(d => (
                            <div key={d} style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4, textTransform: "uppercase" }}>{fmtDate(d)}{d === TODAY ? " (TODAY)" : ""} — {departuresMap[d].length} departures</div>
                                {departuresMap[d].length === 0 && <div style={{ fontSize: 12.5, color: "#d1d5db", padding: "8px 12px", background: "#fafafa", borderRadius: 7 }}>No departures</div>}
                                {departuresMap[d].map(b => (
                                    <div key={b.id} style={{ padding: "9px 12px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 4, fontSize: 13 }}>
                                        <div style={{ fontWeight: 600 }}>{b.guestName}</div>
                                        <div style={{ color: "#6b7280", fontSize: 12 }}>{b.bookingRef} · Rm {b.roomNumber} · {b.nights}N</div>
                                        {b.lateCheckOut && <div style={{ fontSize: 11, color: "#7c3aed" }}>🌙 Late CO: {b.lateCheckOutTime}</div>}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── In-House List ──────────────────────────────────── */}
            {tab === "inhouse" && (
                <div className="card">
                    <div className="card-header"><span className="card-title">🛏️ In-House Guests ({inHouse.length})</span><span style={{ fontSize: 12, color: "#9ca3af" }}>{inHouse.reduce((s, b) => s + b.adults + b.children, 0)} persons total</span></div>
                    {inHouse.length === 0 && <div className="card-body text-gray text-center">No guests currently checked in.</div>}
                    <div style={{ overflowX: "auto" }}>
                    <table className="data-table">
                        <thead><tr><th>Room</th><th>Guest</th><th>Co-Guests</th><th>Check-in</th><th>Check-out</th><th>Nights Left</th><th>Meal</th><th>Special</th></tr></thead>
                        <tbody>
                            {inHouse.map(b => {
                                const nightsLeft = Math.max(0, Math.round((new Date(b.checkOut).getTime() - Date.now()) / 86400000));
                                return (
                                    <tr key={b.id} style={{ background: nightsLeft === 0 ? "#fef9c3" : "" }}>
                                        <td><div style={{ fontWeight: 800, fontSize: 15, color: "#2563eb" }}>{b.roomNumber || "—"}</div><div style={{ fontSize: 11, color: "#9ca3af" }}>{b.roomTypeName}</div></td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{b.guestName}</div>
                                            <div style={{ fontSize: 11.5, color: "#6b7280" }}>{b.adults}A{b.children > 0 ? ` ${b.children}C` : ""} · {b.bookingRef}</div>
                                        </td>
                                        <td style={{ fontSize: 12 }}>{b.coGuests?.length > 0 ? b.coGuests.map(g => g.name).join(", ") : <span style={{ color: "#d1d5db" }}>—</span>}</td>
                                        <td style={{ fontSize: 12 }}>{fmtDate(b.checkIn)}{b.earlyCheckIn && <div style={{ fontSize: 11, color: "#7c3aed" }}>🌅 Early</div>}</td>
                                        <td style={{ fontSize: 12 }}>{fmtDate(b.checkOut)}{b.lateCheckOut && <div style={{ fontSize: 11, color: "#7c3aed" }}>🌙 Late</div>}</td>
                                        <td style={{ fontWeight: 700, color: nightsLeft === 0 ? "#dc2626" : nightsLeft <= 2 ? "#d97706" : "#111827" }}>{nightsLeft === 0 ? "Due Out" : nightsLeft + "N left"}</td>
                                        <td style={{ fontSize: 12 }}>{b.mealPlanCode}</td>
                                        <td style={{ fontSize: 12, color: "#d97706", maxWidth: 160 }}>{b.specialRequests || "—"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>
            )}

            {/* ── Revenue ────────────────────────────────────────── */}
            {tab === "revenue" && (<>
                {dateFilter}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                    {[
                        { label: "Total Revenue", value: `₹${fmt(revData.total)}`, color: "#16a34a" },
                        { label: "Room Revenue", value: `₹${fmt(revData.roomTotal)}`, color: "#2563eb" },
                        { label: "Meal Revenue", value: `₹${fmt(revData.mealTotal)}`, color: "#8b5cf6" },
                    ].map(k => (
                        <div key={k.label} className="kpi-card"><div className="kpi-label">{k.label}</div><div style={{ fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div><div className="kpi-sub">{revData.count} bookings</div></div>
                    ))}
                </div>
                <div className="grid-3">
                    {[
                        { title: "By Booking Source", data: revData.bySource },
                        { title: "By Meal Plan", data: revData.byMeal },
                        { title: "By Room Type", data: revData.byRoom },
                    ].map(({ title, data }, ci) => (
                        <div key={title} className="card">
                            <div className="card-header"><span className="card-title">{title}</span></div>
                            <div className="card-body">
                                {Object.entries(data).sort(([, a], [, b]) => b - a).map(([k, v], i) => {
                                    const total = Object.values(data).reduce((s, x) => s + x, 0) || 1;
                                    const pct = Math.round((v / total) * 100);
                                    return (
                                        <div key={k} style={{ marginBottom: 10 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                                                <span>{k}</span><span style={{ fontWeight: 700, color: "#16a34a" }}>₹{fmt(v)}</span>
                                            </div>
                                            <div style={{ height: 5, background: "#f0f0f0", borderRadius: 3 }}>
                                                <div style={{ width: `${pct}%`, height: "100%", background: barColor[(ci * 3 + i) % barColor.length], borderRadius: 3 }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {Object.keys(data).length === 0 && <div style={{ color: "#9ca3af", fontSize: 13 }}>No data for selected period.</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </>)}

            {/* ── Cancellations & No-Shows ─────────────────────── */}
            {tab === "cancellations" && (<>
                {dateFilter}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                    {[
                        { label: "Cancellations & No-Shows", value: cancData.cancelled.length, color: "#dc2626", sub: `of ${cancData.totalCount} total bookings` },
                        { label: "Lost Revenue", value: `₹${fmt(cancData.lostRevenue)}`, color: "#ef4444", sub: "Would-be earnings" },
                        { label: "Cancellation Rate", value: `${cancData.cancRate}%`, color: cancData.cancRate >= 20 ? "#dc2626" : cancData.cancRate >= 10 ? "#d97706" : "#16a34a", sub: "% of all bookings in period" },
                    ].map(k => (
                        <div key={k.label} className="kpi-card"><div className="kpi-label">{k.label}</div><div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div><div className="kpi-sub">{k.sub}</div></div>
                    ))}
                </div>
                <div className="card">
                    <div className="card-header"><span className="card-title">📤 Cancelled & No-Show Bookings</span><span style={{ fontSize: 12, color: "#9ca3af" }}>{cancData.cancelled.length} records</span></div>
                    {cancData.cancelled.length === 0
                        ? <div className="card-body text-gray text-center">No cancellations or no-shows in the selected period.</div>
                        : <div style={{ overflowX: "auto" }}>
                            <table className="data-table">
                                <thead><tr><th>Ref</th><th>Guest</th><th>Room Type</th><th>Check-in</th><th>Check-out</th><th>Nights</th><th>Status</th><th>Lost ₹</th></tr></thead>
                                <tbody>
                                    {cancData.cancelled.map(b => (
                                        <tr key={b.id}>
                                            <td style={{ fontWeight: 600, color: "#E4C581", fontSize: 12 }}>{b.bookingRef}</td>
                                            <td>{b.guestName}</td>
                                            <td style={{ fontSize: 12 }}>{b.roomTypeName}</td>
                                            <td style={{ fontSize: 12 }}>{fmtDate(b.checkIn)}</td>
                                            <td style={{ fontSize: 12 }}>{fmtDate(b.checkOut)}</td>
                                            <td style={{ fontSize: 12 }}>{b.nights}N</td>
                                            <td><span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: b.status === "cancelled" ? "#fef2f2" : "#fff7ed", color: b.status === "cancelled" ? "#dc2626" : "#d97706", fontWeight: 600 }}>{b.status}</span></td>
                                            <td style={{ fontWeight: 700, color: "#dc2626" }}>₹{b.grandTotal.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </>)}

            {/* ── Night Audit ────────────────────────────────────── */}
            {tab === "nightaudit" && (
                <div>
                    <div style={{ background: "#0f1623", borderRadius: 12, padding: "20px 24px", marginBottom: 20, color: "#fff" }}>
                        <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 4 }}>Night Audit</div>
                        <div style={{ fontSize: 22, fontWeight: 800 }}>{fmtDate(TODAY)}</div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>End-of-day hotel operations summary</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                        {[
                            { label: "Arrivals Today", value: nightAuditData.arrivals.length, color: "#2563eb", sub: "Confirmed check-ins" },
                            { label: "Departures Today", value: nightAuditData.departures.length, color: "#d97706", sub: "Expected check-outs" },
                            { label: "No-Shows", value: nightAuditData.noShows.length, color: "#dc2626", sub: "Missed arrivals" },
                            { label: "Today's Revenue", value: `₹${fmt(nightAuditData.todayRevenue)}`, color: "#16a34a", sub: "Room + meal" },
                        ].map(k => (
                            <div key={k.label} className="kpi-card"><div className="kpi-label">{k.label}</div><div className="kpi-value" style={{ color: k.color, fontSize: 22 }}>{k.value}</div><div className="kpi-sub">{k.sub}</div></div>
                        ))}
                    </div>
                    <div className="grid-2 mb-16">
                        <div className="card">
                            <div className="card-header"><span className="card-title">📋 Arrival Recap</span></div>
                            {nightAuditData.arrivals.length === 0 && <div className="card-body text-gray text-center">No arrivals today.</div>}
                            {nightAuditData.arrivals.map(b => (
                                <div key={b.id} style={{ padding: "10px 16px", borderBottom: "1px solid #f5f5f5", fontSize: 13 }}>
                                    <div style={{ fontWeight: 600 }}>{b.guestName}</div>
                                    <div style={{ color: "#6b7280" }}>{b.roomTypeName}{b.roomNumber ? ` · Rm ${b.roomNumber}` : ""} · {b.mealPlanCode} · ₹{b.grandTotal.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                        <div className="card">
                            <div className="card-header"><span className="card-title">🧹 Housekeeping Status</span></div>
                            <div className="card-body">
                                {[
                                    { label: "Clean", value: nightAuditData.cleanRooms, color: "#16a34a" },
                                    { label: "Dirty", value: nightAuditData.dirtyRooms, color: "#d97706" },
                                    { label: "Inspected", value: hkTasks.filter(t => t.status === "inspected").length, color: "#2563eb" },
                                    { label: "DND", value: hkTasks.filter(t => t.status === "dnd").length, color: "#7c3aed" },
                                    { label: "Out of Order", value: hkTasks.filter(t => t.status === "out-of-order").length, color: "#dc2626" },
                                ].map(r => (
                                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f5f5f5", fontSize: 13 }}>
                                        <span>{r.label}</span><span style={{ fontWeight: 700, color: r.color }}>{r.value} rooms</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {nightAuditData.noShows.length > 0 && (
                        <div className="card mb-16" style={{ borderColor: "#fecaca" }}>
                            <div className="card-header" style={{ background: "#fef2f2" }}><span className="card-title" style={{ color: "#dc2626" }}>⚠️ Possible No-Shows ({nightAuditData.noShows.length})</span></div>
                            {nightAuditData.noShows.map(b => (
                                <div key={b.id} style={{ padding: "10px 16px", borderBottom: "1px solid #f5f5f5", fontSize: 13 }}>
                                    <span style={{ fontWeight: 600 }}>{b.guestName}</span> — {b.bookingRef} — Check-in was {fmtDate(b.checkIn)}
                                </div>
                            ))}
                        </div>
                    )}
                    <div style={{ display: "flex", gap: 12 }}>
                        {!nightAuditDone
                            ? <button onClick={() => setNightAuditDone(true)} style={{ padding: "12px 28px", borderRadius: 10, background: "#2563eb", color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>✓ Close Night Audit for {fmtDate(TODAY)}</button>
                            : <div style={{ padding: "12px 20px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, color: "#16a34a", fontWeight: 700, fontSize: 14 }}>✅ Night Audit Closed for {fmtDate(TODAY)}</div>
                        }
                    </div>
                </div>
            )}
        </div>
    );
}
