"use client";
import React from "react";

export default function About() {
  return (
    <section id="about" style={{ padding: "112px 0", background: "#0E0E0E", overflow: "hidden" }}>
      <div className="max-w about-grid" id="about-grid">
        <div className="about-imgs">
          <div className="about-gold-bar"></div>
          <div className="about-main-img fade-in-up visible">
            <img
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800"
              alt="Hotel Grand Eagle Lobby"
              loading="lazy"
              style={{ width: "100%", height: "110%", marginTop: "-5%", objectFit: "cover" }}
            />
            <div className="about-img-overlay"></div>
          </div>
          <div className="about-accent-img fade-in-up visible">
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800"
              alt="Pool"
              loading="lazy"
            />
          </div>
          <div className="about-stat-card fade-in-up visible">
            <div className="about-stat-num font-display">2001</div>
            <div className="about-stat-label">Est. in Jaipur</div>
          </div>
        </div>
        <div>
          <div className="section-eyebrow fade-in-up visible">
            <span className="line"></span>
            <span>Our Philosophy</span>
          </div>
          <h2 className="section-title fade-in-up visible" style={{ marginBottom: "28px" }}>
            A story written<br />
            in <em>gold threads</em>
          </h2>
          <div className="about-text">
            <p className="fade-in-up visible">
              Hotel Grand Eagle was conceived as a destination where tradition meets timeless elegance. 
              Born from a reverence for Rajasthani craftsmanship and the high standards of boutique hospitality.
            </p>
            <p className="fade-in-up visible">
              Every texture, scent, and experience has been thoughtfully considered. Because we believe true luxury
              is not about excess — it is about the quiet perfection of detail.
            </p>
          </div>
          <div className="pillars">
            <div className="pillar fade-in-up visible">
              <div className="pillar-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </div>
              <div>
                <div className="pillar-title">Uncompromising Excellence</div>
                <div className="pillar-desc">
                  Every element chosen to exceed expectation — from thread count to turndown ritual.
                </div>
              </div>
            </div>
            <div className="pillar fade-in-up visible">
              <div className="pillar-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
              <div>
                <div className="pillar-title">Heartfelt Hospitality</div>
                <div className="pillar-desc">
                  Our team doesn't just serve — they connect, anticipate, and genuinely care.
                </div>
              </div>
            </div>
            <div className="pillar fade-in-up visible">
              <div className="pillar-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div className="pillar-title">Sustainable Luxury</div>
                <div className="pillar-desc">
                  Responsible practices woven into every decision, without compromise on comfort.
                </div>
              </div>
            </div>
            <div className="pillar fade-in-up visible">
              <div className="pillar-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div>
                <div className="pillar-title">Award-Winning Design</div>
                <div className="pillar-desc">
                  Rajasthani heritage celebrated with a globally recognized modern sensibility.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
