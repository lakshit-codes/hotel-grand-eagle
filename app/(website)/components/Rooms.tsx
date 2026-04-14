"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Room } from "../../components/types";

export default function Rooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/room-types")
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setRooms(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || rooms.length === 0) return;
    const timeoutId = setTimeout(() => {
      const fadeEls = document.querySelectorAll('.fade-in-up');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transitionDelay = (i * 0.05) + 's';
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      fadeEls.forEach(el => observer.observe(el));
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [rooms, loading]);

  return (
    <section id="rooms">
      <div className="rooms-header">
        <div>
          <div className="section-eyebrow fade-in-up visible">
            <span className="line"></span>
            <span>Accommodations</span>
          </div>
          <h2 className="section-title fade-in-up visible">
            Rooms
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <p
            className="fade-in-up visible"
            style={{ fontSize: "13px", color: "var(--ivory-dim)", lineHeight: 1.7, maxWidth: "260px" }}
          >
            Well-designed rooms offering comfort, convenience, and everything you need for a relaxing stay.
          </p>
          <Link
            href="/rooms"
            className="fade-in-up visible"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--gold)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="rooms-scroll fade-in-up visible">
        {loading ? (
          <div style={{ width: "100%", textAlign: "center", color: "var(--gold)", padding: "40px" }}>
            Discovery in progress...
          </div>
        ) : rooms.length === 0 ? (
          <div style={{ width: "100%", textAlign: "center", color: "var(--ivory-dim)", padding: "40px" }}>
            Our sanctuaries are currently being prepared. Check back soon.
          </div>
        ) : (
          rooms.map((room, idx) => (
            <div key={idx} className="room-card">
              <Link href={`/rooms/${room.slug}`} className="room-img-wrap" style={{ display: 'block' }}>
                <img
                  src={room.images?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800"}
                  alt={room.roomName}
                  loading="lazy"
                />
                <div className="room-img-overlay"></div>
                <div className="room-price">
                  ₹{room.basePrice?.toLocaleString()} <span>/night</span>
                </div>
              </Link>
              <div className="room-body">
                <div className="room-cat">{room.roomCategory}</div>
                <Link href={`/rooms/${room.slug}`} className="room-name font-display" style={{ display: 'block', textDecoration: 'none' }}>
                  {room.roomName}
                </Link>
                <div className="room-meta">
                  <div className="room-meta-item">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C9A96E"
                      strokeWidth="1.5"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    {room.roomSize} m²
                  </div>
                  <div className="room-meta-dot"></div>
                  <div className="room-meta-item">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#C9A96E"
                      strokeWidth="1.5"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9,22 9,12 15,12 15,22" />
                    </svg>
                    {room.bedType}
                  </div>
                </div>
                <div className="tags">
                  <span className="tag">City View</span>
                  <span className="tag">Free Wi-Fi</span>
                  <span className="tag">Mini Bar</span>
                  <span className="tag">24hr Service</span>
                </div>
                <Link href={`/rooms/${room.slug}`} className="btn-room" style={{ textDecoration: 'none' }}>
                  View Details
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C9A96E"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))
        )}
        <div style={{ flexShrink: 0, width: "16px" }}></div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "0 40px",
          fontSize: "11px",
          color: "rgba(200,192,176,0.35)",
        }}
      >
        ← Scroll to explore all rooms
      </div>
    </section>
  );
}

