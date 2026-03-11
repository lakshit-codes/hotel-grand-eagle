"use client";
import React, { useState, useMemo } from "react";
import { Booking, Customer, Room, MealPlan, Availability } from "./types";
import { Btn, Badge, Field, Inp, Sel, Ic, fmtDate, statusColor } from "./ui";

interface Props {
    bookings: Booking[];
    customers: Customer[];
    rooms: Room[];
    mealPlans: MealPlan[];
    availability: Record<string, Availability>;
    onCheckIn: (bookingId: string, roomNumber: string, mealPlanId: string) => void;
}

type Step = 1 | 2 | 3 | 4;

export default function CheckInPage({ bookings, customers, rooms, mealPlans, availability, onCheckIn }: Props) {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Booking | null>(null);
    const [roomNum, setRoomNum] = useState("");
    const [mealPlanId, setMealPlanId] = useState("");
    const [step, setStep] = useState<Step>(1);
    const [done, setDone] = useState(false);

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return bookings.filter(b =>
            b.status === "confirmed" &&
            (b.guestName.toLowerCase().includes(q) || b.bookingRef.toLowerCase().includes(q) || b.guestPhone.includes(q))
        ).slice(0, 8);
    }, [query, bookings]);

    const availableRooms = useMemo(() => {
        if (!selected) return [];
        const rt = rooms.find(r => r.id === selected.roomTypeId);
        const roomNums = rt?.roomNumbers ?? [];
        const occupied = bookings.filter(b => b.roomTypeId === selected.roomTypeId && b.status === "checked-in" && b.roomNumber).map(b => b.roomNumber!);
        return roomNums.filter(n => !occupied.includes(n));
    }, [selected, rooms, bookings]);

    const guestCustomer = useMemo(() => selected ? customers.find(c => c.id === selected.customerId) : null, [selected, customers]);

    const selectBooking = (b: Booking) => {
        setSelected(b);
        setMealPlanId(b.mealPlanId || mealPlans[0]?.id || "");
        setRoomNum("");
        setStep(2);
        setQuery("");
        setDone(false);
    };

    const handleConfirm = () => {
        if (!selected || !roomNum) return;
        onCheckIn(selected.id, roomNum, mealPlanId);
        setStep(4);
        setDone(true);
    };

    const reset = () => { setSelected(null); setStep(1); setQuery(""); setDone(false); setRoomNum(""); };

    const mp = mealPlans.find(m => m.id === mealPlanId);

    if (done && selected) {
        return (
            <div>
                <div className="page-header"><div className="page-title">Quick Check-in</div></div>
                <div className="card" style={{ maxWidth: 540, margin: "40px auto", textAlign: "center" }}>
                    <div className="card-body" style={{ padding: "48px 32px" }}>
                        <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#16a34a", marginBottom: 8 }}>Check-in Successful!</div>
                        <div style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}><b>{selected.guestName}</b> is now checked in</div>
                        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Room <b>{roomNum}</b> &middot; {selected.roomTypeName}</div>
                        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Meal Plan: <b>{mp?.name}</b></div>
                        <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>Check-out: {fmtDate(selected.checkOut)}</div>

                        {/* Simulated QR code for room key */}
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                            <div className="qr-box">🔑</div>
                        </div>
                        <div style={{ fontSize: 12.5, color: "#6b7280", marginBottom: 24 }}>
                            Room key QR code generated &mdash; scan to activate key card
                        </div>
                        <Btn onClick={reset} variant="outline">Check-in Another Guest</Btn>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <div className="page-title">Quick Check-in</div>
                    <div className="page-sub">Hassle-free guest onboarding &mdash; search, assign room, confirm</div>
                </div>
            </div>

            {/* Step 1: Search */}
            <div className={`checkin-step ${step === 1 ? "active" : step > 1 ? "done" : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: step === 1 ? 16 : 0 }}>
                    <div className={`step-num ${step === 1 ? "active" : "done"}`}>{step > 1 ? "✓" : "1"}</div>
                    <div>
                        <div style={{ fontWeight: 700 }}>Find Booking</div>
                        {step > 1 && selected && <div style={{ fontSize: 12.5, color: "#16a34a" }}>{selected.guestName} &middot; {selected.bookingRef}</div>}
                    </div>
                    {step > 1 && <Btn size="sm" variant="ghost" onClick={reset}>Change</Btn>}
                </div>
                {step === 1 && (
                    <div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                            <Ic.Search />
                            <Inp value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by guest name, booking ref, or phone..." style={{ flex: 1 }} autoFocus />
                            <Btn variant="secondary" size="sm"><Ic.QR /> Scan QR</Btn>
                        </div>
                        {results.length > 0 && (
                            <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                                {results.map(b => {
                                    const c = customers.find(cu => cu.id === b.customerId);
                                    return (
                                        <div key={b.id} onClick={() => selectBooking(b)}
                                            style={{ padding: "12px 16px", borderBottom: "1px solid #f5f5f5", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
                                            className="search-result-item">
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600 }}>{b.guestName}
                                                    {c?.vip && <span style={{ marginLeft: 8, fontSize: 11, background: "#faf5ff", color: "#7c3aed", padding: "1px 7px", borderRadius: 10, fontWeight: 700 }}>VIP</span>}
                                                </div>
                                                <div style={{ fontSize: 12, color: "#6b7280" }}>{b.bookingRef} &middot; {b.roomTypeName} &middot; {b.nights} nights &middot; {fmtDate(b.checkIn)} – {fmtDate(b.checkOut)}</div>
                                                {b.specialRequests && <div style={{ fontSize: 11, color: "#d97706", marginTop: 3 }}>⚠ {b.specialRequests}</div>}
                                            </div>
                                            <Badge color={statusColor[b.status]}>{b.status}</Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {query && results.length === 0 && <div style={{ padding: "20px 0", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No confirmed bookings found for "{query}"</div>}
                    </div>
                )}
            </div>

            {/* Step 2: Guest + Booking Summary */}
            {step >= 2 && selected && (
                <div className={`checkin-step ${step === 2 ? "active" : step > 2 ? "done" : ""}`}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: step === 2 ? 16 : 0 }}>
                        <div className={`step-num ${step === 2 ? "active" : "done"}`}>{step > 2 ? "✓" : "2"}</div>
                        <div>
                            <div style={{ fontWeight: 700 }}>Verify Guest Details</div>
                            {step > 2 && <div style={{ fontSize: 12.5, color: "#16a34a" }}>Verified</div>}
                        </div>
                    </div>
                    {step === 2 && (
                        <div>
                            <div className="grid-2 mb-12" style={{ gap: 20 }}>
                                <div>
                                    <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 13 }}>Booking Details</div>
                                    <div style={{ fontSize: 13.5, lineHeight: 2, color: "#374151" }}>
                                        <div>📋 Ref: <b>{selected.bookingRef}</b></div>
                                        <div>🏨 Room Type: <b>{selected.roomTypeName}</b></div>
                                        <div>📅 Check-in: <b>{fmtDate(selected.checkIn)}</b></div>
                                        <div>📅 Check-out: <b>{fmtDate(selected.checkOut)}</b></div>
                                        <div>🌙 Nights: <b>{selected.nights}</b></div>
                                        <div>👥 Guests: <b>{selected.adults} Adults{selected.children > 0 ? `, ${selected.children} Children` : ""}</b></div>
                                        <div>🍽️ Meal Plan: <b>{mealPlans.find(m => m.id === selected.mealPlanId)?.name ?? selected.mealPlanCode}</b></div>
                                        {selected.specialRequests && <div style={{ color: "#d97706" }}>⚠ <b>{selected.specialRequests}</b></div>}
                                    </div>
                                </div>
                                {guestCustomer && (
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 13 }}>Guest Profile</div>
                                        <div style={{ fontSize: 13.5, lineHeight: 2, color: "#374151" }}>
                                            <div>👤 <b>{guestCustomer.firstName} {guestCustomer.lastName}</b>
                                                {guestCustomer.vip && <span style={{ marginLeft: 8, fontSize: 11, background: "#faf5ff", color: "#7c3aed", padding: "1px 7px", borderRadius: 10, fontWeight: 700 }}>VIP</span>}
                                            </div>
                                            <div>🌍 {guestCustomer.nationality} &middot; {guestCustomer.loyaltyTier} Member</div>
                                            <div>📞 {guestCustomer.phone}</div>
                                            <div>📧 {guestCustomer.email}</div>
                                            <div>🪪 Passport: {guestCustomer.passportNo}</div>
                                            <div>🍽️ Dietary: {guestCustomer.dietaryPref}</div>
                                            {guestCustomer.notes && <div style={{ color: "#2563eb" }}>💡 {guestCustomer.notes}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Btn onClick={() => setStep(3)}>Looks Good →</Btn>
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Assign Room + Meal Plan */}
            {step >= 3 && selected && (
                <div className={`checkin-step ${step === 3 ? "active" : step > 3 ? "done" : ""}`}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: step === 3 ? 16 : 0 }}>
                        <div className={`step-num ${step === 3 ? "active" : "done"}`}>{step > 3 ? "✓" : "3"}</div>
                        <div>
                            <div style={{ fontWeight: 700 }}>Assign Room &amp; Meal Plan</div>
                            {step > 3 && roomNum && <div style={{ fontSize: 12.5, color: "#16a34a" }}>Room {roomNum} &middot; {mp?.code}</div>}
                        </div>
                    </div>
                    {step === 3 && (
                        <div>
                            <div className="grid-2 mb-12">
                                <Field label="Assign Room Number *">
                                    {availableRooms.length === 0
                                        ? <div style={{ fontSize: 13, color: "#dc2626", padding: "10px 0" }}>No available rooms of this type right now.</div>
                                        : <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                            {availableRooms.map(n => (
                                                <button key={n} onClick={() => setRoomNum(n)}
                                                    style={{ padding: "8px 16px", borderRadius: 8, border: `2px solid ${roomNum === n ? "#2563eb" : "#d1d5db"}`, background: roomNum === n ? "#eff6ff" : "#fff", fontWeight: roomNum === n ? 700 : 500, fontSize: 15, color: roomNum === n ? "#2563eb" : "#374151", cursor: "pointer" }}>
                                                    {n}
                                                </button>
                                            ))}
                                        </div>
                                    }
                                </Field>
                                <Field label="Meal Plan">
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {mealPlans.map(m => (
                                            <button key={m.id} onClick={() => setMealPlanId(m.id)}
                                                style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, border: `2px solid ${mealPlanId === m.id ? "#2563eb" : "#e5e7eb"}`, background: mealPlanId === m.id ? "#eff6ff" : "#fafafa", cursor: "pointer", textAlign: "left" }}>
                                                <span style={{ fontWeight: 800, fontSize: 18, color: "#2563eb", width: 40 }}>{m.code}</span>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                                                    <div style={{ fontSize: 11.5, color: "#6b7280" }}>{m.pricePerPersonPerNight > 0 ? `+$${m.pricePerPersonPerNight}/person/night` : "Included"}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </Field>
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <Btn onClick={handleConfirm} disabled={!roomNum} variant="success">✓ Confirm Check-in</Btn>
                                <Btn variant="secondary" onClick={() => setStep(2)}>Back</Btn>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
