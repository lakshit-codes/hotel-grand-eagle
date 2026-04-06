"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function VelourFooter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [hotel, setHotel] = useState<any>(null);

  useEffect(() => {
    fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
  }, []);

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer>
      <div className="footer-main">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: "20px" }}>
              <img src="/logo.png" alt="HOTEL GRAND EAGLE" style={{ height: "60px", width: "auto", objectFit: "contain" }} />
            </div>
            <p className="footer-brand-desc">
              Experience the legacy of Rajasthani hospitality at Hotel Grand Eagle. A sanctuary of refinement in the heart 
              of Sitapura, Jaipur, where heritage meets exceptional service.
            </p>
            <div className="footer-contacts">
              <div className="footer-contact">
                <svg
                  className="footer-contact-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{hotel?.address || '12 Palace Road, Jaipur, Rajasthan 302001'}</span>
              </div>
              <div className="footer-contact">
                <svg
                  className="footer-contact-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 0h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.55-.55a2 2 0 012.11-.45c.91.36 1.85.6 2.81.72A2 2 0 0122 16.92z" />
                </svg>
                {hotel?.phone || '+91 63678 50548'}
              </div>
              <div className="footer-contact">
                <svg
                  className="footer-contact-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {hotel?.email || 'reservations@hotelgrandeagle.com'}
              </div>
            </div>
            <div className="footer-social">
              <button className="social-btn" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </button>
              <button className="social-btn" aria-label="Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </button>
              <button className="social-btn" aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <div className="footer-nav-title">Explore</div>
            <ul className="footer-nav-list">
              <li>
                <Link href="/rooms">Rooms &amp; Suites</Link>
              </li>
              <li>
                <Link href="#">Dining &amp; Bar</Link>
              </li>
              <li>
                <Link href="#">Spa &amp; Wellness</Link>
              </li>
              <li>
                <Link href="#">Events &amp; Banquets</Link>
              </li>
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-nav-title">Company</div>
            <ul className="footer-nav-list">
              <li>
                <Link href="/about">About Grand Eagle</Link>
              </li>
              <li>
                <Link href="#">Careers</Link>
              </li>
              <li>
                <Link href="#">Press &amp; Media</Link>
              </li>
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#">Terms of Service</Link>
              </li>
            </ul>
          </div>

          <div className="newsletter-card">
            <div className="newsletter-tag">Inner Circle</div>
            <div className="newsletter-title font-display">Exclusive offers, curated just for you</div>
            <p className="newsletter-desc">
              Join our newsletter and receive early access to seasonal promotions, cultural events, and private member
              benefits.
            </p>
            <input
              className="newsletter-input"
              type="email"
              placeholder={subscribed ? "✓ Subscribed successfully!" : "Your email address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                borderColor: subscribed ? "rgba(212,168,87,0.4)" : undefined,
                color: subscribed ? "#d4a857" : undefined,
              }}
              disabled={subscribed}
            />
            <button className="btn-subscribe" onClick={handleSubscribe} disabled={subscribed}>
              {subscribed ? "Subscribed" : "Subscribe"}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22,2 15,22 11,13 2,9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="footer-bar">
        <span className="footer-copy">© {new Date().getFullYear()} {hotel?.name || 'Hotel Grand Eagle'}. All rights reserved.</span>
        <span className="footer-made">
          Crafted with intention in <span>Rajasthan, India</span>
        </span>
      </div>
    </footer>
  );
}
