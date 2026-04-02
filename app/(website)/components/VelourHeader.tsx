"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VelourHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [hotel, setHotel] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener("scroll", handleScroll);
        fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Rooms", href: "/rooms" },
        { label: "About", href: "/about" },
        { label: "Nearby", href: "/nearby" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <>
            <header className={`vh-header${scrolled ? " scrolled" : ""}`}>
                <div className="vh-container">
                    {/* Logo Section */}
                    <Link href="/" className="logo">
                        <img src="/logo.png" alt="HOTEL GRAND EAGLE" style={{ height: "65px", width: "auto", objectFit: "contain" }} />
                    </Link>

                    {/* Desktop Nav - Shifted right */}
                    <nav className="vh-nav">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href} className="vh-nav-link">{l.label}</Link>
                        ))}
                    </nav>

                    {/* Desktop Actions - Right aligned */}
                    <div className="vh-actions">
                        <a href={`tel:${hotel?.phone || '+916367850548'}`} className="vh-phone-link">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 0h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.55-.55a2 2 0 012.11-.45c.91.36 1.85.6 2.81.72A2 2 0 0122 16.92z" />
                            </svg>
                            <span>{hotel?.phone || '+91 63678 50548'}</span>
                        </a>
                        <Link href="/book" className="vh-btn-book">
                            Book Now
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M7 17L17 7M17 7H7M17 7v10" />
                            </svg>
                        </Link>
                        {/* Mobile hamburger */}
                        <button className="vh-hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="vh-mobile-menu" onClick={() => setMobileOpen(false)}>
                    <button 
                        style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "var(--ivory-dim)", cursor: "pointer" }} 
                        onClick={(e) => { e.stopPropagation(); setMobileOpen(false); }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    {navLinks.map(l => (
                        <Link key={l.href} href={l.href} className="vh-mobile-link" onClick={() => setMobileOpen(false)}>{l.label}</Link>
                    ))}
                    <Link href="/book" className="btn-book" onClick={() => setMobileOpen(false)} style={{ marginTop: 16 }}>
                        Book Now
                    </Link>
                </div>
            )}
        </>
    );
}

