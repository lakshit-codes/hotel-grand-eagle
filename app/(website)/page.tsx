"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Rooms from "./components/Rooms";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import type { CMSPage, HeroSection, HomeTextSection, HomeQuoteSection, HomeTestimonialsSection, TextImageSection, AboutSection } from "../components/types";

// ─── Highlight helper (same as About page) ────────────────────────────────────

function renderWithHighlights(text: string, terms: string): React.ReactNode {
    if (!terms?.trim()) return text;
    const termList = terms.split(",").map(t => t.trim()).filter(Boolean).sort((a, b) => b.length - a.length);
    if (termList.length === 0) return text;
    const escaped = termList.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) => {
                const isMatch = termList.some(t => t.toLowerCase() === part.toLowerCase());
                return isMatch
                    ? <strong key={i} style={{ color: "var(--gold)" }}>{part}</strong>
                    : <React.Fragment key={i}>{part}</React.Fragment>;
            })}
        </>
    );
}

function renderParagraphs(description: string, highlightTerms: string) {
    const paras = (description || "").split(/\n+/).filter(p => p.trim());
    if (paras.length === 0) return null;
    return (
        <>
            {paras.map((para, i) => (
                <p key={i} className="fade-in-up visible" style={{ marginBottom: i < paras.length - 1 ? "20px" : 0 }}>
                    {renderWithHighlights(para, highlightTerms)}
                </p>
            ))}
        </>
    );
}

// ─── Hero Section Renderer ────────────────────────────────────────────────────

