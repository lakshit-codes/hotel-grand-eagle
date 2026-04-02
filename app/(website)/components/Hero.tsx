"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  
  // Initialize dates
  const today = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);

  // When check-in changes, ensure check-out is at least one day later
  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    
    const cin = new Date(newCheckIn);
    const cout = new Date(checkOut);
    
    if (cout <= cin) {
      const nextDay = new Date(cin);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckOut(e.target.value);
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-bg"></div>
      <div className="hero-grad1"></div>
      <div className="hero-grad2"></div>

      <div className="hero-content fade-in-up visible">
        <div className="hero-eyebrow">
          <div className="eyebrow-line"></div>
          <span className="eyebrow-text">WELCOME TO HOTEL GRAND EAGLE</span>
        </div>
        <h1 className="hero-headline font-display">
          Smart, Simple<br /><em>Comfort</em>
        </h1>
        <p className="hero-sub" style={{ textTransform: "none" }}>
          An intimate retreat in the heart of Sitapura, Jaipur — where affordability meets the warmth of genuine hospitality.
        </p>
        <div className="hero-ctas">
          <Link href="#rooms" className="btn-primary">
            Explore Rooms
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </Link>
          <Link href="#about" className="btn-outline">
            Our Story
          </Link>
        </div>
      </div>

      <div className="hero-stats fade-in-up visible">
        <div className="hero-stat">
          <span className="stat-num font-display">24+</span>
          <span className="stat-label">Years of Excellence</span>
        </div>
        <div className="hero-stat">
          <span className="stat-num font-display">340+</span>
          <span className="stat-label">Luxury Suites</span>
        </div>
        <div className="hero-stat">
          <span className="stat-num font-display">4.9</span>
          <span className="stat-label">Guest Rating</span>
        </div>
      </div>

      <div className="slide-dots">
        <div className="dot active"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>

      <div className="booking-bar fade-in-up visible">
        <label className="booking-field" style={{ cursor: "pointer" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{color: "var(--gold)"}} strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <div style={{ flex: 1 }}>
            <span className="booking-field-label">Check In</span>
            <input 
              type="date" 
              value={checkIn}
              min={today}
              onChange={handleCheckInChange}
              onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} 
            />
          </div>
        </label>
        <label className="booking-field" style={{ cursor: "pointer" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{color: "var(--gold)"}} strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <div style={{ flex: 1 }}>
            <span className="booking-field-label">Check Out</span>
            <input 
              type="date" 
              value={checkOut}
              min={new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]}
              onChange={handleCheckOutChange}
              onClick={(e) => { try { (e.target as HTMLInputElement).showPicker() } catch(err) {} }} 
            />
          </div>
        </label>
        <label className="booking-field" style={{ cursor: "pointer" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{color: "var(--gold)"}} strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
          <div style={{ flex: 1 }}>
            <span className="booking-field-label">Guests</span>
            <select defaultValue="2 Guests">
              <option>1 Guest</option>
              <option value="2 Guests">2 Guests</option>
              <option>3 Guests</option>
              <option>4 Guests</option>
              <option>5+ Guests</option>
            </select>
          </div>
        </label>
        <button 
          className="btn-search" 
          onClick={() => router.push(`/book?checkIn=${checkIn}&checkOut=${checkOut}`)}
        >
          Search Rooms
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

