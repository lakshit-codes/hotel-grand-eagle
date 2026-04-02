"use client";
import React, { useState, useEffect } from "react";

export default function Testimonials() {
  const testimonials = [
    {
      text: '"Hotel Grand Eagle transcends the concept of a stay. It is an immersive cultural experience delivered through the lens of flawless modern hospitality."',
      name: "Aditi Sharma",
      role: "Travel Editor, Condé Nast Traveller India",
      location: "Delhi, India",
      img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80",
    },
    {
      text: '"The Presidential Suite felt like a private palace. From the moment our butler greeted us to the final handwritten farewell note, every interaction was orchestrated with exceptional care."',
      name: "James Whitmore",
      role: "CEO, Meridian Capital",
      location: "London, UK",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80",
    },
    {
      text: '"As an architect who obsesses over space and proportion, walking into Hotel Grand Eagle was like seeing all my ideals made tangible. The design is masterful."',
      name: "Priya Nair",
      role: "Principal Architect, Nair & Partners",
      location: "Mumbai, India",
      img: "https://images.unsplash.com/photo-1494790108755-2616b12c4c66?w=80",
    },
  ];

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
  }, []);

  const t = testimonials[currentTesti];

  return (
    <section id="testimonials">
      <div className="testi-bg-quote font-display">&ldquo;</div>
      <div className="max-w" style={{ position: "relative", zIndex: 1 }}>
        <div className="testi-header">
          <div className="testi-eyebrow">
            <span className="eyebrow-line"></span>
            <span className="eyebrow-text">Guest Stories</span>
            <span className="eyebrow-line"></span>
          </div>
          <h2 className="section-title fade-in-up visible">
            Voices of <em>Grand Eagle</em>
          </h2>
        </div>

        <div
          className="testi-card"
          style={{
            opacity: fade ? 1 : 0,
            transform: fade ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.3s, transform 0.3s",
          }}
        >
          <div className="stars">
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
            <span className="star">★</span>
          </div>
          <blockquote className="testi-quote font-display">{t.text}</blockquote>
          <div className="testi-author">
            <div className="testi-avatar">
              <img src={t.img} alt={t.name} />
            </div>
            <div style={{ textAlign: "left" }}>
              <div className="testi-name">{t.name}</div>
              <div className="testi-role">{t.role}</div>
              <div className="testi-location">{t.location}</div>
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

        <div className="press-strip">
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
    </section>
  );
}
