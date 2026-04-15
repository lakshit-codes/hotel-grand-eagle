"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export default function VelourFooter() {
  const [hotel, setHotel] = useState<any>(null);

  useEffect(() => {
    fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => { });
  }, []);

  return (
    <footer style={{ borderTop: "1px solid rgba(212,168,87,0.1)", background: "var(--midnight)", paddingTop: "60px", paddingBottom: "30px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px", marginBottom: "40px" }}>

          {/* COLUMN 1: Logo & Description */}
          <div>
            <div style={{ marginBottom: "20px" }}>
              <img src="/logo.png" alt="HOTEL GRAND EAGLE" style={{ height: "50px", width: "auto", objectFit: "contain" }} />
            </div>
            <p style={{ fontSize: "13px", color: "var(--ivory-dim)", lineHeight: "1.7", maxWidth: "400px" }}>
              Experience the charm of comfortable living at Hotel Grand Eagle.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <a href="#" title="Facebook" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", textDecoration: "none", transition: "all 0.3s ease", border: "1px solid rgba(212,168,87,0.15)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--midnight)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </a>
              <a href="#" title="Instagram" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", textDecoration: "none", transition: "all 0.3s ease", border: "1px solid rgba(212,168,87,0.15)" }} onMouseEnter={(e) => { e.currentTarget.style.background = "var(--gold)"; e.currentTarget.style.color = "var(--midnight)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div>
            <div style={{ fontSize: "11px", color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px", fontWeight: "600" }}>Quick Links</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li>
                <Link href="/about" style={{ fontSize: "13px", color: "var(--ivory-dim)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ivory-dim)"}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/nearby" style={{ fontSize: "13px", color: "var(--ivory-dim)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ivory-dim)"}>
                  Nearby
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ fontSize: "13px", color: "var(--ivory-dim)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--gold)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--ivory-dim)"}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Contact Details */}
          <div>
            <div style={{ fontSize: "11px", color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "20px", fontWeight: "600" }}>Contact Us</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "var(--ivory-dim)" }}>
                <FiMapPin style={{ color: "var(--gold)", marginTop: "2px", flexShrink: 0 }} size={16} />
                <span>{hotel?.address || '12 Palace Road, Jaipur, Rajasthan 302001'}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--ivory-dim)" }}>
                <FiPhone style={{ color: "var(--gold)", flexShrink: 0 }} size={16} />
                <span>{hotel?.phone || '+91 63678 50548'}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--ivory-dim)" }}>
                <FiMail style={{ color: "var(--gold)", flexShrink: 0 }} size={16} />
                <span>{hotel?.email || 'reservations@hotelgrandeagle.com'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div style={{ borderTop: "1px solid rgba(212,168,87,0.1)", paddingTop: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "rgba(200,192,176,0.5)", letterSpacing: "0.05em" }}>
              © {new Date().getFullYear()} {hotel?.name || 'Hotel Grand Eagle'}. All rights reserved.
            </span>
            <span style={{ fontSize: "10px", color: "var(--gold)", letterSpacing: "0.05em", opacity: 0.8 }}>
              By Codified Web Solutions
            </span>
          </div>
          <div id="footer-legal-links" style={{ display: "flex", gap: "20px" }}>
            <Link
              href="/privacy-policy"
              className="footer-link"
              style={{ fontSize: "11px", color: "rgba(200,192,176,0.6)", textDecoration: "none", transition: "color 0.3s ease" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="footer-link"
              style={{ fontSize: "11px", color: "rgba(200,192,176,0.6)", textDecoration: "none", transition: "color 0.3s ease" }}
            >
              Terms and Conditions
            </Link>
          </div>
          <style>{`
            .footer-link:hover {
              color: var(--gold) !important;
            }
          `}</style>
        </div>
      </div>
    </footer>
  );
}
