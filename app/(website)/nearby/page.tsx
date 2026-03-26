"use client";
import React, { useEffect, useState } from "react";
import { Hotel, NearbyPlace } from "../../components/types";
import { Fade } from "../components/hooks";

const DEFAULT_IMG = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=60";

export default function NearbyPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [places, setPlaces] = useState<NearbyPlace[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/hotel-settings")
            .then(r => r.json())
            .then(d => { if (d.name) setHotel(d); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        fetch("/api/nearby")
            .then(r => r.json())
            .then(d => { if (Array.isArray(d)) setPlaces(d); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ paddingTop: 120, paddingBottom: 112, minHeight: "100vh" }}>
            <div className="vh-max">
                {/* Header */}
                <Fade className="text-center" style={{ marginBottom: 80 }}>
                    <div className="vh-section-eyebrow" style={{ justifyContent: "center" }}>
                        <span className="vh-line" />
                        <span>Local Discoveries</span>
                        <span className="vh-line" />
                    </div>
                    <h1 className="vh-section-title">Nearby <em>Attractions</em></h1>
                    <p style={{ color: "var(--ivory-dim)", marginTop: 24, fontSize: 14 }}>Explore the cultural vibrance and business hubs surrounding {hotel?.name || "Hotel Grand Eagle"}.</p>
                </Fade>

                {/* Landmarks Grid */}
                {loading ? (
                    <Fade>
                        <div style={{ textAlign: "center", padding: "100px 0" }}>
                            <div style={{ fontSize: 32, marginBottom: 16 }}>🗺️</div>
                            <div style={{ fontSize: 14, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Loading places...</div>
                        </div>
                    </Fade>
                ) : places.length === 0 ? (
                    <Fade>
                        <div style={{ textAlign: "center", padding: "100px 0" }}>
                            <div style={{ fontSize: 32, marginBottom: 16 }}>🗺️</div>
                            <div style={{ fontSize: 14, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase" }}>No nearby places listed yet.</div>
                        </div>
                    </Fade>
                ) : (
                    <div className="vh-gallery-grid" style={{ marginBottom: 96 }}>
                        {places.map((place) => (
                            <Fade key={place.id}>
                                <div style={{ background: "var(--charcoal)", border: "1px solid rgba(201,169,110,0.2)", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                                    <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
                                        <img
                                            src={place.image || DEFAULT_IMG}
                                            alt={place.name}
                                            onError={e => { e.currentTarget.src = DEFAULT_IMG; }}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                                            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                                            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                        />
                                        {place.distance && (
                                            <div style={{ position: "absolute", top: 16, right: 16, background: "var(--dark)", color: "var(--gold)", border: "1px solid var(--gold)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 8px" }}>
                                                {place.distance}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: 32, flex: 1, display: "flex", flexDirection: "column" }}>
                                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "var(--ivory)", marginBottom: 12 }}>{place.name}</h3>
                                        <p style={{ fontSize: 13, color: "var(--ivory-dim)", lineHeight: 1.6, flex: 1 }}>{place.description}</p>
                                    </div>
                                </div>
                            </Fade>
                        ))}
                    </div>
                )}

                {/* Getting Around */}
                <div style={{ borderTop: "1px solid rgba(201,169,110,0.15)", paddingTop: 80 }}>
                    <Fade className="text-center" style={{ marginBottom: 48 }}>
                        <h2 className="vh-section-title" style={{ fontSize: 32 }}>Getting <em>Around</em></h2>
                        <p style={{ color: "var(--ivory-dim)", marginTop: 16, fontSize: 14, maxWidth: 600, margin: "16px auto 0" }}>Sitapura is well-connected to all parts of Jaipur. Whether you prefer public transport, private taxis, or app-based services, we ensure your commute is easy.</p>
                    </Fade>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                        {[
                            { title: "Uber / Ola", text: "Most popular and reliable way to travel. Cabs are available 24/7 at our doorstep." },
                            { title: "E-Rickshaws", text: "Perfect for short distances to JECC or local eateries. Affordable and eco-friendly." },
                            { title: "Private Taxis", text: "Can be arranged at the front desk for full-day city tours or airport transfers." }
                        ].map((m, i) => (
                            <Fade key={i}>
                                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--muted)", padding: 32 }}>
                                    <h4 style={{ color: "var(--gold)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>{m.title}</h4>
                                    <p style={{ fontSize: 13, color: "var(--ivory-dim)", lineHeight: 1.6 }}>{m.text}</p>
                                </div>
                            </Fade>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