function HeroRenderer({ sec }: { sec: HeroSection }) {
    const router = useRouter();
    const today = new Date().toLocaleDateString('en-CA');
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toLocaleDateString('en-CA');

    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState(tomorrow);
    const [activeImg, setActiveImg] = useState(0);

    const images = sec.images?.length > 0
        ? sec.images
        : [{ url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop" }];

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => setActiveImg(i => (i + 1) % images.length), 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCheckIn = e.target.value;
        setCheckIn(newCheckIn);
        const cin = new Date(newCheckIn);
        const cout = new Date(checkOut);
        if (cout <= cin) {
            const nextDay = new Date(cin);
            nextDay.setDate(nextDay.getDate() + 1);
            setCheckOut(nextDay.toISOString().split("T")[0]);
        }
    };

    const title = sec.title || "Smart, Simple";
    const titleEm = sec.titleEm || "Comfort";
    const subtitle = sec.subtitle || "An intimate retreat in the heart of Sitapura, Jaipur — where affordability meets the warmth of genuine hospitality.";
    const primaryBtnLabel = sec.primaryButtonLabel || "Explore Rooms";
    const primaryBtnLink = sec.primaryButtonLink || "#rooms";
    const secondaryBtnLabel = sec.secondaryButtonLabel || "Our Story";
    const secondaryBtnLink = sec.secondaryButtonLink || "#about";
    const stats = sec.stats?.length > 0 ? sec.stats : [
        { id: "s1", value: "24+", label: "Years of Excellence" },
        { id: "s2", value: "340+", label: "Happy Guests" },
        { id: "s3", value: "4.9", label: "Guest Rating" },
    ];

    return (
        <section className="hero" id="hero">
            {/* Background images (slider) */}
            {images.map((img, idx) => (
                <div
                    key={idx}
                    className="hero-bg"
                    style={{
                        backgroundImage: `url('${img.url}')`,
                        opacity: activeImg === idx ? 1 : 0,
                        transition: "opacity 1.5s ease-in-out",
                        zIndex: activeImg === idx ? 1 : 0,
                    }}
                />
            ))}
            <div className="hero-grad1" style={{ zIndex: 2 }} />
            <div className="hero-grad2" style={{ zIndex: 2 }} />

            {/* Slide dots */}
            {images.length > 1 && (
                <div className="slide-dots" style={{ zIndex: 10 }}>
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`dot${activeImg === idx ? " active" : ""}`}
                            onClick={() => setActiveImg(idx)}
                        />
                    ))}
                </div>
            )}

            <div className="hero-inner">
                <div className="hero-content fade-in-up visible">
                    <div className="hero-eyebrow">
                        <div className="eyebrow-line" />
                        <span className="eyebrow-text">WELCOME TO HOTEL GRAND EAGLE</span>
                    </div>

                    <h1 className="hero-headline font-display">
                        {title}<br /><em>{titleEm}</em>
                    </h1>

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

                {/* Stats */}
                <div className="hero-stats fade-in-up visible">
                    {stats.map(s => (
                        <div key={s.id} className="hero-stat">
                            <span className="stat-num font-display">{s.value}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Booking bar */}
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
                            <input type="date" value={checkIn} min={today} onChange={handleCheckInChange}
                                onClick={(e) => { try { (e.target as HTMLInputElement).showPicker(); } catch { } }} />
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
                            <input type="date" value={checkOut}
                                min={new Date(new Date(checkIn).getTime() + 86400000).toISOString().split("T")[0]}
                                onChange={e => setCheckOut(e.target.value)}
                                onClick={(e) => { try { (e.target as HTMLInputElement).showPicker(); } catch { } }} />
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

                    <button className="btn-search" onClick={() => router.push(`/book?checkIn=${checkIn}&checkOut=${checkOut}`)}>
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

// ─── Text+Image Section Renderer ──────────────────────────────────────────────

function TextImageRenderer({ sec }: { sec: HomeTextSection }) {
    const isLeft = sec.imagePosition === "left";
    return (
        <section id="about" style={{ padding: "112px 0", background: "#0E0E0E" }}>
            <div className="max-w">
                <div className="about-grid">
                    {isLeft && (
                        <div className="about-imgs">
                            <div className="about-gold-bar" />
                            <div className="about-main-img fade-in-up visible">
                                {sec.images && sec.images.length > 0 ? (
                                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                        {sec.images.map((img, idx) => (
                                            <div key={idx} style={{ 
                                                position: idx === 0 ? "relative" : "absolute", 
                                                top: 0, left: 0, width: "100%", height: "100%",
                                                opacity: 1, // Simple for now, can add slider logic
                                                display: idx === 0 ? "block" : "none"
                                            }}>
                                                <img src={img.url} alt={sec.heading || "Section"} style={{ width: "100%", height: "110%", marginTop: "-5%", objectFit: "cover" }} />
                                            </div>
                                        ))}
                                    </div>
                                ) : <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} />}
                                <div className="about-img-overlay" />
                            </div>
                            {sec.stats?.[0] && (
                                <div className="about-stat-card fade-in-up visible">
                                    <div className="about-stat-num font-display">{sec.stats[0].value}</div>
                                    <div className="about-stat-label">{sec.stats[0].label}</div>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="about-text" style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#a0a0a0" }}>
                        <h2 className="section-title fade-in-up visible" style={{ fontSize: 36, marginBottom: 32, lineHeight: 1.2, color: "var(--ivory)" }}>
                            {sec.heading.includes("\n")
                                ? sec.heading.split("\n").map((line, i) => <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>)
                                : <>{sec.heading.split(" ").slice(0, -1).join(" ")} <em>{sec.heading.split(" ").slice(-1)}</em></>
                            }
                        </h2>
                        {renderParagraphs(sec.description, sec.highlightTerms)}
                        {(sec.pillars && sec.pillars.length > 0) ? (
                            <div className="pillars" style={{ marginTop: 40 }}>
                                {sec.pillars.map(p => (
                                    <div key={p.id} className="pillar fade-in-up">
                                        <div className="pillar-icon">{p.icon}</div>
                                        <div>
                                            <div className="pillar-title">{p.title}</div>
                                            <div className="pillar-desc">{p.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            (sec.stats?.length ?? 0) > 1 && (
                                <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap" }}>
                                    {sec.stats.slice(1).map(stat => (
                                        <div key={stat.id} className="about-stat-card fade-in-up visible" style={{ position: "static" }}>
                                            <div className="about-stat-num font-display">{stat.value}</div>
                                            <div className="about-stat-label">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                    {!isLeft && (
                        <div className="about-imgs">
                            <div className="about-gold-bar" />
                            <div className="about-main-img fade-in-up visible">
                                {sec.images && sec.images.length > 0 ? (
                                    <div style={{ position: "relative", width: "100%", height: "100%" }}>
                                        {sec.images.map((img, idx) => (
                                            <div key={idx} style={{ 
                                                position: idx === 0 ? "relative" : "absolute", 
                                                top: 0, left: 0, width: "100%", height: "100%",
                                                opacity: 1,
                                                display: idx === 0 ? "block" : "none"
                                            }}>
                                                <img src={img.url} alt={sec.heading || "Section"} style={{ width: "100%", height: "110%", marginTop: "-5%", objectFit: "cover" }} />
                                            </div>
                                        ))}
                                    </div>
                                ) : <div style={{ width: "100%", height: "100%", background: "#1a1a1a" }} />}
                                <div className="about-img-overlay" />
                            </div>
                            {sec.stats?.[0] && (
                                <div className="about-stat-card fade-in-up visible">
                                    <div className="about-stat-num font-display">{sec.stats[0].value}</div>
                                    <div className="about-stat-label">{sec.stats[0].label}</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// ─── Quote Renderer ───────────────────────────────────────────────────────────

function QuoteRenderer({ sec }: { sec: HomeQuoteSection }) {
    return (
        <div style={{ background: "rgba(212, 168, 87, 0.05)", padding: "100px 40px", textAlign: "center", borderRadius: "1px", border: "1px solid rgba(212, 168, 87, 0.1)", margin: "0 0 80px" }}>
            <div className="section-eyebrow fade-in-up visible" style={{ justifyContent: "center" }}>
                <span>{sec.eyebrow || "The Vision"}</span>
            </div>
            <blockquote className="font-display fade-in-up visible"
                style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "var(--ivory)", fontStyle: "italic", maxWidth: 800, margin: "24px auto" }}>
                {sec.text}
            </blockquote>
        </div>
    );
}

// ─── Static fallback (when no CMS data) ──────────────────────────────────────

const STATIC_HERO: HeroSection = {
    id: "static_hero",
    type: "hero",
    title: "Smart, Simple",
    titleEm: "Comfort",
    subtitle: "An intimate retreat in the heart of Sitapura, Jaipur — where affordability meets the warmth of genuine hospitality.",
    primaryButtonLabel: "Explore Rooms",
    primaryButtonLink: "#rooms",
    secondaryButtonLabel: "Our Story",
    secondaryButtonLink: "#about",
    images: [{ url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop" }],
    stats: [
        { id: "s1", value: "24+", label: "Years of Excellence" },
        { id: "s2", value: "340+", label: "Happy Guests" },
        { id: "s3", value: "4.9", label: "Guest Rating" },
    ],
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
    const [cmsData, setCmsData] = useState<CMSPage | null>(null);

    useEffect(() => {
        fetch("/api/pages?slug=home")
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.slug === "home") setCmsData(d); })
            .catch(() => {});
    }, []);

    // Scroll animation observer
    useEffect(() => {
        const fadeEls = document.querySelectorAll(".fade-in-up");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        (entry.target as HTMLElement).style.transitionDelay = (i * 0.06) + "s";
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "-50px" }
        );
        fadeEls.forEach(el => { el.classList.remove("visible"); observer.observe(el); });
        return () => observer.disconnect();
    }, [cmsData]);

    const useCMS = cmsData?.isPublished && cmsData?.sections && (cmsData.sections as any[]).length > 0;
    const sections: any[] = useCMS ? (cmsData!.sections as any[]) : [STATIC_HERO];

    // Find if there is a CMS-managed hero or a text-image "about" section
    const heroSection = sections.find(s => s.type === "hero") as HeroSection | undefined;
    const textImageSections = sections.filter(s => s.type === "text-image") as HomeTextSection[];
    const quoteSections = sections.filter(s => s.type === "quote") as HomeQuoteSection[];
    const testimSections = sections.filter(s => s.type === "testimonials") as HomeTestimonialsSection[];
    const hasCustomAbout = textImageSections.length > 0 || quoteSections.length > 0 || testimSections.length > 0;

    return (
        <>
            {/* Hero */}
            {heroSection
                ? <HeroRenderer sec={heroSection} />
                : <HeroRenderer sec={STATIC_HERO} />
            }

            {/* Rooms (always rendered) */}
            <Rooms />

            {/* Dynamic CMS text/image and quote sections */}
            {hasCustomAbout ? (
                <>
                    {sections
                        .filter(s => s.type === "text-image" || s.type === "quote" || s.type === "testimonials")
                        .map(sec => {
                            if (sec.type === "text-image") return <TextImageRenderer key={sec.id} sec={sec as HomeTextSection} />;
                            if (sec.type === "quote") return <QuoteRenderer key={sec.id} sec={sec as HomeQuoteSection} />;
                            if (sec.type === "testimonials") return <Testimonials key={sec.id} eyebrow={sec.eyebrow} title={sec.heading} titleEm={sec.headingEm} />;
                            return null;
                        })
                    }
                </>
            ) : (
                /* Static About component as fallback */
                <StaticAbout />
            )}

            {!testimSections.length && <Testimonials />}
            <Contact />
        </>
    );
}

// ─── Static About fallback ────────────────────────────────────────────────────

function StaticAbout() {
    return (
        <section id="about" style={{ padding: "112px 0", background: "#0E0E0E" }}>
            <div className="max-w">
                <div className="about-grid">
                    <div className="about-imgs">
                        <div className="about-gold-bar" />
                        <div className="about-main-img fade-in-up visible">
                            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800" alt="Hotel Grand Eagle" style={{ width: "100%", height: "110%", marginTop: "-5%", objectFit: "cover" }} />
                            <div className="about-img-overlay" />
                        </div>
                        <div className="about-stat-card fade-in-up visible">
                            <div className="about-stat-num font-display">24+</div>
                            <div className="about-stat-label">Years of Excellence</div>
                        </div>
                    </div>
                    <div className="about-text" style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#a0a0a0" }}>
                        <div className="section-eyebrow fade-in-up visible">
                            <div className="line" />
                            <span>Our Heritage</span>
                        </div>
                        <h2 className="section-title fade-in-up visible" style={{ fontSize: 36, marginBottom: 32, lineHeight: 1.2, color: "var(--ivory)" }}>
                            Budget-Friendly Stay in <em>Jaipur</em>
                        </h2>
                        <p className="fade-in-up visible" style={{ marginBottom: 20 }}>
                            Hotel Grand Eagle is a <strong style={{ color: "var(--gold)" }}>value-for-money hotel</strong> offering clean, well-furnished rooms tailored for both business travelers and tourists.
                        </p>
                        <p className="fade-in-up visible">
                            Located near <strong style={{ color: "var(--gold)" }}>JECC</strong>, major transport hubs, and local food joints, our hotel is perfect for <strong style={{ color: "var(--gold)" }}>budget-conscious travelers</strong> seeking convenience and accessibility.
                        </p>
                        <div className="pillars">
                            {[
                                { icon: "🌙", title: "Elegant Comfort", desc: "Thoughtfully designed spaces" },
                                { icon: "🍽", title: "Fine Dining", desc: "Culinary excellence" },
                                { icon: "✨", title: "Personalized Service", desc: "Tailored to your needs" },
                                { icon: "📍", title: "Prime Location", desc: "Heart of Sitapura, Jaipur" },
                            ].map(p => (
                                <div key={p.title} className="pillar">
                                    <div className="pillar-icon">{p.icon}</div>
                                    <div>
                                        <div className="pillar-title">{p.title}</div>
                                        <div className="pillar-desc">{p.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
