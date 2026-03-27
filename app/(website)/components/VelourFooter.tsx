"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function VelourFooter() {
    return (
        <footer className="vh-footer">
            <div className="vh-footer-main">
                <div className="vh-footer-grid" style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
                    {/* Brand Info & Big Logo */}
                    <div style={{ paddingRight: 32, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <Link href="/" style={{ marginBottom: 24, display: "inline-block" }}>
                            <img src="/logo.png" alt="Hotel Grand Eagle" style={{ height: 80, objectFit: "contain" }} />
                        </Link>
                        <p className="vh-footer-brand-desc" style={{ maxWidth: 320, marginBottom: 24 }}>A comfortable and welcoming stay in Jaipur's Sitapura, where modern convenience meets exceptional value and warm hospitality.</p>
                        
                        <div className="vh-footer-contacts" style={{ marginBottom: 28, width: "100%" }}>
                            <div className="vh-footer-contact" style={{ marginBottom: 12 }}>
                                <svg className="vh-footer-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                <span>Sitapura Industrial Area, Jaipur, Rajasthan 302022</span>
                            </div>
                            <div className="vh-footer-contact" style={{ marginBottom: 12 }}>
                                <svg className="vh-footer-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 0h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.55-.55a2 2 0 012.11-.45c.91.36 1.85.6 2.81.72A2 2 0 0122 16.92z" /></svg>
                                <span>+91 63678 50548</span>
                            </div>
                            <div className="vh-footer-contact">
                                <svg className="vh-footer-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                <span>reservations@hotelgrandeagle.com</span>
                            </div>
                        </div>

                        <div className="vh-footer-social">
                            <button className="vh-social-btn" aria-label="Instagram">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                            </button>
                            <button className="vh-social-btn" aria-label="Twitter">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                            </button>
                            <button className="vh-social-btn" aria-label="Facebook">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <div className="vh-footer-nav-title">Explore</div>
                        <ul className="vh-footer-nav-list">
                            <li><Link href="/rooms">Rooms</Link></li>
                            <li><Link href="/services">Services &amp; Amenities</Link></li>
                            <li><Link href="/nearby">Nearby Places</Link></li>
                            <li><Link href="/testimonials">Testimonials</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <div className="vh-footer-nav-title">Hotel</div>
                        <ul className="vh-footer-nav-list">
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/book">Book Now</Link></li>
                            <li><a href="tel:+916367850548">Call Us</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="vh-footer-bar">
                <span className="vh-footer-copy">© {new Date().getFullYear()} Hotel Grand Eagle. All rights reserved.</span>
                <span className="vh-footer-made">Crafted with care in <span>Rajasthan, India</span></span>
            </div>

            {/* WhatsApp */}
            <a href="https://wa.me/916367850548" target="_blank" rel="noopener noreferrer"
                style={{ position: "fixed", bottom: 28, left: 28, zIndex: 50, background: "#25D366", color: "#fff", padding: 14, borderRadius: "50%", boxShadow: "0 8px 24px rgba(0,0,0,0.4)", display: "flex", transition: "transform 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 26, height: 26 }}><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.228.6 4.385 1.708 6.273L.5 24l5.854-1.536A11.972 11.972 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22.015a9.966 9.966 0 01-5.074-1.383l-.364-.216-3.774.989.99-3.68-.236-.376A9.972 9.972 0 012.049 12.03C2.049 6.52 6.52 2.048 12.03 2.048S22.016 6.52 22.016 12.03c0 5.51-4.471 9.985-9.985 9.985zm5.496-7.5c-.302-.15-1.785-.88-2.062-.98-.277-.101-.48-.15-.682.15-.202.301-.78 1.006-.957 1.206-.176.2-.352.226-.654.075-.302-.15-1.272-.47-2.42-1.49-.893-.794-1.497-1.774-1.673-2.075-.176-.301-.019-.464.133-.614.136-.134.301-.35.452-.526.151-.176.202-.301.302-.501.101-.2.05-.376-.025-.526-.075-.15-.682-1.644-.933-2.253-.243-.591-.49-.51-.682-.52-.176-.01-.377-.01-.58-.01-.202 0-.58.075-.856.376-.277.301-1.056 1.03-1.056 2.51s1.082 2.91 1.232 3.11c.15.2 2.113 3.322 5.161 4.542 1.93.774 2.766.866 3.82.723 1.139-.155 3.518-1.436 4.018-2.825.5-1.388.5-2.583.35-2.825-.15-.24-.553-.39-1.054-.64z" /></svg>
            </a>
        </footer>
    );
}
