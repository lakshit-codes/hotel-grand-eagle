"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);

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

  const [heroData, setHeroData] = useState<any>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await fetch("/api/pages?slug=home");
        if (res.ok) {
          const data = await res.json();
          let foundHero = null;
          if (data?.content) {
            for (const section of data.content) {
              if (section.columns) {
                for (const col of section.columns) {
                  if (Array.isArray(col)) {
                    for (const item of col) {
                      if (item.type === "hero") {
                        foundHero = item;
                        break;
                      }
                    }
                  }
                }
              }
              if (foundHero) break;
            }
          }
          if (foundHero) setHeroData(foundHero);
        }
      } catch (err) {
        console.error("Failed to fetch hero", err);
      }
    }
    fetchHero();
  }, []);

  const images = heroData?.images && heroData.images.length > 0
    ? heroData.images
    : [{ url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop" }];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImgIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const title = heroData?.title || "Smart, Simple\n*Comfort*";
  const subtitle = heroData?.subtitle || "An intimate retreat in the heart of Sitapura, Jaipur — where affordability meets the warmth of genuine hospitality.";
  const primaryBtnLabel = heroData?.primaryButtonLabel || "Explore Rooms";
  const primaryBtnLink = heroData?.primaryButtonLink || "#rooms";
  const secondaryBtnLabel = heroData?.secondaryButtonLabel || "Our Story";
  const secondaryBtnLink = heroData?.secondaryButtonLink || "#about";

  return (
    <section className="hero" id="hero">
      {/* Backgrounds */}
      {images.map((img: any, idx: number) => (
        <div
          key={idx}
          className="hero-bg"
          style={{
            backgroundImage: `url('${img.url}')`,
            opacity: activeImgIndex === idx ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: activeImgIndex === idx ? 1 : 0
          }}
        />
      ))}
      <div className="hero-grad1" style={{ zIndex: 2 }} />
      <div className="hero-grad2" style={{ zIndex: 2 }} />

      {/* Slide dots */}
      {images.length > 1 && (
        <div className="slide-dots" style={{ zIndex: 10 }}>
          {images.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`dot ${activeImgIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveImgIndex(idx)}
            />
          ))}
        </div>
      )}

      {/* Inner flex column layout */}
      <div className="hero-inner">

        {/* Main content — grows to fill space */}
        <div className="hero-content fade-in-up visible">
          <div className="hero-eyebrow">
            <div className="eyebrow-line" />
            <span className="eyebrow-text">WELCOME TO HOTEL GRAND EAGLE</span>
          </div>

          <h1
            className="hero-headline font-display"
            dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />').replace(/\*(.*?)\*/g, '<em>$1</em>') }}
          />

          <p className="hero-sub">{subtitle}</p>

          <div className="hero-ctas">
            <Link href={primaryBtnLink} className="btn-primary">
              {primaryBtnLabel}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </Link>
            <Link href={secondaryBtnLink} className="btn-outline">
              {secondaryBtnLabel}
            </Link>
          </div>
        </div>

        {/* Stats — below content */}
        <div className="hero-stats fade-in-up visible">
          <div className="hero-stat">
            <span className="stat-num font-display">24+</span>
            <span className="stat-label">Years of Excellence</span>
          </div>
          <div className="hero-stat">
            <span className="stat-num font-display">340+</span>
            <span className="stat-label">Happy Guests</span>
          </div>
          <div className="hero-stat">
            <span className="stat-num font-display">4.9</span>
            <span className="stat-label">Guest Rating</span>
          </div>
        </div>

        {/* Booking bar — sticks to bottom of hero */}
        <div className="booking-bar fade-in-up visible">
          <label className="booking-field" style={{ cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: "var(--gold)", flexShrink: 0 }} strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="booking-field-label">Check In</span>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={handleCheckInChange}
                onClick={(e) => { try { (e.target as HTMLInputElement).showPicker(); } catch { } }}
              />
            </div>
          </label>

          <label className="booking-field" style={{ cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: "var(--gold)", flexShrink: 0 }} strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="booking-field-label">Check Out</span>
              <input
                type="date"
                value={checkOut}
                min={new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]}
                onChange={e => setCheckOut(e.target.value)}
                onClick={(e) => { try { (e.target as HTMLInputElement).showPicker(); } catch { } }}
              />
            </div>
          </label>

          <label className="booking-field" style={{ cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color: "var(--gold)", flexShrink: 0 }} strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
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

      </div>
    </section>
  );
}
