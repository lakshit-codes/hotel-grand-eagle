import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ic } from "./ui";
import { useAdmin } from "./AdminContext";

export const NAV_GROUPS = [
    {
        label: "Operations", items: [
            { id: "dashboard", label: "Dashboard", Icon: Ic.Dashboard, path: "/admin/dashboard" },
            { id: "bookings", label: "Bookings", Icon: Ic.Bookings, path: "/admin/bookings" },
            { id: "customers", label: "Guests", Icon: Ic.Customers, path: "/admin/guests" },
            { id: "reports", label: "Reports & Audit", Icon: Ic.Reports, path: "/admin/reports" },
        ]
    },
    {
        label: "Hotel", items: [
            { id: "room-types", label: "Room Types", Icon: Ic.Rooms, path: "/admin/room-types" },
            { id: "rooms", label: "Rooms", Icon: Ic.Rooms, path: "/admin/rooms" },
            { id: "meals", label: "Meal Plans", Icon: Ic.Meals, path: "/admin/meals" },
            { id: "hk", label: "Housekeeping", Icon: Ic.HK, path: "/admin/hk" },
            { id: "maint", label: "Maintenance", Icon: Ic.Maint, path: "/admin/maint" },
            { id: "staff", label: "Staff", Icon: Ic.Staff, path: "/admin/staff" },
            { id: "testimonials", label: "Testimonials", Icon: Ic.Customers, path: "/admin/testimonials" },
        ]
    },
    {
        label: "Configuration", items: [
            { id: "pricing", label: "Pricing", Icon: Ic.Pricing, path: "/admin/pricing" },
            { id: "avail", label: "Availability", Icon: Ic.Avail, path: "/admin/avail" },
            { id: "amenity", label: "Amenity Manager", Icon: Ic.Amenity, path: "/admin/amenity" },
            { id: "cms", label: "Pages CMS", Icon: Ic.Hotel, path: "/admin/cms" },
            { id: "gallery", label: "Gallery", Icon: Ic.Hotel, path: "/admin/gallery" },
            { id: "overview", label: "Hotel Overview", Icon: Ic.Hotel, path: "/admin/overview" },
            { id: "nearby", label: "Nearby Places", Icon: Ic.Maint, path: "/admin/nearby" },
        ]
    },
];

export function Sidebar() {
    const { collapsed, setCollapsed, mobileNavOpen, setMobileNavOpen } = useAdmin();
    const pathname = usePathname();
    
    return (
        <>
            <div className={`sidebar-overlay ${mobileNavOpen ? "" : "hidden"}`} onClick={() => setMobileNavOpen(false)} />
            <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileNavOpen ? "mobile-open" : ""}`}>
                <div className="sidebar-logo-icon" style={{ background: "none" }}>
                    <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "lighten" }} />
                </div>
                <nav className="sidebar-nav">
                    {NAV_GROUPS.map(group => (
                        <div key={group.label}>
                            <div className="nav-group-label">{group.label}</div>
                            {group.items.map(({ id, label, Icon, path }) => (
                                <Link key={id} href={path} onClick={() => setMobileNavOpen(false)} title={collapsed ? label : ""}
                                    className={`nav-item ${pathname === path ? "active" : ""}`}>
                                    <span className="nav-item-icon"><Icon /></span>
                                    <span className="nav-item-label">{label}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={() => setCollapsed(!collapsed)} className="nav-item">
                        <span className="nav-item-icon"><Ic.Chev r={collapsed} /></span>
                        {!collapsed && <span className="nav-item-label">Collapse</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}

export function SearchOverlay() {
    const { bookings, customers, roomTypes, setPage, setSearchOpen } = useAdmin();
    const [q, setQ] = useState("");
    
    const results = useMemo(() => {
        if (!q.trim()) return [];
        const lq = q.toLowerCase();
        const res: { type: string; main: string; sub: string; path: string }[] = [];
        bookings.filter(b => b.guestName.toLowerCase().includes(lq) || b.bookingRef.toLowerCase().includes(lq)).slice(0, 5)
            .forEach(b => res.push({ type: "Booking", main: `${b.bookingRef} — ${b.guestName}`, sub: `${b.roomTypeName} · ${b.status}`, path: "/admin/bookings" }));
        customers.filter(c => `${c.firstName} ${c.lastName} ${c.email} ${c.aadharNo}`.toLowerCase().includes(lq)).slice(0, 5)
            .forEach(c => res.push({ type: "Guest", main: `${c.firstName} ${c.lastName}`, sub: `${c.nationality} · ${c.loyaltyTier}`, path: "/admin/guests" }));
        roomTypes.filter(r => r.roomName.toLowerCase().includes(lq)).slice(0, 3)
            .forEach(r => res.push({ type: "Room Type", main: r.roomName, sub: `${r.roomCategory} · ₹${r.basePrice.toLocaleString()}/night`, path: "/admin/room-types" }));
        return res.slice(0, 10);
    }, [q, bookings, customers, roomTypes]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchOpen(false); };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [setSearchOpen]);

    return (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
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
                        <Link key={i} href={r.path} className="search-result-item" onClick={() => setSearchOpen(false)}>
                            <span className="search-result-type">{r.type}</span>
                            <div>
                                <div className="search-result-main">{r.main}</div>
                                <div className="search-result-sub">{r.sub}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function Topbar() {
    const { hotel, setMobileNavOpen, setSearchOpen, bookings, runSeed } = useAdmin();
    const pathname = usePathname();
    const pageLabel = NAV_GROUPS.flatMap(g => g.items).find(n => n.path === pathname)?.label ?? "Hotel Admin";

    return (
        <div className="topbar">
            <div className="topbar-left">
                <button className="mobile-menu-btn" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                </button>
                <div className="topbar-breadcrumb">
                    <span className="hide-mobile">{hotel.name}</span>
                    <span className="topbar-breadcrumb-active">{pageLabel}</span>
                </div>
            </div>
            <div className="topbar-right">
                {bookings.length === 0 && <button className="btn btn-sm btn-warn" onClick={runSeed}>🌱 Load Demo Data</button>}
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
    );
}
