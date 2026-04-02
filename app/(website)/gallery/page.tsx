"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function GalleryPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [lightboxSrc, setLightboxSrc] = useState("");

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

    const openLightbox = (src: string) => { 
        setLightboxSrc(src); 
        document.body.style.overflow = "hidden"; 
    };
    
    const closeLightbox = () => { 
        setLightboxSrc(""); 
        document.body.style.overflow = ""; 
    };

    return (
        <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, paddingBottom: 112 }}>
            <div className="max-w">
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span className="line"></span>
                        <span>Visual Journey</span>
                        <span className="line"></span>
                    </div>
                    <h1 className="section-title fade-in-up" style={{ fontSize: "clamp(40px, 8vw, 84px)" }}>
                        Art of <em>Living</em>
                    </h1>
                    <p className="fade-in-up" style={{ color: "var(--ivory-dim)", marginTop: 24, fontSize: 15, maxWidth: 600, margin: "24px auto 0", lineHeight: 1.8 }}>
                        From our meticulously curated suites to the serene ambiance of our public spaces, explore the visual aesthetic of Hotel Grand Eagle.
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="gallery-grid" style={{ marginBottom: 96 }}>
                    {images.map((img, i) => (
                        <div key={i} className="gallery-item fade-in-up" onClick={() => openLightbox(img)} style={{ aspectRatio: "4/5", cursor: "pointer" }}>
                            <img src={img} alt={`Gallery item ${i + 1}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <div className="gallery-overlay">
                                <div className="gallery-overlay-content">
                                    <div className="gallery-zoom-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--midnight)" strokeWidth="1.5">
                                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                        </svg>
                                    </div>
                                    <span className="gallery-view-text">Enlarge View</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Invitation Section */}
                <div style={{ textAlign: "center", borderTop: "1px solid rgba(212,168,87,0.1)", paddingTop: 112 }}>
                    <h2 className="section-title fade-in-up" style={{ fontSize: 36, marginBottom: 40 }}>
                        Experience the <em>extraordinary</em>
                    </h2>
                    <div className="fade-in-up">
                        <a href="/book" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
                            Secure Your Reservation
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 12 }}>
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Lightbox Implementation */}
            {lightboxSrc && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <img src={lightboxSrc} alt="Gallery Spotlight" style={{ maxWidth: "90vw", maxHeight: "85vh", border: "1px solid var(--gold)" }} />
                    </div>
                </div>
            )}

            <style jsx>{`
                .lightbox-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.95);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(8px);
                    animation: fadeIn 0.4s ease;
                }
                .lightbox-close {
                    position: absolute;
                    top: 40px; right: 40px;
                    background: none; border: none;
                    cursor: pointer; padding: 10px;
                    z-index: 10001;
                }
                .lightbox-content {
                    position: relative;
                    animation: zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}


