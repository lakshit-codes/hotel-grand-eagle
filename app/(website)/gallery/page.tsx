"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";
import { Fade } from "../components/hooks";

export default function GalleryPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
    }, []);

    const images = [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200",
        "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1200",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200",
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200",
        "https://images.unsplash.com/photo-1551882547-ff43c63efe81?q=80&w=1200"
    ];

    const [lightboxSrc, setLightboxSrc] = useState("");
    const openLightbox = (src: string) => { setLightboxSrc(src); document.body.style.overflow = "hidden"; };
    const closeLightbox = () => { setLightboxSrc(""); document.body.style.overflow = ""; };

    return (
        <div style={{ paddingTop: 120, paddingBottom: 112, minHeight: "100vh" }}>
            <div className="vh-max">
                {/* Header */}
                <Fade className="text-center" style={{ marginBottom: 80 }}>
                    <div className="vh-section-eyebrow" style={{ justifyContent: "center" }}>
                        <span className="vh-line" />
                        <span>Visual Journey</span>
                        <span className="vh-line" />
                    </div>
                    <h1 className="vh-section-title">Hospitality <em>Gallery</em></h1>
                    <p style={{ color: "var(--ivory-dim)", marginTop: 24, fontSize: 14 }}>Explore the elegant spaces and premium amenities at {hotel?.name || "Hotel Grand Eagle"}.</p>
                </Fade>

                {/* Gallery Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 80 }}>
                    {images.map((img, i) => (
                        <Fade key={i}>
                            <div className="vh-gallery-item" onClick={() => openLightbox(img)} style={{ aspectRatio: "4/3" }}>
                                <img src={img} alt={`Gallery image ${i + 1}`} loading="lazy" />
                                <div className="vh-gallery-overlay">
                                    <svg className="vh-gallery-zoom" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                                    <span className="vh-gallery-overlay-text">View Full</span>
                                </div>
                            </div>
                        </Fade>
                    ))}
                </div>

                {/* CTA Section */}
                <Fade>
                    <div style={{ textAlign: "center", padding: "64px 0", borderTop: "1px solid rgba(201,169,110,0.15)" }}>
                        <h2 className="vh-section-title" style={{ fontSize: 32, marginBottom: 32 }}>Ready to experience it <em>yourself?</em></h2>
                        <a href="/book" className="vh-btn-primary" style={{ display: "inline-flex" }}>
                            Book Your Stay Now
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6" /></svg>
                        </a>
                    </div>
                </Fade>
            </div>

            {/* Lightbox */}
            {lightboxSrc && (
                <div className="vh-lightbox open" onClick={closeLightbox}>
                    <button className="vh-lightbox-close" onClick={closeLightbox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                    <img src={lightboxSrc} alt="Gallery" onClick={e => e.stopPropagation()} />
                </div>
            )}
        </div>
    );
}

