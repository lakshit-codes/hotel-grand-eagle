"use client";
import React, { useState } from "react";
import NearbyMap from "../components/NearbyMap";

interface Attraction {
    name: string;
    timing: string;
}

interface Category {
    id: string;
    title: string;
    items: Attraction[];
}

const CATEGORIES: Category[] = [
    {
        id: "airport",
        title: "AIRPORT",
        items: [
            { name: "Jaipur International Airport", timing: "20min" }
        ]
    },
    {
        id: "landmark",
        title: "LANDMARK",
        items: [
            { name: "D'Mart", timing: "3 min" },
            { name: "Sitapura Industrial Area", timing: "3 min" },
            { name: "Viva city mall", timing: "4 min" },
            { name: "Capital Mall", timing: "5 min" },
            { name: "Akshay Patra Temple", timing: "5 min" },
            { name: "Jagatpura Railway Station", timing: "8 min" }
        ]
    },
    {
        id: "schools",
        title: "School's & Colleges",
        items: [
            { name: "JECRC University", timing: "5 min" },
            { name: "Poornima University", timing: "5 min" },
            { name: "VIT University", timing: "5 min" },
            { name: "Gyan vihar University", timing: "4 min" },
            { name: "Maharaja sawai bhawani Singh school", timing: "8 min" },
            { name: "SRN International school", timing: "5 min" },
            { name: "Jaishree Periwal Global school", timing: "5 min" },
            { name: "Ryan International school", timing: "5 min" }
        ]
    },
    {
        id: "hospitals",
        title: "Hospitals",
        items: [
            { name: "Bombay hospital", timing: "3 min" },
            { name: "Jeevan rekha hospital", timing: "4 min" },
            { name: "Medical college hospital", timing: "5 min" },
            { name: "Mahatma Gandhi hospital", timing: "5 min" },
            { name: "Narayana multi speciality hospital", timing: "8 min" }
        ]
    }
];

export default function NearbyPage() {
    const [activeCategory, setActiveCategory] = useState<string>("airport");

    return (
        <div style={{ 
            background: "var(--midnight)", 
            minHeight: "100vh", 
            paddingTop: "160px", 
            paddingBottom: "112px",
            fontFamily: "var(--font-primary)",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Background Branding Text */}
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
                Nearby Attractions
            </div>

            <div className="max-w" style={{ position: "relative", zIndex: 1 }}>
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="section-eyebrow fade-in-up visible" style={{ justifyContent: "center" }}>
                        <span className="line"></span>
                        <span>Local Discoveries</span>
                        <span className="line"></span>
                    </div>
                    <h1 className="section-title fade-in-up visible" style={{ fontSize: "clamp(32px, 6vw, 64px)", textTransform: "uppercase" }}>
                        Nearby <em>Attractions</em>
                    </h1>
                </div>

                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1.2fr 1fr", 
                    gap: "60px", 
                    alignItems: "start" 
                }}>
                    {/* Left: Accordion */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat.id;
                            return (
                                <div 
                                    key={cat.id}
                                    onMouseEnter={() => setActiveCategory(cat.id)}
                                    style={{
                                        background: isActive ? "var(--gold)" : "rgba(255,255,255,0.03)",
                                        border: isActive ? "1px solid var(--gold)" : "1px solid rgba(212,168,87,0.1)",
                                        borderRadius: "2px",
                                        padding: isActive ? "32px 40px" : "24px 40px",
                                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                        cursor: "default",
                                        color: isActive ? "var(--midnight)" : "var(--ivory)"
                                    }}
                                >
                                    <div style={{ 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center",
                                        marginBottom: isActive ? "24px" : "0"
                                    }}>
                                        <h2 style={{ 
                                            margin: 0, 
                                            fontSize: "13px", 
                                            fontWeight: 700, 
                                            letterSpacing: "0.15em",
                                            textTransform: "uppercase"
                                        }}>
                                            {cat.title}
                                        </h2>
                                        {!isActive && (
                                            <div style={{ 
                                                width: "20px", 
                                                height: "20px", 
                                                display: "flex", 
                                                alignItems: "center", 
                                                justifyContent: "center",
                                                color: "var(--gold)",
                                                opacity: 0.6
                                            }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {isActive && (
                                        <ul style={{ 
                                            listStyle: "none", 
                                            padding: 0, 
                                            margin: 0,
                                            animation: "fadeIn 0.5s ease-out"
                                        }}>
                                            {cat.items.map((item, idx) => (
                                                <li key={idx} style={{ 
                                                    marginBottom: "14px", 
                                                    fontSize: "14px", 
                                                    display: "flex",
                                                    alignItems: "start",
                                                    lineHeight: "1.6"
                                                }}>
                                                    <span style={{ 
                                                        marginRight: "16px", 
                                                        marginTop: "10px", 
                                                        width: "30px", 
                                                        height: "1px", 
                                                        background: "var(--midnight)", 
                                                        opacity: 0.3, 
                                                        flexShrink: 0 
                                                    }} />
                                                    <span>
                                                        <strong style={{ fontWeight: 700 }}>{item.name}</strong>
                                                        <span style={{ opacity: 0.7, marginLeft: "8px" }}>— {item.timing}</span>
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Map */}
                    <div className="fade-in-up visible" style={{ 
                        position: "sticky", 
                        top: "160px",
                        height: "650px", 
                        borderRadius: "2px", 
                        overflow: "hidden",
                        border: "1px solid rgba(212,168,87,0.2)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
                    }}>
                        <NearbyMap places={[]} />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @media (max-width: 1024px) {
                    .max-w {
                        grid-template-columns: 1fr !important;
                    }
                    div[style*="position: sticky"] {
                        position: relative !important;
                        top: 0 !important;
                        margin-top: 48px;
                        height: 500px !important;
                    }
                }
            `}</style>
        </div>
    );
}


