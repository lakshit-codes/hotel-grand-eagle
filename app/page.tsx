"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { GlobalStyles, Ic, Btn, Badge, Inp, Field, FieldLabel, Sel, NumInp, CurrencyInput, Toggle, Confirm, uid, statusColor, clamp, slugify, BOOKING_SOURCES } from "./components/ui";
import type { RoomItem, Room, Availability, Pricing, SeasonalPrice, AmenityCat, Hotel, Customer, Booking, MealPlan, HousekeepingTask, MaintenanceItem, PricingRule, StaffMember } from "./components/types";
import Dashboard from "./components/Dashboard";
import BookingsPage from "./components/Bookings";
import CheckInPage from "./components/CheckIn";
import CustomersPage from "./components/Customers";
import MealPlansPage from "./components/MealPlans";
import HousekeepingPage from "./components/Housekeeping";
import MaintenancePage from "./components/Maintenance";
import StaffPage from "./components/Staff";
import ReportsPage from "./components/Reports";
import RoomsPage from "./components/Rooms";

// ── Constants ────────────────────────────────────────────────────────────────
const CURRENCIES = ["USD", "EUR", "GBP", "AED", "INR", "SGD", "AUD", "CAD", "JPY"];
const ROOM_CATS = ["Standard", "Superior", "Deluxe", "Premium", "Junior Suite", "Suite", "Grand Suite", "Penthouse", "Villa", "Studio"];
const BED_TYPES = ["Single", "Twin", "Double", "Queen", "King", "Super King", "Bunk Bed"];
const VIEWS = ["City View", "Garden View", "Pool View", "Ocean View", "Mountain View", "Courtyard View", "Panoramic", "Street View"];
const SMOKING = ["Non-Smoking", "Smoking", "Designated Area"];
const SOUNDPROOF = ["Standard", "Enhanced", "Premium", "Maximum"];
const BATHROOMS = ["Shower Only", "Walk-in Shower", "Rain Shower", "Rain Shower + Tub", "Soaking Tub", "Spa Bathroom", "Shared"];
const FLOORS = ["Any", "Ground Floor", "Lower Floor", "Mid Floor", "Upper Floor", "Top Floor", "Penthouse Level"];
const THEMES = ["Classic", "Modern", "Art Deco", "Minimalist", "Colonial", "Boutique", "Contemporary", "Industrial", "Tropical", "Scandinavian"];
const ENTERTAIN = ["Smart TV", "Smart TV + Mini Bar", "Smart TV + Sound System", "Home Theatre", "Tablet + Smart TV", "Gaming Console + TV"];

// Default amenity cats
const DEFAULT_CATS: AmenityCat[] = [
    { id: "cat_basic", name: "Basic Facilities", facilities: [{ id: "fb1", name: "Room Service" }, { id: "fb2", name: "Refrigerator" }, { id: "fb3", name: "Power Backup" }, { id: "fb4", name: "Elevator / Lift" }, { id: "fb5", name: "Housekeeping" }, { id: "fb6", name: "Air Conditioning" }, { id: "fb7", name: "Wi-Fi (Free)" }, { id: "fb8", name: "Express Check-out" }] },
    { id: "cat_room", name: "Room Amenities", facilities: [{ id: "fr1", name: "Hairdryer" }, { id: "fr2", name: "Jacuzzi" }, { id: "fr3", name: "Bathtub" }, { id: "fr4", name: "Sofa" }, { id: "fr5", name: "Minibar" }, { id: "fr6", name: "Work Desk" }, { id: "fr7", name: "Coffee Machine" }, { id: "fr8", name: "Iron / Ironing Board" }, { id: "fr9", name: "Mineral Water" }, { id: "fr10", name: "Toiletries" }] },
    { id: "cat_wellness", name: "Health & Wellness", facilities: [{ id: "fw1", name: "Gym" }, { id: "fw2", name: "Swimming Pool" }, { id: "fw3", name: "Spa" }, { id: "fw4", name: "Steam & Sauna" }, { id: "fw5", name: "Yoga Room" }] },
    { id: "cat_biz", name: "Business", facilities: [{ id: "fbz1", name: "Business Centre" }, { id: "fbz2", name: "Conference Room" }, { id: "fbz3", name: "Printer" }, { id: "fbz4", name: "Banquet Hall" }] },
    { id: "cat_security", name: "Safety & Security", facilities: [{ id: "fs1", name: "CCTV" }, { id: "fs2", name: "Security Guard" }, { id: "fs3", name: "Fire Extinguishers" }, { id: "fs4", name: "Safe Deposit Box" }] },
];

// Mock static data
const MOCK_HOTEL: Hotel = {
    name: "HOTEL GRAND EAGLE", shortDescription: "Iconic 5-star urban retreat with panoramic city views.",
    address: "123 Eagle Avenue, Downtown District", city: "Metropolis", country: "United Arab Emirates",
    contactNumber: "+91 63678 50548", email: "reservations@hotelgrandeagle.com",
    checkInTime: "15:00", checkOutTime: "12:00", starRating: 5,
};

const MOCK_ROOMS: Room[] = [
    { id: "rm1", roomName: "Deluxe King Room", slug: "deluxe-king-room", roomCategory: "Deluxe", bedType: "King", maxOccupancy: 2, roomSize: 42, view: "City View", smokingPolicy: "Non-Smoking", balconyAvailable: true, roomTheme: "Modern", soundproofingLevel: "Premium", inRoomWorkspace: true, entertainmentOptions: "Smart TV + Sound System", bathroomType: "Rain Shower + Tub", floorPreference: "Upper Floor", basePrice: 450, extraBedPrice: 80, refundable: true, currency: "USD", amenityIds: ["fb7", "fr6", "fr7", "fr10"], images: [], roomNumbers: ["101", "102", "103", "104", "105", "201", "202", "203"] },
    { id: "rm2", roomName: "Royal Suite", slug: "royal-suite", roomCategory: "Suite", bedType: "Super King", maxOccupancy: 3, roomSize: 120, view: "Panoramic", smokingPolicy: "Non-Smoking", balconyAvailable: true, roomTheme: "Art Deco", soundproofingLevel: "Maximum", inRoomWorkspace: true, entertainmentOptions: "Home Theatre", bathroomType: "Spa Bathroom", floorPreference: "Top Floor", basePrice: 1800, extraBedPrice: 0, refundable: true, currency: "USD", amenityIds: ["fw3", "fr2", "fr3", "fr5", "fr9"], images: [], roomNumbers: ["501", "502", "503"] },
    { id: "rm3", roomName: "Twin Standard", slug: "twin-standard", roomCategory: "Standard", bedType: "Twin", maxOccupancy: 2, roomSize: 28, view: "Garden View", smokingPolicy: "Non-Smoking", balconyAvailable: false, roomTheme: "Classic", soundproofingLevel: "Standard", inRoomWorkspace: false, entertainmentOptions: "Smart TV", bathroomType: "Walk-in Shower", floorPreference: "Lower Floor", basePrice: 220, extraBedPrice: 50, refundable: false, currency: "USD", amenityIds: ["fb7", "fr10"], images: [], roomNumbers: ["301", "302", "303", "304", "305", "306", "307", "308", "309", "310"] },
];

