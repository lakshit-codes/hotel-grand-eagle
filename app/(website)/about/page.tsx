"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function AboutPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings")
            .then(r => r.json())
            .then(d => { if (d.name) setHotel(d); })
            .catch(() => {});
    }, []);

    return (
        <div className="w-full bg-white pb-24">
            {/* Header */}
            <div className="bg-[#0f1623] text-white py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto mt-16">
                    <span className="text-[#f59e0b] font-bold tracking-widest text-sm uppercase mb-4 block">Our Story</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-wide drop-shadow-md">About {hotel?.name || "Hotel Grand Eagle"}</h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 mt-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-px bg-gray-400"></div>
                            <span className="text-gray-500 text-sm font-medium tracking-wide">About Us</span>
                        </div>
                        <h2 className="text-3xl font-serif text-[#0f1623] font-bold mb-6">Budget-Friendly Stay in Jaipur</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            {hotel?.name || "Hotel Grand Eagle"} is a <strong>value-for-money hotel</strong> offering clean, well-furnished rooms tailored for both business travelers and tourists. Each room is thoughtfully equipped with essentials such as <strong>air conditioning, private bathrooms, comfortable chairs, work desks, telephones, televisions,</strong> and <strong>24/7 hot and cold water supply</strong>—everything you need for a <strong>comfortable yet affordable stay.</strong>
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Located near <strong>JECC</strong>, major <strong>transport hubs</strong>, and <strong>local food joints</strong>, our hotel is perfect for <strong>budget-conscious travelers</strong> seeking convenience and accessibility. With a focus on <strong>cleanliness, functionality,</strong> and <strong>friendly service</strong>, {hotel?.name || "Hotel Grand Eagle"} is the ideal pick for <strong>short or extended stays</strong> in Jaipur's Sitapura Industrial Area.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#0f1623] translate-x-4 translate-y-4"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1542314831-c6a4d14d8376?q=80&w=1000&auto=format&fit=crop" 
                            alt="Hotel Exterior" 
                            className="relative z-10 w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center border-t border-gray-100 pt-16">
                    <div>
                        <div className="text-4xl mb-4">🥂</div>
                        <h3 className="font-serif font-bold text-[#0f1623] text-xl mb-2">Unmatched Hospitality</h3>
                        <p className="text-sm text-gray-500">Service that anticipates your every need.</p>
                    </div>
                    <div>
                        <div className="text-4xl mb-4">🛏️</div>
                        <h3 className="font-serif font-bold text-[#0f1623] text-xl mb-2">Luxurious Rooms</h3>
                        <p className="text-sm text-gray-500">Sanctuaries designed for ultimate comfort.</p>
                    </div>
                    <div>
                        <div className="text-4xl mb-4">🌆</div>
                        <h3 className="font-serif font-bold text-[#0f1623] text-xl mb-2">Prime Location</h3>
                        <p className="text-sm text-gray-500">Situated in the vibrant heart of the city.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
