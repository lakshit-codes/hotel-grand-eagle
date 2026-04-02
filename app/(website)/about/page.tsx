"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function AboutPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings")
            .then(r => r.json())
            .then(d => { if (d.name) setHotel(d); })
            .catch(() => {});
        
        // Handle scroll animations
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

    return (
        <div style={{ paddingTop: 160, paddingBottom: 112, background: "var(--midnight)" }}>
            <div className="max-w">
                {/* Section Header */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span className="line" />
                        <span>Our Heritage</span>
                        <span className="line" />
                    </div>
                    <h1 className="section-title fade-in-up" style={{ fontSize: "clamp(40px, 8vw, 84px)" }}>
                        A legacy of <em>excellence</em>
                    </h1>
                </div>

                {/* About Content Grid */}
                <div className="about-grid" style={{ marginBottom: 112 }}>
                    <div className="about-imgs">
                        <div className="about-gold-bar" />
                        <div className="about-main-img fade-in-up">
                            <img 
                                src="https://images.unsplash.com/photo-1542314831-c6a4d14d8376?q=80&w=800" 
                                alt="Grand Eagle Interior" 
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <div className="about-img-overlay" />
                        </div>
                        <div className="about-accent-img fade-in-up">
                            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800" alt="Detail" />
                        </div>
                        <div className="about-stat-card fade-in-up">
                            <div className="about-stat-num font-display">24+</div>
                            <div className="about-stat-label">Years of Luxury</div>
                        </div>
                    </div>
                    
                    <div className="about-text">
                        <h2 className="section-title fade-in-up" style={{ fontSize: 36, marginBottom: 32, lineHeight: 1.2 }}>
                            Reimagining the art of<br /><em>refined living</em>
                        </h2>
                        <p className="fade-in-up">
                            {hotel?.name || "Hotel Grand Eagle"} was established in Jaipur with a single vision: to create a sanctuary where heritage and modernity exist in perfect harmony. Every corner of our property tells a story of craftsmanship, from the hand-carved pillars to the curated art that graces our halls.
                        </p>
                        <p className="fade-in-up">
                            We believe that true luxury is not defined by excess, but by the quiet perfection of a tailored experience. Whether it is the morning light hitting the courtyard or the personalized greeting from our staff, we aim to make every moment spent here feel unique and unforgettable.
                        </p>
                        
                        <div className="pillars" style={{ marginTop: 48 }}>
                            {[
                                { icon: "💎", title: "Luxury Redefined", desc: "Crafting experiences that transcend the ordinary." },
                                { icon: "🏛️", title: "Cultural Depth", desc: "Rooted in the rich traditions of the Pink City." },
                                { icon: "🗝️", title: "Intimate Care", desc: "Personalized service tailored to your lifestyle." }
                            ].map((p, i) => (
                                <div key={i} className="pillar fade-in-up">
                                    <div className="pillar-icon" style={{ fontSize: 18 }}>{p.icon}</div>
                                    <div>
                                        <div className="pillar-title">{p.title}</div>
                                        <div className="pillar-desc">{p.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Additional Vision Section */}
                <div style={{ background: "rgba(212, 168, 87, 0.05)", padding: "100px 40px", textAlign: "center", borderRadius: "1px", border: "1px solid rgba(212, 168, 87, 0.1)" }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span>The Vision</span>
                    </div>
                    <blockquote className="font-display fade-in-up" style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "var(--ivory)", fontStyle: "italic", maxWidth: 800, margin: "24px auto" }}>
                        "We created Grand Eagle as a love letter to Jaipur — a space where guests don't just visit, they belong."
                    </blockquote>
                </div>
            </div>
        </div>
    );
}


