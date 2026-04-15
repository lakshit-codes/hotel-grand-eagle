"use client";
import React, { useState, useEffect } from "react";

import type { Testimonial } from "../../components/types";

export default function Testimonials({ data, eyebrow, title, titleEm }: { 
  data?: Testimonial[];
  eyebrow?: string;
  title?: string;
  titleEm?: string;
}) {
  const [dbData, setDbData] = useState<Testimonial[]>([]);
  
  useEffect(() => {
    if (!data) {
      fetch("/api/testimonials")
        .then(r => r.json())
        .then(d => { if (Array.isArray(d)) setDbData(d); })
        .catch(() => {});
    }
  }, [data]);

  const formatStayDate = (ds: string) => {
    if (!ds) return "";
    try {
      const [y, m] = ds.split("-");
      return new Date(Number(y), Number(m) - 1).toLocaleString("default", { month: "long", year: "numeric" });
    } catch (e) { return ds; }
  };

  const testimonials = data && data.length > 0 ? data : (dbData.length > 0 ? dbData : [
    {
      id: "t1",
      text: '"Hotel Grand Eagle transcends the concept of a stay. It is an immersive cultural experience delivered through the lens of flawless modern hospitality."',
      name: "Aditi Sharma",
      location: "Delhi, India",
      stayDate: "2026-03",
      rating: 5,
    },
    {
      id: "t2",
      text: '"The Presidential Suite felt like a private palace. From the moment our butler greeted us to the final handwritten farewell note, every interaction was orchestrated with exceptional care."',
      name: "James Whitmore",
      location: "London, UK",
      stayDate: "2026-02",
      rating: 5,
    },
    {
      id: "t3",
      text: '"As an architect who obsesses over space and proportion, walking into Hotel Grand Eagle was like seeing all my ideals made tangible. The design is masterful."',
      name: "Priya Nair",
      location: "Mumbai, India",
      stayDate: "2026-01",
      rating: 5,
    },
  ]);

  const [currentTesti, setCurrentTesti] = useState(0);
  const [fade, setFade] = useState(true);

  const goNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentTesti((prev) => (prev + 1) % testimonials.length);
      setFade(true);
    }, 200);
  };

  const goPrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentTesti((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setFade(true);
    }, 200);
  };

  const setTesti = (index: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrentTesti(index);
      setFade(true);
    }, 200);
  };

  useEffect(() => {
    const interval = setInterval(goNext, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]); // Added dependency

  useEffect(() => {
    if (currentTesti >= testimonials.length) {
      setCurrentTesti(0);
    }
  }, [testimonials.length]);

  const t = testimonials[currentTesti];

  if (!t) return null;

  return (
    <section id="testimonials">
      <div className="testi-bg-quote font-display">&ldquo;</div>
      <div className="max-w" style={{ position: "relative", zIndex: 1 }}>
        <div className="testi-header">
          <div className="testi-eyebrow">
            <span className="eyebrow-line"></span>
            <span className="eyebrow-text">{eyebrow || "Guest Stories"}</span>
            <span className="eyebrow-line"></span>
          </div>
          <h2 className="section-title fade-in-up visible">
            {title || "Voices of"} <em>{titleEm || "Grand Eagle"}</em>
          </h2>
        </div>

        <div
          className="testi-card"
          style={{
            opacity: fade ? 1 : 0,
            transform: fade ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.3s, transform 0.3s",
            padding: "40px 60px"
          }}
        >
          <div className="stars" style={{ marginBottom: 20 }}>
            {Array.from({ length: t.rating || 5 }).map((_, i) => (
               <span key={i} className="star">★</span>
            ))}
          </div>
          <blockquote className="testi-quote font-display" style={{ fontSize: "1.25rem", marginBottom: 30 }}>{t.text}</blockquote>
          <div className="testi-author" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div className="testi-name" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--gold)" }}>{t.name}</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: "0.9rem", color: "#6b7280" }}>
               <span>{t.location}</span>
               {t.stayDate && (
                 <>
                   <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#d1d5db" }}></span>
                   <span>{formatStayDate(t.stayDate)}</span>
                 </>
               )}
            </div>
          </div>
        </div>

        <div className="testi-controls">
          <button className="testi-btn" onClick={goPrev}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <div className="testi-dots">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`testi-dot ${i === currentTesti ? "active" : ""}`}
                onClick={() => setTesti(i)}
              ></button>
            ))}
          </div>
          <button className="testi-btn" onClick={goNext}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
