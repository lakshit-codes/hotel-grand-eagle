"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function NearbyPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
    }, []);

    const landmarks = [
        { 
            n: "Chokhi Dhani", 
            d: "A world-renowned ethnic village resort that captures the vibrant spirit of Rajasthan. Enjoy camel rides, folk dances, traditional pottery, and an authentic Rajasthani Thali dinner.",
            m: "5 mins", 
            img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800" 
        },
        { 
            n: "Jaipur Exhibition & Convention Centre (JECC)", 
            d: "The city's premier venue for large-scale exhibitions, conventions, and trade fairs. Our hotel is the ideal choice for business professionals and exhibitors.",
            m: "2 mins", 
            img: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=800" 
        },
        { 
            n: "Jaipur International Airport (Sanganer)", 
            d: "Stay close to the airport for a stress-free travel experience. Our location ensures you can reach your terminal quickly, even during peak hours.",
            m: "15 mins", 
            img: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=800" 
        },
        { 
            n: "Sitapura Industrial Area", 
            d: "Jaipur's major industrial hub. Perfect for corporate guests visiting companies and manufacturing units in the Sitapura and Pratap Nagar zones.",
            m: "1 min", 
            img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800" 
        },
        { 
            n: "Pink City (City Palace & Hawa Mahal)", 
            d: "The historic heart of Jaipur. Explore the architectural marvels of Hawa Mahal, Jantar Mantar, and the City Palace museum.",
            m: "35 mins", 
            img: "https://images.unsplash.com/photo-1590050752117-23a9d7fc217c?q=80&w=800" 
        },
        { 
            n: "World Trade Park (WTP)", 
            d: "A modern shopping marvel with high-end brands, food courts, and entertainment. Perfect for a day of retail therapy and leisure.",
            m: "20 mins", 
            img: "https://images.unsplash.com/photo-1567449300518-034888bb247a?q=80&w=800" 
        }
    ];

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#0f1623] py-20 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-widest uppercase mb-4">
                    Nearby Attractions
                </h1>
                <div className="w-24 h-1 bg-[#dfb163] mx-auto mb-6"></div>
                <p className="text-[#dfb163] font-medium tracking-wide max-w-2xl mx-auto">
                    Explore the cultural vibrance and business hubs surrounding {hotel?.name || "Hotel Grand Eagle"}.
                </p>
            </div>

            {/* Landmarks Grid */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {landmarks.map((place, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300">
                            <div className="relative h-48 overflow-hidden">
                                <img src={place.img} alt={place.n} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 text-[10px] font-black tracking-widest text-[#0f1623] shadow-sm">
                                    {place.m} {place.m.includes("mins") ? "MINS" : "MIN"} DRIVE
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-[#0f1623] mb-3 uppercase tracking-tight">{place.n}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                    {place.d}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Getting Around Section */}
            <section className="bg-gray-50 py-24 px-4 border-t border-gray-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-bold text-[#0f1623] mb-6 uppercase">Getting Around</h2>
                    <p className="text-gray-600 mb-12">
                        Sitapura is well-connected to all parts of Jaipur. Whether you prefer public transport, private taxis, or app-based services, we ensure your commute is easy.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="bg-white p-6 rounded-sm shadow-sm">
                            <h4 className="font-bold text-[#0f1623] mb-2 uppercase text-xs tracking-widest">Uber / Ola</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">Most popular and reliable way to travel. Cabs are available 24/7 at our doorstep.</p>
                        </div>
                        <div className="bg-white p-6 rounded-sm shadow-sm">
                            <h4 className="font-bold text-[#0f1623] mb-2 uppercase text-xs tracking-widest">E-Rickshaws</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">Perfect for short distances to JECC or local eateries. Affordable and eco-friendly.</p>
                        </div>
                        <div className="bg-white p-6 rounded-sm shadow-sm">
                            <h4 className="font-bold text-[#0f1623] mb-2 uppercase text-xs tracking-widest">Private Taxis</h4>
                            <p className="text-gray-500 text-xs leading-relaxed">Can be arranged at the front desk for full-day city tours or airport transfers.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
