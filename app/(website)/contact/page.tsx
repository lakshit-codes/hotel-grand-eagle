"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";
import { Fade } from "../components/hooks";

export default function ContactPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [formSent, setFormSent] = useState(false);

    useEffect(() => {
        fetch("/api/hotel-settings")
            .then(r => r.json())
            .then(d => { if (d.name) setHotel(d); })
            .catch(() => {});
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSent(true);
    };

    return (
        <div style={{ paddingTop: 120, paddingBottom: 112, minHeight: "100vh" }}>
            <div className="vh-max">
                {/* Header */}
                <Fade className="text-center" style={{ marginBottom: 80 }}>
                    <div className="vh-section-eyebrow" style={{ justifyContent: "center" }}>
                        <span className="vh-line" />
                        <span>Get In Touch</span>
                        <span className="vh-line" />
                    </div>
                    <h1 className="vh-section-title">Contact <em>Us</em></h1>
                    <p style={{ color: "var(--ivory-dim)", marginTop: 24, fontSize: 14 }}>We are here to help make your stay exceptional.</p>
                </Fade>

                {/* Contact Grid */}
                <div className="vh-contact-grid">
                    <div>
                        <Fade><h2 className="vh-section-title" style={{ fontSize: 32, marginBottom: 28 }}>Reach<br /><em>Out</em></h2></Fade>
                        <Fade><p style={{ fontSize: 14, color: "var(--ivory-dim)", lineHeight: 1.8, maxWidth: 320, marginBottom: 40 }}>
                            Whether you have questions about your booking or need assistance planning your visit, our team is available around the clock.
                        </p></Fade>
                        <div className="vh-contact-details">
                            {[
                                { icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>, label: "Address", val: "Sitapura Industrial Area, Jaipur, Rajasthan" },
                                { icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 0h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.55-.55a2 2 0 012.11-.45c.91.36 1.85.6 2.81.72A2 2 0 0122 16.92z" />, label: "Direct Line", val: hotel?.contactNumber ? `+91 ${hotel.contactNumber}` : "+91 63678 50548" },
                                { icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>, label: "Email", val: hotel?.email || "reservations@hotelgrandeagle.com" },
                            ].map((item, i) => (
                                <Fade key={i}>
                                    <div className="vh-contact-item">
                                        <div className="vh-contact-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">{item.icon}</svg>
                                        </div>
                                        <div>
                                            <span className="vh-contact-lbl" style={{ color: "var(--ivory-dim)" }}>{item.label}</span>
                                            <span className="vh-contact-val" style={{ color: "var(--ivory)" }}>{item.val}</span>
                                        </div>
                                    </div>
                                </Fade>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <Fade>
                        <div className="vh-form-card">
                            <div className="vh-form-subtitle">Enquiry Form</div>
                            <div className="vh-form-title">Send a Message</div>
                            {formSent ? (
                                <div style={{ padding: "40px 0", textAlign: "center" }}>
                                    <div style={{ width: 56, height: 56, border: "1px solid rgba(201,169,110,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                                        <div style={{ width: 10, height: 10, background: "var(--gold)", transform: "rotate(45deg)" }} />
                                    </div>
                                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "var(--gold)", fontWeight: 300, marginBottom: 10 }}>Thank You</div>
                                    <p style={{ fontSize: 13, color: "var(--ivory-dim)", lineHeight: 1.7, maxWidth: 260, margin: "0 auto" }}>We have received your message and will be in touch shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="vh-form-row">
                                        <input className="vh-form-input" type="text" placeholder="Full Name" required />
                                        <input className="vh-form-input" type="email" placeholder="Email Address" required />
                                    </div>
                                    <input className="vh-form-input" type="tel" placeholder="Phone Number" required style={{ marginBottom: 12, width: "100%", display: "block" }} />
                                    <textarea className="vh-form-textarea" rows={5} placeholder="Your Message..." required />
                                    <button className="vh-btn-submit" type="submit">
                                        Send Message
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9" /></svg>
                                    </button>
                                </form>
                            )}
                        </div>
                    </Fade>
                </div>
            </div>
        </div>
    );
}


