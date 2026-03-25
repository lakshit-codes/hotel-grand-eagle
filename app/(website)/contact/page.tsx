"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function ContactPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings")
            .then(r => r.json())
            .then(d => { if (d.name) setHotel(d); })
            .catch(() => {});
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for reaching out! We will get back to you shortly.");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="w-full bg-gray-50 pb-24 pt-20">
            {/* Header */}
            <div className="bg-[#0f1623] text-white py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto mt-16">
                    <span className="text-[#dfb163] font-bold tracking-widest text-sm uppercase mb-4 block">Get In Touch</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-wide drop-shadow-md">Contact Us</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-[-40px] relative z-10">
                <div className="bg-white shadow-2xl flex flex-col md:flex-row">
                    
                    {/* Contact Form */}
                    <div className="p-12 md:w-3/5 bg-[#dfb163]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <input required type="text" className="w-full bg-white p-4 outline-none text-sm placeholder-gray-400 font-medium border-none" placeholder="Your Name*" />
                                </div>
                                <div>
                                    <input required type="email" className="w-full bg-white p-4 outline-none text-sm placeholder-gray-400 font-medium border-none" placeholder="Your Email*" />
                                </div>
                                <div>
                                    <input required type="tel" className="w-full bg-white p-4 outline-none text-sm placeholder-gray-400 font-medium border-none" placeholder="Your Phone*" />
                                </div>
                                <div>
                                    <select defaultValue="" className="w-full bg-white p-4 outline-none text-sm text-gray-400 font-medium border-none appearance-none">
                                        <option value="" disabled>Booking Plan Time</option>
                                        <option value="morning">Morning</option>
                                        <option value="afternoon">Afternoon</option>
                                        <option value="evening">Evening</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <textarea required rows={5} className="w-full bg-white p-4 outline-none text-sm placeholder-gray-400 font-medium border-none resize-none" placeholder="Message..."></textarea>
                            </div>
                            <div className="flex justify-center mt-6">
                                <button type="submit" className="bg-[#0f1623] hover:bg-black text-white px-10 py-3 font-semibold text-sm transition-colors uppercase tracking-widest">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="md:w-2/5 p-12 bg-white flex flex-col justify-start gap-6">
                        <div className="border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <span className="text-[#dfb163] text-3xl">📞</span>
                            <div>
                                <div className="text-xs tracking-widest uppercase font-semibold text-gray-400 mb-1">Call Us:</div>
                                <div className="font-bold text-[#0f1623]">+{hotel?.contactNumber || "916367850548"}</div>
                            </div>
                        </div>
                        <div className="border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                            <span className="text-[#dfb163] text-3xl">✉️</span>
                            <div>
                                <div className="text-xs tracking-widest uppercase font-semibold text-gray-400 mb-1">E-mail Us:</div>
                                <div className="font-bold text-[#0f1623]">{hotel?.email || "grandeaglehotel@gmail.com"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

