"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function TestimonialsPage() {
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

    const testimonials = [
        { 
            name: "Aditi Sharma", 
            text: "Hotel Grand Eagle transcends the concept of a stay. It is an immersive cultural experience delivered through the lens of flawless modern hospitality.",
            role: "Travel Editor",
            location: "Delhi, India",
            img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80",
            rating: 5
        },
        { 
            name: "James Whitmore", 
            text: "The Presidential Suite felt like a private palace. From the moment our butler greeted us to the final handwritten farewell note, every interaction was orchestrated with exceptional care.",
            role: "CEO, Meridian Capital",
            location: "London, UK",
            img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80",
            rating: 5
        },
        { 
            name: "Priya Nair", 
            text: "As an architect who obsesses over space and proportion, walking into Hotel Grand Eagle was like seeing all my ideals made tangible. The design is masterful.",
            role: "Principal Architect",
            location: "Mumbai, India",
            img: "https://images.unsplash.com/photo-1494790108755-2616b12c4c66?w=80",
            rating: 5
        },
        { 
            name: "Vikram Mehta", 
            text: "A sanctuary of quiet luxury. The staff doesn't just serve — they connect and anticipate. Each detail, from the thread count to the turndown ritual, was perfect.",
            role: "Entrepreneur",
            location: "Dubai, UAE",
            img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80",
            rating: 5
        },
        { 
            name: "Anita Sharma", 
            text: "The perfect fusion of Rajasthani heritage and global luxury. The evening courtyard ritual is something I'll remember for a long time.",
            role: "Fashion Designer",
            location: "Milan, Italy",
            img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80",
            rating: 5
        },
        { 
            name: "Sandeep Kumar", 
            text: "Unparalleled service in Jaipur. We've stayed in many properties, but Grand Eagle has a level of personalized care that is rare to find.",
            role: "Managing Director",
            location: "Singapore",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80",
            rating: 5
        }
    ];

    return (
        <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, paddingBottom: 112 }}>
            <div className="max-w">
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span className="line"></span>
                        <span>Guest Stories</span>
                        <span className="line"></span>
                    </div>
                    <h1 className="section-title fade-in-up" style={{ fontSize: "clamp(40px, 8vw, 84px)" }}>
                        Voices of <em>Grand Eagle</em>
                    </h1>
                    <p className="fade-in-up" style={{ color: "var(--ivory-dim)", marginTop: 24, fontSize: 15, maxWidth: 600, margin: "24px auto 0", lineHeight: 1.8 }}>
                        From intimate escapes to grand celebrations, discover the unforgettable moments shared by our distinguished guests.
                    </p>
                </div>

                {/* Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 32 }}>
                    {testimonials.map((t, i) => (
                        <div key={i} className="testi-card fade-in-up" style={{ textAlign: "left", margin: 0, maxWidth: "100%", padding: 40, border: "1px solid rgba(212,168,87,0.1)", background: "var(--charcoal)" }}>
                            <div className="stars" style={{ justifyContent: "flex-start", marginBottom: 20 }}>
                                {[...Array(t.rating)].map((_, i) => <span key={i} className="star">★</span>)}
                            </div>
                            <blockquote className="testi-quote font-display" style={{ fontSize: 20, textAlign: "left", marginBottom: 32 }}>
                                &ldquo;{t.text}&rdquo;
                            </blockquote>
                            <div className="testi-author" style={{ justifyContent: "flex-start" }}>
                                <div className="testi-avatar">
                                    <img src={t.img} alt={t.name} />
                                </div>
                                <div>
                                    <div className="testi-name">{t.name}</div>
                                    <div className="testi-role">{t.role}</div>
                                    <div className="testi-location">{t.location}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Media Strip */}
                <div className="press-strip" style={{ marginTop: 112 }}>
                    <div className="press-label">As Featured In</div>
                    <div className="press-logos">
                        <span className="press-logo">CONDÉ NAST</span>
                        <span className="press-logo">VOGUE INDIA</span>
                        <span className="press-logo">ARCHITECTURAL DIGEST</span>
                        <span className="press-logo">TRAVEL + LEISURE</span>
                        <span className="press-logo">FORBES TRAVEL</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


