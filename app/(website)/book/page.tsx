"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Room, MealPlan } from "../../components/types";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const dtIn = tomorrow.toISOString().split("T")[0];
const dayAfter = new Date(tomorrow);
dayAfter.setDate(dayAfter.getDate() + 1);
const dtOut = dayAfter.toISOString().split("T")[0];

function BookingForm() {
    const searchParams = useSearchParams();
    const initialSlug = searchParams?.get("room") || "";

    const [step, setStep] = useState<1 | 2 | 3>(1);
    
    const [checkIn, setCheckIn] = useState(searchParams?.get("checkIn") || dtIn);
    const [checkOut, setCheckOut] = useState(searchParams?.get("checkOut") || dtOut);
    const [guests, setGuests] = useState(Number(searchParams?.get("guests")) || 2);

    const handleCheckInChange = (val: string) => {
        const newIn = new Date(val);
        const currentOut = new Date(checkOut);
        let newOut = checkOut;
        if (newIn >= currentOut) {
            const nextDay = new Date(newIn);
            nextDay.setDate(nextDay.getDate() + 1);
            newOut = nextDay.toISOString().split("T")[0];
        }
        setCheckIn(val);
        setCheckOut(newOut);
    };
    
    const [loading, setLoading] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [selectedMealPlanId, setSelectedMealPlanId] = useState("");
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    
    const [guestInfo, setGuestInfo] = useState({ firstName: "", lastName: "", email: "", phone: "", specialRequests: "" });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [refId, setRefId] = useState("");

    useEffect(() => {
        fetch("/api/meal-plans").then(r => r.json()).then(d => { if(d.length) setMealPlans(d.filter((m: MealPlan) => m.pricePerPersonPerNight >= 0)); }).catch(() => {});
        
        // Handle animations
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
    }, [step, success]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
            const physicalRooms: any[] = await res.json();
            const rtRes = await fetch("/api/room-types");
            const rtData: Room[] = await rtRes.json();
            
            const availableTypes = rtData.filter(rt => physicalRooms.some(pr => pr.roomTypeId === rt.id));
            setAvailableRooms(availableTypes);
            setStep(2);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    const handleSelectRoom = (roomId: string) => {
        setSelectedRoomId(roomId);
        if (mealPlans.length > 0) setSelectedMealPlanId(mealPlans[0].id);
        setStep(3);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const rRes = await fetch(`/api/rooms?checkIn=${checkIn}&checkOut=${checkOut}&roomTypeId=${selectedRoomId}`);
            const pRooms = await rRes.json();
            
            if (!pRooms.length) {
                alert("Sorry, rooms of this type are no longer available for these dates.");
                setStep(1);
                return;
            }
            
            const targetPhysicalRoom = pRooms[0];
            const roomType = availableRooms.find(r => r.id === selectedRoomId);
            const mealPlan = mealPlans.find(m => m.id === selectedMealPlanId);
            
            const d1 = new Date(checkIn); const d2 = new Date(checkOut);
            const nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
            const rt = roomType!.basePrice;
            const mp = mealPlan ? mealPlan.pricePerPersonPerNight * guests : 0;
            const ttl = (rt + mp) * nights;

            const br = `BK${Math.floor(Date.now() / 1000).toString().slice(-6)}`;
            
            const bookingPayload = {
                id: crypto.randomUUID(),
                bookingRef: br,
                customerId: "",
                guestName: `${guestInfo.firstName} ${guestInfo.lastName}`.trim(),
                guestEmail: guestInfo.email,
                guestPhone: guestInfo.phone,
                checkIn: checkIn,
                checkOut: checkOut,
                nights,
                adults: guests,
                children: 0,
                coGuests: [],
                roomTypeId: selectedRoomId,
                roomTypeName: roomType!.roomName,
                roomNumber: targetPhysicalRoom.roomNumber,
                mealPlanId: selectedMealPlanId,
                mealPlanCode: mealPlan?.code || "RO",
                totalRoomCost: rt * nights,
                totalMealCost: mp * nights,
                grandTotal: ttl,
                currency: "INR",
                status: "confirmed",
                bookingSource: "Website",
                specialRequests: guestInfo.specialRequests,
                createdAt: new Date().toISOString(),
            };

            const bookRes = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingPayload)
            });

            if (bookRes.status === 409) {
                alert("Conflict: The room was just booked by someone else. Please try again.");
                setStep(1);
                return;
            }
            setRefId(br);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            alert("An error occurred while confirming your booking.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, paddingBottom: 112 }}>
                <div className="max-w" style={{ maxWidth: 640 }}>
                    <div className="fade-in-up" style={{ background: "var(--charcoal)", border: "1px solid rgba(212,168,87,0.2)", padding: 60, textAlign: "center" }}>
                        <div className="success-icon" style={{ margin: "0 auto 32px" }}>
                            <div className="success-diamond"></div>
                        </div>
                        <h2 className="section-title font-display" style={{ fontSize: 42, marginBottom: 16 }}>Reservation <em>Confirmed</em></h2>
                        <p style={{ color: "var(--ivory-dim)", fontSize: 15, lineHeight: 1.8, marginBottom: 40 }}>
                            Thank you for choosing Hotel Grand Eagle. Your sanctuary awaits. A confirmation email has been sent to <strong style={{ color: "var(--ivory)" }}>{guestInfo.email}</strong>.
                        </p>
                        <div style={{ background: "rgba(212,168,87,0.03)", border: "1px solid rgba(212,168,87,0.1)", padding: 32, marginBottom: 40 }}>
                            <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Booking Reference</div>
                            <div className="font-display" style={{ fontSize: 36, color: "var(--ivory)", letterSpacing: "0.05em" }}>{refId}</div>
                        </div>
                        <Link href="/" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, paddingBottom: 112 }}>
            <div className="max-w">
                
                {/* Steps Header */}
                <div className="fade-in-up" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, marginBottom: 80 }}>
                    {[1, 2, 3].map((s, i) => (
                        <React.Fragment key={s}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: step >= s ? 1 : 0.3, transition: "opacity 0.4s" }}>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${step >= s ? "var(--gold)" : "var(--ivory-dim)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontFamily: "'Cormorant Garamond', serif", color: step >= s ? "var(--gold)" : "var(--ivory-dim)", marginBottom: 10, background: step === s ? "rgba(212,168,87,0.05)" : "transparent" }}>{s}</div>
                                <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: step >= s ? "var(--gold)" : "var(--ivory-dim)", fontWeight: step === s ? "bold" : "normal" }}>
                                    {s === 1 ? "Inquiry" : s === 2 ? "Select" : "Finalize"}
                                </span>
                            </div>
                            {i < 2 && <div style={{ width: 60, height: 1, background: step > s ? "var(--gold)" : "rgba(212,168,87,0.1)", marginTop: -20 }} />}
                        </React.Fragment>
                    ))}
                </div>

                {/* STEP 1: SEARCH */}
                {step === 1 && (
                    <div className="fade-in-up" style={{ maxWidth: 800, margin: "0 auto" }}>
                        <div className="form-card" style={{ padding: 60 }}>
                            <h2 className="section-title font-display" style={{ fontSize: 42, textAlign: "center", marginBottom: 40 }}>Check <em>Sanctuary Availability</em></h2>
                            
                            <form onSubmit={handleSearch} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, alignItems: "end" }}>
                                <div>
                                    <label className="input-label" style={{ color: "var(--ivory-dim)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>Arrival</label>
                                    <input className="form-input" type="date" required value={checkIn} onChange={e => handleCheckInChange(e.target.value)} min={dtIn} style={{ colorScheme: 'dark' }} />
                                </div>
                                <div>
                                    <label className="input-label" style={{ color: "var(--ivory-dim)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>Departure</label>
                                    <input className="form-input" type="date" required value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || dtIn} style={{ colorScheme: 'dark' }} />
                                </div>
                                <div>
                                    <label className="input-label" style={{ color: "var(--ivory-dim)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>Guests</label>
                                    <div style={{ position: "relative" }}>
                                        <select className="form-input" style={{ appearance: "none", cursor: "pointer" }} value={guests} onChange={e => setGuests(Number(e.target.value))}>
                                            {[1, 2, 3, 4, 5].map(g => <option key={g} value={g}>{g} Guest{g > 1 ? 's' : ''}</option>)}
                                        </select>
                                        <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="var(--gold)" strokeWidth="1.5" /></svg>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: 32 }}>
                                    <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "20px 64px" }}>
                                        {loading ? "Searching Cosmos..." : "Search Suites"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* STEP 2: SELECT */}
                {step === 2 && (
                    <div className="fade-in-up" style={{ maxWidth: 1000, margin: "0 auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(212,168,87,0.03)", border: "1px solid rgba(212,168,87,0.1)", padding: "24px 32px", marginBottom: 48 }}>
                            <div style={{ fontSize: 14, color: "var(--ivory-dim)", letterSpacing: "0.05em" }}>
                                Current selection: <span style={{ color: "var(--ivory)" }}>{new Date(checkIn).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} — {new Date(checkOut).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span> · <span style={{ color: "var(--gold)" }}>{guests} Guests</span>
                            </div>
                            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--gold)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", borderBottom: "1px solid var(--gold)" }}>Modify</button>
                        </div>

                        {availableRooms.length === 0 ? (
                            <div style={{ background: "var(--charcoal)", border: "1px solid rgba(212,168,87,0.1)", padding: 80, textAlign: "center" }}>
                                <h3 className="section-title font-display" style={{ fontSize: 32, marginBottom: 16 }}>Fully <em>Reserved</em></h3>
                                <p style={{ color: "var(--ivory-dim)", fontSize: 15, marginBottom: 40 }}>Our sanctuaries are currently at full capacity for your selected timeline.</p>
                                <button onClick={() => setStep(1)} className="btn-primary">Adjust Dates</button>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                                {availableRooms.filter(r => r.maxOccupancy >= guests).map(room => (
                                    <div key={room.id} className="room-card-horizontal" style={{ background: "var(--charcoal)", border: "1px solid rgba(212,168,87,0.1)", display: "flex", height: 340 }}>
                                        <div style={{ width: "40%", overflow: "hidden" }}>
                                            <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000'} alt={room.roomName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </div>
                                        <div style={{ width: "60%", padding: 40, display: "flex", flexDirection: "column" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                                <h3 className="font-display" style={{ fontSize: 32, color: "var(--ivory)" }}>{room.roomName}</h3>
                                                <div style={{ textAlign: "right" }}>
                                                    <div style={{ color: "var(--gold)", fontSize: 28, fontFamily: "'Cormorant Garamond', serif" }}>₹{room.basePrice.toLocaleString()}</div>
                                                    <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Per Night</div>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: 20, fontSize: 11, color: "var(--gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24, opacity: 0.8 }}>
                                                <span>{room.maxOccupancy} Occupancy</span>
                                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", alignSelf: "center" }}></span>
                                                <span>{room.bedType}</span>
                                                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--gold)", alignSelf: "center" }}></span>
                                                <span>{room.roomSize} m²</span>
                                            </div>
                                            <p style={{ fontSize: 14, color: "var(--ivory-dim)", lineHeight: 1.8, flex: 1 }}>Surrender to absolute comfort in a space designed for the discerning traveler. Features include curated artwork, premium linens, and {room.view.toLowerCase()}.</p>
                                            <div style={{ textAlign: "right", marginTop: 24 }}>
                                                <button onClick={() => handleSelectRoom(room.id)} className="btn-primary" style={{ padding: "12px 32px", fontSize: 12 }}>Select Sanctuary</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: DETAILS */}
                {step === 3 && (
                    <div className="fade-in-up" style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 40 }}>
                            {/* Guest Details Form */}
                            <div className="form-card" style={{ padding: 48 }}>
                                <h2 className="section-title font-display" style={{ fontSize: 32, marginBottom: 32 }}>Guest <em>Sanctuary Details</em></h2>
                                <form id="booking-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    <div style={{ display: "flex", gap: 24 }}>
                                        <div style={{ flex: 1 }}>
                                            <label className="input-label" style={{ color: "var(--ivory-dim)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>First Name</label>
                                            <input required className="form-input" type="text" value={guestInfo.firstName} onChange={e => setGuestInfo(p => ({...p, firstName: e.target.value}))} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className="input-label" style={{ color: "var(--ivory-dim)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>Last Name</label>
                                            <input required className="form-input" type="text" value={guestInfo.lastName} onChange={e => setGuestInfo(p => ({...p, lastName: e.target.value}))} />
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 24 }}>
                                        <div style={{ flex: 1 }}>
                                            <label className="input-label" style={{ color: "var(--ivory-dim)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>Email Address</label>
                                            <input required className="form-input" type="email" value={guestInfo.email} onChange={e => setGuestInfo(p => ({...p, email: e.target.value}))} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label className="input-label" style={{ color: "var(--ivory-dim)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>Phone Number</label>
                                            <input required className="form-input" type="tel" value={guestInfo.phone} onChange={e => setGuestInfo(p => ({...p, phone: e.target.value}))} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="input-label" style={{ color: "var(--ivory-dim)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "block" }}>Special Requirements</label>
                                        <textarea className="form-textarea" rows={4} value={guestInfo.specialRequests} onChange={e => setGuestInfo(p => ({...p, specialRequests: e.target.value}))} placeholder="Dietary needs, pillow preferences, or timing requests..." />
                                    </div>
                                </form>
                            </div>

                            {/* Meal Plans */}
                            {mealPlans.length > 0 && (
                                <div className="form-card" style={{ padding: 48 }}>
                                    <h2 className="section-title font-display" style={{ fontSize: 24, marginBottom: 24 }}>Enhance Your <em>Experience</em></h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {mealPlans.map(mp => (
                                            <label key={mp.id} style={{ display: "flex", alignItems: "center", border: `1px solid ${selectedMealPlanId === mp.id ? "var(--gold)" : "rgba(212,168,87,0.1)"}`, background: selectedMealPlanId === mp.id ? "rgba(212,168,87,0.05)" : "transparent", padding: "24px 32px", cursor: "pointer", transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                                                <input type="radio" name="mealPlan" checked={selectedMealPlanId === mp.id} onChange={() => setSelectedMealPlanId(mp.id)} style={{ accentColor: "var(--gold)", width: 18, height: 18 }} />
                                                <div style={{ marginLeft: 24, flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <div>
                                                        <div style={{ fontSize: 16, color: "var(--ivory)", fontWeight: "500", marginBottom: 4 }}>{mp.name}</div>
                                                        <div style={{ fontSize: 11, color: "var(--ivory-dim)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{mp.description || "Gourmet dining experience"}</div>
                                                    </div>
                                                    <div style={{ textAlign: "right" }}>
                                                        <div style={{ color: "var(--gold)", fontSize: 18, fontWeight: "600" }}>+₹{mp.pricePerPersonPerNight.toLocaleString()}</div>
                                                        <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Per Person</div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                        <label style={{ display: "flex", alignItems: "center", border: `1px solid ${selectedMealPlanId === "" ? "var(--gold)" : "rgba(212,168,87,0.1)"}`, background: selectedMealPlanId === "" ? "rgba(212,168,87,0.05)" : "transparent", padding: "24px 32px", cursor: "pointer", transition: "all 0.3s" }}>
                                            <input type="radio" name="mealPlan" checked={selectedMealPlanId === ""} onChange={() => setSelectedMealPlanId("")} style={{ accentColor: "var(--gold)", width: 18, height: 18 }} />
                                            <div style={{ marginLeft: 24, flex: 1 }}>
                                                <div style={{ fontSize: 16, color: "var(--ivory)", fontWeight: "500" }}>Room Only</div>
                                                <div style={{ fontSize: 11, color: "var(--ivory-dim)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Breakfast and meals not included</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Summary Sidebar */}
                        <div style={{ width: 380, flexShrink: 0 }}>
                            <div style={{ background: "rgba(212,168,87,0.02)", border: "1px solid rgba(212,168,87,0.15)", padding: 40, position: "sticky", top: 120 }}>
                                <h3 className="font-display" style={{ fontSize: 28, color: "var(--ivory)", borderBottom: "1px solid rgba(212,168,87,0.1)", paddingBottom: 20, marginBottom: 32 }}>Sanctuary <em>Summary</em></h3>
                                
                                <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
                                    <div>
                                        <div style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Selected Suite</div>
                                        <div className="font-display" style={{ color: "var(--ivory)", fontSize: 24, letterSpacing: "0.03em" }}>{availableRooms.find(r => r.id === selectedRoomId)?.roomName}</div>
                                    </div>
                                    
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                        <div>
                                            <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Arrival</div>
                                            <div style={{ fontSize: 15, color: "var(--ivory)" }}>{new Date(checkIn).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Departure</div>
                                            <div style={{ fontSize: 15, color: "var(--ivory)" }}>{new Date(checkOut).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div>
                                            <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Stay</div>
                                            <div style={{ fontSize: 15, color: "var(--ivory)" }}>{Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000*3600*24)))} Night(s)</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Party</div>
                                            <div style={{ fontSize: 15, color: "var(--ivory)" }}>{guests} Adult{guests > 1 && 's'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 40, display: "flex", flexDirection: "column", gap: 16 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ivory-dim)", fontSize: 14 }}>
                                        <span style={{ letterSpacing: "0.05em" }}>Suite Rate</span>
                                        <span style={{ color: "var(--ivory)" }}>₹{(availableRooms.find(r => r.id === selectedRoomId)?.basePrice || 0).toLocaleString()} <span style={{ fontSize: 10 }}>/ Night</span></span>
                                    </div>
                                    {selectedMealPlanId && (
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ivory-dim)", fontSize: 14 }}>
                                            <span style={{ letterSpacing: "0.05em" }}>Meal Provisions</span>
                                            <span style={{ color: "var(--ivory)" }}>+₹{((mealPlans.find(m => m.id === selectedMealPlanId)?.pricePerPersonPerNight || 0) * guests).toLocaleString()} <span style={{ fontSize: 10 }}>/ Night</span></span>
                                        </div>
                                    )}
                                    <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 20, borderTop: "1px dashed rgba(212,168,87,0.3)", marginTop: 8 }}>
                                        <span style={{ fontSize: 11, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", alignSelf: "center", fontWeight: "bold" }}>Total Investment</span>
                                        <span style={{ color: "var(--gold)", fontSize: 32, fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.02em" }}>
                                            ₹{((availableRooms.find(r => r.id === selectedRoomId)?.basePrice || 0) + ((mealPlans.find(m => m.id === selectedMealPlanId)?.pricePerPersonPerNight || 0) * guests)) * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000*3600*24)))}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    <button form="booking-form" type="submit" disabled={submitting} className="btn-primary" style={{ width: "100%", padding: 22, fontSize: 14 }}>
                                        {submitting ? "Processing Ritual..." : "Confirm Sanctuary"}
                                    </button>
                                    <button type="button" onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "var(--ivory-dim)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", display: "inline-block", opacity: 0.7, transition: "opacity 0.3s" }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}>
                                        ← Change Suite
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function BookPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--midnight)", color: "var(--gold)", letterSpacing: "0.3em", fontSize: 14 }}>COMMUNING...</div>}>
            <BookingForm />
        </Suspense>
    );
}

