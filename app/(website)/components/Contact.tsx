"use client";
import React, { useState, useEffect } from "react";

export default function Contact() {
  const [formSent, setFormSent] = useState(false);
  const [hotel, setHotel] = useState<any>(null);

  useEffect(() => {
    fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <section id="contact" style={{ padding: "112px 0", position: "relative", overflow: "hidden" }}>
      <div className="contact-bg">
        <img
          src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800"
          alt=""
        />
        <div className="contact-bg-grad"></div>
      </div>
      <div className="max-w contact-grid" style={{ position: "relative", zIndex: 1 }}>
        <div>
          <div className="section-eyebrow fade-in-up visible">
            <span className="line"></span>
            <span>Reservations</span>
          </div>
          <h2 className="section-title fade-in-up visible" style={{ marginBottom: "28px" }}>
            Begin your<br />
            <em>journey here</em>
          </h2>
          <p
            className="fade-in-up visible"
            style={{ fontSize: "14px", color: "var(--ivory-dim)", lineHeight: 1.8, maxWidth: "320px", marginBottom: "40px" }}
          >
            Our reservations team is available around the clock to craft your perfect stay. Reach out and let us curate
            the experience you deserve.
          </p>

          <div className="contact-details">
            <div className="contact-item fade-in-up visible">
              <div className="contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a857" strokeWidth="1.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 0h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.55-.55a2 2 0 012.11-.45c.91.36 1.85.6 2.81.72A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <span className="contact-lbl">Direct Line</span>
                <span className="contact-val">{hotel?.phone || '+91 63678 50548'}</span>
              </div>
            </div>
            <div className="contact-item fade-in-up visible">
              <div className="contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a857" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <span className="contact-lbl">Email</span>
                <span className="contact-val">{hotel?.email || 'reservations@hotelgrandeagle.com'}</span>
              </div>
            </div>
            <div className="contact-item fade-in-up visible">
              <div className="contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a857" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <span className="contact-lbl">Address</span>
                <span className="contact-val">{hotel?.address || '12 Palace Road, Jaipur, Rajasthan 302001'}</span>
              </div>
            </div>
            <div className="contact-item fade-in-up visible">
              <div className="contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4a857" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <div>
                <span className="contact-lbl">Concierge</span>
                <span className="contact-val">24 hours, 7 days a week</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="form-card fade-in-up visible">
            <div className="form-subtitle">Enquiry Form</div>
            <div className="form-title font-display">Tell us about your visit</div>
            {!formSent ? (
              <form id="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <input className="form-input" type="text" placeholder="Full Name" required />
                  <input className="form-input" type="email" placeholder="Email Address" required />
                </div>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="Phone Number"
                  style={{ marginBottom: "12px", display: "block" }}
                />
                <div className="form-row">
                  <div>
                    <label className="input-label">Check In</label>
                    <input className="form-input" type="date" />
                  </div>
                  <div>
                    <label className="input-label">Check Out</label>
                    <input className="form-input" type="date" />
                  </div>
                </div>
                <select className="form-select" style={{ marginBottom: "12px", display: "block" }} defaultValue="">
                  <option value="" disabled>
                    Number of Guests
                  </option>
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4 Guests</option>
                  <option>5+ Guests</option>
                </select>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Special requests or questions..."
                ></textarea>
                <button type="submit" className="btn-submit">
                  Send Enquiry
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22,2 15,22 11,13 2,9" />
                  </svg>
                </button>
                <div className="form-note">Our team will respond within 2 hours.</div>
              </form>
            ) : (
              <div className="form-success visible" id="form-success">
                <div className="success-icon">
                  <div className="success-diamond"></div>
                </div>
                <div className="success-title font-display">Thank You</div>
                <p className="success-msg">
                  Your enquiry has reached our reservations team. Expect a personal response within 2 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
