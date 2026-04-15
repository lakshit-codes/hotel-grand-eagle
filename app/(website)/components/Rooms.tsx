"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Room, AmenityCat } from "../../components/types";
import { 
  FaWifi, FaBolt, FaSnowflake, FaConciergeBell, FaShower, FaTv 
} from "react-icons/fa";
import { 
  MdAir, MdElevator, MdCleaningServices, MdOutput, MdRestaurant, MdRoomService, MdKitchen 
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
};

const DEFAULT_ICON = <IoShieldCheckmarkOutline />;

interface RoomsProps {
  roomsData?: any[];
  amenitiesData?: AmenityCat[];
}

export default function Rooms({ roomsData = [], amenitiesData = [] }: RoomsProps) {
  const [rooms, setRooms] = useState<any[]>(roomsData);
  const [amenities, setAmenities] = useState<AmenityCat[]>(amenitiesData);

  useEffect(() => {
    setRooms(roomsData);
    setAmenities(amenitiesData);
  }, [roomsData, amenitiesData]);

  useEffect(() => {
    if (rooms.length === 0) return;
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
  }, [rooms]);

  // Find "Basic" amenities category
  const basicAmenitiesCat = amenities.find(c => 
    c.name.toLowerCase().includes("basic") || c.id.toLowerCase().includes("basic")
  ) || amenities[0];

  const basicFacilities = basicAmenitiesCat?.facilities?.slice(0, 8) || [];

  const isSingleRoom = rooms.length === 1;

  return (
    <section id="rooms" style={{ padding: "112px 0", background: "var(--midnight)" }}>
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
        </div>
      </div>

      <div className="max-w">
        {rooms.length === 0 ? (
          <div style={{ width: "100%", textAlign: "center", color: "var(--ivory-dim)", padding: "80px 0" }}>
            Our sanctuaries are currently being prepared. Check back soon.
          </div>
        ) : isSingleRoom ? (
          <div className="single-room-layout fade-in-up visible">
            <div className="room-card" style={{ width: "100%", maxWidth: "420px", margin: 0 }}>
              <Link href={`/room/${rooms[0]?.id}`} className="room-img-wrap" style={{ display: 'block' }}>
                <img
                  src={rooms[0].images?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800"}
                  alt={rooms[0].roomName}
                  loading="lazy"
                />
                <div className="room-img-overlay"></div>
                <div className="room-price">
                  ₹{rooms[0].basePrice?.toLocaleString()} <span>/night</span>
                </div>
              </Link>
              <div className="room-body">
                <div className="room-cat">{rooms[0].roomCategory}</div>
                <Link href={`/room/${rooms[0]?.id}`} className="room-name font-display" style={{ display: 'block', textDecoration: 'none' }}>
                  {rooms[0].roomName}
                </Link>
                <div className="room-meta">
                  <div className="room-meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    {rooms[0].roomSize} m²
                  </div>
                  <div className="room-meta-dot"></div>
                  <div className="room-meta-item">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9,22 9,12 15,12 15,22" />
                    </svg>
                    {rooms[0].bedType}
                  </div>
                </div>
                <div className="tags">
                  <span className="tag">City View</span>
                  <span className="tag">Free Wi-Fi</span>
                  {rooms[0].roomName !== "Deluxe Room" && <span className="tag">Mini Bar</span>}
                  <span className="tag">24hr Service</span>
                </div>
                <Link href={`/room/${rooms[0]?.id}`} className="btn-room" style={{ textDecoration: 'none' }}>
                  View Details
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="basic-amenities-section">
              <h3 className="amenities-heading font-display" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Basic Amenities</h3>
              <div className="amenities-grid">
                {basicFacilities.length > 0 ? (
                  basicFacilities.map((fac: any) => (
                    <div key={fac.id} className="amenity-item">
                      <div className="amenity-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {ICON_MAP[fac.name] || DEFAULT_ICON}
                      </div>
                      <span className="amenity-label">{fac.name}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "var(--ivory-dim)", fontSize: "14px", opacity: 0.5 }}>
                    Loading premium amenities...
                  </div>
                )}
              </div>
              <p className="amenities-note">
                Everything you need for a comfortable and seamless stay, designed with your convenience in mind.
              </p>
            </div>
          </div>
        ) : (
          <div className="rooms-scroll fade-in-up visible">
            {rooms.map((room, idx) => (
              <div key={idx} className="room-card">
                <Link href={`/room/${room?.id}`} className="room-img-wrap" style={{ display: 'block' }}>
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
                  <Link href={`/room/${room?.id}`} className="room-name font-display" style={{ display: 'block', textDecoration: 'none' }}>
                    {room.roomName}
                  </Link>
                  <div className="room-meta">
                    <div className="room-meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                      {room.roomSize} m²
                    </div>
                    <div className="room-meta-dot"></div>
                    <div className="room-meta-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        <polyline points="9,22 9,12 15,12 15,22" />
                      </svg>
                      {room.bedType}
                    </div>
                  </div>
                  <div className="tags">
                    <span className="tag">City View</span>
                    <span className="tag">Free Wi-Fi</span>
                    {room.roomName !== "Deluxe Room" && <span className="tag">Mini Bar</span>}
                    <span className="tag">24hr Service</span>
                  </div>
                  <Link href={`/room/${room?.id}`} className="btn-room" style={{ textDecoration: 'none' }}>
                    View Details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
            <div style={{ flexShrink: 0, width: "16px" }}></div>
          </div>
        )}
      </div>

      {!isSingleRoom && (
        <div
          style={{
            marginTop: "20px",
            padding: "0 40px",
            fontSize: "11px",
            color: "rgba(200,192,176,0.35)",
            maxWidth: "1400px",
            margin: "20px auto 0"
          }}
        >
          ← Scroll to explore all rooms
        </div>
      )}

      <style jsx>{`
        .single-room-layout {
          display: grid;
          grid-template-columns: 420px 1fr;
          gap: 60px;
          align-items: start;
        }

        .basic-amenities-section {
          padding-top: 20px;
        }

        .amenities-heading {
          font-size: 32px;
          color: var(--gold);
          margin-bottom: 32px;
          font-weight: 300;
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .amenity-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(212, 168, 87, 0.1);
          transition: all 0.3s ease;
        }

        .amenity-item:hover {
          border-color: rgba(212, 168, 87, 0.3);
          background: rgba(212, 168, 87, 0.03);
          transform: translateY(-2px);
        }

        .amenity-icon {
          font-size: 20px;
          color: var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .amenity-label {
          font-size: 13px;
          color: var(--ivory-dim);
          letter-spacing: 0.02em;
        }

        .amenities-note {
          font-size: 14px;
          color: var(--ivory-dim);
          line-height: 1.7;
          max-width: 500px;
          opacity: 0.6;
        }

        @media (max-width: 1024px) {
          .single-room-layout {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .room-card {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}

