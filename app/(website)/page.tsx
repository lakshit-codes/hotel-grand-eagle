"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Room, Hotel } from "../components/types";

export default function HomePage() {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [bookingData, setBookingData] = useState({
        checkIn: "",
        checkOut: "",
        guests: "1"
    });

    useEffect(() => {
        // Default dates: tomorrow and day after
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dtIn = tomorrow.toISOString().split("T")[0];
        
        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(dayAfter.getDate() + 1);
        const dtOut = dayAfter.toISOString().split("T")[0];
        
        setBookingData(prev => ({
            ...prev,
            checkIn: dtIn,
            checkOut: dtOut
        }));

        fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
        fetch("/api/room-types").then(r => r.json()).then(d => { if (d.length) setRooms(d.slice(0, 3)); }).catch(() => {});
    }, []);

    // Auto-update check-out when check-in changes
    const handleCheckInChange = (val: string) => {
        const newIn = new Date(val);
        const currentOut = new Date(bookingData.checkOut);
        
        let newOut = bookingData.checkOut;
        if (newIn >= currentOut) {
            const nextDay = new Date(newIn);
            nextDay.setDate(nextDay.getDate() + 1);
            newOut = nextDay.toISOString().split("T")[0];
        }
        
        setBookingData({ ...bookingData, checkIn: val, checkOut: newOut });
    };

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center bg-gray-100">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                
                <div className="relative z-10 text-center px-6 py-12 bg-black/70 backdrop-blur-sm rounded-xl max-w-4xl mx-auto shadow-2xl border border-white/10 mt-16">
                    <h1 className="text-5xl md:text-7xl text-white font-serif font-bold tracking-widest drop-shadow-xl mb-4 uppercase leading-tight">
                        {hotel?.name || "Hotel Grand Eagle"}
                    </h1>
                    <p className="text-xl md:text-2xl text-[#dfb163] mb-8 max-w-2xl mx-auto font-medium tracking-wide">
                        Comfort Within Your Budget!
                    </p>
                    <div className="flex justify-center">
                        <Link href="/contact" className="bg-[#dfb163] hover:bg-[#c99a4e] text-black px-8 py-3 text-sm font-bold tracking-wider transition-colors flex items-center gap-2">
                            Enquire Now! ↗
                        </Link>
                    </div>
                </div>

                <a href={`https://wa.me/${hotel?.contactNumber?.replace(/\+/g, "") || "916367850548"}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-8 left-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.228.6 4.385 1.708 6.273L.5 24l5.854-1.536A11.972 11.972 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22.015a9.966 9.966 0 01-5.074-1.383l-.364-.216-3.774.989.99-3.68-.236-.376A9.972 9.972 0 012.049 12.03C2.049 6.52 6.52 2.048 12.03 2.048S22.016 6.52 22.016 12.03c0 5.51-4.471 9.985-9.985 9.985zm5.496-7.5c-.302-.15-1.785-.88-2.062-.98-.277-.101-.48-.15-.682.15-.202.301-.78 1.006-.957 1.206-.176.2-.352.226-.654.075-.302-.15-1.272-.47-2.42-1.49-.893-.794-1.497-1.774-1.673-2.075-.176-.301-.019-.464.133-.614.136-.134.301-.35.452-.526.151-.176.202-.301.302-.501.101-.2.05-.376-.025-.526-.075-.15-.682-1.644-.933-2.253-.243-.591-.49-.51-.682-.52-.176-.01-.377-.01-.58-.01-.202 0-.58.075-.856.376-.277.301-1.056 1.03-1.056 2.51s1.082 2.91 1.232 3.11c.15.2 2.113 3.322 5.161 4.542 1.93.774 2.766.866 3.82.723 1.139-.155 3.518-1.436 4.018-2.825.5-1.388.5-2.583.35-2.825-.15-.24-.553-.39-1.054-.64z" /></svg>
                </a>
                {/* Quick Booking Bar */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-sm p-3 flex flex-col md:flex-row gap-3 z-30 border border-gray-100/50 backdrop-blur-sm">
                    <div className="flex-1 px-5 py-3 border border-gray-100 bg-gray-50/50 hover:bg-white transition-colors group">
                        <span className="block text-[10px] font-black text-[#0f1623]/40 uppercase tracking-[0.2em] mb-1.5 group-hover:text-[#dfb163] transition-colors">Check In</span>
                        <input 
                            type="date" 
                            value={bookingData.checkIn}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => handleCheckInChange(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-[#0f1623] font-bold cursor-pointer text-sm" 
                            style={{ colorScheme: 'light' }}
                        />
                    </div>
                    <div className="flex-1 px-5 py-3 border border-gray-100 bg-gray-50/50 hover:bg-white transition-colors group">
                        <span className="block text-[10px] font-black text-[#0f1623]/40 uppercase tracking-[0.2em] mb-1.5 group-hover:text-[#dfb163] transition-colors">Check Out</span>
                        <input 
                            type="date" 
                            value={bookingData.checkOut}
                            min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
                            onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                            className="w-full bg-transparent border-none outline-none text-[#0f1623] font-bold cursor-pointer text-sm" 
                            style={{ colorScheme: 'light' }}
                        />
                    </div>
                    <div className="flex-1 px-5 py-3 border border-gray-100 bg-gray-50/50 hover:bg-white transition-colors group">
                        <span className="block text-[10px] font-black text-[#0f1623]/40 uppercase tracking-[0.2em] mb-1.5 group-hover:text-[#dfb163] transition-colors">Guests</span>
                        <select 
                            value={bookingData.guests}
                            onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
                            className="w-full bg-transparent border-none outline-none text-[#0f1623] font-bold cursor-pointer text-sm"
                        >
                            <option value="1">1 Adult</option>
                            <option value="2">2 Adults</option>
                            <option value="3">3 Adults</option>
                            <option value="4">4 Adults</option>
                        </select>
                    </div>
                    <button 
                        onClick={() => router.push(`/book?checkIn=${bookingData.checkIn}&checkOut=${bookingData.checkOut}&guests=${bookingData.guests}`)}
                        className="bg-[#0f1623] hover:bg-black text-[#dfb163] px-10 py-4 flex items-center justify-center min-w-[200px] font-black tracking-[0.2em] uppercase text-xs transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Search Rooms
                    </button>
                </div>
            </section>

            {/* Spacer for floating booking bar */}
            <div className="h-24 hidden md:block"></div>

            {/* Intro Section */}
            <section id="about" className="py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start">
                    <div className="flex-1 relative border-4 border-gray-100 p-2">
                        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop" alt="Reception" className="w-full h-auto" />
                    </div>
                    <div className="flex-1 lg:pl-8 lg:pt-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-px bg-gray-400"></div>
                            <span className="text-gray-500 font-medium tracking-wide">About Us</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#111] mb-8 leading-tight uppercase font-serif tracking-tight">{hotel?.name || "Hotel Grand Eagle"}</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {hotel?.name || "Hotel Grand Eagle"} is a <strong>value-for-money hotel</strong> offering clean, well-furnished rooms tailored for both business travelers and tourists. Each room is thoughtfully equipped with essentials such as <strong>air conditioning, private bathrooms, comfortable chairs, work desks, telephones, televisions,</strong> and <strong>24/7 hot and cold water supply</strong>—everything you need for a <strong>comfortable yet affordable stay.</strong>
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Located near <strong>JECC</strong>, major <strong>transport hubs</strong>, and <strong>local food joints</strong>, our hotel is perfect for <strong>budget-conscious travelers</strong> seeking convenience and accessibility. With a focus on <strong>cleanliness, functionality,</strong> and <strong>friendly service</strong>, {hotel?.name || "Hotel Grand Eagle"} is the ideal pick for <strong>short or extended stays</strong> in Jaipur's Sitapura Industrial Area.
                        </p>
                        <Link href="/rooms" className="inline-block mt-4 bg-[#0f1623] hover:bg-black text-white px-8 py-3.5 text-sm font-bold tracking-wider uppercase transition-colors">
                            Explore Rooms
                        </Link>
                    </div>
                </div>
            </section>

            {/* Hotel Facilities Grid */}
            <section id="services" className="py-24 bg-[#0a0a0a] px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl text-white font-bold text-center mb-16 tracking-wide">HOTEL AMENITIES</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { i: "📶", t: "Free Wi-Fi", d: "Stay connected anywhere in the hotel with complimentary high-speed internet." },
                            { i: "🚗", t: "Free Parking", d: "On-site parking space available for guests, bikes, and cars at no extra cost." },
                            { i: "🤝", t: "24/7 Front Desk", d: "Assistance available anytime for check-ins, queries, or local info." },
                            { i: "🚌", t: "Easy Access To Transit", d: "Located near bus stand and major travel points for effortless connectivity." },
                            { i: "🍽️", t: "Nearby Food Courts", d: "Surrounded by budget-friendly eateries and local restaurants within walking distance." },
                            { i: "🛎️", t: "Room Service", d: "Quick and hygienic meal delivery right to your room." },
                            { i: "🧺", t: "Laundry Service", d: "Full-service laundry and ironing available on request." },
                            { i: "⚡", t: "Power Backup", d: "Uninterrupted power supply ensures a hassle-free stay." },
                            { i: "📹", t: "CCTV Surveillance", d: "24-hour security surveillance for your peace of mind." },
                        ].map((fac, i) => (
                            <div key={i} className="border border-[#dfb163]/30 p-8 text-center rounded-md hover:bg-[#dfb163]/5 transition-colors">
                                <div className="w-16 h-16 mx-auto bg-[#dfb163] rounded-full flex items-center justify-center text-3xl mb-6 shadow-[0_0_15px_rgba(223,177,99,0.4)]">
                                    {fac.i}
                                </div>
                                <h3 className="text-white font-bold text-lg mb-3 tracking-wide">{fac.t}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{fac.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Rooms */}
            <section className="py-24 bg-gray-50 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[#f59e0b] font-bold tracking-widest text-sm uppercase mb-4 block">Accommodations</span>
                        <h2 className="text-4xl font-serif text-[#0f1623] font-bold">Featured Rooms & Suites</h2>
                    </div>

                    {rooms.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">Loading exquisite rooms...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {rooms.map(room => (
                                <div key={room.id} className="bg-white group cursor-pointer hover:shadow-2xl transition-all duration-300">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                                        <img 
                                            src={room.images?.[0] || `https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop`} 
                                            alt={room.roomName} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                            onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop")}
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold tracking-wider text-[#0f1623]">
                                            {room.roomCategory}
                                        </div>
                                    </div>
                                    <div className="p-8 text-center border border-t-0 border-gray-100">
                                        <h3 className="text-xl font-serif font-bold text-[#0f1623] mb-3">{room.roomName}</h3>
                                        <div className="flex justify-center gap-4 text-xs text-gray-500 font-semibold tracking-wider mb-6">
                                            <span>👥 {room.maxOccupancy} GUESTS</span>
                                            <span>🛏️ {room.bedType}</span>
                                            <span>📐 {room.roomSize} M²</span>
                                        </div>
                                        <div className="text-[#f59e0b] font-bold text-xl mb-6">
                                            ₹{room.basePrice.toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ night</span>
                                        </div>
                                        <Link href={`/rooms/${room.slug}`} className="block w-full border border-[#0f1623] text-[#0f1623] hover:bg-[#0f1623] hover:text-white transition-colors py-3 text-sm font-bold tracking-wider uppercase">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="text-center mt-12">
                        <Link href="/rooms" className="inline-block text-[#0f1623] font-bold border-b-2 border-[#0f1623] pb-1 hover:text-[#f59e0b] hover:border-[#f59e0b] transition-colors uppercase text-sm tracking-wider">
                            View All Accommodations
                        </Link>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-24 bg-white px-4">
                <div className="max-w-7xl mx-auto text-center mb-16">
                    <span className="text-[#dfb163] font-bold tracking-widest text-sm uppercase mb-4 block">Visual Tour</span>
                    <h2 className="text-4xl font-serif font-bold text-[#0f1623]">HOSPITALITY GALLERY</h2>
                </div>
                <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800",
                        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800",
                        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800",
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
                        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800",
                        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800",
                        "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=800",
                        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800"
                    ].map((img, i) => (
                        <div key={i} className="aspect-square bg-gray-100 overflow-hidden group">
                            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-[#0a0a0a] px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-[#dfb163] font-bold tracking-widest text-sm uppercase mb-6 block">What Our Guests Say</span>
                    <div className="relative">
                        <div className="text-6xl text-[#dfb163]/20 absolute -top-10 left-1/2 -translate-x-1/2 font-serif font-black">"</div>
                        <p className="text-2xl md:text-3xl text-gray-200 font-serif italic mb-10 leading-relaxed">
                            "Clean, budget-friendly and great service! Best hotel near Sitapura Area. The rooms are well-maintained and the staff is very polite. Highly recommended for short business trips."
                        </p>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-[#dfb163] rounded-full mb-4 flex items-center justify-center font-bold text-black border-2 border-white/10">S</div>
                            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Sandeep Kumar</h4>
                            <div className="flex text-[#dfb163] mt-2 text-xs">★★★★★</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nearby Places */}
            <section id="nearby" className="py-24 bg-gray-50 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-[#dfb163] font-bold tracking-widest text-sm uppercase mb-4 block">Explore Rajasthan</span>
                        <h2 className="text-4xl font-serif font-bold text-[#0f1623]">POPULAR LANDMARKS</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { n: "Chokhi Dhani", d: "Experience authentic Rajasthani culture and cuisine just minutes away.", m: "5 mins" },
                            { n: "JECC Jaipur", d: "Walking distance for business professionals attending exhibitions.", m: "2 mins" },
                            { n: "Sanganer Airport", d: "Conveniently located for travelers flying in and out of Pink City.", m: "15 mins" }
                        ].map((place, i) => (
                            <div key={i} className="bg-white p-8 border-t-4 border-[#dfb163] shadow-lg">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] block mb-2">{place.m} Drive</span>
                                <h3 className="text-xl font-bold text-[#111] mb-3">{place.n}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{place.d}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
