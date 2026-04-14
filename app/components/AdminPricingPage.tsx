"use client";
import React, { useCallback } from "react";
import { Ic, Btn, Badge, Inp, FieldLabel, Sel, CurrencyInput, Toggle, clamp, uid } from "./ui";
import type { Room, Pricing, PricingRule, SeasonalPrice } from "./types";

export default function AdminPricingPage({ rooms, pricing, setPricing, pricingRules, setPricingRules, currency, setCurrency }: {
    rooms: Room[]; pricing: Record<string, Pricing>; setPricing: React.Dispatch<React.SetStateAction<Record<string, Pricing>>>;
    pricingRules: PricingRule[]; setPricingRules: React.Dispatch<React.SetStateAction<PricingRule[]>>;
    currency: string; setCurrency: (s: string) => void;
}) {
    const upd = useCallback((roomId: string, field: keyof Pricing, val: unknown) => setPricing(p => ({ ...p, [roomId]: { ...p[roomId], [field]: val } })), [setPricing]);
    const addSeason = (roomId: string) => {
        const e: SeasonalPrice = { id: uid(), seasonName: "", startDate: "", endDate: "", price: 0 };
        setPricing(p => ({ ...p, [roomId]: { ...p[roomId], seasonalPricing: [...(p[roomId]?.seasonalPricing || []), e] } }));
    };
    const updSeason = (roomId: string, sid: string, field: keyof SeasonalPrice, val: string | number) =>
        setPricing(p => ({ ...p, [roomId]: { ...p[roomId], seasonalPricing: p[roomId].seasonalPricing.map(s => s.id === sid ? { ...s, [field]: field === "price" ? clamp(Number(val), 0, Infinity) : val } : s) } }));
    const delSeason = (roomId: string, sid: string) =>
        setPricing(p => ({ ...p, [roomId]: { ...p[roomId], seasonalPricing: p[roomId].seasonalPricing.filter(s => s.id !== sid) } }));

    const toggleRule = (id: string) => setPricingRules(rs => rs.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    const updRule = (id: string, field: keyof PricingRule, val: unknown) => setPricingRules(rs => rs.map(r => r.id === id ? { ...r, [field]: val } : r));

    return (
        <div>
            <div className="page-header"><div><div className="page-title">Pricing Management</div><div className="page-sub">Base, weekend, seasonal & smart discount rules</div></div></div>
            <div style={{ display: "none" }}>
                <FieldLabel>Display Currency</FieldLabel>
                <Sel value={currency} onChange={e => setCurrency(e.target.value)} opts={["INR"]} />
            </div>
            {rooms.map(room => {
                const p = pricing[room.id] || { currency: "INR", weekendPricingEnabled: false, weekendPrice: 0, seasonalPricing: [] };
                const roomRules = pricingRules.filter(r => r.roomTypeId === room.id);
                return (
                    <div className="card pricing-room" key={room.id}>
                        <div className="pricing-header">
                            <div><div style={{ fontWeight: 700, fontSize: 15 }}>{room.roomName}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{room.roomCategory} · {room.bedType}</div></div>
                        </div>
                        <div className="pricing-body">
                            <div className="grid-4" style={{ marginBottom: 16 }}>
                                <div>
                                    <FieldLabel>Base Price ({currency})</FieldLabel>
                                    <div style={{ fontSize: 22, fontWeight: 700, color: "#2563eb" }}>{room.basePrice.toLocaleString()}</div>
                                    <div style={{ fontSize: 11, color: "#9ca3af" }}>Edit in Room Types</div>
                                </div>
                                {room.extraBedPrice > 0 && <div><FieldLabel>Extra Bed</FieldLabel><div style={{ fontSize: 16, fontWeight: 600 }}>+{room.extraBedPrice}</div></div>}
                                <div><FieldLabel>Weekend Pricing</FieldLabel><div style={{ paddingTop: 4 }}><Toggle checked={p.weekendPricingEnabled} onChange={v => upd(room.id, "weekendPricingEnabled", v)} label={p.weekendPricingEnabled ? "Enabled" : "Disabled"} /></div></div>
                                {p.weekendPricingEnabled && <FieldLabel label={`Weekend Price (${currency})`}><CurrencyInput currency={currency} value={p.weekendPrice} onChange={e => upd(room.id, "weekendPrice", clamp(Number(e.target.value), 0, Infinity))} /></FieldLabel>}
                            </div>
                            {/* Seasonal */}
                            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                    <span style={{ fontWeight: 600, fontSize: 14 }}>Seasonal Pricing <span style={{ color: "#9ca3af", fontWeight: 400 }}>({p.seasonalPricing.length})</span></span>
                                    <Btn size="sm" variant="outline" onClick={() => addSeason(room.id)}><Ic.Plus /> Add Season</Btn>
                                </div>
                                {p.seasonalPricing.length === 0
                                    ? <div style={{ background: "#f9fafb", borderRadius: 8, padding: "14px 16px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>No seasonal pricing configured.</div>
                                    : p.seasonalPricing.map(sp => (
                                        <div className="seasonal-row" key={sp.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 12, marginBottom: 12, alignItems: "flex-end" }}>
                                            <div><FieldLabel>Season Name</FieldLabel><Inp value={sp.seasonName} onChange={e => updSeason(room.id, sp.id, "seasonName", e.target.value)} placeholder="e.g. Eid, Summer" /></div>
                                            <div><FieldLabel>Start Date</FieldLabel><Inp type="date" value={sp.startDate} onChange={e => updSeason(room.id, sp.id, "startDate", e.target.value)} /></div>
                                            <div><FieldLabel>End Date</FieldLabel><Inp type="date" value={sp.endDate} onChange={e => updSeason(room.id, sp.id, "endDate", e.target.value)} /></div>
                                            <div><FieldLabel>{`Price (${currency})`}</FieldLabel><CurrencyInput currency={currency} value={sp.price} onChange={e => updSeason(room.id, sp.id, "price", e.target.value)} /></div>
                                            <Btn size="sm" variant="danger" onClick={() => delSeason(room.id, sp.id)}><Ic.Trash /></Btn>
                                        </div>
                                    ))}
                            </div>
                            {/* Smart rules */}
                            {roomRules.length > 0 && (
                                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Smart Discount Rules</div>
                                    {roomRules.map(rule => (
                                        <div className="rule-row" key={rule.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                                            <Toggle checked={rule.enabled} onChange={() => toggleRule(rule.id)} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, fontSize: 13 }}>{rule.label}</div>
                                                <div style={{ fontSize: 12, color: "#6b7280" }}>
                                                    {rule.type === "last_minute" && `Within ${rule.threshold} days of stay`}
                                                    {rule.type === "early_bird" && `Booked ${rule.threshold}+ days in advance`}
                                                    {rule.type === "long_stay" && `Stays of ${rule.threshold}+ nights`}
                                                    {rule.type === "weekend_surge" && "Fri–Sun nights"}
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ fontSize: 12, color: "#6b7280" }}>Discount</span>
                                                <Inp type="number" value={String(Math.abs(rule.discount))} onChange={e => updRule(rule.id, "discount", Number(e.target.value))} style={{ width: 60, textAlign: "center" }} />
                                                <span style={{ fontSize: 12, color: "#6b7280" }}>%</span>
                                                <Badge color={rule.enabled ? "green" : "gray"}>{rule.enabled ? "Active" : "Off"}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
