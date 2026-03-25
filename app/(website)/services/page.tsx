"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function ServicesPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
    }, []);

    const services = [
        { i: "📶", t: "Free Wi-Fi", d: "Experience seamless connectivity with our complimentary high-speed internet available throughout the hotel. Perfect for business travelers and streaming enthusiasts alike." },
        { i: "🚗", t: "Free Parking", d: "We provide ample, secure on-site parking for all our guests at no additional cost. Whether you are traveling by bike or car, your vehicle is safe with us." },
        { i: "🤝", t: "24/7 Front Desk", d: "Our dedicated reception team is available around the clock to assist you with check-ins, local recommendations, travel arrangements, and any special requests." },
        { i: "🚌", t: "Easy Access To Transit", d: "Strategically located near the main bus stands and travel hubs, our hotel ensures you spend less time commuting and more time enjoying your stay." },
        { i: "🍽️", t: "In-Room Dining", d: "Enjoy a variety of hygienic and delicious local and continental dishes delivered right to your doorstep. Perfect for those quiet evenings after a long day of travel." },
        { i: "🧺", t: "Laundry & Ironing", d: "Travel light and stay fresh. Our professional laundry and ironing services are available to ensure you always look your best for meetings or sightseeing." },
        { i: "⚡", t: "Uninterrupted Power", d: "With a robust 24/7 power backup system, your comfort is never compromised. Enjoy all amenities without worrying about power outages." },
        { i: "📹", t: "Secure Environment", d: "Your safety is our priority. We maintain 24-hour CCTV surveillance and on-site security personnel to ensure a secure environment for all our guests." },
        { i: "🖨️", t: "Business Services", d: "Need a quick print or a scan? Our front desk offers basic business services including printing, scanning, and courier assistance for our professional guests." }
    ];

    return (
        <div className="pt-24 min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="bg-[#0f1623] py-20 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-widest uppercase mb-4">
                    Services & Facilities
                </h1>
                <div className="w-24 h-1 bg-[#dfb163] mx-auto mb-6"></div>
                <p className="text-[#dfb163] font-medium tracking-wide max-w-2xl mx-auto">
                    Designed for comfort, convenience, and a seamless stay at {hotel?.name || "Hotel Grand Eagle"}.
                </p>
            </div>

            {/* Services Grid */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {services.map((svc, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-8 border border-gray-100 bg-white hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md rounded-sm">
                            <div className="w-20 h-20 bg-[#dfb163] rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_10px_20px_rgba(223,177,99,0.3)]">
                                {svc.i}
                            </div>
                            <h3 className="text-[#0f1623] font-bold text-xl mb-4 tracking-wide uppercase font-serif">
                                {svc.t}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {svc.d}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Feature Highlight */}
            <section className="bg-[#0f1623] py-24 px-4 mt-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#dfb163]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 text-center md:text-left">
                        <span className="text-[#dfb163] font-bold tracking-widest text-sm uppercase mb-4 block">Ultimate Comfort</span>
                        <h2 className="text-4xl font-serif font-bold text-white mb-6 leading-tight uppercase">Why Choose {hotel?.name || "Hotel Grand Eagle"}?</h2>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <span className="text-[#dfb163]">✓</span> Best hospitality in Sitapura Industrial Area
                            </li>
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <span className="text-[#dfb163]">✓</span> Budget-friendly with premium amenities
                            </li>
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <span className="text-[#dfb163]">✓</span> Exceptionally clean and well-maintained rooms
                            </li>
                            <li className="flex items-center gap-3 justify-center md:justify-start">
                                <span className="text-[#dfb163]">✓</span> Highly rated customer service
                            </li>
                        </ul>
                    </div>
                    <div className="flex-1 relative aspect-video w-full rounded-sm overflow-hidden shadow-2xl border-4 border-[#dfb163]/20">
                         <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200" alt="Hospitality" className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>
        </div>
    );
}
