"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Room, MealPlan } from "../../components/types";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Fade } from "../components/hooks";

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
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
            const physicalRooms: any[] = await res.json();
            const rtRes = await fetch("/api/room-types");
            const rtData: Room[] = await rtRes.json();
            
            const availTypeCounts: Record<string, number> = {};
            physicalRooms.forEach(pr => {
                if (pr.status === "available" || pr.status === "occupied") {
                    availTypeCounts[pr.roomTypeId] = (availTypeCounts[pr.roomTypeId] || 0) + 1;
                }
            });

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
                earlyCheckIn: false,
                lateCheckOut: false,
                earlyCheckInTime: "",
                lateCheckOutTime: "",
                checkInActual: null,
                checkOutActual: null,
                primaryAadharNo: "",
                primaryAadharFileUrl: "",
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
            <div style={{ paddingTop: 120, paddingBottom: 112, minHeight: "100vh" }}>
                <Fade className="vh-max" style={{ textAlign: "center", maxWidth: 600 }}>
                    <div style={{ background: "var(--charcoal)", border: "1px solid var(--gold)", padding: 48 }}>
                        <div style={{ fontSize: 48, marginBottom: 24 }}>✓</div>
                        <h2 className="vh-section-title" style={{ fontSize: 32, marginBottom: 16 }}>Reservation <em>Confirmed</em></h2>
                        <p style={{ color: "var(--ivory-dim)", fontSize: 13, lineHeight: 1.7, marginBottom: 32 }}>
                            Thank you for choosing Hotel Grand Eagle. A confirmation email has been sent to <strong style={{ color: "var(--ivory)" }}>{guestInfo.email}</strong>.
                        </p>
                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,169,110,0.2)", padding: 24, marginBottom: 32 }}>
                            <div style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Booking Reference</div>
                            <div style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", color: "var(--ivory)" }}>{refId}</div>
                        </div>
                        <Link href="/" className="vh-btn-primary" style={{ display: "inline-flex" }}>
                            Return to Home
                        </Link>
                    </div>
                </Fade>
            </div>
        );
    }

    return (
        <div style={{ paddingTop: 120, paddingBottom: 112, minHeight: "100vh" }}>
            <div className="vh-max">
                
                {/* Steps indicator */}
                <Fade style={{ display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", gap: 16, marginBottom: 64 }}>
                    {[1, 2, 3].map((s, i) => (
                        <React.Fragment key={s}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: step >= s ? 1 : 0.4 }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${step >= s ? "var(--gold)" : "var(--muted)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontFamily: "'Cormorant Garamond', serif", color: step >= s ? "var(--gold)" : "var(--ivory)", marginBottom: 8 }}>{s}</div>
                                <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: step >= s ? "var(--gold)" : "var(--ivory-dim)" }}>
                                    {s === 1 ? "Search" : s === 2 ? "Select" : "Details"}
                                </span>
                            </div>
                            {i < 2 && <div style={{ width: 48, height: 1, background: step > s ? "var(--gold)" : "var(--muted)", transform: "translateY(-12px)" }} />}
                        </React.Fragment>
                    ))}
                </Fade>

                {/* STEP 1: SEARCH */}
                {step === 1 && (
                    <Fade>
                        <div className="vh-form-card" style={{ maxWidth: 800, margin: "0 auto", padding: 48 }}>
                            <h2 className="vh-section-title" style={{ fontSize: 32, textAlign: "center", marginBottom: 32 }}>Check <em>Availability</em></h2>
                            {initialSlug && <div style={{ background: "rgba(201,169,110,0.1)", border: "1px solid var(--gold)", padding: 16, textAlign: "center", fontSize: 13, color: "var(--gold)", marginBottom: 32 }}>Searching dates for: <strong>{initialSlug.replace(/-/g, ' ')}</strong></div>}
                            
                            <form onSubmit={handleSearch} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, alignItems: "end" }}>
                                <div>
                                    <label className="vh-input-label">Check-In</label>
                                    <input className="vh-form-input" type="date" required value={checkIn} onChange={e => handleCheckInChange(e.target.value)} min={dtIn} style={{ colorScheme: 'dark' }} />
                                </div>
                                <div>
                                    <label className="vh-input-label">Check-Out</label>
                                    <input className="vh-form-input" type="date" required value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || dtIn} style={{ colorScheme: 'dark' }} />
                                </div>
                                <div>
                                    <label className="vh-input-label">Guests</label>
                                    <select className="vh-form-select" value={guests} onChange={e => setGuests(Number(e.target.value))}>
                                        {[1, 2, 3, 4, 5].map(g => <option key={g} value={g}>{g} Guest{g > 1 ? 's' : ''}</option>)}
                                    </select>
                                </div>
                                <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: 16 }}>
                                    <button type="submit" disabled={loading} className="vh-btn-primary" style={{ padding: "16px 48px" }}>
                                        {loading ? "Searching..." : "Search Rooms"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Fade>
                )}

                {/* STEP 2: SELECT */}
                {step === 2 && (
                    <Fade>
                        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid var(--muted)", padding: 24, marginBottom: 32 }}>
                                <div style={{ fontSize: 14, color: "var(--ivory-dim)", letterSpacing: "0.05em" }}>
                                    <span style={{ color: "var(--ivory)" }}>{new Date(checkIn).toLocaleDateString()}</span> to <span style={{ color: "var(--ivory)" }}>{new Date(checkOut).toLocaleDateString()}</span> · {guests} Guest{guests > 1 && 's'}
                                </div>
                                <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--gold)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>Modify Search</button>
                            </div>

                            {availableRooms.length === 0 ? (
                                <div style={{ background: "var(--charcoal)", border: "1px solid var(--muted)", padding: 64, textAlign: "center" }}>
                                    <div style={{ fontSize: 32, marginBottom: 16 }}>😔</div>
                                    <h3 className="vh-section-title" style={{ fontSize: 24, marginBottom: 16 }}>No Rooms <em>Available</em></h3>
                                    <p style={{ color: "var(--ivory-dim)", fontSize: 14, marginBottom: 32 }}>We're fully booked for your selected dates. Please adjust your search.</p>
                                    <button onClick={() => setStep(1)} className="vh-btn-outline">Change Dates</button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    {availableRooms.filter(r => r.maxOccupancy >= guests).map(room => (
                                        <div key={room.id} style={{ background: "var(--charcoal)", border: "1px solid var(--muted)", display: "flex", overflow: "hidden" }}>
                                            <div style={{ width: "35%" }}>
                                                <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000'} alt={room.roomName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            </div>
                                            <div style={{ width: "65%", padding: 32, display: "flex", flexDirection: "column" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--ivory)" }}>{room.roomName}</h3>
                                                    <div style={{ textAlign: "right" }}>
                                                        <div style={{ color: "var(--gold)", fontSize: 24, fontFamily: "'Cormorant Garamond', serif" }}>₹{room.basePrice.toLocaleString()}</div>
                                                        <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>/ night</div>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", gap: 16, fontSize: 10, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>
                                                    <span>👥 {room.maxOccupancy} max</span>
                                                    <span>🛏️ {room.bedType}</span>
                                                    <span>📐 {room.roomSize} m²</span>
                                                </div>
                                                <p style={{ fontSize: 13, color: "var(--ivory-dim)", lineHeight: 1.6, flex: 1 }}>Enjoy luxury and comfort in our exquisitely designed {room.roomName}, featuring premium amenities and stunning {room.view.toLowerCase()}.</p>
                                                <div style={{ textAlign: "right", marginTop: 24 }}>
                                                    <button onClick={() => handleSelectRoom(room.id)} className="vh-btn-outline">Select Room</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {availableRooms.filter(r => r.maxOccupancy >= guests).length === 0 && (
                                        <div style={{ textAlign: "center", padding: 32, border: "1px dashed var(--muted)", color: "var(--ivory-dim)", fontSize: 13 }}>
                                            Rooms are available, but none can accommodate {guests} guests.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Fade>
                )}

                {/* STEP 3: DETAILS */}
                {step === 3 && (
                    <Fade>
                        <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 32 }}>
                                {/* Guest Details Form */}
                                <div className="vh-form-card" style={{ maxWidth: "100%" }}>
                                    <h2 className="vh-section-title" style={{ fontSize: 24, marginBottom: 32 }}>Guest <em>Details</em></h2>
                                    <form id="booking-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <div style={{ display: "flex", gap: 24 }}>
                                            <div style={{ flex: 1 }}>
                                                <label className="vh-input-label">First Name *</label>
                                                <input required className="vh-form-input" type="text" value={guestInfo.firstName} onChange={e => setGuestInfo(p => ({...p, firstName: e.target.value}))} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label className="vh-input-label">Last Name *</label>
                                                <input required className="vh-form-input" type="text" value={guestInfo.lastName} onChange={e => setGuestInfo(p => ({...p, lastName: e.target.value}))} />
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 24 }}>
                                            <div style={{ flex: 1 }}>
                                                <label className="vh-input-label">Email Address *</label>
                                                <input required className="vh-form-input" type="email" value={guestInfo.email} onChange={e => setGuestInfo(p => ({...p, email: e.target.value}))} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label className="vh-input-label">Phone Number *</label>
                                                <input required className="vh-form-input" type="tel" value={guestInfo.phone} onChange={e => setGuestInfo(p => ({...p, phone: e.target.value}))} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="vh-input-label">Special Requests</label>
                                            <textarea className="vh-form-textarea" rows={3} value={guestInfo.specialRequests} onChange={e => setGuestInfo(p => ({...p, specialRequests: e.target.value}))} />
                                        </div>
                                    </form>
                                </div>

                                {/* Meal Plans */}
                                {mealPlans.length > 0 && (
                                    <div className="vh-form-card" style={{ maxWidth: "100%" }}>
                                        <h2 className="vh-section-title" style={{ fontSize: 24, marginBottom: 24 }}>Enhance Your <em>Stay</em></h2>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                            {mealPlans.map(mp => (
                                                <label key={mp.id} style={{ display: "flex", alignItems: "center", border: `1px solid ${selectedMealPlanId === mp.id ? "var(--gold)" : "var(--muted)"}`, background: selectedMealPlanId === mp.id ? "rgba(201,169,110,0.05)" : "transparent", padding: 20, cursor: "pointer", transition: "all 0.2s" }}>
                                                    <input type="radio" name="mealPlan" checked={selectedMealPlanId === mp.id} onChange={() => setSelectedMealPlanId(mp.id)} style={{ accentColor: "var(--gold)" }} />
                                                    <div style={{ marginLeft: 16, flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                        <div>
                                                            <div style={{ fontSize: 14, color: "var(--ivory)", fontWeight: "bold" }}>{mp.name} <span style={{ color: "var(--ivory-dim)", fontSize: 10, letterSpacing: "0.1em" }}>({mp.code})</span></div>
                                                        </div>
                                                        <div style={{ color: "var(--gold)", fontSize: 14, fontWeight: "bold" }}>
                                                            +₹{mp.pricePerPersonPerNight.toLocaleString()} <span style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em" }}>/ person</span>
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                            <label style={{ display: "flex", alignItems: "center", border: `1px solid ${selectedMealPlanId === "" ? "var(--gold)" : "var(--muted)"}`, background: selectedMealPlanId === "" ? "rgba(201,169,110,0.05)" : "transparent", padding: 20, cursor: "pointer", transition: "all 0.2s" }}>
                                                <input type="radio" name="mealPlan" checked={selectedMealPlanId === ""} onChange={() => setSelectedMealPlanId("")} style={{ accentColor: "var(--gold)" }} />
                                                <div style={{ marginLeft: 16, flex: 1 }}>
                                                    <div style={{ fontSize: 14, color: "var(--ivory)", fontWeight: "bold" }}>Room Only <span style={{ color: "var(--ivory-dim)", fontSize: 10, letterSpacing: "0.1em" }}>({mealPlans[0]?.code})</span></div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div style={{ width: 340, flexShrink: 0 }}>
                                <div style={{ background: "#0E0E0E", border: "1px solid rgba(201,169,110,0.2)", padding: 32, position: "sticky", top: 120 }}>
                                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: "var(--ivory)", borderBottom: "1px solid rgba(201,169,110,0.2)", paddingBottom: 16, marginBottom: 24 }}>Your <em>Selection</em></h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
                                        <div>
                                            <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Room Category</div>
                                            <div style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>{availableRooms.find(r => r.id === selectedRoomId)?.roomName}</div>
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                            <div>
                                                <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Check-in</div>
                                                <div style={{ fontSize: 13, color: "var(--ivory)" }}>{new Date(checkIn).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Check-out</div>
                                                <div style={{ fontSize: 13, color: "var(--ivory)" }}>{new Date(checkOut).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
                                            <div>
                                                <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Length of stay</div>
                                                <div style={{ fontSize: 13, color: "var(--ivory)" }}>{Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000*3600*24)))} Night(s)</div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 10, color: "var(--ivory-dim)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Guests</div>
                                                <div style={{ fontSize: 13, color: "var(--ivory)" }}>{guests} Adult{guests > 1 && 's'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ borderTop: "1px dashed rgba(201,169,110,0.2)", paddingTop: 24, marginBottom: 32, display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ivory-dim)" }}>
                                            <span>Room Rate</span>
                                            <span style={{ color: "var(--ivory)" }}>₹{(availableRooms.find(r => r.id === selectedRoomId)?.basePrice || 0).toLocaleString()} <span style={{ fontSize: 10 }}>/ night</span></span>
                                        </div>
                                        {selectedMealPlanId && (
                                            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ivory-dim)" }}>
                                                <span>Meal Plan ({guests} pax)</span>
                                                <span style={{ color: "var(--ivory)" }}>+₹{((mealPlans.find(m => m.id === selectedMealPlanId)?.pricePerPersonPerNight || 0) * guests).toLocaleString()} <span style={{ fontSize: 10 }}>/ night</span></span>
                                            </div>
                                        )}
                                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(201,169,110,0.5)", paddingTop: 16, marginTop: 8 }}>
                                            <span style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.1em", textTransform: "uppercase", alignSelf: "center" }}>Grand Total</span>
                                            <span style={{ color: "var(--gold)", fontSize: 24, fontFamily: "'Cormorant Garamond', serif" }}>
                                                ₹{((availableRooms.find(r => r.id === selectedRoomId)?.basePrice || 0) + ((mealPlans.find(m => m.id === selectedMealPlanId)?.pricePerPersonPerNight || 0) * guests)) * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000*3600*24)))}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <button form="booking-form" type="submit" disabled={submitting} className="vh-btn-primary" style={{ width: "100%", padding: 16 }}>
                                            {submitting ? "Processing..." : "Confirm Booking"}
                                        </button>
                                        <button type="button" onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "var(--ivory-dim)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", display: "inline-block", marginTop: 20 }}>
                                            ← Back to Selection
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Fade>
                )}
            </div>
        </div>
    );
}

export default function BookPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "var(--dark)", color: "var(--gold)", letterSpacing: "0.1em" }}>LOADING...</div>}>
            <BookingForm />
        </Suspense>
    );
}
