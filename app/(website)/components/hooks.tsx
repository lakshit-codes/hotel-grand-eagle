"use client";
import React, { useEffect, useRef } from "react";

export function useFadeIn() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
            { threshold: 0.1, rootMargin: "-40px" }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return ref;
}

export function Fade({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    const ref = useFadeIn();
    return <div ref={ref} className={`vh-fade ${className || ""}`} style={style}>{children}</div>;
}
