"use client";
import React, { useState, useMemo, useCallback } from "react";
import { Booking, Customer, Room, RoomItem, MealPlan, CoGuest } from "./types";
import { Badge, Btn, Confirm, Field, Inp, Sel, Ic, statusColor, uid, fmtDate, BOOKING_SOURCES, DIETARY_PREFS } from "./ui";
import { SimplePicker } from "./DateRangePicker";

interface Props {
    bookings: Booking[];
    customers: Customer[];
    roomTypes: Room[];
    rooms: RoomItem[];
    mealPlans: MealPlan[];
    onAdd: (b: Booking) => void;
    onUpdate: (b: Booking) => void;
    onDelete: (id: string) => void;
}

const ROOM_COLORS: Record<string, string> = {
    rm1: "#E4C581", rm2: "#8b5cf6", rm3: "#16a34a",
};
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type BookingStatus = Booking["status"];
const ALL_STATUSES: BookingStatus[] = ["confirmed", "checked-in", "checked-out", "cancelled", "no-show", "pending"];

function buildBlankBooking(rooms: Room[], mealPlans: MealPlan[]): Booking {
    const tod = new Date().toISOString().slice(0, 10);
    const tom = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    return {
        id: uid(), bookingRef: "BK" + Math.floor(100000 + Math.random() * 900000),
        customerId: "", guestName: "", guestEmail: "", guestPhone: "",
        roomTypeId: rooms[0]?.id ?? "", roomTypeName: rooms[0]?.roomName ?? "",
        roomNumber: null, checkIn: tod, checkOut: tom, nights: 1, adults: 1, children: 0,
        coGuests: [],
        mealPlanId: mealPlans.find(m => m.active !== false)?.id ?? mealPlans[0]?.id ?? "",
        mealPlanCode: mealPlans.find(m => m.active !== false)?.code ?? "EP",
        totalRoomCost: 0, totalMealCost: 0, grandTotal: 0, currency: "USD",
        status: "confirmed", bookingSource: "Direct", specialRequests: "",
        earlyCheckIn: false, lateCheckOut: false, earlyCheckInTime: "", lateCheckOutTime: "",
        checkInActual: null, checkOutActual: null, primaryAadharNo: "", primaryAadharFileUrl: "",
        overrideRoomPrice: undefined, createdAt: tod,
    };
}

/** Checks if a room number has an overlapping booking (excluding the current booking id) */
function isRoomConflict(roomNumber: string, roomTypeId: string, checkIn: string, checkOut: string, bookings: Booking[], excludeId: string): boolean {
    return bookings.some(b =>
        b.id !== excludeId &&
        b.roomNumber === roomNumber &&
        b.roomTypeId === roomTypeId &&
        b.status !== "cancelled" && b.status !== "checked-out" && b.status !== "no-show" &&
        b.checkIn < checkOut && b.checkOut > checkIn
    );
}

