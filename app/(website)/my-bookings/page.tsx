"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        // First check if user is logged in
        fetch("/api/auth/me")
            .then(res => res.json())
            .then(data => {
                if (!data.authenticated) {
                    window.location.href = "/sign-in";
                } else {
                    setUser(data.user);
                    fetchBookings();
                }
            })
            .catch(() => {
                window.location.href = "/sign-in";
            });

        const fetchBookings = () => {
            fetch("/api/my-bookings")
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setBookings(data);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        };
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return { bg: 'rgba(212,168,87,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,168,87,0.3)' };
            case 'checked-in':
                return { bg: 'rgba(100, 200, 100, 0.1)', color: '#88cc88', border: '1px solid rgba(100, 200, 100, 0.3)' };
            case 'checked-out':
                return { bg: 'rgba(200, 192, 176, 0.1)', color: 'var(--ivory-dim)', border: '1px solid rgba(200, 192, 176, 0.3)' };
            case 'cancelled':
            case 'no-show':
                return { bg: 'rgba(255, 100, 100, 0.1)', color: '#ff8888', border: '1px solid rgba(255, 100, 100, 0.3)' };
            default:
                return { bg: 'rgba(200, 192, 176, 0.1)', color: 'var(--ivory-dim)', border: '1px solid rgba(200, 192, 176, 0.3)' };
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, display: "flex", justifyContent: "center" }}>
                <div style={{ color: "var(--gold)", fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading your reservations...</div>
            </div>
        );
    }

    return (
        <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, paddingBottom: 112 }}>
            <div className="max-w">
                
                <div style={{ marginBottom: 60 }}>
                    <div className="section-eyebrow fade-in-up visible">
                        <span className="line"></span>
                        <span>Your Dashboard</span>
                    </div>
                    <h1 className="section-title fade-in-up visible" style={{ fontSize: 48, marginBottom: 16 }}>
                        My <em>Bookings</em>
                    </h1>
                    <p style={{ color: "var(--ivory-dim)", fontSize: 15, maxWidth: 600 }}>
                        Welcome back, {user?.name || "Guest"}. Here you can review all your past and upcoming reservations with Hotel Grand Eagle.
                    </p>
                </div>

                {bookings.length === 0 ? (
                    <div style={{ background: "var(--charcoal)", padding: "60px 40px", textAlign: "center", border: "1px solid rgba(212,168,87,0.15)" }} className="fade-in-up visible">
                        <div style={{ width: 64, height: 64, margin: "0 auto 24px", border: "1px solid rgba(212,168,87,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M19 4H5a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2 3.5-2V6a2 2 0 00-2-2z" />
                                <line x1="8" y1="9" x2="16" y2="9" />
                                <line x1="8" y1="13" x2="14" y2="13" />
                            </svg>
                        </div>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--ivory)", fontWeight: 300, marginBottom: 12 }}>No Bookings Found</h3>
                        <p style={{ color: "var(--ivory-dim)", fontSize: 14, marginBottom: 32 }}>You don't have any past or upcoming reservations with us.</p>
                        <Link href="/book" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "var(--gold)", color: "var(--midnight)", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, textDecoration: "none" }}>
                            Book a Stay
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: 24 }} className="fade-in-up visible">
                        {bookings.map((booking, idx) => {
                            const statusStyle = getStatusStyle(booking.status);
                            return (
                                <div key={booking.id || idx} style={{ background: "var(--charcoal)", border: "1px solid rgba(212,168,87,0.15)", padding: 32 }}>
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid rgba(212,168,87,0.1)" }}>
                                        <div>
                                            <div style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Reference Number</div>
                                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--ivory)", fontWeight: 300 }}>{booking.bookingRef}</div>
                                        </div>
                                        <div style={{ background: statusStyle.bg, color: statusStyle.color, border: statusStyle.border, padding: "6px 12px", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
                                            {booking.status}
                                        </div>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
                                        <div>
                                            <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Room Type</div>
                                            <div style={{ fontSize: 15, color: "var(--ivory)" }}>{booking.roomTypeName || "Standard Room"}</div>
                                            {booking.roomNumber && (
                                                <div style={{ fontSize: 13, color: "var(--gold)", marginTop: 4 }}>Room: {booking.roomNumber}</div>
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Stay Details</div>
                                            <div style={{ fontSize: 15, color: "var(--ivory)" }}>
                                                {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                                            </div>
                                            <div style={{ fontSize: 13, color: "var(--ivory-dim)", marginTop: 4 }}>
                                                {booking.nights} Night{booking.nights > 1 ? 's' : ''} • {booking.adults} Adult{booking.adults > 1 ? 's' : ''}{booking.children > 0 ? `, ${booking.children} Child` : ''}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Total Amount</div>
                                            <div style={{ fontSize: 20, color: "var(--gold)", fontFamily: "'DM Sans', sans-serif" }}>
                                                ₹{booking.grandTotal?.toLocaleString('en-IN') || "0"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}