const MOCK_PRICING: Record<string, Pricing> = {
    rm1: { roomId: "rm1", currency: "USD", weekendPricingEnabled: true, weekendPrice: 550, seasonalPricing: [{ id: "sp1", seasonName: "New Year", startDate: "2026-12-26", endDate: "2027-01-05", price: 720 }] },
    rm2: { roomId: "rm2", currency: "USD", weekendPricingEnabled: true, weekendPrice: 2100, seasonalPricing: [] },
    rm3: { roomId: "rm3", currency: "USD", weekendPricingEnabled: false, weekendPrice: 0, seasonalPricing: [] },
};

const MOCK_AVAIL: Record<string, Availability> = {
    rm1: { roomId: "rm1", totalRooms: 40, availableRooms: 28, minimumStay: 1, maximumStay: 30, blackoutDates: ["2026-12-24", "2026-12-25"] },
    rm2: { roomId: "rm2", totalRooms: 8, availableRooms: 5, minimumStay: 2, maximumStay: 14, blackoutDates: [] },
    rm3: { roomId: "rm3", totalRooms: 60, availableRooms: 48, minimumStay: 1, maximumStay: 30, blackoutDates: [] },
};

// ── Nav ──────────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
    {
        label: "Operations", items: [
            { id: "dashboard", label: "Dashboard", Icon: Ic.Dashboard },
            { id: "bookings", label: "Bookings", Icon: Ic.Bookings },
            { id: "customers", label: "Guests", Icon: Ic.Customers },
            { id: "reports", label: "Reports & Audit", Icon: Ic.Reports },
        ]
    },
    {
        label: "Hotel", items: [
            { id: "room-types", label: "Room Types", Icon: Ic.Rooms },
            { id: "rooms", label: "Rooms", Icon: Ic.Rooms },
            { id: "meals", label: "Meal Plans", Icon: Ic.Meals },
            { id: "hk", label: "Housekeeping", Icon: Ic.HK },
            { id: "maint", label: "Maintenance", Icon: Ic.Maint },
            { id: "staff", label: "Staff", Icon: Ic.Staff },
        ]
    },
    {
        label: "Configuration", items: [
            { id: "pricing", label: "Pricing", Icon: Ic.Pricing },
            { id: "avail", label: "Availability", Icon: Ic.Avail },
            { id: "amenity", label: "Amenity Manager", Icon: Ic.Amenity },
            { id: "overview", label: "Hotel Overview", Icon: Ic.Hotel },
        ]
    },
];

