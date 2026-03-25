"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hotel } from "../types";

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [hotel, setHotel] = useState<Hotel | null>(null);

    const [hash, setHash] = useState("");

    useEffect(() => {
        fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => {});
        
        const handleHashChange = () => {
            setHash(window.location.hash);
        };

        // Initial hash
        setHash(window.location.hash);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("hashchange", handleHashChange);
        
        // Listen for internal navigation that might change hash
        const interval = setInterval(() => {
            if (window.location.hash !== hash) {
                setHash(window.location.hash);
            }
        }, 500);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("hashchange", handleHashChange);
            clearInterval(interval);
        };
    }, [hash]);

    const links = [
        { href: "/", label: "HOME" },
        { href: "/about", label: "ABOUT US" },
        { href: "/services", label: "SERVICES" },
        { href: "/gallery", label: "GALLERY" },
        { href: "/nearby", label: "NEARBY PLACES" },
        { href: "/testimonials", label: "TESTIMONIALS" },
        { href: "/contact", label: "CONTACT US" },
        { href: "/book", label: "BOOK NOW" }
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-[#0f1623] ${isScrolled ? "shadow-2xl py-1" : "py-3 lg:py-4"}`}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    
                    {/* Logo (Left) */}
                    <div className="flex-1 flex items-center justify-start">
                        <Link href="/" className="flex items-center shrink-0">
                            <img 
                                src={hotel?.logoUrl || "/logo.png"} 
                                alt={hotel?.name || "Hotel Logo"} 
                                className="h-10 md:h-14 w-auto object-contain transition-all duration-500 hover:scale-105 [mix-blend-mode:screen]" 
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation Links (Center) */}
                    <div className="hidden xl:flex flex-none items-center justify-center px-4">
                        <div className="flex gap-x-4 xl:gap-x-7 items-center">
                            {links.filter(l => !["BOOK NOW"].includes(l.label)).map(link => {
                                // Sophisticated isActive logic
                                const linkHash = link.href.includes("#") ? "#" + link.href.split("#")[1] : "";
                                const linkPath = link.href.split("#")[0] || "/";
                                
                                let isActive = false;
                                if (link.href === "/") {
                                    isActive = pathname === "/" && (!hash || hash === "" || hash === "#");
                                } else if (linkHash) {
                                    isActive = pathname === linkPath && hash === linkHash;
                                } else {
                                    isActive = pathname === link.href;
                                }

                                return (
                                    <Link 
                                        key={link.href} 
                                        href={link.href}
                                        onClick={() => {
                                            if (linkHash) setHash(linkHash);
                                            else if (link.href === "/") setHash("");
                                        }}
                                        className={`group relative text-[9px] xl:text-[10px] font-black tracking-[0.15em] transition-all duration-300 whitespace-nowrap py-2 ${isActive ? "text-[#d4a857]" : "text-white/90 hover:text-[#d4a857]"}`}
                                    >
                                        {link.label}
                                        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#d4a857] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}></span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions (Right) */}
                    <div className="flex-1 flex items-center justify-end gap-3 xl:gap-4">
                        <Link 
                            href="/book" 
                            className={`hidden xl:flex items-center justify-center bg-[#0f1623] text-[#d4a857] px-5 py-2.5 text-[10px] font-black tracking-[0.1em] transition-all duration-300 hover:bg-black hover:scale-[1.02] active:scale-95 shadow-lg border border-[#d4a857]/30 uppercase rounded-[2px] h-10 md:h-11`}
                        >
                            BOOK NOW
                        </Link>
                        <a href={`tel:${hotel?.contactNumber || "+916367850548"}`} className="bg-[#d4a857] hover:bg-[#c19541] text-black px-4 xl:px-6 py-2 xl:py-2.5 font-black text-[10px] xl:text-xs tracking-wider transition-all duration-300 flex items-center gap-2 h-10 md:h-11 whitespace-nowrap shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 group rounded-[2px] border border-black/10">
                            <span className="text-base xl:text-lg group-hover:rotate-12 transition-transform">📞</span> 
                            <span className="font-black uppercase">{hotel?.contactNumber || "+91 63678 50548"}</span>
                        </a>
                        
                        {/* Mobile Menu Button - VISIBLE ONLY ON MOBILE */}
                        <div className="xl:hidden flex items-center ml-2 text-white">
                            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="hover:text-[#d4a857] transition-all active:scale-90 p-1" aria-label="Toggle Menu">
                                <div className="w-8 flex flex-col gap-1.5">
                                    <span className={`h-0.5 w-full bg-current transition-all duration-300 transform origin-right ${isMobileOpen ? '-rotate-45 translate-x-[-2px] translate-y-[-1px]' : ''}`}></span>
                                    <span className={`h-0.5 w-full bg-current transition-all duration-300 ${isMobileOpen ? 'opacity-0' : ''}`}></span>
                                    <span className={`h-0.5 w-full bg-current transition-all duration-300 transform origin-right ${isMobileOpen ? 'rotate-45 translate-x-[-2px] translate-y-[1px]' : ''}`}></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileOpen && (
                <div className="xl:hidden bg-[#0f1623] border-t border-white/5 shadow-2xl absolute w-full top-full left-0 z-40">
                    <div className="px-6 py-10 flex flex-col space-y-6 max-h-[85vh] overflow-y-auto">
                        {links.filter(l => !["BOOK NOW"].includes(l.label)).map(link => {
                            const linkHash = link.href.includes("#") ? "#" + link.href.split("#")[1] : "";
                            const linkPath = link.href.split("#")[0] || "/";
                            
                            let isActive = false;
                            if (link.href === "/") {
                                isActive = pathname === "/" && !hash;
                            } else if (linkHash) {
                                isActive = pathname === linkPath && hash === linkHash;
                            } else {
                                isActive = pathname === link.href;
                            }

                            return (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    onClick={() => {
                                        setIsMobileOpen(false);
                                        if (linkHash) setHash(linkHash);
                                        else if (link.href === "/") setHash("");
                                    }}
                                    className={`text-lg font-black tracking-[0.2em] uppercase border-b border-white/5 pb-6 transition-colors ${isActive ? "text-[#d4a857]" : "text-white/90 hover:text-[#d4a857]"}`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        <a href={`tel:${hotel?.contactNumber || "+916367850548"}`} className="bg-[#d4a857] text-black py-4.5 text-center font-black text-base tracking-[0.2em] mt-6 inline-block w-full rounded-[2px] shadow-lg">
                            CALL US: {hotel?.contactNumber || "+91 63678 50548"}
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
}
