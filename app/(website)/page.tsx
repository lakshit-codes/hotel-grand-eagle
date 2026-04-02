"use client";
import React, { useEffect } from "react";
import Hero from "./components/Hero";
import Rooms from "./components/Rooms";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";

export default function HomePage() {
  // Add an effect to handle scroll-triggered fade-in animations that were in HTML
  useEffect(() => {
    const fadeEls = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transitionDelay = (i * 0.06) + 's';
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );
    fadeEls.forEach(el => {
      // Temporarily remove 'visible' class if it was hardcoded during render, 
      // or we just let it animate via CSS by default.
      el.classList.remove('visible'); 
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Hero />
      <Rooms />
      <About />
      <Gallery />
      <Testimonials />
      <Contact />
    </>
  );
}