function Sidebar({ page, onNav, collapsed, onToggle, hotelName, mobileOpen, onMobileClose }: { page: string; onNav: (p: string) => void; collapsed: boolean; onToggle: () => void; hotelName: string; mobileOpen: boolean; onMobileClose: () => void; }) {
    const handleNav = (id: string) => { onNav(id); onMobileClose(); };
    return (
        <>
            {/* Dark overlay behind drawer on mobile */}
            <div className={`sidebar-overlay ${mobileOpen ? "" : "hidden"}`} onClick={onMobileClose} />
            <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
                <div className="sidebar-logo-icon" style={{ background: "none" }}><img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "lighten" }} /></div>
                <nav className="sidebar-nav">
                    {NAV_GROUPS.map(group => (
                        <div key={group.label}>
                            <div className="nav-group-label">{group.label}</div>
                            {group.items.map(({ id, label, Icon }) => (
                                <button key={id} onClick={() => handleNav(id)} title={collapsed ? label : ""}
                                    className={`nav-item ${page === id ? "active" : ""}`}>
                                    <span className="nav-item-icon"><Icon /></span>
                                    <span className="nav-item-label">{label}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={onToggle} className="nav-item">
                        <span className="nav-item-icon"><Ic.Chev r={collapsed} /></span>
                        {!collapsed && <span className="nav-item-label">Collapse</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}

// ── Search overlay ────────────────────────────────────────────────────────────
function SearchOverlay({ bookings, customers, rooms, onClose, onNav }: { bookings: Booking[]; customers: Customer[]; rooms: Room[]; onClose: () => void; onNav: (p: string) => void; }) {
    const [q, setQ] = useState("");
    const results = useMemo(() => {
        if (!q.trim()) return [];
        const lq = q.toLowerCase();
        const res: { type: string; main: string; sub: string; page: string }[] = [];
        bookings.filter(b => b.guestName.toLowerCase().includes(lq) || b.bookingRef.toLowerCase().includes(lq)).slice(0, 5)
            .forEach(b => res.push({ type: "Booking", main: `${b.bookingRef} — ${b.guestName}`, sub: `${b.roomTypeName} · ${b.status}`, page: "bookings" }));
        customers.filter(c => `${c.firstName} ${c.lastName} ${c.email} ${c.aadharNo}`.toLowerCase().includes(lq)).slice(0, 5)
            .forEach(c => res.push({ type: "Guest", main: `${c.firstName} ${c.lastName}`, sub: `${c.nationality} · ${c.loyaltyTier}`, page: "customers" }));
        rooms.filter(r => r.roomName.toLowerCase().includes(lq)).slice(0, 3)
            .forEach(r => res.push({ type: "Room Type", main: r.roomName, sub: `${r.roomCategory} · $${r.basePrice}/night`, page: "room-types" }));
        return res.slice(0, 10);
    }, [q, bookings, customers, rooms]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-box" onClick={e => e.stopPropagation()}>
                <div className="search-input-wrap">
                    <Ic.Search />
                    <input autoFocus className="inp" style={{ flex: 1, border: "none", outline: "none", fontSize: 16 }} placeholder="Search guests, bookings, rooms..." value={q} onChange={e => setQ(e.target.value)} />
                    <kbd style={{ fontSize: 11, color: "#9ca3af", background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>Esc</kbd>
                </div>
                <div className="search-results">
                    {results.length === 0 && q && <div className="search-empty">No results for "{q}"</div>}
                    {!q && <div className="search-empty">Type to search across all hotel data…</div>}
                    {results.map((r, i) => (
                        <div key={i} className="search-result-item" onClick={() => { onNav(r.page); onClose(); }}>
                            <span className="search-result-type">{r.type}</span>
                            <div>
                                <div className="search-result-main">{r.main}</div>
                                <div className="search-result-sub">{r.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Pricing page (kept from original, extended with rules) ────────────────────
function PricingPage({ rooms, pricing, setPricing, pricingRules, setPricingRules, currency, setCurrency }: {
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
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <FieldLabel>Display Currency</FieldLabel>
                <Sel value={currency} onChange={e => setCurrency(e.target.value)} opts={CURRENCIES} />
            </div>
            {rooms.map(room => {
                const p = pricing[room.id] || { currency: "USD", weekendPricingEnabled: false, weekendPrice: 0, seasonalPricing: [] };
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
                                {p.weekendPricingEnabled && <Field label={`Weekend Price (${currency})`}><CurrencyInput currency={currency} value={p.weekendPrice} onChange={e => upd(room.id, "weekendPrice", clamp(Number(e.target.value), 0, Infinity))} /></Field>}
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
                                        <div className="seasonal-row" key={sp.id}>
                                            <Field label="Season Name"><Inp value={sp.seasonName} onChange={e => updSeason(room.id, sp.id, "seasonName", e.target.value)} placeholder="e.g. Eid, Summer" /></Field>
                                            <Field label="Start Date"><Inp type="date" value={sp.startDate} onChange={e => updSeason(room.id, sp.id, "startDate", e.target.value)} /></Field>
                                            <Field label="End Date"><Inp type="date" value={sp.endDate} onChange={e => updSeason(room.id, sp.id, "endDate", e.target.value)} /></Field>
                                            <Field label={`Price (${currency})`}><CurrencyInput currency={currency} value={sp.price} onChange={e => updSeason(room.id, sp.id, "price", e.target.value)} /></Field>
                                            <div style={{ display: "flex", alignItems: "flex-end" }}><Btn size="sm" variant="danger" onClick={() => delSeason(room.id, sp.id)}><Ic.Trash /></Btn></div>
                                        </div>
                                    ))}
                            </div>
                            {/* Smart rules */}
                            {roomRules.length > 0 && (
                                <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
                                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Smart Discount Rules</div>
                                    {roomRules.map(rule => (
                                        <div className="rule-row" key={rule.id}>
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

// ── Availability page (original) ─────────────────────────────────────────────
function AvailPage({ rooms, availability, setAvailability }: { rooms: Room[]; availability: Record<string, Availability>; setAvailability: React.Dispatch<React.SetStateAction<Record<string, Availability>>>; }) {
    const [bIn, setBIn] = useState<Record<string, string>>({});
    const upd = useCallback((roomId: string, field: keyof Availability, raw: string | number) => {
        setAvailability(p => {
            const c = p[roomId] || { totalRooms: 0, availableRooms: 0, minimumStay: 1, maximumStay: 30, blackoutDates: [] };
            let v = Number(raw) || 0;
            if (field === "totalRooms") v = clamp(v, 0, 9999);
            if (field === "availableRooms") v = clamp(v, 0, c.totalRooms);
            if (field === "minimumStay") v = clamp(v, 1, c.maximumStay);
            if (field === "maximumStay") v = clamp(v, c.minimumStay, 365);
            return { ...p, [roomId]: { ...c, [field]: v } };
        });
    }, [setAvailability]);
    const addBO = (roomId: string) => { const d = bIn[roomId]; if (!d) return; setAvailability(p => { const c = p[roomId]; if (c.blackoutDates.includes(d)) return p; return { ...p, [roomId]: { ...c, blackoutDates: [...c.blackoutDates, d].sort() } }; }); setBIn(b => ({ ...b, [roomId]: "" })); };
    const remBO = (roomId: string, date: string) => setAvailability(p => ({ ...p, [roomId]: { ...p[roomId], blackoutDates: p[roomId].blackoutDates.filter(d => d !== date) } }));
    return (
        <div>
            <div className="page-header"><div><div className="page-title">Availability & Inventory</div><div className="page-sub">Room inventory, stay restrictions, blackout dates</div></div></div>
            {rooms.map(room => { const a = availability[room.id] || { totalRooms: 0, availableRooms: 0, minimumStay: 1, maximumStay: 30, blackoutDates: [] }; const occ = a.totalRooms > 0 ? Math.round(((a.totalRooms - a.availableRooms) / a.totalRooms) * 100) : 0; const oc = occ >= 90 ? "#dc2626" : occ >= 60 ? "#d97706" : "#16a34a"; return (<div className="card avail-room" key={room.id}><div className="avail-header"><div><div style={{ fontWeight: 700, fontSize: 15 }}>{room.roomName}</div><div style={{ fontSize: 12, color: "#9ca3af" }}>{room.roomCategory}</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 24, fontWeight: 700, color: oc }}>{occ}%</div><div style={{ fontSize: 11, color: "#9ca3af" }}>Occupied</div></div></div><div className="avail-bar"><div className="avail-bar-fill" style={{ width: `${occ}%`, background: oc }} /></div><div className="avail-body"><div className="grid-4" style={{ marginBottom: 12 }}><Field label="Total Rooms"><NumInp value={a.totalRooms} onChange={e => upd(room.id, "totalRooms", e.target.value)} min={0} max={9999} /></Field><Field label="Available Rooms"><NumInp value={a.availableRooms} onChange={e => upd(room.id, "availableRooms", e.target.value)} min={0} max={a.totalRooms} /></Field><Field label="Min Stay (nights)"><NumInp value={a.minimumStay} onChange={e => upd(room.id, "minimumStay", e.target.value)} min={1} max={a.maximumStay} /></Field><Field label="Max Stay (nights)"><NumInp value={a.maximumStay} onChange={e => upd(room.id, "maximumStay", e.target.value)} min={a.minimumStay} max={365} /></Field></div><div style={{ marginTop: 16 }}><div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Blackout Dates ({a.blackoutDates.length})</div><div style={{ display: "flex", gap: 8, marginBottom: 10 }}><Inp type="date" value={bIn[room.id] || ""} onChange={e => setBIn(b => ({ ...b, [room.id]: e.target.value }))} style={{ maxWidth: 200 }} /><Btn size="sm" variant="secondary" onClick={() => addBO(room.id)}>Add</Btn></div><div className="blackout-list">{a.blackoutDates.map(d => (<span className="blackout-chip" key={d}>📅 {d}<button onClick={() => remBO(room.id, d)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", padding: 0, marginLeft: 4 }}>✕</button></span>))}</div></div></div></div>); })}
        </div>
    );
}

// ── Amenity Manager — DB-backed ────────────────────────────────────────────────
function AmenityManager({ cats, setCats }: { cats: AmenityCat[]; setCats: React.Dispatch<React.SetStateAction<AmenityCat[]>>; }) {
    const [newCat, setNewCat] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [facInputs, setFacInputs] = useState<Record<string, string>>({});
    const [expanded, setExpanded] = useState<Record<string, boolean>>(() => Object.fromEntries(cats.map(c => [c.id, true])));
    const [saving, setSaving] = useState<string | null>(null);  // catId being saved
    const [confirm, setConfirm] = useState<{ type: string; catId: string; facId?: string; label: string } | null>(null);

    // Persist a category update to DB
    const persist = async (updated: AmenityCat) => {
        setSaving(updated.id);
        try {
            await fetch("/api/amenities", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });
        } finally {
            setSaving(null);
        }
    };

    // Add new category — POST to DB
    const addCat = async () => {
        const n = newCat.trim();
        if (!n) return;
        const newEntry: AmenityCat = { id: uid(), name: n, facilities: [] };
        await fetch("/api/amenities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEntry),
        });
        setCats(p => [...p, newEntry]);
        setExpanded(e => ({ ...e, [newEntry.id]: true }));
        setNewCat(""); setShowAdd(false);
    };

    // Add facility to category — PUT whole category
    const addFac = async (catId: string) => {
        const n = (facInputs[catId] || "").trim();
        if (!n) return;
        const newFac = { id: uid(), name: n };
        setCats(p => {
            const updated = p.map(c => c.id === catId ? { ...c, facilities: [...c.facilities, newFac] } : c);
            persist(updated.find(c => c.id === catId)!);
            return updated;
        });
        setFacInputs(x => ({ ...x, [catId]: "" }));
    };

    // Delete category — DELETE from DB
    const delCat = async (catId: string) => {
        await fetch(`/api/amenities?id=${catId}`, { method: "DELETE" });
        setCats(p => p.filter(c => c.id !== catId));
        setConfirm(null);
    };

    // Delete facility from category — PUT whole category
    const delFac = async (catId: string, facId: string) => {
        setCats(p => {
            const updated = p.map(c => c.id === catId ? { ...c, facilities: c.facilities.filter(f => f.id !== facId) } : c);
            persist(updated.find(c => c.id === catId)!);
            return updated;
        });
        setConfirm(null);
    };

    const total = cats.reduce((s, c) => s + c.facilities.length, 0);

    return (
        <div>
            {confirm && <Confirm title={confirm.type === "cat" ? "Delete Category" : "Delete Facility"} msg={`Delete "${confirm.label}"?`} onOk={() => confirm.type === "cat" ? delCat(confirm.catId) : delFac(confirm.catId, confirm.facId!)} onCancel={() => setConfirm(null)} />}
            <div className="page-header">
                <div>
                    <div className="page-title">Amenity Manager</div>
                    <div className="page-sub">{cats.length} categories · {total} facilities total · <span style={{ color: "#16a34a", fontWeight: 600 }}>● Synced to Database</span></div>
                </div>
                <Btn variant="outline" onClick={() => setShowAdd(true)}><Ic.Plus /> Add Category</Btn>
            </div>

            {showAdd && (
                <div className="card mb-16" style={{ borderColor: "#bfdbfe", background: "#eff6ff" }}>
                    <div className="card-body">
                        <div style={{ fontWeight: 600, marginBottom: 10 }}>New Category</div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <Inp value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Category name..." onKeyDown={e => e.key === "Enter" && addCat()} />
                            <Btn onClick={addCat}>Add</Btn>
                            <Btn variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
                        </div>
                    </div>
                </div>
            )}

            {cats.map(cat => (
                <div className="card amen-cat" key={cat.id} style={{ opacity: saving === cat.id ? 0.7 : 1, transition: "opacity .15s" }}>
                    <div className="amen-cat-header" onClick={() => setExpanded(p => ({ ...p, [cat.id]: !p[cat.id] }))}>
                        <span style={{ color: "#9ca3af", marginRight: 4 }}><Ic.Chev r={!expanded[cat.id]} /></span>
                        <span className="amen-cat-name">{cat.name}</span>
                        <span className="amen-cat-count">{cat.facilities.length}</span>
                        {saving === cat.id && <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 6 }}>saving…</span>}
                        <div onClick={e => e.stopPropagation()} style={{ display: "flex", gap: 4, marginLeft: 8 }}>
                            <Btn size="sm" variant="ghost" style={{ color: "#dc2626" }} onClick={() => setConfirm({ type: "cat", catId: cat.id, label: cat.name })}><Ic.Trash /></Btn>
                        </div>
                    </div>
                    {expanded[cat.id] && (<>
                        <div className="amen-fac-list">
                            {cat.facilities.map(fc => (
                                <div className="amen-fac-item" key={fc.id}>
                                    <span className="amen-fac-name">{fc.name}</span>
                                    <div className="amen-fac-actions">
                                        <Btn size="sm" variant="ghost" style={{ color: "#dc2626" }} onClick={() => setConfirm({ type: "fac", catId: cat.id, facId: fc.id, label: fc.name })}><Ic.Trash /></Btn>
                                    </div>
                                </div>
                            ))}
                            {cat.facilities.length === 0 && <div style={{ fontSize: 12, color: "#9ca3af", padding: "6px 0" }}>No facilities yet — add one below</div>}
                        </div>
                        <div className="amen-add-row">
                            <Inp
                                value={facInputs[cat.id] || ""}
                                onChange={e => setFacInputs(x => ({ ...x, [cat.id]: e.target.value }))}
                                placeholder="Add facility name..."
                                style={{ flex: 1 }}
                                onKeyDown={e => e.key === "Enter" && addFac(cat.id)}
                            />
                            <Btn size="sm" variant="secondary" onClick={() => addFac(cat.id)}><Ic.Plus /> Add</Btn>
                        </div>
                    </>)}
                </div>
            ))}

            {cats.length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🏷️</div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>No amenity categories yet</div>
                    <div style={{ fontSize: 13 }}>Click "Add Category" to create your first amenity group</div>
                </div>
            )}
        </div>
    );
}

// ── Room Form ─────────────────────────────────────────────────────────────────
const BLANK_ROOM: Room = { id: "", roomName: "", slug: "", roomCategory: "Deluxe", bedType: "King", maxOccupancy: 2, roomSize: 30, view: "City View", smokingPolicy: "Non-Smoking", balconyAvailable: false, roomTheme: "Modern", soundproofingLevel: "Standard", inRoomWorkspace: false, entertainmentOptions: "Smart TV", bathroomType: "Walk-in Shower", floorPreference: "Any", basePrice: 100, extraBedPrice: 0, refundable: true, currency: "USD", amenityIds: [], images: [], roomNumbers: [] };

function RoomForm({ initial, amenityCats, onSave, onCancel }: { initial?: Room; amenityCats: AmenityCat[]; onSave: (r: Room) => void; onCancel: () => void; }) {
    const [f, setF] = useState<Room>(() => initial ? { ...initial } : { ...BLANK_ROOM, id: uid() });
    const [imgUrl, setImgUrl] = useState("");
    const [imgErr, setImgErr] = useState("");
    const s = (field: keyof Room) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF(p => ({ ...p, [field]: e.target.value, ...(field === "roomName" ? { slug: slugify(e.target.value) } : {}) }));
    const sn = (field: keyof Room, mn: number, mx: number) => (e: React.ChangeEvent<HTMLInputElement>) => setF(p => ({ ...p, [field]: clamp(Number(e.target.value), mn, mx) }));
    const sb = (field: keyof Room) => (val: boolean) => setF(p => ({ ...p, [field]: val }));
    const facilityMap = useMemo(() => { const m: Record<string, string> = {}; amenityCats.forEach(c => c.facilities.forEach(f => { m[f.id] = f.name; })); return m; }, [amenityCats]);
    const toggleAmen = (id: string) => setF(p => ({ ...p, amenityIds: p.amenityIds.includes(id) ? p.amenityIds.filter(x => x !== id) : [...p.amenityIds, id] }));

    const addImgUrl = () => {
        const u = imgUrl.trim();
        if (!u) return;
        if (!u.startsWith("http") && !u.startsWith("data:")) { setImgErr("Please enter a valid URL (starting with http) or upload a file."); return; }
        setF(p => ({ ...p, images: [...p.images, u] }));
        setImgUrl(""); setImgErr("");
    };
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach(file => {
            if (!file.type.startsWith("image/")) return;
            const reader = new FileReader();
            reader.onload = ev => {
                const result = ev.target?.result as string;
                if (result) setF(p => ({ ...p, images: [...p.images, result] }));
            };
            reader.readAsDataURL(file);
        });
        e.target.value = ""; // reset so same file can be re-selected
    };
    const removeImg = (idx: number) => setF(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
    const moveImg = (from: number, to: number) => {
        if (to < 0 || to >= f.images.length) return;
        setF(p => { const imgs = [...p.images];[imgs[from], imgs[to]] = [imgs[to], imgs[from]]; return { ...p, images: imgs }; });
    };
    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}><Btn variant="ghost" size="sm" onClick={onCancel}><Ic.Back /> Back</Btn><h2 style={{ fontSize: 18, fontWeight: 700 }}>{initial ? "Edit Room Type" : "Add Room Type"}</h2></div>
            <div className="card mb-16"><div className="card-header"><span className="card-title">Room Identity</span></div><div className="card-body">
                <div className="grid-3" style={{ marginBottom: 16 }}><Field label="Room Name *"><Inp value={f.roomName} onChange={s("roomName")} placeholder="e.g. Deluxe King Room" /></Field><Field label="Slug (auto)"><Inp value={f.slug} onChange={s("slug")} /></Field><Field label="Room Category"><Sel value={f.roomCategory} onChange={s("roomCategory")} opts={ROOM_CATS} /></Field></div>
                <div className="grid-3" style={{ marginBottom: 16 }}><Field label="Bed Type"><Sel value={f.bedType} onChange={s("bedType")} opts={BED_TYPES} /></Field><Field label="Room Theme"><Sel value={f.roomTheme} onChange={s("roomTheme")} opts={THEMES} /></Field><Field label="View"><Sel value={f.view} onChange={s("view")} opts={VIEWS} /></Field></div>
                <div className="grid-4"><Field label="Max Occupancy"><NumInp value={f.maxOccupancy} onChange={sn("maxOccupancy", 1, 20)} min={1} max={20} /></Field><Field label="Room Size (m²)"><NumInp value={f.roomSize} onChange={sn("roomSize", 5, 2000)} min={5} /></Field><Field label="Floor Preference"><Sel value={f.floorPreference} onChange={s("floorPreference")} opts={FLOORS} /></Field><Field label="Smoking Policy"><Sel value={f.smokingPolicy} onChange={s("smokingPolicy")} opts={SMOKING} /></Field></div>
            </div></div>
            <div className="card mb-16"><div className="card-header"><span className="card-title">Room Specifications</span></div><div className="card-body">
                <div className="grid-3" style={{ marginBottom: 16 }}><Field label="Soundproofing"><Sel value={f.soundproofingLevel} onChange={s("soundproofingLevel")} opts={SOUNDPROOF} /></Field><Field label="Bathroom Type"><Sel value={f.bathroomType} onChange={s("bathroomType")} opts={BATHROOMS} /></Field><Field label="Entertainment"><Sel value={f.entertainmentOptions} onChange={s("entertainmentOptions")} opts={ENTERTAIN} /></Field></div>
                <div style={{ display: "flex", gap: 32 }}><Toggle checked={f.balconyAvailable} onChange={sb("balconyAvailable")} label="Balcony Available" /><Toggle checked={f.inRoomWorkspace} onChange={sb("inRoomWorkspace")} label="In-Room Workspace" /></div>
            </div></div>
            <div className="card mb-16"><div className="card-header"><span className="card-title">Pricing</span></div><div className="card-body">
                <div className="grid-4"><Field label="Currency"><Sel value={f.currency} onChange={s("currency")} opts={CURRENCIES} /></Field><Field label={`Base Price (${f.currency})`}><CurrencyInput currency={f.currency} value={f.basePrice} onChange={sn("basePrice", 0, 999999)} /></Field><Field label={`Extra Bed (${f.currency})`}><CurrencyInput currency={f.currency} value={f.extraBedPrice} onChange={sn("extraBedPrice", 0, 999999)} /></Field><Field label="Cancellation"><div style={{ paddingTop: 6 }}><Toggle checked={f.refundable} onChange={sb("refundable")} label={f.refundable ? "Refundable" : "Non-Refundable"} /></div></Field></div>
            </div></div>
            <div className="card mb-20"><div className="card-header"><span className="card-title">Amenities</span><span style={{ fontSize: 13, color: "#6b7280" }}>{f.amenityIds.length} selected</span></div><div className="card-body"><div className="amen-picker">{amenityCats.map(cat => (<div className="amen-pick-cat" key={cat.id}><div className="amen-pick-cat-name">{cat.name}</div><div className="amen-pick-pills">{cat.facilities.map(fc => { const on = f.amenityIds.includes(fc.id); return (<button key={fc.id} onClick={() => toggleAmen(fc.id)} className={`amen-pill ${on ? "on" : "off"}`}>{fc.name}</button>); })}</div></div>))}</div></div></div>

            {/* Images */}
            <div className="card mb-20">
                <div className="card-header">
                    <span className="card-title">Room Photos <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 400 }}>({f.images.length} image{f.images.length !== 1 ? "s" : ""})</span></span>
                </div>
                <div className="card-body">
                    {/* Hero */}
                    {f.images.length > 0 && (
                        <div style={{ marginBottom: 16, borderRadius: 10, overflow: "hidden", position: "relative", height: 200, background: "#0f1623" }}>
                            <img src={f.images[0]} alt="Room hero" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Ctext y='18' font-size='18'%3E🖼️%3C/text%3E%3C/svg%3E"; }} />
                            <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,.55)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>HERO PHOTO</div>
                        </div>
                    )}
                    {/* Thumbnail strip */}
                    {f.images.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 8, marginBottom: 16 }}>
                            {f.images.map((img, idx) => (
                                <div key={idx} style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: idx === 0 ? "2px solid #2563eb" : "2px solid #e5e7eb", height: 80 }}>
                                    <img src={img} alt={`Room ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24'%3E%3Ctext y='18' font-size='18'%3E🖼️%3C/text%3E%3C/svg%3E"; }} />
                                    <div style={{ position: "absolute", top: 2, right: 2, display: "flex", gap: 2 }}>
                                        {idx > 0 && <button onClick={() => moveImg(idx, idx - 1)} title="Move left" style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(0,0,0,.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>◀</button>}
                                        {idx < f.images.length - 1 && <button onClick={() => moveImg(idx, idx + 1)} title="Move right" style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(0,0,0,.6)", color: "#fff", border: "none", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>}
                                        <button onClick={() => removeImg(idx)} title="Remove" style={{ width: 18, height: 18, borderRadius: 4, background: "#dc2626", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                                    </div>
                                    {idx === 0 && <div style={{ position: "absolute", bottom: 2, left: 2, fontSize: 9, fontWeight: 700, color: "#fff", background: "#2563eb", padding: "1px 5px", borderRadius: 4 }}>HERO</div>}
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Upload & URL input */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                        <input value={imgUrl} onChange={e => { setImgUrl(e.target.value); setImgErr(""); }} placeholder="Paste image URL (https://...)" className="inp" style={{ flex: 1, minWidth: 200 }} onKeyDown={e => e.key === "Enter" && addImgUrl()} />
                        <Btn size="sm" variant="secondary" onClick={addImgUrl}>+ Add URL</Btn>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 500, color: "#374151" }}>
                            📁 Upload Files
                            <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: "none" }} />
                        </label>
                    </div>
                    {imgErr && <div style={{ fontSize: 12, color: "#dc2626", marginBottom: 8 }}>{imgErr}</div>}
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>💡 First image is the hero photo shown in lists. Use ◀▶ to reorder. Accepts JPEG, PNG, WebP.</div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}><Btn size="lg" onClick={() => onSave(f)} disabled={!f.roomName.trim()}>{initial ? "Update Room" : "Create Room"}</Btn><Btn variant="secondary" size="lg" onClick={onCancel}>Cancel</Btn></div>
        </div>
    );
}

function RoomManagement({ rooms, amenityCats, onAdd, onEdit, onDelete }: { rooms: Room[]; amenityCats: AmenityCat[]; onAdd: (r: Room) => void; onEdit: (r: Room) => void; onDelete: (id: string) => void; }) {
    const [view, setView] = useState<"list" | "add" | "edit">("list"); const [target, setTarget] = useState<Room | null>(null); const [delId, setDelId] = useState<string | null>(null);
    const facilityMap = useMemo(() => { const m: Record<string, string> = {}; amenityCats.forEach(c => c.facilities.forEach(f => { m[f.id] = f.name; })); return m; }, [amenityCats]);
    if (view === "add") return <RoomForm amenityCats={amenityCats} onSave={r => { onAdd(r); setView("list"); }} onCancel={() => setView("list")} />;
    if (view === "edit" && target) return <RoomForm initial={target} amenityCats={amenityCats} onSave={r => { onEdit(r); setView("list"); }} onCancel={() => setView("list")} />;
    return (
        <div>
            {delId && <Confirm title="Delete Room Type" msg={`Delete "${rooms.find(r => r.id === delId)?.roomName}"?`} onOk={() => { onDelete(delId); setDelId(null); }} onCancel={() => setDelId(null)} />}
            <div className="page-header"><div><div className="page-title">Room Types ({rooms.length})</div><div className="page-sub">Manage room configurations</div></div><Btn onClick={() => setView("add")}><Ic.Plus /> Add Room Type</Btn></div>
            {rooms.map(room => (
                <div className="card room-card" key={room.id}>
                    <div className="room-card-header">
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}><span className="room-name">{room.roomName}</span><Badge color="blue">{room.roomCategory}</Badge><Badge color="gray">{room.bedType}</Badge>{room.refundable ? <Badge color="green">Refundable</Badge> : <Badge color="amber">Non-Refundable</Badge>}{room.balconyAvailable && <Badge color="purple">Balcony</Badge>}{room.inRoomWorkspace && <Badge color="gray">Workspace</Badge>}</div></div>
                        <div className="room-actions"><Btn size="sm" variant="secondary" onClick={() => { setTarget(room); setView("edit"); }}><Ic.Edit />Edit</Btn><Btn size="sm" variant="danger" onClick={() => setDelId(room.id)}><Ic.Trash /></Btn></div>
                    </div>
                    <div className="room-attrs"><span className="room-attr">👥 Max {room.maxOccupancy}</span><span className="room-attr">📐 {room.roomSize} m²</span><span className="room-attr">🪟 {room.view}</span><span className="room-attr">🏢 {room.floorPreference}</span><span className="room-attr">💰 {room.currency} {room.basePrice.toLocaleString()}/night</span><span className="room-attr">🚿 {room.bathroomType}</span><span className="room-attr">🔇 {room.soundproofingLevel}</span><span className="room-attr">🎭 {room.roomTheme}</span></div>
                    {room.roomNumbers && room.roomNumbers.length > 0 && <div style={{ padding: "6px 20px 10px", fontSize: 12, color: "#6b7280" }}>Rooms: {room.roomNumbers.join(", ")}</div>}
                    {room.amenityIds.length > 0 && <div className="room-amenities">{room.amenityIds.slice(0, 8).map(id => <Badge key={id} color="gray">{facilityMap[id] || id}</Badge>)}{room.amenityIds.length > 8 && <Badge color="gray">+{room.amenityIds.length - 8} more</Badge>}</div>}
                </div>
            ))}
        </div>
    );
}

function HotelOverview({ hotel, onSave }: { hotel: Hotel; onSave: (h: Hotel) => void; }) {
    const [editing, setEditing] = useState(false); const [d, setD] = useState(hotel); const s = (f: keyof Hotel) => (e: React.ChangeEvent<HTMLInputElement>) => setD(p => ({ ...p, [f]: e.target.value }));
    const fields: [string, keyof Hotel][] = [["Hotel Name", "name"], ["Short Description", "shortDescription"], ["City", "city"], ["Country", "country"], ["Address", "address"], ["Contact", "contactNumber"], ["Email", "email"], ["Check-in", "checkInTime"], ["Check-out", "checkOutTime"]];
    return (
        <div>
            <div className="page-header"><div><div className="page-title">Hotel Overview</div><div className="page-sub">Core hotel information</div></div>{!editing ? <Btn variant="secondary" onClick={() => setEditing(true)}>Edit</Btn> : <div style={{ display: "flex", gap: 8 }}><Btn onClick={() => { onSave(d); setEditing(false); }}>Save</Btn><Btn variant="secondary" onClick={() => { setD(hotel); setEditing(false); }}>Cancel</Btn></div>}</div>
            <div className="card">
                {editing ? <div className="card-body"><div className="grid-2" style={{ marginBottom: 16 }}>{fields.map(([lbl, key]) => <Field label={lbl} key={key}><Inp value={String(d[key])} onChange={s(key)} type={String(key).includes("Time") ? "time" : "text"} /></Field>)}</div><Field label="Star Rating"><div style={{ display: "flex", gap: 4, paddingTop: 4 }}>{[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => setD(p => ({ ...p, starRating: n }))} style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer", color: n <= d.starRating ? "#f59e0b" : "#d1d5db" }}>★</button>)}</div></Field></div>
                    : <div className="overview-grid">{[...fields, ["Star Rating", "starRating"] as [string, keyof Hotel]].map(([lbl, key]) => <div className="overview-cell" key={key}><div className="overview-cell-label">{lbl}</div><div className="overview-cell-value">{key === "starRating" ? <span style={{ color: "#f59e0b", fontSize: 18 }}>{"★".repeat(Number(hotel[key]))}{"☆".repeat(5 - Number(hotel[key]))}</span> : String(hotel[key])}</div></div>)}</div>}
            </div>
        </div>
    );
}

// ── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
    const [page, setPage] = useState("dashboard");
    const [collapsed, setCollapsed] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [hotel, setHotel] = useState<Hotel>(MOCK_HOTEL);
    const [roomTypes, setRoomTypes] = useState<Room[]>([]);
    const [pricing, setPricing] = useState<Record<string, Pricing>>(MOCK_PRICING);
    const [availability, setAvailability] = useState<Record<string, Availability>>(MOCK_AVAIL);
    const [amenityCats, setAmenityCats] = useState<AmenityCat[]>(DEFAULT_CATS);
    const [currency, setCurrency] = useState("USD");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [hkTasks, setHkTasks] = useState<HousekeepingTask[]>([]);
    const [maintenance, setMaintenance] = useState<MaintenanceItem[]>([]);
    const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [rooms, setRooms] = useState<RoomItem[]>([]);
    const [seeded, setSeeded] = useState(false);

    // Load data from APIs
    useEffect(() => { fetch("/api/room-types").then(r => r.json()).then(d => { if (d.length) setRoomTypes(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/amenities").then(r => r.json()).then(d => { if (d.length) setAmenityCats(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/bookings").then(r => r.json()).then(d => setBookings(d)).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/customers").then(r => r.json()).then(d => setCustomers(d)).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/meal-plans").then(r => r.json()).then(d => { if (d.length) setMealPlans(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/housekeeping").then(r => r.json()).then(d => setHkTasks(d)).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/maintenance").then(r => r.json()).then(d => setMaintenance(d)).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/pricing-rules").then(r => r.json()).then(d => { if (d.length) setPricingRules(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/staff").then(r => r.json()).then(d => { if (d.length) setStaff(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/rooms").then(r => r.json()).then(d => { if (d.length) setRooms(d); }).catch(() => { }); }, []);

    // Ctrl+K search
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(o => !o); } };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, []);

    const runSeed = async () => {
        const res = await fetch("/api/seed");
        const data = await res.json();
        if (data.success) {
            const [b, c, mp, hk, mn, pr, st, rm, am, ri] = await Promise.all([
                fetch("/api/bookings").then(r => r.json()),
                fetch("/api/customers").then(r => r.json()),
                fetch("/api/meal-plans").then(r => r.json()),
                fetch("/api/housekeeping").then(r => r.json()),
                fetch("/api/maintenance").then(r => r.json()),
                fetch("/api/pricing-rules").then(r => r.json()),
                fetch("/api/staff").then(r => r.json()),
                fetch("/api/room-types").then(r => r.json()),
                fetch("/api/amenities").then(r => r.json()),
                fetch("/api/rooms").then(r => r.json()),
            ]);
            setBookings(b); setCustomers(c); if (mp.length) setMealPlans(mp);
            setHkTasks(hk); setMaintenance(mn); if (pr.length) setPricingRules(pr);
            if (st.length) setStaff(st);
            if (rm.length) setRoomTypes(rm);
            if (am.length) setAmenityCats(am);
            if (ri.length) setRooms(ri);
            setSeeded(true);
        }
    };

    // Booking actions
    const addBooking = async (b: Booking) => {
        await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
        setBookings(p => [...p, b]);
        // Sync rooms status
        fetch("/api/rooms").then(r => r.json()).then(d => { if (d.length) setRooms(d); }).catch(() => { });
    };
    const updateBooking = async (b: Booking) => {
        await fetch("/api/bookings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
        setBookings(p => p.map(x => x.id === b.id ? b : x));
        // Sync rooms status
        fetch("/api/rooms").then(r => r.json()).then(d => { if (d.length) setRooms(d); }).catch(() => { });
    };
    const deleteBooking = async (id: string) => { await fetch(`/api/bookings?id=${id}`, { method: "DELETE" }); setBookings(p => p.filter(x => x.id !== id)); };

    // Customer actions
    const addCustomer = async (c: Customer) => { await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) }); setCustomers(p => [...p, c]); };
    const updateCustomer = async (c: Customer) => { await fetch("/api/customers", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) }); setCustomers(p => p.map(x => x.id === c.id ? c : x)); };

    // Room Type actions
    const addRoomType = async (r: Room) => {
        await fetch("/api/room-types", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
        setRoomTypes(p => [...p, r]);
    };
    const editRoomType = async (r: Room) => {
        await fetch("/api/room-types", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
        setRoomTypes(p => p.map(x => x.id === r.id ? r : x));
    };
    const deleteRoomType = async (id: string) => {
        await fetch(`/api/room-types?id=${id}`, { method: "DELETE" });
        setRoomTypes(p => p.filter(x => x.id !== id));
    };

    // Rooms actions
    const addRoom = async (r: RoomItem) => {
        await fetch("/api/rooms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
        setRooms(p => [...p, r]);
    };
    const updateRoom = async (r: RoomItem) => {
        await fetch("/api/rooms", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
        setRooms(p => p.map(x => x.id === r.id ? r : x));
    };
    const deleteRoom = async (id: string) => {
        await fetch(`/api/rooms?id=${id}`, { method: "DELETE" });
        setRooms(p => p.filter(x => x.id !== id));
    };

    // Housekeeping update
    const updateHkTask = async (t: HousekeepingTask) => { await fetch("/api/housekeeping", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) }); setHkTasks(p => p.map(x => x.id === t.id ? t : x)); };

    // Maintenance actions
    const addMaintenance = async (item: MaintenanceItem) => { await fetch("/api/maintenance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }); setMaintenance(p => [...p, item]); };
    const updateMaintenance = async (item: MaintenanceItem) => { await fetch("/api/maintenance", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }); setMaintenance(p => p.map(x => x.id === item.id ? item : x)); };

    // Staff actions
    const addStaff = async (s: StaffMember) => { await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) }); setStaff(p => [...p, s]); };
    const updateStaff = async (s: StaffMember) => { await fetch("/api/staff", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) }); setStaff(p => p.map(x => x.id === s.id ? s : x)); };
    const deleteStaff = async (id: string) => { await fetch(`/api/staff?id=${id}`, { method: "DELETE" }); setStaff(p => p.filter(x => x.id !== id)); };

    // Meal plan actions
    const addMealPlan = async (mp: MealPlan) => { await fetch("/api/meal-plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mp) }); setMealPlans(p => [...p, mp]); };
    const updateMealPlan = async (mp: MealPlan) => { await fetch("/api/meal-plans", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mp) }); setMealPlans(p => p.map(x => x.id === mp.id ? mp : x)); };
    const deleteMealPlan = async (id: string) => { await fetch(`/api/meal-plans?id=${id}`, { method: "DELETE" }); setMealPlans(p => p.filter(x => x.id !== id)); };

    // Quick check-in
    const handleCheckIn = (bookingId: string, roomNumber: string, mealPlanId: string) => {
        const mp = mealPlans.find(m => m.id === mealPlanId);
        updateBooking({ ...bookings.find(b => b.id === bookingId)!, roomNumber, mealPlanId, mealPlanCode: mp?.code ?? "", status: "checked-in", checkInActual: new Date().toISOString() });
    };

    const pageLabel = NAV_GROUPS.flatMap(g => g.items).find(n => n.id === page)?.label ?? "Dashboard";
    const effectiveRooms = roomTypes;

    return (
        <>
            <GlobalStyles />
            {searchOpen && <SearchOverlay bookings={bookings} customers={customers} rooms={effectiveRooms} onClose={() => setSearchOpen(false)} onNav={p => { setPage(p); setSearchOpen(false); }} />}
            <div className="app-shell">
                <Sidebar page={page} onNav={setPage} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} hotelName={hotel.name} mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />
                <div className="main-area">
                    {/* Topbar */}
                    <div className="topbar">
                        <div className="topbar-left">
                            {/* Hamburger — visible on mobile only */}
                            <button className="mobile-menu-btn" onClick={() => setMobileNavOpen(o => !o)} aria-label="Open navigation">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                            </button>
                            <div className="topbar-breadcrumb">
                                <span className="hide-mobile">{hotel.name}</span>
                                <span className="topbar-breadcrumb-active">{pageLabel}</span>
                            </div>
                        </div>
                        <div className="topbar-right">
                            {/* Seed button */}
                            {!seeded && bookings.length === 0 && <button className="btn btn-sm btn-warn" onClick={runSeed}>🌱 Load Demo Data</button>}
                            <div className="search-trigger" onClick={() => setSearchOpen(true)}>
                                <Ic.Search />
                                <span className="search-label-desktop">Search <kbd>⌘K</kbd></span>
                            </div>
                            <div className="topbar-info-badges hide-tablet">
                                <span className="star-rating">{"★".repeat(hotel.starRating)}</span>
                                <span className="location-text">{hotel.city}, {hotel.country}</span>
                            </div>
                            <span className="live-badge"><span className="live-dot" />Live</span>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="page-content">
                        {page === "dashboard" && <Dashboard hotel={hotel} rooms={effectiveRooms} availability={availability} bookings={bookings} customers={customers} hkTasks={hkTasks} maintenance={maintenance} onNav={setPage} />}
                        {page === "bookings" && <BookingsPage bookings={bookings} customers={customers} roomTypes={effectiveRooms} rooms={rooms} mealPlans={mealPlans} onAdd={addBooking} onUpdate={updateBooking} onDelete={deleteBooking} />}
                        {page === "checkin" && <CheckInPage bookings={bookings} customers={customers} rooms={effectiveRooms} mealPlans={mealPlans} availability={availability} onCheckIn={handleCheckIn} />}
                        {page === "customers" && <CustomersPage customers={customers} bookings={bookings} mealPlans={mealPlans} onAdd={addCustomer} onUpdate={updateCustomer} />}
                        {page === "room-types" && <RoomManagement rooms={effectiveRooms} amenityCats={amenityCats} onAdd={addRoomType} onEdit={editRoomType} onDelete={deleteRoomType} />}
                        {page === "rooms" && <RoomsPage inventory={rooms} rooms={effectiveRooms} onAdd={addRoom} onUpdate={updateRoom} onDelete={deleteRoom} />}
                        {page === "meals" && <MealPlansPage mealPlans={mealPlans} bookings={bookings} onAdd={addMealPlan} onUpdate={updateMealPlan} onDelete={deleteMealPlan} />}
                        {page === "hk" && <HousekeepingPage tasks={hkTasks} onUpdate={updateHkTask} />}
                        {page === "maint" && <MaintenancePage items={maintenance} staff={staff} onAdd={addMaintenance} onUpdate={updateMaintenance} />}
                        {page === "staff" && <StaffPage staff={staff} onAdd={addStaff} onUpdate={updateStaff} onDelete={deleteStaff} />}
                        {page === "reports" && <ReportsPage bookings={bookings} rooms={effectiveRooms} mealPlans={mealPlans} hkTasks={hkTasks} />}
                        {page === "pricing" && <PricingPage rooms={effectiveRooms} pricing={pricing} setPricing={setPricing} pricingRules={pricingRules} setPricingRules={setPricingRules} currency={currency} setCurrency={setCurrency} />}
                        {page === "avail" && <AvailPage rooms={effectiveRooms} availability={availability} setAvailability={setAvailability} />}
                        {page === "amenity" && <AmenityManager cats={amenityCats} setCats={setAmenityCats} />}
                        {page === "overview" && <HotelOverview hotel={hotel} onSave={setHotel} />}
                    </div>
                </div>
            </div>
        </>
    );
}
