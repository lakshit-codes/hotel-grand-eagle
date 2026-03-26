"use client";
import React, { useEffect, useState } from "react";
import { Hotel, NearbyPlace } from "../../components/types";

const DEFAULT_IMG = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=60";

export default function NearbyPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [places, setPlaces] = useState<NearbyPlace[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/hotel-settings")
            .then(r => r.json())
            .then(d => { if (d.name) setHotel(d); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        fetch("/api/nearby")
            .then(r => r.json())
            .then(d => { if (Array.isArray(d)) setPlaces(d); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

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
                {loading ? (
                    <div className="text-center py-24 text-gray-400">
                        <div className="text-5xl mb-4 animate-pulse">🗺️</div>
                        <p className="text-lg font-medium">Loading nearby places...</p>
                    </div>
                ) : places.length === 0 ? (
                    <div className="text-center py-24 text-gray-400">
                        <div className="text-5xl mb-4">🗺️</div>
                        <p className="text-lg font-medium">No nearby places listed yet.</p>
                        <p className="text-sm mt-2 text-gray-300">Check back soon — we are updating this page.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {places.map((place) => (
                            <div key={place.id} className="bg-white border border-gray-100 rounded-sm overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={place.image || DEFAULT_IMG}
                                        alt={place.name}
                                        onError={e => { e.currentTarget.src = DEFAULT_IMG; }}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {place.distance && (
                                        <div className="absolute top-4 right-4 bg-white/95 px-3 py-1 text-[10px] font-black tracking-widest text-[#0f1623] shadow-sm">
                                            {place.distance.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-[#0f1623] mb-3 uppercase tracking-tight">{place.name}</h3>
                                    {place.description && (
                                        <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                            {place.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
