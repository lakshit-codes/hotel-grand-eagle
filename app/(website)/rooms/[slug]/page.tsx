"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Room, AmenityCat } from "../../../components/types";

export default function RoomDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [room, setRoom] = useState<Room | null>(null);
    const [amenities, setAmenities] = useState<AmenityCat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const slug = params?.slug as string;
        if (!slug) return;
        
        Promise.all([
            fetch("/api/room-types").then(r => r.json()),
            fetch("/api/amenities").then(r => r.json())
        ]).then(([rData, aData]) => {
            const found = rData.find((rm: Room) => rm.slug === slug);
            if (found) setRoom(found);
            if (aData.length) setAmenities(aData);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [params]);

    if (loading) return <div className="min-h-screen pt-40 text-center text-gray-500">Loading room details...</div>;
    
    if (!room) {
        return (
            <div className="min-h-screen pt-40 px-4 text-center">
                <h1 className="text-4xl font-serif text-[#0f1623] mb-6">Room Not Found</h1>
                <p className="text-gray-500 mb-8">We couldn't find the room you were looking for.</p>
                <Link href="/rooms" className="text-[#f59e0b] font-bold tracking-wider uppercase border-b-2 border-[#f59e0b] pb-1">Back to Rooms</Link>
            </div>
        );
    }

    const facilityMap = amenities.reduce<Record<string, string>>((acc, cat) => {
        cat.facilities.forEach(fac => { acc[fac.id] = fac.name; });
        return acc;
    }, {});

    const heroImg = room.images?.[0] || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop';
    const gallery = room.images?.slice(1) || [];

    return (
        <div className="w-full bg-white pb-24">
            {/* Hero Image */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-gray-900">
                <img src={heroImg} alt={room.roomName} className="w-full h-full object-cover mix-blend-overlay opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-0 w-full px-4 text-center">
                    <span className="text-[#f59e0b] font-bold tracking-widest text-sm uppercase mb-3 block">{room.roomCategory}</span>
                    <h1 className="text-4xl md:text-6xl font-serif text-white font-bold drop-shadow-xl">{room.roomName}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-16">
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100 text-center">
                        <div>
                            <span className="block text-xl mb-2">👥</span>
                            <span className="block font-bold text-gray-800 text-sm">Up to {room.maxOccupancy} Guests</span>
                        </div>
                        <div>
                            <span className="block text-xl mb-2">📐</span>
                            <span className="block font-bold text-gray-800 text-sm">{room.roomSize} m²</span>
                        </div>
                        <div>
                            <span className="block text-xl mb-2">🛏️</span>
                            <span className="block font-bold text-gray-800 text-sm">{room.bedType} Bed</span>
                        </div>
                        <div>
                            <span className="block text-xl mb-2">🪟</span>
                            <span className="block font-bold text-gray-800 text-sm">{room.view}</span>
                        </div>
                    </div>

                    {/* Room Overview */}
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-[#0f1623] mb-6">Room Overview</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-600">
                            <li className="flex justify-between border-b border-gray-100 pb-2"><span>Bathroom</span> <span className="font-semibold text-gray-800">{room.bathroomType}</span></li>
                            <li className="flex justify-between border-b border-gray-100 pb-2"><span>Soundproofing</span> <span className="font-semibold text-gray-800">{room.soundproofingLevel}</span></li>
                            <li className="flex justify-between border-b border-gray-100 pb-2"><span>Theme</span> <span className="font-semibold text-gray-800">{room.roomTheme}</span></li>
                            <li className="flex justify-between border-b border-gray-100 pb-2"><span>Smoking</span> <span className="font-semibold text-gray-800">{room.smokingPolicy}</span></li>
                            <li className="flex justify-between border-b border-gray-100 pb-2"><span>Floor</span> <span className="font-semibold text-gray-800">{room.floorPreference}</span></li>
                            <li className="flex justify-between border-b border-gray-100 pb-2"><span>Entertainment</span> <span className="font-semibold text-gray-800">{room.entertainmentOptions}</span></li>
                            <li className="flex justify-between border-b border-gray-100 pb-2"><span>Balcony</span> <span className="font-semibold text-gray-800">{room.balconyAvailable ? "Yes" : "No"}</span></li>
                            <li className="flex justify-between border-b border-gray-100 pb-2"><span>Workspace</span> <span className="font-semibold text-gray-800">{room.inRoomWorkspace ? "Yes" : "No"}</span></li>
                        </ul>
                    </div>

                    {/* Amenities */}
                    {room.amenityIds?.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-[#0f1623] mb-6">In-Room Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {room.amenityIds.map(id => (
                                    <div key={id} className="flex items-center gap-3 text-gray-600 bg-gray-50 px-4 py-3 rounded-sm border border-gray-100">
                                        <span className="text-[#f59e0b]">✓</span>
                                        <span className="text-sm font-medium">{facilityMap[id] || id}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gallery Sidebar items if we had more than 1 image */}
                    {gallery.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-[#0f1623] mb-6">Gallery</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {gallery.map((img, i) => (
                                    <div key={i} className="aspect-square bg-gray-200 overflow-hidden">
                                        <img src={img} alt={`${room.roomName} view ${i}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Booking Sticky Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-32 bg-[#0f1623] text-white p-8 shadow-2xl rounded-sm">
                        <div className="text-center pb-8 border-b border-gray-700 mb-8">
                            <span className="block text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">From</span>
                            <span className="text-4xl text-[#f59e0b] font-bold">₹{room.basePrice.toLocaleString()}</span>
                            <span className="block text-gray-400 text-sm mt-2">per night, excluding taxes</span>
                        </div>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Extra Bed Option</span>
                                <span className="font-semibold text-white">{room.extraBedPrice > 0 ? `+₹${room.extraBedPrice}` : "Available"}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-300">
                                <span>Cancellation</span>
                                <span className="font-semibold text-white">{room.refundable ? "Refundable" : "Non-Refundable"}</span>
                            </div>
                        </div>

                        <Link 
                            href={`/book?room=${room.slug}`} 
                            className="block w-full text-center bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold tracking-wider uppercase py-4 transition-colors"
                        >
                            Select Dates
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