function CoGuestSection({
    coGuests, adults, children, onChange
}: {
    coGuests: CoGuest[];
    adults: number;
    children: number;
    onChange: (g: CoGuest[]) => void;
}) {
    // Total additional guests = (adults - 1) for co-adults + all children
    const totalAdditional = Math.max(0, Number(adults) - 1) + Math.max(0, Number(children));

    // When adults/children count changes, auto-sync co-guest list length
    React.useEffect(() => {
        if (coGuests.length === totalAdditional) return;
        if (coGuests.length < totalAdditional) {
            // Add slots
            const toAdd = totalAdditional - coGuests.length;
            const newGuests = [...coGuests];
            for (let i = 0; i < toAdd; i++) {
                // First fill adult slots, then children
                const currentAdults = newGuests.filter(g => !g.isChild).length;
                const needMoreAdults = currentAdults < Math.max(0, Number(adults) - 1);
                newGuests.push({ id: uid(), name: "", aadharNo: "", aadharFileUrl: "", nationality: "", dob: "", dietaryPref: "Non-Veg", phone: "", isChild: !needMoreAdults });
            }
            onChange(newGuests);
        } else {
            // Remove extra slots from the end
            onChange(coGuests.slice(0, totalAdditional));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adults, children]);

    const upd = (id: string, f: keyof CoGuest, v: string | boolean) =>
        onChange(coGuests.map(g => g.id === id ? { ...g, [f]: v } : g));

    return (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#f9fafb", borderBottom: coGuests.length ? "1px solid #e5e7eb" : "none" }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>👥 All Guests ({1 + coGuests.length}) — {adults} Adult(s) + {children} Child(ren)</span>
                {totalAdditional === 0 && <span style={{ fontSize: 12, color: "#9ca3af" }}>Increase Adults or Children count to add guests</span>}
            </div>
            {coGuests.length === 0 && (
                <div style={{ padding: "14px 16px", fontSize: 13, color: "#9ca3af", textAlign: "center" }}>
                    📝 Increase the number of Adults or Children in the main tab to register their details here.
                </div>
            )}
            {coGuests.map((g, i) => {
                const isChild = !!g.isChild;
                const adultsBefore = coGuests.slice(0, i).filter(x => !x.isChild).length;
                const childrenBefore = coGuests.slice(0, i).filter(x => x.isChild).length;
                const label = isChild ? `👦 Child ${childrenBefore + 1}` : `🧑 Adult ${adultsBefore + 2}`;
                return (
                    <div key={g.id} style={{ padding: "12px 14px", borderBottom: i < coGuests.length - 1 ? "1px solid #f3f4f6" : "none", background: "#fff" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 12.5, color: isChild ? "#7c3aed" : "#E4C581", background: isChild ? "#faf5ff" : "#fcf8ed", border: `1px solid ${isChild ? "#e9d5ff" : "#E4C581"}`, borderRadius: 6, padding: "2px 10px" }}>{label}</span>
                        </div>
                        <div className="grid-3" style={{ gap: 8 }}>
                            <Field label="Full Name"><Inp value={g.name} onChange={e => upd(g.id, "name", e.target.value)} placeholder="Guest name" /></Field>
                            <Field label="Aadhar Number"><Inp value={g.aadharNo} onChange={e => upd(g.id, "aadharNo", e.target.value)} placeholder="Aadhar number" /></Field>
                            <Field label="Upload Aadhar"><Inp type="file" value="" style={{ padding: "6px" }} onChange={e => upd(g.id, "aadharFileUrl", e.target.value)} /></Field>
                        </div>
                        <div className="grid-4" style={{ gap: 8, marginTop: 8 }}>
                            <Field label="Nationality"><Inp value={g.nationality} onChange={e => upd(g.id, "nationality", e.target.value)} placeholder="Country" /></Field>
                            <Field label="Date of Birth"><Inp type="date" value={g.dob} onChange={e => upd(g.id, "dob", e.target.value)} /></Field>
                            <Field label="Phone"><Inp value={g.phone} onChange={e => upd(g.id, "phone", e.target.value)} placeholder="+91 98765 43210" /></Field>
                            {!isChild && <Field label="Dietary Pref"><Sel value={g.dietaryPref} onChange={e => upd(g.id, "dietaryPref", e.target.value)} opts={DIETARY_PREFS} /></Field>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function RoomPicker({ roomNumbers, roomTypeId, checkIn, checkOut, selected, bookings, bookingId, onChange }: {
    roomNumbers: RoomItem[]; roomTypeId: string; checkIn: string; checkOut: string;
    selected: string | null; bookings: Booking[]; bookingId: string; onChange: (r: string | null) => void;
}) {
    // Only keep available rooms OR the room that is currently selected (so the user can see it's selected, even if it has a conflict)
    const visibleRooms = roomNumbers.filter(r => {
        const conflict = isRoomConflict(r.roomNumber, roomTypeId, checkIn, checkOut, bookings, bookingId);
        // Exclude rooms that are strictly out-of-order or maintenance.
        // We DO NOT filter out "cleaning" or "occupied", because a room can be cleaning now or occupied now but totally available for the selected dates in the future.
        const isUnavailableStatus = r.status === "maintenance" || r.status === "out-of-order";
        return (!conflict && !isUnavailableStatus) || selected === r.roomNumber;
    });

    // Check if we need to show the "Occupied" legend
    const hasConflictVisible = visibleRooms.some(r => isRoomConflict(r.roomNumber, roomTypeId, checkIn, checkOut, bookings, bookingId) || (r.status !== "available" && r.status !== "occupied" && r.status !== "cleaning"));

    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                <button onClick={() => onChange(null)}
                    style={{ padding: "6px 12px", borderRadius: 7, border: `2px solid ${selected === null ? "#9ca3af" : "#e5e7eb"}`, background: selected === null ? "#f3f4f6" : "#fff", fontSize: 12.5, cursor: "pointer", color: "#6b7280", fontWeight: selected === null ? 700 : 400 }}>
                    Unassigned
                </button>
                {visibleRooms.length === 0 && (
                    <div style={{ padding: "6px 12px", fontSize: 12.5, color: "#9ca3af", fontStyle: "italic", display: "flex", alignItems: "center" }}>No available rooms</div>
                )}
                {visibleRooms.map(r => {
                    const n = r.roomNumber;
                    const conflict = isRoomConflict(n, roomTypeId, checkIn, checkOut, bookings, bookingId);
                    const isSelected = selected === n;
                    return (
                        <button key={n} onClick={() => !conflict && onChange(n)} disabled={conflict}
                            title={conflict ? "Already booked for these dates" : (r.status === "maintenance" || r.status === "out-of-order" ? `Room is ${r.status}` : `Assign Room ${n}`)}
                            style={{
                                padding: "6px 14px", borderRadius: 7, fontWeight: 700, fontSize: 14, cursor: conflict ? "not-allowed" : "pointer",
                                border: `2px solid ${isSelected ? (conflict ? "#fecaca" : "#E4C581") : "#d1d5db"}`,
                                background: isSelected ? (conflict ? "#fef2f2" : "#fcf8ed") : "#fff",
                                color: isSelected ? (conflict ? "#dc2626" : "#E4C581") : "#374151",
                                opacity: conflict ? 0.7 : 1,
                                position: "relative",
                            }}>
                            {n}
                            {conflict && <span style={{ fontSize: 9, position: "absolute", top: -4, right: -4, background: "#dc2626", color: "#fff", borderRadius: "50%", width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</span>}
                        </button>
                    );
                })}
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span><span style={{ display: "inline-block", width: 8, height: 8, background: "#fcf8ed", border: "1px solid #E4C581", borderRadius: 2, marginRight: 4 }} />Selected</span>
                {hasConflictVisible && <span><span style={{ display: "inline-block", width: 8, height: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 2, marginRight: 4 }} />Occupied & Unavailable</span>}
                <span><span style={{ display: "inline-block", width: 8, height: 8, background: "#fff", border: "1px solid #d1d5db", borderRadius: 2, marginRight: 4 }} />Available</span>
            </div>
        </div>
    );
}

function BookingModal({ booking: init, roomTypes, physicalRooms, mealPlans, customers, allBookings, onSave, onClose }: {
    booking: Booking; roomTypes: Room[]; physicalRooms: RoomItem[]; mealPlans: MealPlan[]; customers: Customer[];
    allBookings: Booking[]; onSave: (b: Booking) => void; onClose: () => void;
}) {
    const [b, setB] = useState<Booking>(() => {
        const defaults: Partial<Booking> = { coGuests: [], earlyCheckIn: false, lateCheckOut: false, earlyCheckInTime: "", lateCheckOutTime: "" };
        return { ...defaults, ...init } as Booking;
    });
    const [tab, setTab] = useState<"main" | "guests" | "special">("main");

    // Helper: add N days to a YYYY-MM-DD string
    const addDay = (d: string, n: number) => { const dt = new Date(d + "T00:00:00"); dt.setDate(dt.getDate() + n); return dt.toISOString().slice(0, 10); };

    const s = (field: keyof Booking) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setB(p => {
            const updated = { ...p, [field]: e.target.value } as Booking;
            if (field === "roomTypeId") { const rt = roomTypes.find(r => r.id === e.target.value); updated.roomTypeName = rt?.roomName ?? ""; updated.roomNumber = null; }
            if (field === "mealPlanId") { const mp = mealPlans.find(m => m.id === e.target.value); updated.mealPlanCode = mp?.code ?? ""; }
            // Date guard: check-out must always be after check-in
            if (field === "checkIn" && updated.checkOut <= updated.checkIn) {
                updated.checkOut = addDay(updated.checkIn, 1);
            }
            if (field === "checkOut" && updated.checkOut <= updated.checkIn) {
                updated.checkIn = addDay(updated.checkOut, -1);
            }
            const rt2 = roomTypes.find(r => r.id === updated.roomTypeId);
            const mp2 = mealPlans.find(m => m.id === updated.mealPlanId);
            const nights = Math.max(1, Math.round((new Date(updated.checkOut).getTime() - new Date(updated.checkIn).getTime()) / 86400000));
            updated.nights = nights;
            updated.totalRoomCost = (rt2?.basePrice ?? 0) * nights;
            const pax = Number(updated.adults) + Number(updated.children);
            updated.totalMealCost = (mp2?.pricePerPersonPerNight ?? 0) * pax * nights;
            updated.grandTotal = updated.totalRoomCost + updated.totalMealCost;
            return updated;
        });

    const roomNums = useMemo(() => physicalRooms.filter(r => r.roomTypeId === b.roomTypeId).sort((x, y) => x.roomNumber.localeCompare(y.roomNumber, undefined, { numeric: true })), [physicalRooms, b.roomTypeId]);

    const conflict = b.roomNumber
        ? isRoomConflict(b.roomNumber, b.roomTypeId, b.checkIn, b.checkOut, allBookings, b.id)
        : false;


    // Build a price map for the date picker: show base price on every date
    const priceMap = useMemo(() => {
        const rt = roomTypes.find(r => r.id === b.roomTypeId);
        if (!rt) return {};
        const map: Record<string, number> = {};
        const start = new Date();
        for (let i = 0; i < 120; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const key = d.toISOString().slice(0, 10);
            map[key] = rt.basePrice;
        }
        return map;
    }, [roomTypes, b.roomTypeId]);

    // Blocked dates: rooms occupied by OTHER bookings for the selected room type
    const blockedDates = useMemo(() => {
        if (!b.roomNumber) return new Set<string>();
        const s = new Set<string>();
        allBookings.forEach(bk => {
            if (bk.id === b.id) return;
            if (bk.roomNumber !== b.roomNumber || bk.roomTypeId !== b.roomTypeId) return;
            if (bk.status === "cancelled" || bk.status === "no-show") return;
            const cur = new Date(bk.checkIn + "T00:00:00");
            while (cur.toISOString().slice(0, 10) < bk.checkOut) {
                s.add(cur.toISOString().slice(0, 10));
                cur.setDate(cur.getDate() + 1);
            }
        });
        return s;
    }, [allBookings, b.roomNumber, b.roomTypeId, b.id]);

    const [showPicker, setShowPicker] = useState<"in" | "out" | null>(null);

    const handleDateSelect = (date: string) => {
        if (showPicker === "in") {
            setB(p => {
                const rt2 = roomTypes.find(r => r.id === p.roomTypeId);
                const mp2 = mealPlans.find(m => m.id === p.mealPlanId);
                // If new checkIn >= checkOut, push checkOut forward by 1
                const newCheckOut = p.checkOut > date ? p.checkOut : addDay(date, 1);
                const nights = Math.max(1, Math.round((new Date(newCheckOut).getTime() - new Date(date).getTime()) / 86400000));
                const totalRoomCost = (rt2?.basePrice ?? 0) * nights;
                const totalMealCost = (mp2?.pricePerPersonPerNight ?? 0) * (Number(p.adults) + Number(p.children)) * nights;
                return { ...p, checkIn: date, checkOut: newCheckOut, nights, totalRoomCost, totalMealCost, grandTotal: totalRoomCost + totalMealCost };
            });
            setShowPicker(null);
        } else if (showPicker === "out") {
            setB(p => {
                const rt2 = roomTypes.find(r => r.id === p.roomTypeId);
                const mp2 = mealPlans.find(m => m.id === p.mealPlanId);
                const nights = Math.max(1, Math.round((new Date(date).getTime() - new Date(p.checkIn).getTime()) / 86400000));
                const totalRoomCost = (rt2?.basePrice ?? 0) * nights;
                const totalMealCost = (mp2?.pricePerPersonPerNight ?? 0) * (Number(p.adults) + Number(p.children)) * nights;
                return { ...p, checkOut: date, nights, totalRoomCost, totalMealCost, grandTotal: totalRoomCost + totalMealCost };
            });
            setShowPicker(null);
        }
    };

    const fmtPick = (d: string) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

    const activeMealPlans = mealPlans.filter(m => m.active !== false);

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* Calendar picker — fixed overlay above modal */}
            {showPicker && (
                <SimplePicker
                    mode={showPicker}
                    checkIn={b.checkIn}
                    checkOut={b.checkOut}
                    onSelect={handleDateSelect}
                    onClose={() => setShowPicker(null)}
                />
            )}
            <div className="modal-box modal-box-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{init.guestName ? "Edit Booking" : "New Booking"} — {b.bookingRef}</span>
                    <button className="modal-close" onClick={onClose}><Ic.X /></button>
                </div>
                {/* Tab bar */}
                <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #f0f0f0", padding: "0 24px" }}>
                    {(["main", "guests", "special"] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            style={{ padding: "10px 18px", borderBottom: `2px solid ${tab === t ? "#E4C581" : "transparent"}`, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: tab === t ? 700 : 500, color: tab === t ? "#E4C581" : "#6b7280" }}>
                            {t === "main" ? "📋 Booking" : t === "guests" ? `👥 Guests (${1 + (b.coGuests?.length ?? 0)})` : "⚙️ Special"}
                        </button>
                    ))}
                </div>

                <div className="modal-body">
                    {tab === "main" && (<>
                        <div className="grid-2 mb-12">
                            <Field label="Primary Guest Name *"><Inp value={b.guestName} onChange={s("guestName")} placeholder="Full name" autoFocus /></Field>
                            <Field label="Booking Ref"><Inp value={b.bookingRef} onChange={s("bookingRef")} /></Field>
                        </div>
                        <div className="grid-2 mb-12">
                            <Field label="Aadhar Number"><Inp value={b.primaryAadharNo || ""} onChange={s("primaryAadharNo" as keyof Booking)} placeholder="Aadhar number" /></Field>
                            <Field label="Upload Aadhar"><Inp type="file" value="" style={{ padding: "6px" }} onChange={s("primaryAadharFileUrl" as keyof Booking)} /></Field>
                        </div>
                        <div className="grid-3 mb-12">
                            <Field label="Email"><Inp value={b.guestEmail} onChange={s("guestEmail")} type="email" /></Field>
                            <Field label="Phone"><Inp value={b.guestPhone} onChange={s("guestPhone")} /></Field>
                            <Field label="Source"><Sel value={b.bookingSource} onChange={s("bookingSource")} opts={BOOKING_SOURCES} /></Field>
                        </div>
                        <div className="grid-3 mb-12">
                            <Field label="Room Type"><Sel value={b.roomTypeId} onChange={s("roomTypeId")} opts={roomTypes.map(r => ({ v: r.id, l: r.roomName }))} /></Field>
                            {/* Check-in button */}
                            <Field label="Check-in">
                                <button onClick={() => setShowPicker("in")}
                                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${showPicker === "in" ? "#E4C581" : "#d1d5db"}`, background: showPicker === "in" ? "#fcf8ed" : "#fff", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                                    <span style={{ fontSize: 15 }}>📅</span>
                                    <div>
                                        {b.checkIn
                                            ? <span style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{fmtPick(b.checkIn)}</span>
                                            : <span style={{ fontSize: 13, color: "#9ca3af" }}>Select date</span>}
                                    </div>
                                </button>
                            </Field>
                            {/* Check-out button */}
                            <Field label="Check-out">
                                <button onClick={() => setShowPicker("out")}
                                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${showPicker === "out" ? "#E4C581" : "#d1d5db"}`, background: showPicker === "out" ? "#fcf8ed" : "#fff", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                                    <span style={{ fontSize: 15 }}>🛫</span>
                                    <div>
                                        {b.checkOut
                                            ? <div>
                                                <span style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{fmtPick(b.checkOut)}</span>
                                                {b.checkIn && b.checkOut && <span style={{ fontSize: 11, color: "#E4C581", marginLeft: 8, fontWeight: 600 }}>🌙 {b.nights}N</span>}
                                            </div>
                                            : <span style={{ fontSize: 13, color: "#9ca3af" }}>Select date</span>}
                                    </div>
                                </button>
                            </Field>
                        </div>
                        <Field label="Room Assignment" style={{ marginBottom: 12 }}>
                            {roomNums.length > 0
                                ? <RoomPicker roomNumbers={roomNums} roomTypeId={b.roomTypeId} checkIn={b.checkIn} checkOut={b.checkOut} selected={b.roomNumber} bookings={allBookings} bookingId={b.id} onChange={rn => setB(p => ({ ...p, roomNumber: rn }))} />
                                : <div style={{ fontSize: 13, color: "#9ca3af", padding: "8px 0" }}>No room numbers configured for this room type.</div>
                            }
                            {conflict && <div style={{ marginTop: 6, padding: "8px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 12.5, color: "#dc2626" }}>⚠ Room {b.roomNumber} is already booked for overlapping dates. Please choose another room.</div>}
                        </Field>
                        <div className="grid-4 mb-12">
                            <Field label="Adults"><Inp type="number" value={String(b.adults)} onChange={s("adults" as keyof Booking)} /></Field>
                            <Field label="Children"><Inp type="number" value={String(b.children)} onChange={s("children" as keyof Booking)} /></Field>
                            <Field label="Meal Plan"><Sel value={b.mealPlanId} onChange={s("mealPlanId")} opts={activeMealPlans.map(mp => ({ v: mp.id, l: `${mp.code} – ${mp.name}` }))} /></Field>
                            <Field label="Status"><Sel value={b.status} onChange={s("status")} opts={ALL_STATUSES} /></Field>
                        </div>
                        <div style={{ background: "#f0fdf4", border: `1px solid ${b.overrideRoomPrice !== undefined ? "#fde68a" : "#bbf7d0"}`, borderRadius: 10, padding: "12px 16px" }}>
                            <div style={{ display: "flex", gap: 28, fontSize: 13, flexWrap: "wrap" }}>
                                <span>🌙 <b>{b.nights}</b> nights</span>
                                <span>🏨 Room: <b>₹{b.totalRoomCost.toLocaleString()}</b>{b.overrideRoomPrice !== undefined && <span style={{ fontSize: 11, color: "#d97706", marginLeft: 4 }}>(🏷 Custom)</span>}</span>
                                <span>🍽️ Meals: <b>₹{b.totalMealCost.toLocaleString()}</b></span>
                                <span style={{ fontSize: 15, fontWeight: 800, color: "#16a34a", marginLeft: "auto" }}>Total: ₹{b.grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </>)}

                    {tab === "guests" && (
                        <div>
                            <div style={{ background: "#fcf8ed", border: "1px solid #E4C581", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
                                <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>👤 Primary Guest: {b.guestName || "(Not set)"}</div>
                                <div style={{ fontSize: 12.5, color: "#6b7280" }}>Aadhar: {b.primaryAadharNo || "—"} · {b.adults} Adult(s) + {b.children} Child(ren)</div>
                            </div>
                            <CoGuestSection coGuests={b.coGuests ?? []} adults={b.adults} children={b.children} onChange={cg => setB(p => ({ ...p, coGuests: cg }))} />
                            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
                                💡 Guest slots are auto-generated based on Adults &amp; Children count. Aadhar details required for compliance.
                            </div>
                        </div>
                    )}

                    {tab === "special" && (
                        <div>
                            {/* Price Override */}
                            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
                                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>💰 Custom Price Override</div>
                                <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 10 }}>Override the standard room price for this booking (e.g. staff rate, friend discount). Leave blank to use the default room price.</div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder={`Standard: ${roomTypes.find(r => r.id === b.roomTypeId)?.basePrice ?? 0} / night`}
                                            value={b.overrideRoomPrice ?? ""}
                                            onChange={e => {
                                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                                const rt2 = roomTypes.find(r => r.id === b.roomTypeId);
                                                const mp2 = mealPlans.find(m => m.id === b.mealPlanId);
                                                const pricePerNight = val !== undefined ? val : (rt2?.basePrice ?? 0);
                                                const totalRoomCost = pricePerNight * b.nights;
                                                const totalMealCost = (mp2?.pricePerPersonPerNight ?? 0) * (Number(b.adults) + Number(b.children)) * b.nights;
                                                setB(p => ({ ...p, overrideRoomPrice: val, totalRoomCost, grandTotal: totalRoomCost + totalMealCost }));
                                            }}
                                            className="inp"
                                            style={{ flex: 1 }}
                                        />
                                        {b.overrideRoomPrice !== undefined && (
                                            <button onClick={() => {
                                                const rt2 = roomTypes.find(r => r.id === b.roomTypeId);
                                                const mp2 = mealPlans.find(m => m.id === b.mealPlanId);
                                                const totalRoomCost = (rt2?.basePrice ?? 0) * b.nights;
                                                const totalMealCost = (mp2?.pricePerPersonPerNight ?? 0) * (Number(b.adults) + Number(b.children)) * b.nights;
                                                setB(p => ({ ...p, overrideRoomPrice: undefined, totalRoomCost, grandTotal: totalRoomCost + totalMealCost }));
                                            }} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>✕ Remove</button>
                                        )}
                                    </div>
                                </div>
                                {b.overrideRoomPrice !== undefined && (
                                    <div style={{ marginTop: 8, fontSize: 12, color: "#92400e", background: "#fef3c7", padding: "6px 10px", borderRadius: 6 }}>
                                        ⚠️ Using custom price ₹{b.overrideRoomPrice}/night instead of standard ₹{roomTypes.find(r => r.id === b.roomTypeId)?.basePrice ?? 0}/night
                                    </div>
                                )}
                            </div>
                            <Field label="Special Requests" style={{ marginBottom: 16 }}>
                                <textarea className="textarea" value={b.specialRequests} onChange={e => setB(p => ({ ...p, specialRequests: e.target.value }))} placeholder="Honeymoon setup, high floor, quiet room, extra pillows..." style={{ minHeight: 90 }} />
                            </Field>
                            <div className="grid-2 mb-12">
                                <div>
                                    <label className="field-label">Early Check-in</label>
                                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
                                        <input type="checkbox" checked={b.earlyCheckIn} onChange={e => setB(p => ({ ...p, earlyCheckIn: e.target.checked }))} />
                                        <span style={{ fontSize: 13 }}>Request early check-in</span>
                                    </div>
                                    {b.earlyCheckIn && <Inp type="time" value={b.earlyCheckInTime} onChange={s("earlyCheckInTime")} style={{ marginTop: 8 }} />}
                                </div>
                                <div>
                                    <label className="field-label">Late Check-out</label>
                                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
                                        <input type="checkbox" checked={b.lateCheckOut} onChange={e => setB(p => ({ ...p, lateCheckOut: e.target.checked }))} />
                                        <span style={{ fontSize: 13 }}>Request late check-out</span>
                                    </div>
                                    {b.lateCheckOut && <Inp type="time" value={b.lateCheckOutTime} onChange={s("lateCheckOutTime")} style={{ marginTop: 8 }} />}
                                </div>
                            </div>
                            {(b.checkInActual || b.checkOutActual) && (
                                <div style={{ background: "#f9fafb", borderRadius: 8, padding: "12px 14px", fontSize: 13 }}>
                                    {b.checkInActual && <div>✅ Actual Check-in: <b>{b.checkInActual}</b></div>}
                                    {b.checkOutActual && <div>🧳 Actual Check-out: <b>{b.checkOutActual}</b></div>}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
                    <Btn onClick={() => onSave(b)} disabled={!b.guestName.trim() || !!conflict}>Save Booking</Btn>
                </div>
            </div>
        </div>
    );
}

export default function BookingsPage({ bookings, customers, roomTypes, rooms, mealPlans, onAdd, onUpdate, onDelete }: Props) {
    const now = new Date();
    const [startDateStr, setStartDateStr] = useState(() => {
        const d = new Date(now);
        d.setDate(d.getDate() - 3); // start 3 days ago by default
        return d.toISOString().slice(0, 10);
    });
    const daysToShow = 30; // 30 days window
    const colW = 50; // 50px per day

    const scrollRef = React.useRef<HTMLDivElement>(null);
    const headerSyncRef = React.useRef<HTMLDivElement>(null);

    const onScrollSync = () => {
        if (headerSyncRef.current && scrollRef.current) {
            headerSyncRef.current.scrollLeft = scrollRef.current.scrollLeft;
        }
    };

    const [view, setView] = useState<"calendar" | "list">("calendar");
    const [modal, setModal] = useState<Booking | null>(null);
    const [delId, setDelId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortField, setSortField] = useState<"checkIn" | "guestName" | "bookingRef" | "roomTypeName" | "createdAt">("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const todStr = now.toISOString().slice(0, 10);

    const timelineDates = useMemo(() => {
        const arr = [];
        const d = new Date(startDateStr);
        for (let i = 0; i < daysToShow; i++) {
            arr.push({ date: d.toISOString().slice(0, 10), dayStr: d.toLocaleDateString("en-US", { weekday: "short" }), tDay: d.getDate() });
            d.setDate(d.getDate() + 1);
        }
        return arr;
    }, [startDateStr, daysToShow]);

    const shiftStart = (days: number) => {
        setStartDateStr(p => {
            const d = new Date(p);
            d.setDate(d.getDate() + days);
            return d.toISOString().slice(0, 10);
        });
    };

    const roomsByType = useMemo(() => {
        const map = new Map<string, RoomItem[]>();
        roomTypes.forEach(rt => map.set(rt.id, []));
        rooms.forEach(r => {
            if (!map.has(r.roomTypeId)) map.set(r.roomTypeId, []);
            map.get(r.roomTypeId)!.push(r);
        });
        for (const arr of map.values()) {
            arr.sort((a, b) => a.floor - b.floor || a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true }));
        }
        return map;
    }, [roomTypes, rooms]);

    const unassignedBookings = useMemo(() => bookings.filter(b => !b.roomNumber && b.status !== "cancelled" && b.status !== "no-show"), [bookings]);

    const filteredBookings = useMemo(() => bookings.filter(b => {
        const q = search.toLowerCase();
        const matchSearch = !q || b.guestName.toLowerCase().includes(q) || b.bookingRef.toLowerCase().includes(q) || b.roomTypeName.toLowerCase().includes(q) || (b.roomNumber ?? "").includes(q);
        return matchSearch && (filterStatus === "all" || b.status === filterStatus);
    }).sort((a, b) => {
        let cmp = 0;
        if (sortField === "checkIn") cmp = a.checkIn.localeCompare(b.checkIn);
        else if (sortField === "guestName") cmp = a.guestName.localeCompare(b.guestName);
        else if (sortField === "bookingRef") cmp = a.bookingRef.localeCompare(b.bookingRef);
        else if (sortField === "roomTypeName") cmp = (a.roomTypeName || "").localeCompare(b.roomTypeName || "");
        else if (sortField === "createdAt") cmp = (a.createdAt || "").localeCompare(b.createdAt || "");
        return sortOrder === "asc" ? cmp : -cmp;
    }), [bookings, search, filterStatus, sortField, sortOrder]);

    return (
        <div>
            {modal && <BookingModal booking={modal} roomTypes={roomTypes} physicalRooms={rooms} mealPlans={mealPlans} customers={customers} allBookings={bookings}
                onSave={b => { modal.guestName ? onUpdate(b) : onAdd(b); setModal(null); }}
                onClose={() => setModal(null)} />}
            {delId && <Confirm msg="Delete this booking permanently?" onOk={() => { onDelete(delId); setDelId(null); }} onCancel={() => setDelId(null)} />}

            <div className="page-header">
                <div><div className="page-title">Bookings</div><div className="page-sub">{bookings.length} total · {bookings.filter(b => b.status === "confirmed").length} confirmed · {bookings.filter(b => b.status === "checked-in").length} in-house</div></div>
                <Btn onClick={() => setModal(buildBlankBooking(roomTypes, mealPlans))}><Ic.Plus /> New Booking</Btn>
            </div>

            <div className="tab-bar" style={{ maxWidth: 240, marginBottom: 16 }}>
                <button className={`tab-btn ${view === "calendar" ? "active" : ""}`} onClick={() => setView("calendar")}>📅 Calendar</button>
                <button className={`tab-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")}>📋 List</button>
            </div>

            {view === "calendar" && (
                <div className="card">
                    <div className="card-header" style={{ flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <Btn variant="outline" size="sm" onClick={() => shiftStart(-7)}>« 7d</Btn>
                            <Btn variant="outline" size="sm" onClick={() => shiftStart(-1)}>‹ 1d</Btn>
                            <input type="date" value={startDateStr} onChange={e => setStartDateStr(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, fontFamily: "inherit" }} />
                            <Btn variant="outline" size="sm" onClick={() => shiftStart(1)}>1d ›</Btn>
                            <Btn variant="outline" size="sm" onClick={() => shiftStart(7)}>7d »</Btn>
                            <Btn variant="outline" size="sm" onClick={() => { const d = new Date(); d.setDate(d.getDate() - 3); setStartDateStr(d.toISOString().slice(0, 10)); }}>Today</Btn>
                        </div>
                        <div style={{ marginLeft: "auto", display: "flex", gap: 12, fontSize: 13, alignItems: "center" }}>
                            {unassignedBookings.length > 0 && <span style={{ color: "#dc2626", fontWeight: 700 }}>⚠ {unassignedBookings.length} Unassigned</span>}
                            <span>Total Bookings: <b>{bookings.length}</b></span>
                        </div>
                    </div>
                    {/* --- FIXED COMBINED HEADER --- */}
                    <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", background: "#f3f4f6" }}>
                        {/* Fixed Left Top Corner */}
                        <div style={{ width: 140, flexShrink: 0, height: 50, display: "flex", alignItems: "center", padding: "0 12px", background: "#f9fafb", fontWeight: 700, fontSize: 13, color: "#6b7280", borderRight: "1px solid #e5e7eb", zIndex: 30 }}>
                            Room
                        </div>
                        {/* Scrollable Sticky Dates Header */}
                        <div ref={headerSyncRef} style={{ display: "flex", height: 50, background: "#f9fafb", overflow: "hidden", position: "relative", flexGrow: 1 }}>
                            {timelineDates.map(d => (
                                <div key={d.date} style={{ width: colW, flexShrink: 0, borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: d.date === todStr ? "#fcf8ed" : "transparent" }}>
                                    <div style={{ fontSize: 10, fontWeight: 600, color: d.date === todStr ? "#E4C581" : "#9ca3af", textTransform: "uppercase" }}>{d.dayStr}</div>
                                    <div style={{ fontSize: 14, fontWeight: d.date === todStr ? 800 : 600, color: d.date === todStr ? "#E4C581" : "#374151" }}>{d.tDay}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- SCROLLABLE BODY --- */}
                    <div ref={scrollRef} onScroll={onScrollSync} style={{ display: "flex", overflow: "auto", maxHeight: "calc(100vh - 340px)", position: "relative", borderRadius: "0 0 10px 10px", background: "#f3f4f6" }}>

                        {/* Left Column (Sticky Rooms) */}
                        <div style={{ width: 140, flexShrink: 0, position: "sticky", left: 0, background: "#fff", zIndex: 20, boxShadow: "2px 0 8px rgba(0,0,0,0.05)" }}>
                            {unassignedBookings.length > 0 && <div style={{ height: Math.max(50, unassignedBookings.length * 40 + 10), borderBottom: "1px solid #e5e7eb", padding: "8px 12px", background: "#fef2f2", fontWeight: 700, fontSize: 13, color: "#dc2626", borderRight: "1px solid #fecaca" }}>Unassigned</div>}
                            {roomTypes.map(rt => {
                                const typeRooms = roomsByType.get(rt.id) ?? [];
                                if (typeRooms.length === 0) return null;
                                return (
                                    <React.Fragment key={rt.id}>
                                        <div style={{ background: "#f9fafb", padding: "8px 12px", fontSize: 11, fontWeight: 800, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb" }}>{rt.roomName}</div>
                                        {typeRooms.map(r => (
                                            <div key={r.id} style={{ height: 50, padding: "0 12px", display: "flex", alignItems: "center", borderBottom: "1px solid #e5e7eb", fontSize: 13, fontWeight: 700, color: "#111827", background: "#fff", borderRight: "1px solid #e5e7eb" }} title={`Floor ${r.floor} · ${r.status}`}>
                                                Rm {r.roomNumber}
                                                <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: r.status === "maintenance" ? "#f59e0b" : r.status === "out-of-order" ? "#dc2626" : "transparent" }} />
                                            </div>
                                        ))}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Right Timelines Grid */}
                        <div style={{ position: "relative", minHeight: "100%", background: "#fff", flexGrow: 1 }}>

                            {/* Grid background lines */}
                            <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, display: "flex", pointerEvents: "none", zIndex: 1 }}>
                                {timelineDates.map(d => (
                                    <div key={d.date} style={{ width: colW, flexShrink: 0, borderRight: "1px dashed #e5e7eb", background: d.date === todStr ? "rgba(59, 130, 246, 0.03)" : "transparent" }} />
                                ))}
                            </div>

                            {/* Unassigned row content */}
                            {unassignedBookings.length > 0 && (
                                <div style={{ position: "relative", height: Math.max(50, unassignedBookings.length * 40 + 10), borderBottom: "1px solid #fecaca", background: "#fef2f2" }}>
                                    {unassignedBookings.map((b, idx) => {
                                        const inTime = new Date(b.checkIn).getTime();
                                        const outTime = new Date(b.checkOut).getTime();
                                        const startTime = new Date(startDateStr).getTime();
                                        if (outTime <= startTime || inTime >= startTime + daysToShow * 86400000) return null; // out of view

                                        const startOffsetDays = Math.max(0, (inTime - startTime) / 86400000);
                                        const visualNights = Math.min(daysToShow - startOffsetDays, b.nights - Math.max(0, (startTime - inTime) / 86400000));

                                        const left = startOffsetDays * colW;
                                        const width = visualNights * colW;

                                        return (
                                            <div key={b.id} onClick={() => setModal(b)} style={{
                                                position: "absolute", left, width, top: 5 + idx * 40, height: 32, borderRadius: 6,
                                                background: "#fff", border: "2px solid #ef4444", color: "#991b1b",
                                                display: "flex", alignItems: "center", padding: "0 8px", fontSize: 11, fontWeight: 600,
                                                cursor: "pointer", zIndex: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                                            }} title={`${b.guestName} (${b.checkIn} to ${b.checkOut})`}>
                                                {b.guestName}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Room Rows Content */}
                            <div style={{ position: "relative", zIndex: 2 }}>
                                {roomTypes.map(rt => {
                                    const typeRooms = roomsByType.get(rt.id) ?? [];
                                    if (typeRooms.length === 0) return null;
                                    return (
                                        <React.Fragment key={rt.id}>
                                            <div style={{ height: 32, borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }} /> {/* Spacer for type header */}
                                            {typeRooms.map(r => {
                                                const roomBks = bookings.filter(b => b.roomNumber === r.roomNumber && b.roomTypeId === r.roomTypeId && b.status !== "cancelled" && b.status !== "no-show");
                                                return (
                                                    <div key={r.id} style={{ height: 50, borderBottom: "1px solid #e5e7eb", position: "relative" }}>
                                                        {roomBks.map(b => {
                                                            const inTime = new Date(b.checkIn).getTime();
                                                            const outTime = new Date(b.checkOut).getTime();
                                                            const startTime = new Date(startDateStr).getTime();
                                                            if (outTime <= startTime || inTime >= startTime + daysToShow * 86400000) return null;

                                                            const startOffsetDays = (inTime - startTime) / 86400000;
                                                            const actualLeft = startOffsetDays * colW + colW / 2;
                                                            const baseWidth = b.nights * colW;

                                                            const renderLeft = Math.max(0, actualLeft);
                                                            const renderWidth = Math.min(daysToShow * colW - renderLeft, baseWidth - (renderLeft - actualLeft));

                                                            if (renderWidth <= 0) return null;

                                                            const isCheckedIn = b.status === "checked-in";
                                                            const color = isCheckedIn ? "#16a34a" : b.status === "confirmed" ? "#E4C581" : "#d97706";
                                                            const bg = isCheckedIn ? "#dcfce7" : b.status === "confirmed" ? "#fcf8ed" : "#fef3c7";

                                                            return (
                                                                <div key={b.id} onClick={() => setModal(b)} style={{
                                                                    position: "absolute", left: renderLeft, width: renderWidth, top: 4, height: 42, borderRadius: 6,
                                                                    background: bg, border: `2px solid ${color}`, color: color === "#d97706" ? "#b45309" : color,
                                                                    display: "flex", alignItems: "center", padding: "0 6px", fontSize: 11, fontWeight: 700,
                                                                    cursor: "pointer", zIndex: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "clip", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                                                }} title={`${b.guestName} (${b.checkIn} to ${b.checkOut}) - ${b.status}`}>
                                                                    {actualLeft >= renderLeft && <span style={{ marginRight: 4, opacity: 0.7, fontSize: 10 }}>▶</span>}
                                                                    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                                                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", lineHeight: "1.2" }}>{b.guestName}</span>
                                                                        <span style={{ fontSize: 9, opacity: 0.8, fontWeight: 600, lineHeight: "1.2" }}>{isCheckedIn ? "OCCUPIED" : b.status.toUpperCase()}</span>
                                                                    </div>
                                                                    {b.earlyCheckIn && <span style={{ marginLeft: "auto", fontSize: 10 }}>🌅</span>}
                                                                    {(renderLeft + renderWidth) >= (actualLeft + baseWidth) && <span style={{ marginLeft: "auto", opacity: 0.7, fontSize: 10, paddingLeft: 4 }}>◀</span>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {view === "list" && (
                <div className="card">
                    <div className="card-header" style={{ gap: 10, flexWrap: "wrap" }}>
                        <input className="inp" style={{ flex: 1, minWidth: 220 }} placeholder="Search name, ref, room..." value={search} onChange={e => setSearch(e.target.value)} />
                        <select className="sel" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="all">All Statuses</option>
                            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select className="sel" style={{ width: 160 }} value={sortField} onChange={e => setSortField(e.target.value as any)}>
                            <option value="createdAt">Sort: Created At</option>
                            <option value="checkIn">Sort: Check-in Date</option>
                            <option value="guestName">Sort: Guest Name</option>
                            <option value="bookingRef">Sort: Booking Ref</option>
                            <option value="roomTypeName">Sort: Room Type</option>
                        </select>
                        <select className="sel" style={{ width: 100 }} value={sortOrder} onChange={e => setSortOrder(e.target.value as any)}>
                            <option value="desc">Desc ⬇</option>
                            <option value="asc">Asc ⬆</option>
                        </select>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>Ref</th><th>Primary Guest</th><th>Room</th><th>Dates</th><th>Guests</th><th>Meal</th><th>Flags</th><th>Total</th><th>Status</th><th></th></tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(b => (
                                    <tr key={b.id}>
                                        <td style={{ fontWeight: 600, color: "#E4C581", fontSize: 12 }}>{b.bookingRef}</td>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{b.guestName}</div>
                                            <div style={{ fontSize: 11, color: "#9ca3af" }}>{b.bookingSource}</div>
                                        </td>
                                        <td style={{ fontSize: 12 }}>{b.roomTypeName}<br />{b.roomNumber ? <span style={{ color: "#E4C581", fontWeight: 600 }}>Rm {b.roomNumber}</span> : <span style={{ color: "#9ca3af" }}>Unassigned</span>}</td>
                                        <td style={{ fontSize: 12 }}>{fmtDate(b.checkIn)}<br /><span style={{ color: "#9ca3af" }}>{fmtDate(b.checkOut)} ({b.nights}N)</span></td>
                                        <td style={{ fontSize: 12 }}>{b.adults}A{b.children > 0 ? ` ${b.children}C` : ""}{b.coGuests?.length > 0 && <span style={{ color: "#7c3aed", display: "block", fontSize: 11 }}>+{b.coGuests.length} co</span>}</td>
                                        <td><Badge color="indigo">{b.mealPlanCode}</Badge></td>
                                        <td>
                                            {b.earlyCheckIn && <div style={{ fontSize: 11, color: "#7c3aed" }}>🌅 Early CI</div>}
                                            {b.lateCheckOut && <div style={{ fontSize: 11, color: "#7c3aed" }}>🌙 Late CO</div>}
                                            {b.specialRequests && <div style={{ fontSize: 11, color: "#d97706" }}>⚠ SR</div>}
                                        </td>
                                        <td style={{ fontWeight: 600 }}>${b.grandTotal.toLocaleString()}</td>
                                        <td><Badge color={statusColor[b.status]}>{b.status}</Badge></td>
                                        <td>
                                            <div style={{ display: "flex", gap: 4 }}>
                                                <Btn size="sm" variant="ghost" onClick={() => setModal(b)}><Ic.Edit /></Btn>
                                                <Btn size="sm" variant="ghost" style={{ color: "#dc2626" }} onClick={() => setDelId(b.id)}><Ic.Trash /></Btn>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredBookings.length === 0 && <div className="card-body text-gray text-center" style={{ padding: "32px 20px" }}>No bookings match your filters.</div>}
                </div>
            )}
        </div>
    );
}
