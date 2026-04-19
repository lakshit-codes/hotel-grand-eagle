"use client";
import React, { useState, useMemo } from "react";
import { Customer, Booking, MealPlan } from "./types";
import { Btn, Badge, Field, Inp, Sel, Ic, fmtDate, DIETARY_PREFS, uid, Confirm } from "./ui";

interface Props {
    customers: Customer[];
    bookings: Booking[];
    mealPlans: MealPlan[];
    onAdd: (c: Customer) => void;
    onUpdate: (c: Customer) => void;
    onDelete: (id: string) => void;
}

const BLANK_CUSTOMER: Customer = {
    id: "", firstName: "", lastName: "", email: "", phone: "", nationality: "",
    aadharNo: "", dob: "", vip: false,
    preferredRoom: "", dietaryPref: "Non-Veg", address: "", company: "", notes: "",
};

function CustomerModal({ cust: init, onSave, onClose }: { cust: Customer; onSave: (c: Customer) => void; onClose: () => void; }) {
    const [c, setC] = useState<Customer>({ ...init });
    const s = (f: keyof Customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setC(p => ({ ...p, [f]: e.target.value }));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box modal-box-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{init.firstName ? "Edit Guest" : "New Guest"}</span>
                    <button className="modal-close" onClick={onClose}><Ic.X /></button>
                </div>
                <div className="modal-body">
                    <div className="grid-3 mb-12">
                        <Field label="First Name *"><Inp value={c.firstName} onChange={s("firstName")} /></Field>
                        <Field label="Last Name *"><Inp value={c.lastName} onChange={s("lastName")} /></Field>
                        <Field label="Email"><Inp value={c.email} onChange={s("email")} type="email" /></Field>
                    </div>
                    <div className="grid-3 mb-12">
                        <Field label="Phone"><Inp value={c.phone} onChange={s("phone")} /></Field>
                        <Field label="Nationality"><Inp value={c.nationality} onChange={s("nationality")} /></Field>
                        <Field label="Date of Birth"><Inp value={c.dob} onChange={s("dob")} type="date" /></Field>
                    </div>
                    <div className="grid-3 mb-12">
                        <Field label="Aadhar Number"><Inp value={c.aadharNo} onChange={s("aadharNo")} /></Field>
                        <Field label="Company / Corp Account"><Inp value={c.company} onChange={s("company")} /></Field>
                        <Field label="Address"><Inp value={c.address} onChange={s("address")} /></Field>
                    </div>
                    <div className="grid-2 mb-12">
                        <Field label="Dietary Preference">
                            <Sel value={c.dietaryPref} onChange={s("dietaryPref")} opts={DIETARY_PREFS} />
                        </Field>
                        <Field label="Preferred Room Type"><Inp value={c.preferredRoom} onChange={s("preferredRoom")} placeholder="e.g. Royal Suite" /></Field>
                    </div>
                    <Field label="Notes / Preferences" style={{ marginBottom: 12 }}>
                        <textarea className="textarea" value={c.notes} onChange={e => setC(p => ({ ...p, notes: e.target.value }))} placeholder="Special notes..." />
                    </Field>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <input type="checkbox" id="vip-chk" checked={c.vip} onChange={e => setC(p => ({ ...p, vip: e.target.checked }))} />
                        <label htmlFor="vip-chk" style={{ fontWeight: 600, fontSize: 13.5, color: "#7c3aed" }}>👑 Mark as VIP Guest</label>
                    </div>
                </div>
                <div className="modal-footer">
                    <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
                    <Btn onClick={() => onSave({ ...c, id: c.id || uid() })} disabled={!c.firstName.trim() || !c.lastName.trim()}>Save Guest</Btn>
                </div>
            </div>
        </div>
    );
}


