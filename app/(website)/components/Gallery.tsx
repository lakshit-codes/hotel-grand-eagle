"use client";
import React, { useState, useEffect } from "react";

const FALLBACK_IMAGES = [
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800", alt: "Grand Lobby", label: "Grand Lobby", tall: true },
  { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800", alt: "Infinity Pool", label: "Infinity Pool", tall: false },
  { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800", alt: "Dining Hall", label: "Dining Hall", tall: true },
  { src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800", alt: "Spa Sanctuary", label: "Spa Sanctuary", tall: false },
  { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800", alt: "Garden Suite", label: "Garden Suite", tall: false },
];

export default function Gallery() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [images, setImages] = useState(FALLBACK_IMAGES);

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data.map((img: any, idx: number) => ({
            src: img.url,
            alt: img.label || `Gallery ${idx + 1}`,
            label: img.label || "",
            tall: idx % 3 === 0
          })));
        }
      })
      .catch(() => { /* use fallback */ });
  }, []);

  return (
    <>
      <section id="gallery" style={{ padding: "112px 0" }}>
        <div className="max-w">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", marginBottom: "56px" }}>
            <div>
              <div className="section-eyebrow fade-in-up visible">
                <span className="line"></span>
                <span>Visual Journey</span>
              </div>
              <h2 className="section-title fade-in-up visible">
                Life at <em>Grand Eagle</em>
              </h2>
            </div>
            <p className="fade-in-up visible" style={{ fontSize: "13px", color: "var(--ivory-dim)", maxWidth: "240px", lineHeight: 1.7 }}>
              Glimpses of the spaces and moments that define the Grand Eagle experience.
            </p>
          </div>

          <div className="gallery-grid">
            {images.map((img, idx) => (
              <div key={idx} className={`gallery-item fade-in-up visible ${img.tall ? "tall" : ""}`} onClick={() => setLightboxSrc(img.src)}>
                <img src={img.src} alt={img.alt} loading="lazy" />
                <div className="gallery-overlay">
                  <svg className="gallery-zoom" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span className="gallery-overlay-text font-display">{img.label}</span>
                </div>
                <div className="gallery-corner"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="lightbox open" onClick={() => setLightboxSrc(null)}>
          <button className="lightbox-close" onClick={() => setLightboxSrc(null)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <img src={lightboxSrc} alt="Lightbox View" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
