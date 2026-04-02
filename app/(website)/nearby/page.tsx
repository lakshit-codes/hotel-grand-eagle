"use client";
import React, { useEffect, useState } from "react";
import { Hotel, NearbyPlace } from "../../components/types";

export default function NearbyPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [places, setPlaces] = useState<NearbyPlace[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/hotel-settings")
            .then(r => r.json())
            .then(d => { if (d.name) setHotel(d); })
            .catch(() => {});
        
        fetch("/api/nearby")
            .then(r => r.json())
            .then(d => { if (Array.isArray(d)) setPlaces(d); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (loading || places.length === 0) return;
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
    }, [places, loading]);

    const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.7611843130764!2d75.8118021!3d26.7838531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dc90cb30907d7%3A0x632594e50accb62a!2sHotel%20Grand%20Eagle!5e0!3m2!1sen!2sin!4v1711982741512!5m2!1sen!2sin";

    return (
        <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, paddingBottom: 112, position: "relative", overflow: "hidden" }}>
            {/* Background Text */}
            <div style={{ 
                position: "absolute", 
                top: 100, 
                left: "50%", 
                transform: "translateX(-50%)", 
                fontSize: "clamp(60px, 15vw, 180px)", 
                fontWeight: 900, 
                color: "rgba(212,168,87,0.03)", 
                whiteSpace: "nowrap", 
                zIndex: 0,
                pointerEvents: "none",
                textTransform: "uppercase"
            }}>
                Nearby Places
            </div>

            <div className="max-w" style={{ position: "relative", zIndex: 1 }}>
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span className="line"></span>
                        <span>Local Discoveries</span>
                        <span className="line"></span>
                    </div>
                    <h1 className="section-title fade-in-up" style={{ fontSize: "clamp(32px, 6vw, 64px)", textTransform: "uppercase" }}>
                        Nearby <em>Attractions</em>
                    </h1>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 40, alignItems: "start" }}>
                    {/* Left Column: Places List */}
                    <div className="fade-in-up">
                        {loading ? (
                            <div style={{ color: "var(--gold)", padding: 40, textAlign: "center" }}>Loading local map...</div>
                        ) : places.length === 0 ? (
                            <div style={{ color: "var(--ivory-dim)", padding: 40, textAlign: "center" }}>No nearby places found.</div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {places.map((place) => (
                                    <div key={place.id} style={{ 
                                        background: "var(--gold)", 
                                        padding: "16px 24px", 
                                        borderRadius: "2px", 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "transform 0.3s ease",
                                        color: "var(--midnight)"
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateX(8px)"}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateX(0px)"}
                                    >
                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: "0.05em" }}>{place.name}</span>
                                            <span style={{ fontSize: 11, opacity: 0.8 }}>- {place.distance}</span>
                                        </div>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Interactive Map */}
                    <div className="fade-in-up" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(212,168,87,0.2)", height: "500px" }}>
                        <iframe
                            src={mapSrc}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

                {/* Getting Around */}
                <div style={{ borderTop: "1px solid rgba(212,168,87,0.1)", marginTop: 112, paddingTop: 80 }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span>The Journey</span>
                    </div>
                    <h2 className="section-title fade-in-up" style={{ fontSize: 32, textAlign: "center", marginBottom: 48 }}>Getting <em>Around</em></h2>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
                        {[
                            { title: "Personal Concierge", text: "Our team can arrange private luxury chauffeured cars for your city tours and transfers." },
                            { title: "App Services", text: "Uber and Ola are readily available in the area for quick and easy independent travel." },
                            { title: "Local Explorer", text: "Short distance commutes to JECC or local shopping are best handled via traditional e-rickshaws." }
                        ].map((m, i) => (
                            <div key={i} className="fade-in-up" style={{ background: "rgba(212,168,87,0.03)", border: "1px solid rgba(212,168,87,0.05)", padding: 32 }}>
                                <h4 style={{ color: "var(--gold)", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>{m.title}</h4>
                                <p style={{ fontSize: 14, color: "var(--ivory-dim)", lineHeight: 1.6 }}>{m.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


