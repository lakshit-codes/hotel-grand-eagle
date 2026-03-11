"use client";
import React, { useState, useMemo } from "react";
import { MealPlan, Booking } from "./types";
import { Btn, Badge, Ic, Field, Inp, Sel, uid } from "./ui";

interface Props {
    mealPlans: MealPlan[];
    bookings: Booking[];
    onAdd: (mp: MealPlan) => void;
    onUpdate: (mp: MealPlan) => void;
    onDelete: (id: string) => void;
}

const PLAN_COLORS: Record<string, { bg: string; color: string; border: string }> = {
    EP: { bg: "#f0fdf4", color: "#15803d", border: "#86efac" },
    CP: { bg: "#eff6ff", color: "#1d4ed8", border: "#93c5fd" },
    MAP: { bg: "#faf5ff", color: "#6b21a8", border: "#c4b5fd" },
    AP: { bg: "#fff7ed", color: "#c2410c", border: "#fed7aa" },
};
const PLAN_EMOJI: Record<string, string> = { EP: "🌙", CP: "☀️", MAP: "🌅", AP: "🍽️" };
const INCLUDED_OPTIONS = ["Breakfast", "Lunch", "Dinner", "Afternoon Tea", "Mini Bar", "Welcome Drink", "Room Service", "Snacks", "All Non-Alcoholic", "All Alcoholic"];

const BLANK: MealPlan = { id: "", code: "", name: "", description: "", pricePerPersonPerNight: 0, active: true, includedMeals: [] };

