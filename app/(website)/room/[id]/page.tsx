"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Room, AmenityCat } from "../../../components/types";
import Loading from "../../components/Loading";
import { 
  FaWifi, FaBolt, FaSnowflake, FaConciergeBell, FaShower, FaTv, FaBed, FaUserFriends, FaRulerCombined, FaChevronLeft, FaChevronRight, FaHotTub 
} from "react-icons/fa";
import { 
  MdAir, MdElevator, MdCleaningServices, MdOutput, MdRestaurant, MdRoomService, MdKitchen, MdOutlinePolicy, MdOutlineCoffeeMaker 
} from "react-icons/md";
import { BiFridge } from "react-icons/bi";
import { IoShieldCheckmarkOutline, IoWaterOutline } from "react-icons/io5";

const ICON_MAP: Record<string, React.ReactNode> = {
  "Room Service": <MdRoomService />,
  "Refrigerator": <BiFridge />,
  "Power Backup": <FaBolt />,
  "Elevator / Lift": <MdElevator />,
  "Housekeeping": <MdCleaningServices />,
  "Air Conditioning": <FaSnowflake />,
  "Wi-Fi (Free)": <FaWifi />,
  "Express Check-out": <MdOutput />,
  "Restaurant (On-site)": <MdRestaurant />,
  "24h Room Dining": <FaConciergeBell />,
  "Safe Deposit Box": <IoShieldCheckmarkOutline />,
  "Mineral Water": <IoWaterOutline />,
  "Smart TV": <FaTv />,
  "Rain Shower": <FaShower />,
  "Coffee Maker": <MdOutlineCoffeeMaker />,
  "Geyser": <FaHotTub />,
  "24hr Service": <FaConciergeBell />,
};

const DEFAULT_ICON = <IoShieldCheckmarkOutline />;

