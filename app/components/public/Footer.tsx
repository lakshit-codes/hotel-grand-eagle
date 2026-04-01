"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Hotel } from "../types";

export default function Footer() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings")
            .then(res => res.json())
            .then(data => {
                if (data.name) setHotel(data);
            })
            .catch(() => {});
    }, []);

    return (
        <footer className="bg-[#0f1623] text-gray-300 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <img src={hotel?.logoUrl || "/logo.png"} alt="Logo" className="h-10 w-auto opacity-80 mix-blend-lighten" />
                        <span className="font-serif font-bold text-xl tracking-wider text-white">
                            {hotel?.name || "HOTEL GRAND EAGLE"}
                        </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-md mb-6">
                        {hotel?.shortDescription || "Experience unparalleled luxury and breathtaking views at our 5-star urban retreat. Your perfect escape awaits."}
                    </p>
                    <div className="flex space-x-4">
                        {/* Social Icons Placeholder */}
                        <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#f59e0b] hover:text-white transition-all">FB</a>
                        <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#f59e0b] hover:text-white transition-all">IG</a>
                        <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#f59e0b] hover:text-white transition-all">TW</a>
                    </div>
                </div>
                
                <div>
                    <h3 className="text-white font-semibold tracking-wider text-sm mb-6 uppercase">Quick Links</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/" className="hover:text-[#f59e0b] transition-colors">Home</Link></li>
                        <li><Link href="/rooms" className="hover:text-[#f59e0b] transition-colors">Rooms & Suites</Link></li>
                        <li><Link href="/about" className="hover:text-[#f59e0b] transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-[#f59e0b] transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold tracking-wider text-sm mb-6 uppercase">Contact Us</h3>
                    <ul className="space-y-4 text-sm text-gray-400">
                        <li className="flex items-start gap-3">
                            <span className="mt-1">📍</span>
                            <span>{hotel?.address || "123 Eagle Avenue"}<br />{hotel?.city}, {hotel?.country}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span>📞</span>
                            <span>{hotel?.contactNumber || "+91 63678 50548"}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span>✉️</span>
                            <span>{hotel?.email || "reservations@hotelgrandeagle.com"}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 text-sm text-center text-gray-500 flex flex-col md:flex-row justify-between items-center">
                <p>&copy; {new Date().getFullYear()} {hotel?.name || "Hotel Grand Eagle"}. All rights reserved.</p>
                <div className="space-x-4 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
                    <Link href="#" className="hover:text-gray-300">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
