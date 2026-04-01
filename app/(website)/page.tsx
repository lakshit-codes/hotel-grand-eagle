"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Room } from "../components/types";

// ─── Scroll-fade hook ─────────────────────────────────────────────
function useFadeIn() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
            { threshold: 0.1, rootMargin: "-40px" }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return ref;
}

// ─── Fade wrapper ─────────────────────────────────────────────────
function Fade({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    const ref = useFadeIn();
    return <div className="vh-fade" ref={ref} style={style}>{children}</div>;
}

// ─── TESTIMONIALS DATA ────────────────────────────────────────────
const TESTIMONIALS = [
    {
        text: '"Hotel Grand Eagle truly exceeded my expectations. Clean rooms, helpful staff, and an unbeatable location near JECC. The best budget hotel in Sitapura — highly recommended for business travelers."',
        name: "Rajiv Mehta",
        role: "Senior Manager, TCS",
        location: "Bengaluru, India",
        img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80",
    },
    {
        text: '"Stayed here for an exhibition at JECC and it was perfect. The 24/7 front desk team was incredibly accommodating. The rooms are well-maintained and spotless. Will definitely stay here again."',
        name: "Namrata Singh",
        role: "Event Coordinator, Sun Events",
        location: "Jaipur, India",
        img: "https://images.unsplash.com/photo-1494790108755-2616b12c4c66?w=80",
    },
    {
        text: '"Great value for money in Sitapura. Comfortable beds, fast Wi-Fi, power backup, and the staff genuinely cares. Chokhi Dhani is just minutes away — a wonderful experience overall."',
        name: "Sandeep Kumar",
        role: "Business Traveler",
        location: "Delhi, India",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80",
    },
];

// ─── ROOM CARDS DATA ──────────────────────────────────────────────
const STATIC_ROOMS = [
    { img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800", cat: "Standard", name: "Classic Room", size: "22 m²", bed: "Queen", price: "₹2,499", tags: ["City View", "Free Wi-Fi", "A/C", "24hr Desk"], featured: false },
    { img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800", cat: "Premium", name: "Premium Room", size: "28 m²", bed: "King", price: "₹3,499", tags: ["Larger Space", "Work Desk", "Free Breakfast", "Mini Fridge"], featured: true },
    { img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800", cat: "Family", name: "Family Room", size: "35 m²", bed: "2 Double Beds", price: "₹4,999", tags: ["Family Size", "Extra Bed", "Sitting Area", "City View"], featured: false },
    { img: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=800", cat: "Executive", name: "Executive Suite", size: "45 m²", bed: "King", price: "₹6,499", tags: ["Living Area", "Premium Bath", "Quiet Zone", "Workspace"], featured: false },
];

// ─── GALLERY DATA ─────────────────────────────────────────────────
const GALLERY_ITEMS = [
    { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800", label: "Grand Lobby", tall: true },
    { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800", label: "Dining Area", tall: false },
    { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800", label: "Hotel Exterior", tall: true },
    { src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800", label: "Premium Room", tall: false },
    { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800", label: "Garden View", tall: false },
];

// ─────────────────────────────────────────────────────────────────
export default function HomePage() {
    const router = useRouter();

    // Dates
    const getDefaults = () => {
        const t = new Date(); t.setDate(t.getDate() + 1);
        const cin = t.toISOString().split("T")[0];
        const t2 = new Date(t); t2.setDate(t2.getDate() + 1);
        const cout = t2.toISOString().split("T")[0];
        return { cin, cout };
    };
    const { cin: defIn, cout: defOut } = getDefaults();
    const [checkIn, setCheckIn] = useState(defIn);
    const [checkOut, setCheckOut] = useState(defOut);
    const [guests, setGuests] = useState("2");

    const handleCheckInChange = (v: string) => {
        setCheckIn(v);
        if (v >= checkOut) {
            const d = new Date(v); d.setDate(d.getDate() + 1);
            setCheckOut(d.toISOString().split("T")[0]);
        }
    };

    // Live rooms from API
    const [apiRooms, setApiRooms] = useState<Room[]>([]);
    useEffect(() => {
        fetch("/api/room-types").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setApiRooms(d.slice(0, 4)); }).catch(() => {});
    }, []);

    // Testimonials
    const [testiIdx, setTestiIdx] = useState(0);
    const [testiVisible, setTestiVisible] = useState(true);
    const goTesti = useCallback((i: number) => {
        setTestiVisible(false);
        setTimeout(() => { setTestiIdx(i); setTestiVisible(true); }, 220);
    }, []);
    const nextTesti = useCallback(() => goTesti((testiIdx + 1) % TESTIMONIALS.length), [testiIdx, goTesti]);
    const prevTesti = useCallback(() => goTesti((testiIdx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), [testiIdx, goTesti]);
    useEffect(() => { const t = setInterval(nextTesti, 6000); return () => clearInterval(t); }, [nextTesti]);

    // Lightbox
    const [lightboxSrc, setLightboxSrc] = useState("");
    const openLightbox = (src: string) => { setLightboxSrc(src); document.body.style.overflow = "hidden"; };
    const closeLightbox = () => { setLightboxSrc(""); document.body.style.overflow = ""; };

    // Contact form
    const [form, setForm] = useState({ name: "", email: "", phone: "", checkIn: "", checkOut: "", guests: "", message: "" });
    const [formSent, setFormSent] = useState(false);
    const handleFormSubmit = (e: React.FormEvent) => { e.preventDefault(); setFormSent(true); };

    const t = TESTIMONIALS[testiIdx];

    return (
        <>
            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="vh-hero" id="hero">
                <div className="vh-hero-bg" />
                <div className="vh-hero-grad1" />
                <div className="vh-hero-grad2" />

                <div className="vh-hero-content">
                    <div className="vh-hero-eyebrow">
                        <div className="vh-eyebrow-line" />
                        <span className="vh-eyebrow-text">Welcome to Hotel Grand Eagle</span>
                    </div>
                    <h1 className="vh-hero-headline">
                        Smart, Simple Comfort
                    </h1>
                    <p className="vh-hero-sub">
                        An intimate retreat in the heart of Sitapura, Jaipur — where affordability meets the warmth of genuine hospitality.
                    </p>
                    <div className="vh-hero-ctas">
                        <Link href="/rooms" className="vh-btn-primary">
                            Explore Rooms
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6" /></svg>
                        </Link>
                        <Link href="/about" className="vh-btn-outline">Our Story</Link>
                    </div>
                </div>

                <div className="vh-hero-stats">
                    <div className="vh-hero-stat">
                        <span className="vh-stat-num">24+</span>
                        <span className="vh-stat-label">Years of Service</span>
                    </div>
                    <div className="vh-hero-stat">
                        <span className="vh-stat-num">4.8★</span>
                        <span className="vh-stat-label">Guest Rating</span>
                    </div>
                    <div className="vh-hero-stat">
                        <span className="vh-stat-num">100%</span>
                        <span className="vh-stat-label">Clean Rooms</span>
                    </div>
                </div>

                {/* Booking Bar */}
                <div className="vh-booking-bar">
                    <div className="vh-booking-field">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        <div style={{ flex: 1 }}>
                            <label className="vh-booking-field-label">Check In</label>
                            <input type="date" value={checkIn} min={defIn} onChange={e => handleCheckInChange(e.target.value)} />
                        </div>
                    </div>
                    <div className="vh-booking-field">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        <div style={{ flex: 1 }}>
                            <label className="vh-booking-field-label">Check Out</label>
                            <input type="date" value={checkOut} min={checkIn} onChange={e => setCheckOut(e.target.value)} />
                        </div>
                    </div>
                    <div className="vh-booking-field">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
                        <div style={{ flex: 1 }}>
                            <label className="vh-booking-field-label">Guests</label>
                            <select value={guests} onChange={e => setGuests(e.target.value)}>
                                <option value="1">1 Guest</option>
                                <option value="2">2 Guests</option>
                                <option value="3">3 Guests</option>
                                <option value="4">4 Guests</option>
                                <option value="5">5+ Guests</option>
                            </select>
                        </div>
                    </div>
                    <button className="vh-btn-search" onClick={() => router.push(`/book?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}>
                        Search Rooms
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6" /></svg>
                    </button>
                </div>
            </section>

            {/* ── ROOMS ─────────────────────────────────────────── */}
            <section id="vh-rooms">
                <div className="vh-rooms-header">
                    <div>
                        <Fade>
                            <div className="vh-section-eyebrow"><span className="vh-line" /><span>Accommodations</span></div>
                        </Fade>
                        <Fade>
                            <h2 className="vh-section-title">Rooms</h2>
                        </Fade>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 260 }}>Clean, comfortable, and equipped with everything you need for a restful stay.</p>
                        <Link href="/rooms" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0, textDecoration: "none" }}>
                            View All
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                </div>

                <div className="vh-rooms-scroll">
                    {(apiRooms.length > 0 ? [] : STATIC_ROOMS).concat(
                        apiRooms.length > 0
                            ? apiRooms.map((r, i) => ({
                                img: r.images?.[0] || STATIC_ROOMS[i % STATIC_ROOMS.length].img,
                                cat: r.roomCategory || "Standard Collection",
                                name: r.roomName,
                                size: `${r.roomSize || 30} m²`,
                                bed: r.bedType || "King",
                                price: `₹${r.basePrice?.toLocaleString()}`,
                                tags: (r.amenityIds || []).slice(0, 4).map((id: string) => id),
                                featured: i === 1,
                            }))
                            : []
                    ).map((room, i) => (
                        <div key={i} className={`vh-room-card${room.featured ? " featured" : ""}`}>
                            <div className="vh-room-img-wrap">
                                {room.featured && <div className="vh-featured-badge">Top Choice</div>}
                                <img src={room.img} alt={room.name} loading="lazy" />
                                <div className="vh-room-img-overlay" />
                                <div className="vh-room-price">{room.price} <span>/night</span></div>
                            </div>
                            <div className="vh-room-body">
                                <div className="vh-room-cat">{room.cat}</div>
                                <div className="vh-room-name">{room.name}</div>
                                <div className="vh-room-meta">
                                    <div className="vh-room-meta-item">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                                        {room.size}
                                    </div>
                                    <div className="vh-room-meta-dot" />
                                    <div className="vh-room-meta-item">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
                                        {room.bed}
                                    </div>
                                </div>
                                <div className="vh-tags">
                                    {room.tags.map((tag: string, j: number) => <span key={j} className="vh-tag">{tag}</span>)}
                                </div>
                                <Link href="/rooms" className="vh-btn-room">
                                    View Details
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                    <div style={{ flexShrink: 0, width: 16 }} />
                </div>
                <div style={{ marginTop: 20, padding: "0 40px", fontSize: 12, color: "var(--text-muted)", opacity: 0.7 }}>← Scroll to explore all rooms</div>
            </section>

            {/* ── ABOUT ─────────────────────────────────────────── */}
            <section id="vh-about">
                <div className="vh-max">
                    <div className="vh-about-grid">
                        <div className="vh-about-imgs">
                            <div className="vh-about-gold-bar" />
                            <Fade>
                                <div className="vh-about-main-img">
                                    <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800" alt="Hotel Grand Eagle" loading="lazy" />
                                    <div className="vh-about-img-overlay" />
                                </div>
                            </Fade>
                            <Fade>
                                <div className="vh-about-accent-img">
                                    <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800" alt="Hotel exterior" loading="lazy" />
                                </div>
                            </Fade>
                            <Fade>
                                <div className="vh-about-stat-card">
                                    <div className="vh-about-stat-num">2001</div>
                                    <div className="vh-about-stat-label">Est. in Jaipur</div>
                                </div>
                            </Fade>
                        </div>
                        <div>
                            <Fade>
                                <div className="vh-section-eyebrow"><span className="vh-line" /><span>Our Philosophy</span></div>
                            </Fade>
                            <Fade>
                                <h2 className="vh-section-title" style={{ marginBottom: 28 }}>Modern Comfort at Exceptional Value</h2>
                            </Fade>
                            <div className="vh-about-text">
                                <Fade><p>Hotel Grand Eagle was conceived not merely as a place to sleep, but as a home away from home. Born from a commitment to genuine Rajasthani hospitality and a passion for thoughtful, affordable comfort.</p></Fade>
                                <Fade><p>Every detail — from our well-appointed rooms to our attentive staff — has been thoughtfully considered. Because we believe true value is about the quiet perfection of care, not extravagance.</p></Fade>
                            </div>
                            <div className="vh-pillars">
                                {[
                                    { svg: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />, title: "Uncompromising Cleanliness", desc: "Spotless rooms and common areas maintained to the highest standards, always." },
                                    { svg: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />, title: "Heartfelt Hospitality", desc: "Our team connects, anticipates, and genuinely cares about your experience." },
                                    { svg: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, title: "Value for Money", desc: "Premium comfort at budget-friendly rates — the best of both worlds in Jaipur." },
                                    { svg: <><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></>, title: "Prime Location", desc: "Walking distance to JECC, near transit hubs and local dining — unbeatable access." },
                                ].map((p, i) => (
                                    <Fade key={i}>
                                        <div className="vh-pillar">
                                            <div className="vh-pillar-icon">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">{p.svg}</svg>
                                            </div>
                                            <div>
                                                <div className="vh-pillar-title">{p.title}</div>
                                                <div className="vh-pillar-desc">{p.desc}</div>
                                            </div>
                                        </div>
                                    </Fade>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── GALLERY ───────────────────────────────────────── */}
            <section id="vh-gallery">
                <div className="vh-max">
                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, marginBottom: 56 }}>
                        <div>
                            <Fade><div className="vh-section-eyebrow"><span className="vh-line" /><span>Visual Journey</span></div></Fade>
                            <Fade><h2 className="vh-section-title">Take a Look Inside</h2></Fade>
                        </div>
                        <Fade><p style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 240, lineHeight: 1.7 }}>See our modern spaces, clean accommodations, and welcoming facilities.</p></Fade>
                    </div>

                    <div className="vh-gallery-grid">
                        {GALLERY_ITEMS.map((item, i) => (
                            <Fade key={i}>
                                <div className={`vh-gallery-item${item.tall ? " tall" : ""}`} onClick={() => openLightbox(item.src)}>
                                    <img src={item.src} alt={item.label} loading="lazy" />
                                    <div className="vh-gallery-overlay">
                                        <svg className="vh-gallery-zoom" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
                                        <span className="vh-gallery-overlay-text">{item.label}</span>
                                    </div>
                                    <div className="vh-gallery-corner" />
                                </div>
                            </Fade>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: 40 }}>
                        <Link href="/gallery" className="vh-btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            View Full Gallery
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ──────────────────────────────────── */}
            <section id="vh-testimonials">
                <div className="vh-testi-bg-quote">&ldquo;</div>
                <div className="vh-max" style={{ position: "relative", zIndex: 1 }}>
                    <div className="vh-testi-header">
                        <div className="vh-testi-eyebrow">
                            <span className="vh-eyebrow-line" />
                            <span className="vh-eyebrow-text">Guest Stories</span>
                            <span className="vh-eyebrow-line" />
                        </div>
                        <Fade><h2 className="vh-section-title">What Our Guests Say</h2></Fade>
                    </div>

                    <div className="vh-testi-card" style={{ opacity: testiVisible ? 1 : 0, transform: testiVisible ? "translateY(0)" : "translateY(10px)" }}>
                        <div className="vh-stars">{"★★★★★".split("").map((s, i) => <span key={i} className="vh-star">{s}</span>)}</div>
                        <blockquote className="vh-testi-quote">{t.text}</blockquote>
                        <div className="vh-testi-author">
                            <div className="vh-testi-avatar"><img src={t.img} alt={t.name} /></div>
                            <div style={{ textAlign: "left" }}>
                                <div className="vh-testi-name">{t.name}</div>
                                <div className="vh-testi-role">{t.role}</div>
                                <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.1em" }}>{t.location}</div>
                            </div>
                        </div>
                    </div>

                    <div className="vh-testi-controls">
                        <button className="vh-testi-btn" onClick={prevTesti}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15,18 9,12 15,6" /></svg>
                        </button>
                        <div className="vh-testi-dots">
                            {TESTIMONIALS.map((_, i) => (
                                <button key={i} className={`vh-testi-dot${i === testiIdx ? " active" : ""}`} onClick={() => goTesti(i)} />
                            ))}
                        </div>
                        <button className="vh-testi-btn" onClick={nextTesti}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9,18 15,12 9,6" /></svg>
                        </button>
                    </div>

                    <div className="vh-press-strip">
                        <div className="vh-press-label">As Rated On</div>
                        <div className="vh-press-logos">
                            {["GOOGLE REVIEWS", "BOOKING.COM", "MAKEMYTRIP", "GOIBIBO", "TRIPADVISOR"].map(l => (
                                <span key={l} className="vh-press-logo">{l}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CONTACT ───────────────────────────────────────── */}
            <section id="vh-contact">
                <div className="vh-contact-bg">
                    <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800" alt="" />
                    <div className="vh-contact-bg-grad" />
                </div>
                <div className="vh-max vh-contact-grid" style={{ position: "relative", zIndex: 1 }}>
                    <div>
                        <Fade><div className="vh-section-eyebrow"><span className="vh-line" /><span>Reservations</span></div></Fade>
                        <Fade><h2 className="vh-section-title" style={{ marginBottom: 28 }}>Get in Touch</h2></Fade>
                        <Fade><p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8, maxWidth: 320, marginBottom: 40 }}>
                            Have a question or need to make a booking? We're available 24/7 to assist you.
                        </p></Fade>
                        <div className="vh-contact-details">
                            {[
                                { icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>, label: "Address", val: "Sitapura Industrial Area, Jaipur, Rajasthan 302022" },
                                { icon: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63a19.79 19.79 0 01-3.07-8.63A2 2 0 012.18 0h3a2 2 0 012 1.72c.12.96.36 1.9.72 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.55-.55a2 2 0 012.11-.45c.91.36 1.85.6 2.81.72A2 2 0 0122 16.92z" />, label: "Direct Line", val: "+91 63678 50548" },
                                { icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>, label: "Email", val: "reservations@hotelgrandeagle.com" },
                                { icon: <><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></>, label: "Concierge", val: "24 hours, 7 days a week" },
                            ].map((item, i) => (
                                <Fade key={i}>
                                    <div className="vh-contact-item">
                                        <div className="vh-contact-icon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">{item.icon}</svg>
                                        </div>
                                        <div>
                                            <span className="vh-contact-lbl">{item.label}</span>
                                            <span className="vh-contact-val">{item.val}</span>
                                        </div>
                                    </div>
                                </Fade>
                            ))}
                        </div>
                    </div>

                    <Fade>
                        <div className="vh-form-card">
                            <div className="vh-form-subtitle">Enquiry Form</div>
                            <div className="vh-form-title">Tell us about your visit</div>
                            {formSent ? (
                                <div style={{ padding: "40px 0", textAlign: "center" }}>
                                    <div style={{ width: 56, height: 56, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", borderRadius: "50%" }}>
                                        <div style={{ width: 10, height: 10, background: "var(--accent)", borderRadius: "50%" }} />
                                    </div>
                                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 24, color: "var(--text)", fontWeight: 600, marginBottom: 10 }}>Thank You</div>
                                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 260, margin: "0 auto" }}>Your enquiry has reached our team. Expect a response soon.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit}>
                                    <div className="vh-form-row">
                                        <input className="vh-form-input" type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                                        <input className="vh-form-input" type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                                    </div>
                                    <input className="vh-form-input" type="tel" placeholder="Phone Number" style={{ marginBottom: 12, width: "100%", display: "block" }} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                                    <div className="vh-form-row">
                                        <div>
                                            <label className="vh-input-label">Check In</label>
                                            <input className="vh-form-input" type="date" value={form.checkIn} onChange={e => setForm(p => ({ ...p, checkIn: e.target.value }))} />
                                        </div>
                                        <div>
                                            <label className="vh-input-label">Check Out</label>
                                            <input className="vh-form-input" type="date" value={form.checkOut} onChange={e => setForm(p => ({ ...p, checkOut: e.target.value }))} />
                                        </div>
                                    </div>
                                    <select className="vh-form-select" style={{ marginBottom: 12, width: "100%", display: "block" }} value={form.guests} onChange={e => setForm(p => ({ ...p, guests: e.target.value }))}>
                                        <option value="">Number of Guests</option>
                                        {["1 Guest", "2 Guests", "3 Guests", "4 Guests", "5+ Guests"].map(g => <option key={g}>{g}</option>)}
                                    </select>
                                    <textarea className="vh-form-textarea" rows={4} placeholder="Special requests or questions..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                                    <button className="vh-btn-submit" type="submit">
                                        Send Enquiry
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9" /></svg>
                                    </button>
                                    <div className="vh-form-note">Our team will respond within 2 hours.</div>
                                </form>
                            )}
                        </div>
                    </Fade>
                </div>
            </section>

            {/* Lightbox */}
            {lightboxSrc && (
                <div className="vh-lightbox open" onClick={closeLightbox}>
                    <button className="vh-lightbox-close" onClick={closeLightbox}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                    <img src={lightboxSrc} alt="Gallery" onClick={e => e.stopPropagation()} />
                </div>
            )}
        </>
    );
}
