"use client";
import React, { useEffect, useState } from "react";
import { Hotel } from "../../components/types";

export default function GalleryPage() {
    const [hotel, setHotel] = useState<Hotel | null>(null);

    useEffect(() => {
        fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
    }, []);

    const images = [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200",
        "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1200",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200",
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200",
        "https://images.unsplash.com/photo-1551882547-ff43c63efe81?q=80&w=1200"
    ];

    return (
        <div className="pt-24 min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#0f1623] py-20 px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-widest uppercase mb-4">
                    Hospitality Gallery
                </h1>
                <div className="w-24 h-1 bg-[#dfb163] mx-auto mb-6"></div>
                <p className="text-[#dfb163] font-medium tracking-wide max-w-2xl mx-auto">
                    Explore the elegant spaces and premium facilities at {hotel?.name || "Hotel Grand Eagle"}.
                </p>
            </div>

            {/* Gallery Grid */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img, i) => (
                        <div key={i} className="group relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-sm shadow-lg">
                            <img 
                                src={img} 
                                alt={`Gallery image ${i + 1}`} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-bold tracking-widest border border-white px-6 py-2 uppercase text-xs">
                                    View Full
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-50 py-20 px-4 text-center border-t border-gray-100">
                <h2 className="text-3xl font-serif font-bold text-[#0f1623] mb-8">Ready to experience it yourself?</h2>
                <a href="/book" className="inline-block bg-[#0f1623] hover:bg-black text-[#dfb163] px-10 py-4 font-black tracking-[0.2em] uppercase text-xs transition-all shadow-xl">
                    Book Your Stay Now
                </a>
            </section>
        </div>
    );
}
