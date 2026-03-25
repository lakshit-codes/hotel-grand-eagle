"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Room } from "../../components/types";

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/room-types")
            .then(r => r.json())
            .then(d => {
                if (d.length) setRooms(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="w-full min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-[#0f1623] text-white py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto mt-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-wide drop-shadow-md">Rooms & Suites</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Experience the pinnacle of comfort. Every room is designed to provide you with a luxurious sanctuary high above the city.
                    </p>
                </div>
            </div>

            {/* Screenshot "Your Room, Your Comfort Zone" Section */}
            <div className="bg-[#f8f7eb] py-20 px-4 mt-0">
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <span className="bg-[#dfb163] text-black font-semibold uppercase tracking-widest text-xs px-6 py-2 mb-8 inline-block">ROOMS</span>
                    <h2 className="text-4xl md:text-5xl font-sans text-black font-medium text-center mb-16 uppercase leading-tight tracking-[0.05em]">YOUR ROOM, YOUR COMFORT<br/>ZONE</h2>
                    
                    <div className="flex flex-col md:flex-row shadow-2xl w-full border border-gray-900 overflow-hidden">
                        <div className="md:w-[55%] h-[500px]">
                            <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Hotel Room" />
                        </div>
                        <div className="md:w-[45%] bg-white p-10 lg:p-14 flex flex-col justify-center relative">
                            <ul className="space-y-6 relative z-10 block">
                                <li>
                                    <h4 className="text-[#dfb163] font-bold text-[13px] tracking-wide mb-1">Air Conditioning</h4>
                                    <p className="text-[11px] font-bold text-gray-800 uppercase leading-relaxed tracking-wide">STAY COOL AND COMFORTABLE IN<br/>EVERY SEASON.</p>
                                </li>
                                <li>
                                    <h4 className="text-[#dfb163] font-bold text-[13px] tracking-wide mb-1">Clean Towels & Linen</h4>
                                    <p className="text-[11px] font-bold text-gray-800 uppercase leading-relaxed tracking-wide">FRESHLY LAUNDERED TOWELS, LINEN,<br/>AND TOILETRIES – REFRESHED DAILY.</p>
                                </li>
                                <li>
                                    <h4 className="text-[#dfb163] font-bold text-[13px] tracking-wide mb-1">Work Desk & Chair</h4>
                                    <p className="text-[11px] font-bold text-gray-800 uppercase leading-relaxed tracking-wide">A DEDICATED SPACE TO WORK, WRITE,<br/>OR PLAN YOUR TRAVEL DAY.</p>
                                </li>
                                <li>
                                    <h4 className="text-[#dfb163] font-bold text-[13px] tracking-wide mb-1">Flat-Screen TV</h4>
                                    <p className="text-[11px] font-bold text-gray-800 uppercase leading-relaxed tracking-wide">ENJOY LOCAL AND POPULAR TV<br/>CHANNELS DURING YOUR DOWNTIME.</p>
                                </li>
                                <li>
                                    <h4 className="text-[#dfb163] font-bold text-[13px] tracking-wide mb-1">Private Bathroom</h4>
                                    <p className="text-[11px] font-bold text-gray-800 uppercase leading-relaxed tracking-wide">ATTACHED BATH WITH 24/7 HOT AND<br/>COLD WATER ACCESS.</p>
                                </li>
                            </ul>
                            <div className="mt-10 relative z-10 w-full flex justify-center">
                                <Link href="/book" className="bg-[#dfb163] hover:bg-[#c99a4e] text-black px-12 py-3.5 font-bold tracking-wide text-[13px] transition-colors inline-block shadow-sm">
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-16 pt-16 border-t border-gray-200 text-center">
                <h2 className="text-3xl font-serif text-[#0f1623] font-bold mb-12">Browse All Rooms</h2>
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading exquisite accommodations...</div>
                ) : rooms.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No rooms available at the moment.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {rooms.map(room => (
                            <div key={room.id} className="bg-white flex flex-col group cursor-pointer hover:shadow-2xl transition-shadow duration-300">
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
                                <div className="p-8 flex-1 flex flex-col items-center text-center border border-t-0 border-gray-100">
                                    <h3 className="text-2xl font-serif font-bold text-[#0f1623] mb-4">{room.roomName}</h3>
                                    
                                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-500 font-semibold tracking-wider mb-8">
                                        <span>👥 {room.maxOccupancy} GUESTS</span>
                                        <span>🛏️ {room.bedType}</span>
                                        <span>📐 {room.roomSize} M²</span>
                                        <span>🪟 {room.view}</span>
                                    </div>
                                    
                                    <div className="mt-auto w-full">
                                        <div className="text-[#f59e0b] font-bold text-2xl mb-8">
                                            ₹{room.basePrice.toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ night</span>
                                        </div>
                                        <Link href={`/rooms/${room.slug}`} className="block w-full border border-[#0f1623] hover:bg-[#0f1623] hover:text-white text-[#0f1623] transition-colors py-3 text-sm font-bold tracking-wider uppercase mb-3">
                                            Room Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
