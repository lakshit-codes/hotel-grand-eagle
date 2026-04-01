"use client";
import React from "react";
import type { Booking, Hotel, MealPlan } from "./types";

interface Props {
    booking: Booking;
    hotel: Hotel;
    mealPlans: MealPlan[];
    onClose: () => void;
}

function fmt(n: number) { return n.toLocaleString("en-IN"); }

export default function InvoiceModal({ booking: b, hotel, mealPlans, onClose }: Props) {
    const mp = mealPlans.find(m => m.id === b.mealPlanId);
    const invoiceNo = `INV-${b.bookingRef}`;
    const invoiceDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const checkInFmt = new Date(b.checkIn + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const checkOutFmt = new Date(b.checkOut + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const pax = Number(b.adults) + Number(b.children);
    const roomRatePerNight = b.nights > 0 ? Math.round(b.totalRoomCost / b.nights) : 0;
    const mealRatePerPersonPerNight = mp?.pricePerPersonPerNight ?? 0;

    const handlePrint = () => window.print();

    return (
        <>
            {/* Print styles — injected into document head via style tag */}
            <style>{`
                @media print {
                    body > * { display: none !important; }
                    #invoice-root { display: block !important; position: fixed; top: 0; left: 0; width: 100%; z-index: 99999; }
                    .no-print { display: none !important; }
                    @page { margin: 15mm; size: A4; }
                }
                #invoice-root { display: block; }
            `}</style>

            {/* Modal overlay (screen only) */}
            <div className="no-print" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose} />

            {/* Invoice panel */}
            <div id="invoice-root" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 1001, background: "#fff", width: "min(780px,96vw)", maxHeight: "90vh", overflowY: "auto", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,.3)", fontFamily: "'Segoe UI', Arial, sans-serif" }}>
                {/* Action bar */}
                <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb", borderRadius: "12px 12px 0 0" }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>🧾 Invoice — {invoiceNo}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={handlePrint} style={{ padding: "8px 18px", borderRadius: 8, background: "#1a1a2e", color: "#E4C581", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🖨 Print / Save PDF</button>
                        <button onClick={onClose} style={{ padding: "8px 14px", borderRadius: 8, background: "#fff", border: "1px solid #d1d5db", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#374151" }}>✕ Close</button>
                    </div>
                </div>

                {/* A4 invoice content */}
                <div style={{ padding: "36px 48px 40px" }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, borderBottom: "3px solid #1a1a2e", paddingBottom: 20 }}>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", letterSpacing: 1 }}>{hotel.name}</div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, lineHeight: 1.7 }}>
                                {hotel.address}<br />
                                {hotel.city}, {hotel.country}<br />
                                📞 {hotel.contactNumber} · ✉ {hotel.email}
                                {(hotel as any).gstNumber && <><br />GST: {(hotel as any).gstNumber}</>}
                            </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 28, fontWeight: 900, color: "#E4C581", letterSpacing: 1 }}>INVOICE</div>
                            <div style={{ fontSize: 13, color: "#374151", marginTop: 6 }}>
                                <div><b>Invoice No:</b> {invoiceNo}</div>
                                <div><b>Date:</b> {invoiceDate}</div>
                                <div><b>Booking Ref:</b> {b.bookingRef}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Bill To</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{b.guestName}</div>
                        <div style={{ fontSize: 12.5, color: "#6b7280", marginTop: 2 }}>
                            Booking Source: {b.bookingSource} · {b.adults} Adult{b.adults !== 1 ? "s" : ""}{b.children > 0 ? `, ${b.children} Child${b.children !== 1 ? "ren" : ""}` : ""}
                        </div>
                    </div>

                    {/* Stay Details */}
                    <div style={{ background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 18px", marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                        {[
                            { label: "Check-In", value: checkInFmt },
                            { label: "Check-Out", value: checkOutFmt },
                            { label: "Nights", value: String(b.nights) },
                            { label: "Room", value: b.roomNumber ? `${b.roomTypeName} · Rm ${b.roomNumber}` : b.roomTypeName },
                        ].map(item => (
                            <div key={item.label}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", marginBottom: 3 }}>{item.label}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Line items */}
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: "#1a1a2e", color: "#fff" }}>
                                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Description</th>
                                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>Qty</th>
                                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>Rate (₹)</th>
                                <th style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                                <td style={{ padding: "12px 14px" }}>
                                    <div style={{ fontWeight: 600 }}>{b.roomTypeName} — Room Charge</div>
                                    <div style={{ fontSize: 11, color: "#6b7280" }}>{checkInFmt} to {checkOutFmt}</div>
                                </td>
                                <td style={{ padding: "12px 14px", textAlign: "right" }}>{b.nights} night{b.nights !== 1 ? "s" : ""}</td>
                                <td style={{ padding: "12px 14px", textAlign: "right" }}>₹{fmt(roomRatePerNight)}</td>
                                <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600 }}>₹{fmt(b.totalRoomCost)}</td>
                            </tr>
                            {b.totalMealCost > 0 && (
                                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                                    <td style={{ padding: "12px 14px" }}>
                                        <div style={{ fontWeight: 600 }}>{mp?.name ?? b.mealPlanCode} — Meal Plan</div>
                                        <div style={{ fontSize: 11, color: "#6b7280" }}>{pax} person{pax !== 1 ? "s" : ""} × {b.nights} night{b.nights !== 1 ? "s" : ""}</div>
                                    </td>
                                    <td style={{ padding: "12px 14px", textAlign: "right" }}>{pax * b.nights} covers</td>
                                    <td style={{ padding: "12px 14px", textAlign: "right" }}>₹{fmt(mealRatePerPersonPerNight)}</td>
                                    <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 600 }}>₹{fmt(b.totalMealCost)}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
                        <div style={{ minWidth: 280 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid #e5e7eb" }}>
                                <span style={{ color: "#6b7280" }}>Room Charges</span><span>₹{fmt(b.totalRoomCost)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid #e5e7eb" }}>
                                <span style={{ color: "#6b7280" }}>Meal Plan</span><span>₹{fmt(b.totalMealCost)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, padding: "12px 0 0", color: "#111827" }}>
                                <span>Grand Total</span><span style={{ color: "#1a1a2e" }}>₹{fmt(b.grandTotal)}</span>
                            </div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Currency: Indian Rupees (INR)</div>
                        </div>
                    </div>

                    {/* Status + footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px solid #e5e7eb", paddingTop: 18 }}>
                        <div>
                            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>Booking Status</div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: "#16a34a", textTransform: "uppercase" }}>{b.status}</div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: 12, color: "#6b7280" }}>
                            <div style={{ fontWeight: 700, color: "#1a1a2e", fontSize: 13, marginBottom: 2 }}>Thank you for your stay!</div>
                            <div>For queries: {hotel.email}</div>
                            <div>Check-in: {hotel.checkInTime} · Check-out: {hotel.checkOutTime}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
