"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const premiumHeroSlides = [
  {
    id: 1,
    label: "Modern Living",
    title: "Furniture That",
    highlight: "Defines",
    titleEnd: "Your Space.",
    description:
      "Discover sculptural sofas, refined textures, and timeless furniture pieces crafted to bring warmth, comfort, and luxury into the modern home.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1800",
    product: "The Archi Sofa",
    price: "Starting at ₹1,200",
  },
  {
    id: 2,
    label: "Bedroom Luxury",
    title: "Designed For",
    highlight: "Quiet",
    titleEnd: "Comfort.",
    description:
      "Elevate your bedroom with calming palettes, elegant beds, and thoughtfully designed furniture that blends sophistication with everyday ease.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1800",
    product: "The Haven Bed",
    price: "Starting at ₹1,450",
  },
  {
    id: 3,
    label: "Dining Collection",
    title: "Gather Around",
    highlight: "Beautifully",
    titleEnd: "Crafted Tables.",
    description:
      "Create memorable dining moments with statement tables, elegant chairs, and premium finishes tailored for contemporary interiors.",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=1800",
    product: "The Forma Table",
    price: "Starting at ₹980",
  },
];

export const extractTitleParts = (text: string) => {
  if (!text) return { title: "", highlight: "", titleEnd: "" };
  const defaultHighlights = ["Defines", "Quiet", "Beautifully"];
  for (const h of defaultHighlights) {
    if (text.includes(h)) {
      const parts = text.split(h);
      return {
        title: parts[0]?.trim() || "",
        highlight: h,
        titleEnd: parts[1]?.trim() || "",
      };
    }
  }
  const words = text.split(" ");
  if (words.length <= 2) return { title: text, highlight: "", titleEnd: "" };
  const mid = Math.floor(words.length / 2);
  return {
    title: words.slice(0, mid).join(" "),
    highlight: words[mid],
    titleEnd: words.slice(mid + 1).join(" "),
  };
};

const MainHeroSlider = ({ initialSlides = premiumHeroSlides }: { initialSlides?: any[] }) => {
  const [slides, setSlides] = useState(initialSlides);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    if (initialSlides && initialSlides.length > 0) {
      setSlides(initialSlides);
    }
  }, [initialSlides]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
      setProgressKey((prev) => prev + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setProgressKey((prev) => prev + 1);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setProgressKey((prev) => prev + 1);
  };

  const goPrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + slides.length) % slides.length,
    );
    setProgressKey((prev) => prev + 1);
  };

  const activeSlide = slides[activeIndex] || premiumHeroSlides[0];

  return (
    <section className="relative min-h-[calc(100vh-106px)] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={activeSlide.image}
            alt={activeSlide.product}
            className="h-full w-full object-cover"
          />

          {/* luxury overlays */}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* decorative blur */}
      <div className="pointer-events-none absolute left-[-120px] top-[10%] h-[260px] w-[260px] rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-100px] right-[-80px] h-[300px] w-[300px] rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-106px)] max-w-[1440px] items-center px-[5%] py-12 lg:py-16">
        <div className="grid w-full items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* left content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeSlide.id}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-[720px]"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                <span className="text-[11px] font-black uppercase tracking-[2px] text-white/85">
                  {activeSlide.label}
                </span>
              </div>

              <h1 className="font-heading text-[44px] font-bold leading-[0.98] tracking-tight text-white sm:text-[54px] lg:text-[70px] xl:text-[82px]">
                {activeSlide.title && (
                  <>
                    {activeSlide.title}{" "}
                  </>
                )}
                {activeSlide.highlight && (
                  <span className="block text-secondary">
                    {activeSlide.highlight}
                  </span>
                )}
                {activeSlide.titleEnd && (
                  <span className="block">{activeSlide.titleEnd}</span>
                )}
              </h1>

              <p className="mt-6 max-w-[46ch] text-[17px] font-semibold leading-8 text-white/75 lg:text-[18px]">
                {activeSlide.description}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-[14px] font-semibold uppercase tracking-wider text-white transition-all hover:bg-primary/90">
                  Explore Collection
                </button>

                <button className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 text-[14px] font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-secondary hover:text-secondary">
                  Shop New Arrivals
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* right floating product card */}
          <div className="flex justify-start lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={`card-${activeSlide.id}`}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-[360px] rounded-[28px] border border-white/15 bg-white/10 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl lg:p-6"
              >
                <p className="text-[11px] font-black uppercase tracking-[2px] text-secondary">
                  Featured Piece
                </p>

                <h3 className="mt-3 font-heading text-[28px] font-bold leading-tight text-white">
                  {activeSlide.product}
                </h3>

                <p className="mt-2 text-sm font-semibold text-white/70">
                  {activeSlide.price}
                </p>

                <p className="mt-4 text-[15px] font-medium leading-7 text-white/72">
                  Premium materials, sculptural comfort, and a refined
                  silhouette designed for modern interiors.
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5">
                  <span className="text-[12px] font-black uppercase tracking-[2px] text-white/65">
                    Shop Now
                  </span>
                  <button className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-black transition-transform hover:scale-105">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* bottom controls strip */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-[5%] pb-6 lg:flex-row lg:items-end lg:justify-between">
          {/* progress + dots */}
          <div className="w-full max-w-[420px]">
            <div className="mb-4 h-[2px] w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                key={progressKey}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-full bg-secondary"
              />
            </div>

            <div className="flex items-center gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`rounded-full transition-all ${
                    activeIndex === index
                      ? "h-2.5 w-9 bg-secondary"
                      : "h-2.5 w-2.5 bg-white/45 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* bottom glass strip */}
          <div className="grid w-full gap-3 rounded-[24px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl sm:grid-cols-3 lg:max-w-[720px] lg:p-5  hidden">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[2px] text-secondary">
                Free Delivery
              </p>
              <p className="mt-1 text-sm font-semibold text-white/80">
                On premium orders above ₹999
              </p>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[2px] text-secondary">
                Custom Crafted
              </p>
              <p className="mt-1 text-sm font-semibold text-white/80">
                Design-led essentials for modern homes
              </p>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[2px] text-secondary">
                  Customer Favorite
                </p>
                <p className="mt-1 text-sm font-semibold text-white/80">
                  Bestselling furniture collections
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all hover:border-secondary hover:text-secondary"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-all hover:border-secondary hover:text-secondary"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainHeroSlider;
