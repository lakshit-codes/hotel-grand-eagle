"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Room, MealPlan } from "../../components/types";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Fallback dates: tomorrow and day after tomorrow
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
    
    // Search Criteria
    const [checkIn, setCheckIn] = useState(searchParams?.get("checkIn") || dtIn);
    const [checkOut, setCheckOut] = useState(searchParams?.get("checkOut") || dtOut);
    const [guests, setGuests] = useState(Number(searchParams?.get("guests")) || 2);

    // Auto-update check-out when check-in changes
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
    
    // Availability
    const [loading, setLoading] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    
    // Selection
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [selectedMealPlanId, setSelectedMealPlanId] = useState("");
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    
    // Guest Details
    const [guestInfo, setGuestInfo] = useState({
        firstName: "", lastName: "", email: "", phone: "", specialRequests: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [refId, setRefId] = useState("");

    useEffect(() => {
        fetch("/api/meal-plans").then(r => r.json()).then(d => { if(d.length) setMealPlans(d.filter((m: MealPlan) => m.pricePerPersonPerNight >= 0)); }).catch(() => {});
    }, []);

    // If pre-selected room from URL, auto-fill but user still must press Search to verify it's available.
    useEffect(() => {
        // Just keeping it as informational for step 1
    }, [initialSlug]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We pass optional room slug if present, but here we just get all available for those dates.
            // In the admin panel, the backend takes /api/rooms?checkIn=...&checkOut=... and returns only available physical rooms.
            // Since public website sells "Room Types", we shouldn't show individual physical rooms, but Rather Room Types that have at least 1 room available.
            // The backend /api/rooms returns physical rooms. We group them by roomTypeId.
            const res = await fetch(`/api/rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
            const physicalRooms: any[] = await res.json();
            
            // Fetch the room types definitions
            const rtRes = await fetch("/api/room-types");
            const rtData: Room[] = await rtRes.json();
            
            // Group available physical rooms by Type ID
            const availTypeCounts: Record<string, number> = {};
            physicalRooms.forEach(pr => {
                if (pr.status === "available" || pr.status === "occupied" /* occupied but checkOut handled by backend */) {
                    availTypeCounts[pr.roomTypeId] = (availTypeCounts[pr.roomTypeId] || 0) + 1;
                }
            });

            // If backend already filtered overlaps, physicalRooms are definitely free.
            const availableTypes = rtData.filter(rt => {
                // Return true if at least one physical room of this type is returned from the query
                return physicalRooms.some(pr => pr.roomTypeId === rt.id);
            });

            setAvailableRooms(availableTypes);
            setStep(2);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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
            // 1. We must select a physical room to book. We'll query /api/rooms again and pick the first one of the selected type.
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
            
            // Calculate nights
            const d1 = new Date(checkIn); const d2 = new Date(checkOut);
            const nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
            const rt = roomType!.basePrice;
            const mp = mealPlan ? mealPlan.pricePerPersonPerNight * guests : 0;
            const ttl = (rt + mp) * nights;

            // Generate Booking Ref
            const br = `BK${Math.floor(Date.now() / 1000).toString().slice(-6)}`;
            
            const bookingPayload = {
                id: crypto.randomUUID(),
                bookingRef: br,
                source: "Direct",
                guestName: `${guestInfo.firstName} ${guestInfo.lastName}`.trim(),
                email: guestInfo.email,
                phone: guestInfo.phone,
                checkIn: checkIn,
                checkOut: checkOut,
                roomTypeId: selectedRoomId,
                roomTypeName: roomType!.roomName,
                roomNumber: targetPhysicalRoom.roomNumber,
                mealPlanId: selectedMealPlanId,
                mealPlanCode: mealPlan?.code || "RO",
                status: "confirmed",
                totalAmount: ttl,
                currency: "INR"
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
            <div className="w-full max-w-4xl mx-auto px-4 py-24 text-center">
                <div className="bg-white p-12 shadow-2xl border-t-4 border-[#16a34a]">
                    <div className="text-6xl mb-6">✅</div>
                    <h2 className="text-4xl font-serif font-bold text-[#0f1623] mb-4">Reservation Confirmed</h2>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                        Thank you for choosing Hotel Grand Eagle. We have successfully received your reservation. A confirmation email has been sent to <strong>{guestInfo.email}</strong>.
                    </p>
                    <div className="bg-gray-50 border border-gray-100 p-6 inline-block mb-8">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Booking Reference</div>
                        <div className="text-3xl font-bold tracking-widest text-[#0f1623]">{refId}</div>
                    </div>
                    <div>
                        <Link href="/" className="bg-[#0f1623] text-white px-8 py-4 font-bold tracking-wider uppercase text-sm hover:bg-black transition-colors">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-16">
            
            {/* Steps indicator */}
            <div className="flex items-center justify-center gap-4 mb-12">
                <div className={`flex flex-col items-center ${step === 1 ? "text-[#f59e0b]" : "text-gray-400"}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mb-2 ${step === 1 ? "border-[#f59e0b] bg-[#f59e0b]/10" : "border-gray-300"}`}>1</div>
                    <span className="text-xs uppercase tracking-widest font-bold">Search</span>
                </div>
                <div className="w-16 h-px bg-gray-300 mt-[-24px]"></div>
                <div className={`flex flex-col items-center ${step === 2 ? "text-[#f59e0b]" : "text-gray-400"}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mb-2 ${step === 2 ? "border-[#f59e0b] bg-[#f59e0b]/10" : "border-gray-300"}`}>2</div>
                    <span className="text-xs uppercase tracking-widest font-bold">Select</span>
                </div>
                <div className="w-16 h-px bg-gray-300 mt-[-24px]"></div>
                <div className={`flex flex-col items-center ${step === 3 ? "text-[#f59e0b]" : "text-gray-400"}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mb-2 ${step === 3 ? "border-[#f59e0b] bg-[#f59e0b]/10" : "border-gray-300"}`}>3</div>
                    <span className="text-xs uppercase tracking-widest font-bold">Details</span>
                </div>
            </div>

            {/* STEP 1: SEARCH */}
            {step === 1 && (
                <div className="bg-white shadow-xl p-8 max-w-4xl mx-auto border border-gray-100">
                    <h2 className="text-3xl font-serif font-bold text-[#0f1623] mb-8 text-center">Check Availability</h2>
                    {initialSlug && <div className="bg-blue-50 text-blue-800 p-4 mb-8 text-sm text-center border border-blue-100">You are searching dates for: <strong>{initialSlug.replace(/-/g, ' ')}</strong></div>}
                    
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-[#0f1623]/40 uppercase tracking-[0.2em] mb-2">Check-In</label>
                            <input type="date" required value={checkIn} onChange={e => handleCheckInChange(e.target.value)} min={dtIn} className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#dfb163] transition-colors font-bold text-[#0f1623]" style={{ colorScheme: 'light' }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[#0f1623]/40 uppercase tracking-[0.2em] mb-2">Check-Out</label>
                            <input type="date" required value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn || dtIn} className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#dfb163] transition-colors font-bold text-[#0f1623]" style={{ colorScheme: 'light' }} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Guests</label>
                            <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#0f1623]">
                                <option value={1}>1 Adult</option>
                                <option value={2}>2 Adults</option>
                                <option value={3}>3 Adults</option>
                                <option value={4}>4 Adults</option>
                            </select>
                        </div>
                        <div className="md:col-span-3 mt-4 text-center">
                            <button type="submit" disabled={loading} className="bg-[#0f1623] hover:bg-black text-white px-12 py-4 font-bold tracking-wider uppercase w-full md:w-auto transition-colors disabled:opacity-50">
                                {loading ? "Searching..." : "Search Rooms"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* STEP 2: SELECT */}
            {step === 2 && (
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8 bg-gray-50 px-6 py-4 border border-gray-100">
                        <div className="text-gray-600 font-medium">
                            <span className="text-[#0f1623] font-bold">{new Date(checkIn).toLocaleDateString()}</span> to <span className="text-[#0f1623] font-bold">{new Date(checkOut).toLocaleDateString()}</span> · {guests} Guest{guests > 1 && 's'}
                        </div>
                        <button onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] hover:text-[#d97706]">Modify Search →</button>
                    </div>

                    {availableRooms.length === 0 ? (
                        <div className="bg-white p-16 text-center shadow-md">
                            <div className="text-4xl mb-4">😔</div>
                            <h3 className="text-2xl font-serif text-[#0f1623] font-bold mb-4">No Rooms Available</h3>
                            <p className="text-gray-500 mb-8">We're fully booked for your selected dates. Please try adjusting your search parameters.</p>
                            <button onClick={() => setStep(1)} className="bg-[#f59e0b] text-white px-8 py-3 font-bold uppercase tracking-wider text-sm">Change Dates</button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {availableRooms.filter(r => r.maxOccupancy >= guests).map(room => (
                                <div key={room.id} className="bg-white shadow-lg flex flex-col md:flex-row border border-gray-100">
                                    <div className="md:w-1/3 h-64 md:h-auto bg-gray-200">
                                        <img src={room.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop'} alt={room.roomName} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-8 md:w-2/3 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-2xl font-serif font-bold text-[#0f1623]">{room.roomName}</h3>
                                                <div className="text-right">
                                                    <div className="text-[#f59e0b] font-bold text-2xl">₹{room.basePrice.toLocaleString()}</div>
                                                    <div className="text-xs text-gray-400">/ night</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                                                <span>👥 {room.maxOccupancy} max</span>
                                                <span>🛏️ {room.bedType}</span>
                                                <span>📐 {room.roomSize} m²</span>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-6">Enjoy luxury and comfort in our exquisitely designed {room.roomName}, featuring premium amenities and stunning {room.view.toLowerCase()}.</p>
                                        </div>
                                        <div className="text-right">
                                            <button onClick={() => handleSelectRoom(room.id)} className="bg-[#0f1623] hover:bg-black text-white px-8 py-3 text-sm font-bold tracking-wider uppercase transition-colors">
                                                Select Room
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {availableRooms.filter(r => r.maxOccupancy >= guests).length === 0 && (
                                <div className="text-center p-8 bg-white border border-gray-100 shadow-sm text-gray-500">
                                    Rooms are available, but none can accommodate {guests} guests.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* STEP 3: DETAILS & CONFIRM */}
            {step === 3 && (
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-2/3">
                        <div className="bg-white shadow-xl p-8 border border-gray-100 mb-8 rounded-sm">
                            <h2 className="text-2xl font-serif font-bold text-[#0f1623] mb-8 flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#dfb163] text-black rounded-full flex items-center justify-center text-sm">3</span>
                                Guest Details
                            </h2>
                            <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">First Name *</label>
                                        <input required type="text" value={guestInfo.firstName} onChange={e => setGuestInfo(p => ({...p, firstName: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#dfb163] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Last Name *</label>
                                        <input required type="text" value={guestInfo.lastName} onChange={e => setGuestInfo(p => ({...p, lastName: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#dfb163] transition-colors" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address *</label>
                                        <input required type="email" value={guestInfo.email} onChange={e => setGuestInfo(p => ({...p, email: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#dfb163] transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number *</label>
                                        <input required type="tel" value={guestInfo.phone} onChange={e => setGuestInfo(p => ({...p, phone: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#dfb163] transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Special Requests (Optional)</label>
                                    <textarea rows={3} value={guestInfo.specialRequests} onChange={e => setGuestInfo(p => ({...p, specialRequests: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#dfb163] transition-colors resize-none" placeholder="E.g. Early check-in, late check-out..."></textarea>
                                </div>
                            </form>
                        </div>

                        {mealPlans.length > 0 && (
                            <div className="bg-white shadow-xl p-8 border border-gray-100 rounded-sm">
                                <h2 className="text-2xl font-serif font-bold text-[#0f1623] mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 bg-[#dfb163] text-black rounded-full flex items-center justify-center text-sm">4</span>
                                    Enhance Your Stay
                                </h2>
                                <div className="space-y-4">
                                    {mealPlans.map(mp => (
                                        <label key={mp.id} className={`flex items-start p-4 border cursor-pointer transition-all ${selectedMealPlanId === mp.id ? 'border-[#dfb163] bg-[#dfb163]/5 shadow-sm' : 'border-gray-100 bg-gray-50 hover:border-gray-300'}`}>
                                            <input type="radio" name="mealPlan" value={mp.id} checked={selectedMealPlanId === mp.id} onChange={() => setSelectedMealPlanId(mp.id)} className="mt-1 accent-[#dfb163]" />
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="font-bold text-[#0f1623] tracking-wide">{mp.name}</span>
                                                        <span className="text-gray-400 text-[10px] font-bold ml-2 uppercase tracking-widest">({mp.code})</span>
                                                    </div>
                                                    <span className="font-bold text-[#111]">
                                                        +₹{mp.pricePerPersonPerNight.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal uppercase tracking-widest">/ person / night</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                    <label className={`flex items-start p-4 border cursor-pointer transition-all ${selectedMealPlanId === "" ? 'border-[#dfb163] bg-[#dfb163]/5 shadow-sm' : 'border-gray-100 bg-gray-50 hover:border-gray-300'}`}>
                                        <input type="radio" name="mealPlan" value={""} checked={selectedMealPlanId === ""} onChange={() => setSelectedMealPlanId("")} className="mt-1 accent-[#dfb163]" />
                                        <div className="ml-4 flex-1">
                                            <div className="font-bold text-[#0f1623] tracking-wide uppercase text-sm">Room Only (RO)</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">No meals included</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="bg-[#0f1623] text-white p-8 shadow-2xl sticky top-24 rounded-sm border border-white/5">
                            <h3 className="text-xl font-serif font-bold mb-6 border-b border-white/10 pb-4 tracking-wider uppercase">Your Selection</h3>
                            
                            <div className="space-y-5 mb-8">
                                <div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Room Category</div>
                                    <div className="font-bold text-lg text-[#dfb163] tracking-wide uppercase font-serif">
                                        {availableRooms.find(r => r.id === selectedRoomId)?.roomName}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Check-in</div>
                                        <div className="font-bold">{new Date(checkIn).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Check-out</div>
                                        <div className="font-bold">{new Date(checkOut).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-4 border-y border-white/10">
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Length of stay</div>
                                        <div className="font-bold">{Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000*3600*24)))} Night(s)</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Total Guests</div>
                                        <div className="font-bold">{guests} Adult{guests > 1 && 's'}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3 mb-10 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span className="tracking-wide">Room Rate</span>
                                    <span className="text-white font-medium italic">₹{(availableRooms.find(r => r.id === selectedRoomId)?.basePrice || 0).toLocaleString()} night</span>
                                </div>
                                {selectedMealPlanId && (
                                    <div className="flex justify-between text-gray-400">
                                        <span className="tracking-wide">Meal Plan Add-on</span>
                                        <span className="text-white font-medium italic">+₹{((mealPlans.find(m => m.id === selectedMealPlanId)?.pricePerPersonPerNight || 0) * guests).toLocaleString()} night</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-xl text-white pt-6 mt-4 border-t-2 border-[#dfb163]/30">
                                    <span className="uppercase tracking-widest text-xs self-center">Grand Total</span>
                                    <span className="text-[#dfb163]">
                                        ₹{((availableRooms.find(r => r.id === selectedRoomId)?.basePrice || 0) + ((mealPlans.find(m => m.id === selectedMealPlanId)?.pricePerPersonPerNight || 0) * guests)) * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000*3600*24)))}
                                    </span>
                                </div>
                            </div>

                            <button form="booking-form" type="submit" disabled={submitting} className="w-full bg-[#dfb163] hover:bg-[#c99a4e] text-black py-4 font-bold tracking-widest uppercase text-xs disabled:opacity-50 transition-all shadow-lg active:scale-95">
                                {submitting ? "Processing..." : "Complete Reservation"}
                            </button>
                            <button onClick={() => setStep(2)} className="w-full mt-6 text-[10px] font-bold text-gray-500 hover:text-[#dfb163] uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2">
                                <span>←</span> Back to selection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function BookPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading booking engine...</div>}>
            <BookingForm />
        </Suspense>
    );
}
