"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function TestimonialsPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
    }, []);

    const testimonials = [
        { 
            n: "Sandeep Kumar", 
            d: "Clean, budget-friendly and great service! Best hotel near Sitapura Area. The rooms are well-maintained and the staff is very polite. Highly recommended for short business trips.",
            r: 5,
            p: "S"
        },
        { 
            n: "Anita Sharma", 
            d: "Stayed here for a week while attending a conference at JECC. The location is perfect, and the WiFi was strong enough for my zoom calls. Very professional staff.",
            r: 5,
            p: "A"
        },
        { 
            n: "Rahul Verma", 
            d: "Excellent value for money. You won't find better rooms at this price point in Jaipur. The 24/7 room service was very prompt and the food was surprisingly good.",
            r: 4,
            p: "R"
        },
        { 
            n: "Deepika Singh", 
            d: "A very safe and comfortable stay for solo female travelers. The security measures and CCTV surveillance made me feel at ease throughout my stay. Thank you!",
            r: 5,
            p: "D"
        },
        { 
            n: "Vikram Mehta", 
            d: "Great accessibility to Chokhi Dhani and other major attractions. The staff helped us arrange a city tour at a very reasonable price. Wonderful experience overall.",
            r: 5,
            p: "V"
        },
        { 
            n: "Priyanka Joshi", 
            d: "The room was spacious and the hot water was available throughout. Highly recommend for those who want a peaceful stay away from the city's main hustle.",
            r: 4,
            p: "P"
        }
    ];

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#0f1623] py-20 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-widest uppercase mb-4">
                    Guest Stories
                </h1>
                <div className="w-24 h-1 bg-[#dfb163] mx-auto mb-6"></div>
                <p className="text-[#dfb163] font-medium tracking-wide max-w-2xl mx-auto">
                    Hear what our guests have to say about their stay at {hotel?.name || "Hotel Grand Eagle"}.
                </p>
            </div>

            {/* Testimonials Grid */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-10 border border-gray-100 rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300 relative">
                            <div className="text-6xl text-[#dfb163]/10 absolute top-4 left-6 font-serif font-black">&quot;</div>
                            <div className="relative z-10">
                                <div className="flex text-[#dfb163] mb-6 text-sm">
                                    {"\u2605".repeat(t.r)}{"\u2606".repeat(5 - t.r)}
                                </div>
                                <p className="text-gray-600 font-serif italic mb-8 leading-relaxed text-lg">
                                    &quot;{t.d}&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#dfb163] rounded-full flex items-center justify-center font-bold text-black border-2 border-white/10 shadow-md">
                                        {t.p}
                                    </div>
                                    <div>
                                        <h4 className="text-[#0f1623] font-bold tracking-wider uppercase text-xs">{t.n}</h4>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Verified Guest</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Review CTA */}
            <section className="bg-[#0f1623] py-24 px-4 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-serif font-bold text-white mb-6 uppercase">Did you stay with us recently?</h2>
                    <p className="text-gray-300 mb-10 leading-relaxed font-light">
                        We value your feedback and would love to hear about your experience. Your reviews help us maintain the high standard of service we strive for.
                    </p>
                    <a href="/contact" className="inline-block border border-[#dfb163] text-[#dfb163] hover:bg-[#dfb163] hover:text-black px-10 py-3.5 font-black tracking-[0.2em] uppercase text-xs transition-all shadow-xl">
                        Send Your Feedback
                    </a>
                </div>
            </section>
        </div>
    );
}