function RoomDetailContent() {
    const params = useParams();
    const router = useRouter();
    const roomId = params?.id as string;
    
    const [room, setRoom] = useState<Room | null>(null);
    const [amenities, setAmenities] = useState<AmenityCat[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        if (!roomId) return;
        
        const fetchData = async () => {
            try {
                const [rRes, aRes] = await Promise.all([
                    fetch("/api/room-types"),
                    fetch("/api/amenities")
                ]);
                
                const rData: Room[] = await rRes.json();
                const aData: AmenityCat[] = await aRes.json();
                
                const match = rData.find(r => r.id === roomId);
                if (match) {
                    setRoom(match);
                }
                setAmenities(aData);
            } catch (err) {
                console.error("Error fetching room details:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [roomId]);

    useEffect(() => {
        if (loading) return;
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
        return () => observer.disconnect();
    }, [loading]);

    if (loading) return <Loading />;
    if (!room) {
        return (
            <div style={{ background: "var(--midnight)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--ivory)" }}>
                <h1 className="font-display" style={{ fontSize: 48, marginBottom: 24 }}>Room Not Found</h1>
                <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>Return to Home</Link>
            </div>
        );
    }

    const nextImg = () => setActiveImg(i => (i + 1) % (room.images?.length || 1));
    const prevImg = () => setActiveImg(i => (i - 1 + (room.images?.length || 1)) % (room.images?.length || 1));

    return (
        <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: "120px", paddingBottom: "100px" }}>
            <div className="max-w">
                
                {/* Back Link */}
                <div className="fade-in-up" style={{ marginBottom: 32 }}>
                    <Link href="/#rooms" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--gold)", fontSize: 13, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        <FaChevronLeft size={10} /> Back to Collection
                    </Link>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "64px", alignItems: "start" }}>
                    
                    {/* Left Side: Images and Description */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
                        
                        {/* Image Slider */}
                        <div className="fade-in-up" style={{ position: "relative", borderRadius: 4, overflow: "hidden", aspectRatio: "16/9", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,168,87,0.15)" }}>
                            {room.images && room.images.length > 0 ? (
                                <>
                                    <img 
                                        src={room.images[activeImg]} 
                                        alt={room.roomName} 
                                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.5s ease" }} 
                                    />
                                    {room.images.length > 1 && (
                                        <>
                                            <button onClick={prevImg} style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(212,168,87,0.3)", color: "var(--gold)", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, transition: "background 0.3s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--gold)"} onMouseLeave={e => e.currentTarget.style.color = "var(--gold)"}>
                                                <FaChevronLeft />
                                            </button>
                                            <button onClick={nextImg} style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(212,168,87,0.3)", color: "var(--gold)", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}>
                                                <FaChevronRight />
                                            </button>
                                            <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 10, zIndex: 10 }}>
                                                {room.images.map((_: string, idx: number) => (
                                                    <div 
                                                        key={idx} 
                                                        onClick={() => setActiveImg(idx)}
                                                        style={{ width: 8, height: 8, borderRadius: "50%", background: activeImg === idx ? "var(--gold)" : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "all 0.3s" }} 
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                    <div style={{ position: "absolute", top: 24, right: 24, background: "var(--gold)", color: "var(--midnight)", padding: "10px 20px", fontSize: 18, fontWeight: 700, fontFamily: "'Cormorant Garamond', serif", zIndex: 10 }}>
                                        ₹{room.basePrice?.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.8 }}>/night</span>
                                    </div>
                                </>
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ivory-dim)" }}>No image available</div>
                            )}
                        </div>

                        {/* Description Section */}
                        <div className="fade-in-up">
                            <div className="section-eyebrow" style={{ marginBottom: 16 }}>
                                <span className="line"></span>
                                <span>{room.roomCategory}</span>
                            </div>
                            <h1 className="font-display" style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "var(--ivory)", marginBottom: 32 }}>
                                {room.roomName.split(' ').slice(0, -1).join(' ')} <em>{room.roomName.split(' ').slice(-1)}</em>
                            </h1>
                            
                            <div style={{ display: "flex", gap: "40px", marginBottom: "40px", flexWrap: "wrap", borderTop: "1px solid rgba(212,168,87,0.1)", borderBottom: "1px solid rgba(212,168,87,0.1)", padding: "24px 0" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <FaBed color="var(--gold)" size={18} />
                                    <div>
                                        <div style={{ fontSize: 10, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Bed Type</div>
                                        <div style={{ fontSize: 14, color: "var(--ivory)" }}>{room.bedType}</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <FaUserFriends color="var(--gold)" size={18} />
                                    <div>
                                        <div style={{ fontSize: 10, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Capacity</div>
                                        <div style={{ fontSize: 14, color: "var(--ivory)" }}>{room.maxOccupancy} Guests</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <FaRulerCombined color="var(--gold)" size={18} />
                                    <div>
                                        <div style={{ fontSize: 10, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Room Size</div>
                                        <div style={{ fontSize: 14, color: "var(--ivory)" }}>{room.roomSize} m²</div>
                                    </div>
                                </div>
                            </div>

                            <p style={{ fontSize: 16, color: "var(--ivory-dim)", lineHeight: 1.85, marginBottom: 32 }}>
                                A well-designed and affordable stay offering comfort, convenience, and all the essentials for a relaxing experience.
                            </p>
                            
                            {/* Image Gallery */}
                            {room.images && room.images.length > 0 && (
                                <div style={{ marginTop: 48 }}>
                                    <h3 className="font-display" style={{ fontSize: 24, color: "var(--ivory)", marginBottom: 24 }}>Room <em>Gallery</em></h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                                        {room.images.map((img: string, idx: number) => (
                                            <div 
                                                key={idx} 
                                                className="fade-in-up"
                                                style={{ 
                                                    borderRadius: 4, 
                                                    overflow: "hidden", 
                                                    aspectRatio: "3/2", 
                                                    border: "1px solid rgba(212,168,87,0.1)",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => setActiveImg(idx)}
                                            >
                                                <img 
                                                    src={img} 
                                                    alt={`${room.roomName} ${idx + 1}`} 
                                                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                                                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                                                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Sidebar Booking Card */}
                    <div className="fade-in-up" style={{ position: "sticky", top: 120 }}>
                        <div style={{ background: "var(--charcoal)", border: "1px solid rgba(212,168,87,0.2)", padding: 40, textAlign: "center" }}>
                            <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Check Availability</div>
                            <h3 className="font-display" style={{ fontSize: 32, color: "var(--ivory)", marginBottom: 24 }}>Plan Your <em>Stay</em></h3>
                            <p style={{ fontSize: 14, color: "var(--ivory-dim)", lineHeight: 1.7, marginBottom: 32 }}>
                                Select your dates and discover the perfect timeline for your Jaipur retreat.
                            </p>
                            <Link href={`/book?room=${room.slug}`} className="btn-primary" style={{ width: "100%", display: "block", textDecoration: "none", boxSizing: "border-box" }}>
                                Book This Room
                            </Link>
                            
                            <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(212,168,87,0.1)", display: "flex", flexDirection: "column", gap: 20 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16, textAlign: "left" }}>
                                    <MdOutlinePolicy color="var(--gold)" size={20} />
                                    <div>
                                        <div style={{ fontSize: 11, color: "var(--ivory)", fontWeight: 600 }}>Policy</div>
                                        <div style={{ fontSize: 11, color: "var(--ivory-dim)" }}>{room.refundable ? "Free Cancellation" : "Non-refundable"}</div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 16, textAlign: "left" }}>
                                    <FaChevronRight color="var(--gold)" size={12} />
                                    <div>
                                        <div style={{ fontSize: 11, color: "var(--ivory)", fontWeight: 600 }}>Check-in/out</div>
                                        <div style={{ fontSize: 11, color: "var(--ivory-dim)" }}>12:00 PM / 11:00 AM</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .fade-in-up {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                .fade-in-up.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
}

export default function RoomDetailPage() {
    return (
        <Suspense fallback={<Loading />}>
            <RoomDetailContent />
        </Suspense>
    );
}
