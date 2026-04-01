"use client";
import React, { useState } from "react";
import { Hotel, Room } from "./types";
import { Btn, Field, Inp, Ic, statusColor, Badge } from "./ui";

interface Props {
    hotel: Hotel;
    rooms: Room[];
    onUpdate: (h: Hotel) => Promise<void>;
}

export default function HotelOverview({ hotel, rooms, onUpdate }: Props) {
    const [f, setF] = useState<Hotel>({ ...hotel });
    const [saving, setSaving] = useState(false);
    
    const s = (k: keyof Hotel) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((p: Hotel) => ({ ...p, [k]: e.target.value }));

    const handleSave = async () => {
        setSaving(true);
        await onUpdate(f);
        setSaving(false);
    };

    return (
        <div style={{ maxWidth: 800 }}>
            <div className="page-header">
                <div>
                    <div className="page-title">Hotel Settings & Overview</div>
                    <div className="page-sub">Manage primary business information for invoices and system display.</div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#16a34a", fontWeight: 600 }}>● Synced to Database</span>
                    <Btn onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Btn>
                </div>
            </div>

            <div className="card mb-20">
                <div className="card-header"><span className="card-title">Business Identity</span></div>
                <div className="card-body">
                    <div className="grid-2 mb-16">
                        <Field label="Hotel Name *">
                            <Inp value={f.name} onChange={s("name")} />
                        </Field>
                        <Field label="Star Rating">
                            <div style={{ display: "flex", gap: 4, paddingTop: 4 }}>
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setF((p: Hotel) => ({ ...p, starRating: n }))}
                                        style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer", color: n <= f.starRating ? "#f59e0b" : "#d1d5db", padding: 0 }}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </Field>
                    </div>
                    <div className="mb-16">
                        <Field label="Short Description">
                            <Inp value={f.shortDescription} onChange={s("shortDescription")} />
                        </Field>
                    </div>
                </div>
            </div>

            <div className="card mb-20">
                <div className="card-header"><span className="card-title">Contact & Location</span></div>
                <div className="card-body">
                    <div className="mb-16">
                        <Field label="Physical Address">
                            <Inp value={f.address} onChange={s("address")} />
                        </Field>
                    </div>
                    <div className="grid-2 mb-16">
                        <Field label="City">
                            <Inp value={f.city} onChange={s("city")} />
                        </Field>
                        <Field label="Country">
                            <Inp value={f.country} onChange={s("country")} />
                        </Field>
                    </div>
                    <div className="grid-3 mb-16">
                        <Field label="Contact Number">
                            <Inp value={f.contactNumber} onChange={s("contactNumber")} />
                        </Field>
                        <Field label="Email Address">
                            <Inp value={f.email} onChange={s("email")} />
                        </Field>
                        <Field label="Website">
                            <Inp value={f.website || ""} onChange={s("website")} placeholder="https://" />
                        </Field>
                    </div>
                </div>
            </div>

            <div className="card mb-20">
                <div className="card-header"><span className="card-title">Operations & Billing</span></div>
                <div className="card-body">
                    <div className="grid-3 mb-16">
                        <Field label="Check-In Time">
                            <Inp type="time" value={f.checkInTime} onChange={s("checkInTime")} />
                        </Field>
                        <Field label="Check-Out Time">
                            <Inp type="time" value={f.checkOutTime} onChange={s("checkOutTime")} />
                        </Field>
                        <Field label="GST Registration">
                            <Inp value={f.gstNumber || ""} onChange={s("gstNumber")} placeholder="e.g. 29ABCDE1234F1Z5" />
                        </Field>
                    </div>
                    <div className="mb-16">
                        <Field label="Bank Details (for Invoices)">
                            <Inp value={f.bankDetails || ""} onChange={s("bankDetails")} placeholder="Bank Name, Account No, IFSC Code" />
                        </Field>
                    </div>
                </div>
            </div>
        </div>
    );
}