function MealPlanModal({ initial, onSave, onClose }: { initial: MealPlan; onSave: (mp: MealPlan) => void; onClose: () => void }) {
    const [f, setF] = useState<MealPlan>({ ...initial });
    const toggle = (meal: string) => setF(p => ({ ...p, includedMeals: p.includedMeals?.includes(meal) ? p.includedMeals.filter(m => m !== meal) : [...(p.includedMeals ?? []), meal] }));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{initial.code ? "Edit Meal Plan" : "Add Meal Plan"}</span>
                    <button className="modal-close" onClick={onClose}><Ic.X /></button>
                </div>
                <div className="modal-body">
                    <div className="grid-2 mb-12">
                        <Field label="Plan Code (e.g. EP, MAP)"><Inp value={f.code} onChange={e => setF(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="EP" /></Field>
                        <Field label="Plan Name"><Inp value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} placeholder="European Plan" /></Field>
                    </div>
                    <Field label="Description" style={{ marginBottom: 12 }}>
                        <textarea className="textarea" value={f.description} onChange={e => setF(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of what is included..." />
                    </Field>
                    <div className="grid-2 mb-12">
                        <Field label="Price per Person per Night ($)">
                            <input type="number" className="inp" value={f.pricePerPersonPerNight} min={0} onChange={e => setF(p => ({ ...p, pricePerPersonPerNight: Number(e.target.value) }))} />
                        </Field>
                        <Field label="Status">
                            <div style={{ paddingTop: 8, display: "flex", alignItems: "center", gap: 10 }}>
                                <input type="checkbox" checked={f.active} onChange={e => setF(p => ({ ...p, active: e.target.checked }))} />
                                <span style={{ fontSize: 13 }}>{f.active ? "Active (available for bookings)" : "Inactive (hidden)"}</span>
                            </div>
                        </Field>
                    </div>
                    <Field label="Included Meals">
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 6 }}>
                            {INCLUDED_OPTIONS.map(m => {
                                const on = f.includedMeals?.includes(m) ?? false;
                                return <button key={m} onClick={() => toggle(m)} style={{ padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${on ? "#2563eb" : "#d1d5db"}`, background: on ? "#eff6ff" : "#fff", color: on ? "#2563eb" : "#6b7280", fontWeight: on ? 700 : 500, fontSize: 12.5, cursor: "pointer" }}>{m}</button>;
                            })}
                        </div>
                    </Field>
                </div>
                <div className="modal-footer">
                    <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
                    <Btn disabled={!f.code.trim() || !f.name.trim()} onClick={() => { onSave({ ...f, id: f.id || uid() }); onClose(); }}>Save Plan</Btn>
                </div>
            </div>
        </div>
    );
}

export default function MealPlansPage({ mealPlans, bookings, onAdd, onUpdate, onDelete }: Props) {
    const [modal, setModal] = useState<MealPlan | null>(null);
    const [selected, setSelected] = useState<string | null>(null);

    const mealPlanStats = useMemo(() => {
        const stats: Record<string, { bookings: number; guests: number }> = {};
        mealPlans.forEach(mp => { stats[mp.id] = { bookings: 0, guests: 0 }; });
        bookings.filter(b => b.status !== "cancelled" && b.status !== "no-show").forEach(b => {
            if (stats[b.mealPlanId]) {
                stats[b.mealPlanId].bookings++;
                stats[b.mealPlanId].guests += b.adults + b.children;
            }
        });
        return stats;
    }, [mealPlans, bookings]);

    return (
        <div>
            {modal && <MealPlanModal initial={modal} onSave={mp => { mp.id && modal.code ? onUpdate(mp) : onAdd(mp); setModal(null); }} onClose={() => setModal(null)} />}
            <div className="page-header">
                <div><div className="page-title">Meal Plans</div><div className="page-sub">{mealPlans.filter(m => m.active !== false).length} active plans</div></div>
                <Btn onClick={() => setModal({ ...BLANK })}><Ic.Plus /> Add Plan</Btn>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16, marginBottom: 20 }}>
                {mealPlans.map(mp => {
                    const c = PLAN_COLORS[mp.code] ?? { bg: "#f9fafb", color: "#374151", border: "#e5e7eb" };
                    const emoji = PLAN_EMOJI[mp.code] ?? "🍴";
                    const stats = mealPlanStats[mp.id] ?? { bookings: 0, guests: 0 };
                    const isSelected = selected === mp.id;
                    return (
                        <div key={mp.id} onClick={() => setSelected(isSelected ? null : mp.id)}
                            style={{ background: isSelected ? c.bg : "#fff", border: `2px solid ${isSelected ? c.border : "#e5e7eb"}`, borderRadius: 14, padding: "20px", cursor: "pointer", transition: "all .15s", opacity: mp.active === false ? 0.6 : 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ fontSize: 32, fontWeight: 800, color: c.color, fontFamily: "monospace", lineHeight: 1 }}>{mp.code}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{emoji} {mp.name}</div>
                                        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{mp.active !== false ? <span style={{ color: "#16a34a", fontWeight: 600 }}>● Active</span> : <span style={{ color: "#dc2626", fontWeight: 600 }}>● Inactive</span>}</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                                    <Btn size="sm" variant="ghost" onClick={() => setModal({ ...mp })}><Ic.Edit /></Btn>
                                    <Btn size="sm" variant="ghost" style={{ color: "#dc2626" }} onClick={() => onDelete(mp.id)}><Ic.Trash /></Btn>
                                </div>
                            </div>

                            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 14 }}>{mp.description}</div>

                            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                                {(mp.includedMeals ?? []).map(m => (
                                    <span key={m} style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>{m}</span>
                                ))}
                                {(!mp.includedMeals || mp.includedMeals.length === 0) && <span style={{ fontSize: 12, color: "#d1d5db" }}>No meals specified</span>}
                            </div>

                            <div style={{ borderTop: `1px solid ${c.border}`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: c.color }}>${mp.pricePerPersonPerNight}<span style={{ fontSize: 12, fontWeight: 400, color: "#9ca3af" }}>/person/night</span></div>
                                </div>
                                <div style={{ textAlign: "right", fontSize: 12, color: "#6b7280" }}>
                                    <div><b style={{ color: "#111827" }}>{stats.bookings}</b> bookings</div>
                                    <div><b style={{ color: "#111827" }}>{stats.guests}</b> guests</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {mealPlans.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af", background: "#fff", borderRadius: 12, border: "1px dashed #e5e7eb" }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>🍽️</div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>No meal plans yet</div>
                    <div style={{ fontSize: 13 }}>Click "Add Plan" to create your first meal plan.</div>
                </div>
            )}
        </div>
    );
}