export default function CustomersPage({ customers, bookings, mealPlans, onAdd, onUpdate, onDelete }: Props) {
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState<Customer | null>(null);
    const [delId, setDelId] = useState<string | null>(null);
    const [selected, setSelected] = useState<Customer | null>(null);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return customers.filter(c => {
            const match = !q || `${c.firstName} ${c.lastName} ${c.email} ${c.phone} ${c.nationality} ${c.aadharNo}`.toLowerCase().includes(q);
            return match;
        });
    }, [customers, search]);

    const guestBookings = useMemo(() => {
        if (!selected) return [];
        return Array.isArray(bookings) ? bookings.filter(b => b.customerId === selected.id).sort((a, b) => (b?.checkIn || "").localeCompare(a?.checkIn || "")) : [];
    }, [selected, bookings]);

    const guestStats = useMemo(() => {
        const total = guestBookings.length;
        const spend = guestBookings.reduce((s, b) => s + b.grandTotal, 0);
        const nights = guestBookings.reduce((s, b) => s + b.nights, 0);
        const last = guestBookings[0]?.checkIn ?? null;
        return { total, spend, nights, last };
    }, [guestBookings]);

    return (
        <div>
            {modal && <CustomerModal cust={modal} onSave={c => { c.id === modal.id && modal.firstName ? onUpdate(c) : onAdd(c); setModal(null); }} onClose={() => setModal(null)} />}
            {delId && <Confirm msg="Are you sure you want to delete this guest profile? This action cannot be undone." onOk={() => { onDelete(delId); setDelId(null); if (selected?.id === delId) setSelected(null); }} onCancel={() => setDelId(null)} />}
            <div className="page-header">
                <div>
                    <div className="page-title">Guests &amp; Customers</div>
                    <div className="page-sub">{customers.length} registered guests</div>
                </div>
                <Btn onClick={() => setModal({ ...BLANK_CUSTOMER })}><Ic.Plus /> Add Guest</Btn>
            </div>

            <div style={{ display: "flex", gap: 20, alignItems: "start" }}>
                {/* Customer list */}
                <div className="card" style={{ flex: 1, minWidth: 0 }}>
                    <div className="card-header" style={{ gap: 10, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <Inp value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, passport, phone..." />
                        </div>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <table className="data-table">
                        <thead>
                            <tr><th>Guest</th><th>Contact</th><th>Nationality</th><th>Diet</th><th>Bookings</th><th></th></tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => {
                                const bCount = bookings.filter(b => b.customerId === c.id).length;
                                    return (
                                        <tr key={c.id} className="clickable" onClick={() => setSelected(s => s?.id === c.id ? null : c)}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>
                                                    {c.vip && <span style={{ fontSize: 12, color: "#7c3aed", marginRight: 4 }}>👑</span>}
                                                    {c.firstName} {c.lastName}
                                                </div>
                                                <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{c.aadharNo} &middot; DOB: {c.dob || "—"}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: 13 }}>{c.phone}</div>
                                                <div style={{ fontSize: 11.5, color: "#6b7280" }}>{c.email}</div>
                                            </td>
                                            <td style={{ fontSize: 13 }}>{c.nationality}</td>
                                            <td style={{ fontSize: 12 }}>{c.dietaryPref}</td>
                                            <td style={{ fontWeight: 600 }}>{bCount}</td>
                                            <td onClick={e => e.stopPropagation()}>
                                                <div style={{ display: "flex", gap: 4 }}>
                                                    <Btn size="sm" variant="ghost" onClick={() => setModal(c)}><Ic.Edit /></Btn>
                                                    <Btn size="sm" variant="ghost" style={{ color: "#dc2626" }} onClick={() => setDelId(c.id)}><Ic.Trash /></Btn>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                            })}
                        </tbody>
                    </table>
                    </div>
                    {filtered.length === 0 && <div className="card-body text-gray text-center">No guests match your search.</div>}
                </div>

                {/* Customer detail panel */}
                {selected && (
                    <div style={{ width: 340, flexShrink: 0 }}>
                        <div className="card">
                            <div className="card-header">
                                <span className="card-title">Guest Profile</span>
                                <button className="modal-close" onClick={() => setSelected(null)}><Ic.X /></button>
                            </div>
                            <div className="card-body">
                                <div style={{ textAlign: "center", marginBottom: 16 }}>
                                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#2563eb", margin: "0 auto 10px" }}>
                                        {selected.firstName[0]}{selected.lastName[0]}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: 16 }}>
                                        {selected.vip && "👑 "}{selected.firstName} {selected.lastName}
                                    </div>
                                    {selected.company && <div style={{ fontSize: 12, color: "#6b7280" }}>{selected.company}</div>}
                                </div>

                                <div style={{ fontSize: 12.5, lineHeight: 2.2, color: "#374151", marginBottom: 16 }}>
                                    <div>📞 {selected.phone}</div>
                                    <div>✉️ {selected.email}</div>
                                    <div>🌍 {selected.nationality}</div>
                                    <div>🪪 {selected.aadharNo}</div>
                                    <div>🎂 {selected.dob || "—"}</div>
                                    <div>🏠 {selected.address || "—"}</div>
                                    <div>🍽️ {selected.dietaryPref}</div>
                                    <div>🛏️ Prefers: {selected.preferredRoom || "Any"}</div>
                                    {selected.notes && <div style={{ color: "#2563eb" }}>💡 {selected.notes}</div>}
                                </div>

                                {/* Stats */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                                    {[
                                        { label: "Total Stays", value: guestStats.total },
                                        { label: "Total Nights", value: guestStats.nights },
                                        { label: "Total Spend", value: `$${guestStats.spend.toLocaleString()}` },
                                        { label: "Last Stay", value: guestStats.last ? fmtDate(guestStats.last) : "—" },
                                    ].map(s => (
                                        <div key={s.label} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 12px" }}>
                                            <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{s.label}</div>
                                            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{s.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Booking history */}
                                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Booking History ({guestBookings.length})</div>
                                <div style={{ maxHeight: 240, overflowY: "auto" }}>
                                    {guestBookings.length === 0 && <div style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", padding: 16 }}>No bookings found.</div>}
                                    {guestBookings.map(b => (
                                        <div key={b.id} style={{ padding: "9px 0", borderBottom: "1px solid #f5f5f5", fontSize: 12.5 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ fontWeight: 600, color: "#2563eb" }}>{b.bookingRef}</span>
                                                <Badge color={b.status === "checked-out" ? "green" : b.status === "cancelled" ? "red" : "blue"}>{b.status}</Badge>
                                            </div>
                                            <div style={{ color: "#6b7280", marginTop: 2 }}>{b.roomTypeName} &middot; {fmtDate(b.checkIn)} &middot; {b.nights}N</div>
                                            <div style={{ fontWeight: 600, color: "#16a34a" }}>${b.grandTotal.toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
