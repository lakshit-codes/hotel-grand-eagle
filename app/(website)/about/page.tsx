"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";
import { Fade } from "../components/hooks";

export default function AboutPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings")
            .then(r => r.json())
            .then(d => { if (d.name) setHotel(d); })
            .catch(() => {});
    }, []);

    return (
        <div style={{ paddingTop: 120, paddingBottom: 112, minHeight: "100vh" }}>
            <div className="vh-max">
                {/* Header */}
                <Fade className="text-center" style={{ marginBottom: 80 }}>
                    <div className="vh-section-eyebrow" style={{ justifyContent: "center" }}>
                        <span className="vh-line" />
                        <span>Our Heritage</span>
                        <span className="vh-line" />
                    </div>
                    <h1 className="vh-section-title">About <em>{hotel?.name || "Hotel Grand Eagle"}</em></h1>
                </Fade>

                {/* Content */}
                <div className="vh-about-grid" style={{ marginBottom: 96 }}>
                    <div>
                        <Fade><h2 className="vh-section-title" style={{ fontSize: 40, marginBottom: 32 }}>Value-focused stay<br />in <em>Jaipur</em></h2></Fade>
                        <div className="vh-about-text">
                            <Fade><p>{hotel?.name || "Hotel Grand Eagle"} is a <strong>value-for-money hotel</strong> offering clean, well-furnished rooms tailored for both business travelers and tourists. Each room is thoughtfully equipped with essentials such as air conditioning, private bathrooms, comfortable chairs, work desks, telephones, televisions, and 24/7 hot and cold water supply — everything you need for a comfortable yet affordable stay.</p></Fade>
                            <Fade><p>Located near <strong>JECC</strong>, major transport hubs, and local food joints, our hotel is perfect for budget-conscious travelers seeking convenience and accessibility. With a focus on cleanliness, functionality, and friendly service, we are the ideal pick for short or extended stays in Jaipur's Sitapura Industrial Area.</p></Fade>
                        </div>
                    </div>
                    <div className="vh-about-imgs">
                        <div className="vh-about-gold-bar" />
                        <Fade>
                            <div className="vh-about-main-img">
                                <img src="https://images.unsplash.com/photo-1542314831-c6a4d14d8376?q=80&w=800" alt="Hotel Exterior" loading="lazy" />
                                <div className="vh-about-img-overlay" />
                            </div>
                        </Fade>
                    </div>
                </div>

                {/* Grid */}
                <div className="vh-pillars" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                    <Fade>
                        <div className="vh-pillar" style={{ flexDirection: "column", alignItems: "center", textAlign: "center", padding: 32 }}>
                            <div className="vh-pillar-icon" style={{ width: 48, height: 48, marginBottom: 16 }}>🥂</div>
                            <div className="vh-pillar-title" style={{ fontSize: 16 }}>Unmatched Hospitality</div>
                            <div className="vh-pillar-desc">Service that anticipates your every need.</div>
                        </div>
                    </Fade>
                    <Fade>
                        <div className="vh-pillar" style={{ flexDirection: "column", alignItems: "center", textAlign: "center", padding: 32 }}>
                            <div className="vh-pillar-icon" style={{ width: 48, height: 48, marginBottom: 16 }}>🛏️</div>
                            <div className="vh-pillar-title" style={{ fontSize: 16 }}>Comfortable Rooms</div>
                            <div className="vh-pillar-desc">Sanctuaries designed for ultimate relaxation.</div>
                        </div>
                    </Fade>
                    <Fade>
                        <div className="vh-pillar" style={{ flexDirection: "column", alignItems: "center", textAlign: "center", padding: 32 }}>
                            <div className="vh-pillar-icon" style={{ width: 48, height: 48, marginBottom: 16 }}>📍</div>
                            <div className="vh-pillar-title" style={{ fontSize: 16 }}>Prime Location</div>
                            <div className="vh-pillar-desc">Situated conveniently in Sitapura Industrial Area.</div>
                        </div>
                    </Fade>
                </div>
            </div>
        </div>
    );
}

