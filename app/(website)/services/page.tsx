"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function ServicesPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
        
        // Handle animations
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
    }, []);

    const services = [
        { i: "🥂", t: "Private Concierge", d: "A dedicated team to curate your itinerary, handle exclusive reservations, and ensure every requirement is met with absolute discretion." },
        { i: "🚙", t: "Luxury Fleet", d: "Travel in comfort and style with our private fleet of chauffeured vehicles, available for city explorations or seamless airport transfers." },
        { i: "🍽️", t: "Epicurean Dining", d: "Experience the finest Rajasthani and global cuisines, prepared by master chefs and served in our signature dining venues or privately in-suite." },
        { i: "🧖", t: "Zenith Spa", d: "Surrender to the expert hands of our therapists with holistic treatments inspired by ancient Ayurvedic traditions and modern wellness science." },
        { i: "🏊", t: "Infinity Pool", d: "Swim above the city skyline in our temperature-controlled infinity pool, offering panoramic views of Jaipur's majestic architecture." },
        { i: "🛎️", t: "24/7 Butler Service", d: "Our trained butlers providing intuitive, personalized attention to every detail of your stay — from unpacking to specialized tea service." },
        { i: "🛡️", t: "Discreet Security", d: "Unobtrusive yet comprehensive security protocols and surveillance ensuring absolute peace of mind for our distinguished guests." },
        { i: "🧺", t: "Artisanal Valet", d: "Expert care for your wardrobe with our premium laundry, pressing, and shoe-shine services, handled with the utmost attention to fabric care." },
        { i: "🎻", t: "Cultural Immersions", d: "Nightly performances of traditional folk music and dance in our central courtyard, celebrating the vibrant soul of Jaipur." }
    ];

    return (
        <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, paddingBottom: 112 }}>
            <div className="max-w">
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span className="line"></span>
                        <span>Experience</span>
                        <span className="line"></span>
                    </div>
                    <h1 className="section-title fade-in-up" style={{ fontSize: "clamp(40px, 8vw, 84px)" }}>
                        Services & <em>Amenities</em>
                    </h1>
                    <p className="fade-in-up" style={{ color: "var(--ivory-dim)", marginTop: 24, fontSize: 15, maxWidth: 600, margin: "24px auto 0", lineHeight: 1.8 }}>
                        At Hotel Grand Eagle, we believe that true luxury lies in the quiet perfection of every detail. Our curated services are designed to offer you an unparalleled retreat.
                    </p>
                </div>

                {/* Services Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 32, marginBottom: 112 }}>
                    {services.map((svc, i) => (
                        <div key={i} className="fade-in-up" style={{ background: "var(--charcoal)", border: "1px solid rgba(212,168,87,0.1)", padding: 48, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(212,168,87,0.05)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 24, border: "1px solid rgba(212,168,87,0.1)" }}>
                                {svc.i}
                            </div>
                            <h3 className="font-display" style={{ fontSize: 26, color: "var(--ivory)", marginBottom: 16 }}>{svc.t}</h3>
                            <p style={{ fontSize: 14, color: "var(--ivory-dim)", lineHeight: 1.7 }}>{svc.d}</p>
                        </div>
                    ))}
                </div>

                {/* Feature Highlight Section */}
                <div className="about-grid" style={{ background: "rgba(212,168,87,0.03)", padding: "100px 40px", border: "1px solid rgba(212,168,87,0.05)" }}>
                    <div>
                        <div className="section-eyebrow fade-in-up">
                            <span className="line"></span>
                            <span>Atmosphere</span>
                        </div>
                        <h2 className="section-title fade-in-up" style={{ fontSize: 42, marginBottom: 32 }}>
                            The soul of<br /><em>exceptional stay</em>
                        </h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {[
                                "Bespoke experiences tailored to your lifestyle",
                                "Harmonious fusion of heritage and modern tech",
                                "Quiet, intimate spaces for work and relaxation",
                                "Award-winning hospitality delivered with heart"
                            ].map((text, idx) => (
                                <div key={idx} className="fade-in-up" style={{ display: "flex", alignItems: "center", gap: 14, color: "var(--ivory-dim)", fontSize: 15 }}>
                                    <span style={{ color: "var(--gold)", fontSize: 18 }}>✓</span> {text}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="fade-in-up">
                        <div className="about-main-img" style={{ height: "100%", minHeight: 400 }}>
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800" alt="Hospitality Scene" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <div className="about-img-overlay" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


