"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Room } from "../../components/types";

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/room-types")
            .then(r => r.json())
            .then(d => {
                if (Array.isArray(d)) setRooms(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (loading || rooms.length === 0) return;

        // Handle animations for dynamically loaded content
        const timeoutId = setTimeout(() => {
            const fadeEls = document.querySelectorAll('.fade-in-up');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        (entry.target as HTMLElement).style.transitionDelay = (i * 0.05) + 's';
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            fadeEls.forEach(el => observer.observe(el));
            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [rooms, loading]);

    return (
        <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, paddingBottom: 112 }}>
            <div className="max-w">
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span className="line"></span>
                        <span>Accommodations</span>
                        <span className="line"></span>
                    </div>
                    <h1 className="section-title fade-in-up" style={{ fontSize: "clamp(40px, 8vw, 84px)" }}>
                        Rooms & <em>Suites</em>
                    </h1>
                    <p className="fade-in-up" style={{ color: "var(--ivory-dim)", marginTop: 24, fontSize: 15, maxWidth: 600, margin: "24px auto 0", lineHeight: 1.8 }}>
                        Discover our collection of meticulously designed sanctuaries, where every detail is crafted for your ultimate comfort and repose.
                    </p>
                </div>

                {/* Rooms Content */}
                {loading ? (
                    <div className="fade-in-up" style={{ textAlign: "center", padding: "100px 0", color: "var(--gold)" }}>
                        <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading Sanctuary...</div>
                    </div>
                ) : rooms.length === 0 ? (
                    <div className="fade-in-up" style={{ textAlign: "center", padding: "100px 0", color: "var(--ivory-dim)" }}>
                        No suites available at this moment. Please check back soon.
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 32 }}>
                        {rooms.map((room) => (
                            <div key={room.id} className="room-card fade-in-up" style={{ width: "100%", margin: 0 }}>
                                <div className="room-img-wrap" style={{ height: 260, position: 'relative', overflow: 'hidden' }}>
                                    <div className="featured-badge" style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>{room.roomCategory}</div>
                                    <img 
                                        src={room.images?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800"} 
                                        alt={room.roomName} 
                                        loading="lazy" 
                                    />
                                    <div className="room-img-overlay"></div>
                                    <div className="room-price">
                                        ₹{room.basePrice?.toLocaleString() ?? "N/A"} <span>/night</span>
                                    </div>
                                </div>
                                <div className="room-body">
                                    <div className="room-cat">{room.roomCategory}</div>
                                    <div className="room-name font-display">{room.roomName}</div>
                                    <div className="room-meta">
                                        <div className="room-meta-item">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                            </svg>
                                            {room.roomSize} m²
                                        </div>
                                        <div className="room-meta-dot"></div>
                                        <div className="room-meta-item">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                <polyline points="9,22 9,12 15,12 15,22" />
                                            </svg>
                                            {room.bedType}
                                        </div>
                                    </div>
                                    <div className="tags">
                                        <span className="tag">City View</span>
                                        <span className="tag">Free Wi-Fi</span>
                                        <span className="tag">Mini Bar</span>
                                        <span className="tag">24hr Service</span>
                                    </div>
                                    <Link href={`/rooms`} className="btn-room" style={{ textDecoration: "none" }}>
                                        View Details
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

