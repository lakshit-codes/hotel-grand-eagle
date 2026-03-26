"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";
import { Fade } from "../components/hooks";

export default function ServicesPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
    }, []);

    const services = [
        { i: "📶", t: "Free Wi-Fi", d: "Experience seamless connectivity with our complimentary high-speed internet available throughout the hotel. Perfect for business travelers and streaming enthusiasts alike." },
        { i: "🚗", t: "Free Parking", d: "We provide ample, secure on-site parking for all our guests at no additional cost. Whether you are traveling by bike or car, your vehicle is safe with us." },
        { i: "🤝", t: "24/7 Front Desk", d: "Our dedicated reception team is available around the clock to assist you with check-ins, local recommendations, travel arrangements, and any special requests." },
        { i: "🚌", t: "Easy Access To Transit", d: "Strategically located near the main bus stands and travel hubs, our hotel ensures you spend less time commuting and more time enjoying your stay." },
        { i: "🍽️", t: "In-Room Dining", d: "Enjoy a variety of hygienic and delicious local and continental dishes delivered right to your doorstep. Perfect for those quiet evenings after a long day of travel." },
        { i: "🧺", t: "Laundry & Ironing", d: "Travel light and stay fresh. Our professional laundry and ironing services are available to ensure you always look your best for meetings or sightseeing." },
        { i: "⚡", t: "Uninterrupted Power", d: "With a robust 24/7 power backup system, your comfort is never compromised. Enjoy all amenities without worrying about power outages." },
        { i: "📹", t: "Secure Environment", d: "Your safety is our priority. We maintain 24-hour CCTV surveillance and on-site security personnel to ensure a secure environment for all our guests." },
        { i: "🖨️", t: "Business Services", d: "Need a quick print or a scan? Our front desk offers basic business services including printing, scanning, and courier assistance for our professional guests." }
    ];

    return (
        <div style={{ paddingTop: 120, paddingBottom: 112, minHeight: "100vh" }}>
            <div className="vh-max">
                {/* Header */}
                <Fade className="text-center" style={{ marginBottom: 80 }}>
                    <div className="vh-section-eyebrow" style={{ justifyContent: "center" }}>
                        <span className="vh-line" />
                        <span>Experience</span>
                        <span className="vh-line" />
                    </div>
                    <h1 className="vh-section-title">Services &amp; <em>Amenities</em></h1>
                    <p style={{ color: "var(--ivory-dim)", marginTop: 24, fontSize: 14 }}>Designed for comfort, convenience, and a seamless stay at {hotel?.name || "Hotel Grand Eagle"}.</p>
                </Fade>

                {/* Services Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, marginBottom: 96 }}>
                    {services.map((svc, i) => (
                        <Fade key={i}>
                            <div style={{ background: "var(--charcoal)", border: "1px solid var(--muted)", padding: 40, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(201,169,110,0.1)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 24 }}>
                                    {svc.i}
                                </div>
                                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "var(--ivory)", marginBottom: 16 }}>{svc.t}</h3>
                                <p style={{ fontSize: 13, color: "var(--ivory-dim)", lineHeight: 1.6 }}>{svc.d}</p>
                            </div>
                        </Fade>
                    ))}
                </div>

                {/* Feature Highlight */}
                <div className="vh-about-grid" style={{ background: "#0E0E0E", padding: "64px 40px", border: "1px solid rgba(201,169,110,0.15)" }}>
                    <div>
                        <Fade><div className="vh-section-eyebrow"><span className="vh-line" /><span>Ultimate Comfort</span></div></Fade>
                        <Fade><h2 className="vh-section-title" style={{ fontSize: 40, marginBottom: 32 }}>Why Choose<br /><em>Grand Eagle?</em></h2></Fade>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <Fade><div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--ivory-dim)", fontSize: 14 }}><span style={{ color: "var(--gold)" }}>✓</span> Best hospitality in Sitapura Industrial Area</div></Fade>
                            <Fade><div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--ivory-dim)", fontSize: 14 }}><span style={{ color: "var(--gold)" }}>✓</span> Budget-friendly with premium amenities</div></Fade>
                            <Fade><div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--ivory-dim)", fontSize: 14 }}><span style={{ color: "var(--gold)" }}>✓</span> Exceptionally clean and well-maintained rooms</div></Fade>
                            <Fade><div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--ivory-dim)", fontSize: 14 }}><span style={{ color: "var(--gold)" }}>✓</span> Highly rated customer service</div></Fade>
                        </div>
                    </div>
                    <Fade>
                        <div className="vh-about-main-img" style={{ height: 400 }}>
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800" alt="Hospitality" loading="lazy" />
                            <div className="vh-about-img-overlay" />
                        </div>
                    </Fade>
                </div>
            </div>
        </div>
    );
}

