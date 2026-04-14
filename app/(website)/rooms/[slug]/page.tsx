"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Room, AmenityCat } from "../../../components/types";

export default function RoomDetailsPage() {
    const params = useParams();
    const [room, setRoom] = useState<Room | null>(null);
    const [amenities, setAmenities] = useState<AmenityCat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const slug = params?.slug as string;
        if (!slug) return;

        Promise.all([
            fetch("/api/room-types").then(r => r.json()),
            fetch("/api/amenities").then(r => r.json())
        ]).then(([rData, aData]) => {
            const found = rData.find((rm: Room) => rm.slug === slug);
            if (found) setRoom(found);
            if (aData && Array.isArray(aData)) setAmenities(aData);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [params]);

    if (loading) {
        return (
            <div className="rd-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '13px' }}>
                    Loading...
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="rd-container" style={{ textAlign: 'center', paddingTop: '160px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 40px' }}>
                    <h1 className="rd-section-title" style={{ border: 'none', padding: 0, textAlign: 'center' }}>Sanctuary Not Found</h1>
                    <p style={{ color: 'var(--ivory-dim)', marginBottom: '40px', lineHeight: 1.8 }}>The specific retreat you are looking for may have been moved or is currently being renewed.</p>
                    <Link href="/rooms" className="btn-outline">Return to Collection</Link>
                </div>
            </div>
        );
    }

    const facilityMap = amenities.reduce<Record<string, string>>((acc, cat) => {
        if (cat.facilities && Array.isArray(cat.facilities)) {
            cat.facilities.forEach(fac => { acc[fac.id] = fac.name; });
        }
        return acc;
    }, {});

    const heroImg = room.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop';
    const gallery = room.images?.slice(1) || [];

    return (
        <div className="rd-container">
            {/* Hero Section */}
            <div className="rd-hero">
                <div className="rd-hero-bg">
                    <img src={heroImg} alt={room.roomName} />
                </div>
                <div className="rd-hero-overlay"></div>
                <div className="rd-hero-content">
                    <span className="rd-hero-eyebrow">{room.roomCategory}</span>
                    <h1 className="rd-hero-title">{room.roomName}</h1>
                </div>
            </div>

            <div className="max-w">
                <div className="rd-grid">

                    {/* Main Content */}
                    <div className="rd-content-main" style={{ gap: '48px' }}>
                        {/* Room Overview */}
                        <div>
                            <h2 className="rd-section-title">Room Overview</h2>
                            <div className="rd-desc">
                                A well-designed and affordable stay offering comfort, convenience, and all the essentials for a relaxing experience.
                            </div>
                        </div>

                        {/* Amenities */}
                        {room.amenityIds?.length > 0 && (
                            <div>
                                <h2 className="rd-section-title">In-Room Amenities</h2>
                                <div className="rd-amenities-grid">
                                    {room.amenityIds.map(id => (
                                        <div key={id} className="rd-amenity-item">
                                            <span className="rd-amenity-icon">✓</span>
                                            <span className="rd-amenity-text">{facilityMap[id] || id}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery */}
                        {gallery.length > 0 && (
                            <div>
                                <h2 className="rd-section-title">Visual Gallery</h2>
                                <div className="rd-gallery-grid">
                                    {gallery.map((img, i) => (
                                        <div key={i} className="rd-gallery-item">
                                            <img src={img} alt={`${room.roomName} detail`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="rd-sidebar-card">
                            <span className="rd-sidebar-price-label">Starting From</span>
                            <span className="rd-sidebar-price">
                                ₹{room.basePrice.toLocaleString()} <span>/night</span>
                            </span>

                            <div className="rd-sidebar-meta">
                                <div className="rd-sidebar-meta-item">
                                    <span>Extra Bed Option</span>
                                    <span className="rd-sidebar-meta-val">{room.extraBedPrice > 0 ? `+₹${room.extraBedPrice}` : "Available"}</span>
                                </div>
                                <div className="rd-sidebar-meta-item">
                                    <span>Booking Policy</span>
                                    <span className="rd-sidebar-meta-val">{room.refundable ? "Refundable" : "Non-Refundable"}</span>
                                </div>
                                <div className="rd-sidebar-meta-item">
                                    <span>Check-in</span>
                                    <span className="rd-sidebar-meta-val">14:00 PM</span>
                                </div>
                            </div>

                            <Link href={`/book?room=${room.slug}`} className="rd-btn-book">
                                Book Now
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>

                            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: 'var(--ivory-dim)', lineHeight: 1.6 }}>
                                Best price guaranteed when booking directly through our sanctuary portal.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
