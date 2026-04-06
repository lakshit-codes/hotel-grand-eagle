"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  PenTool,
  Hammer,
  Package,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Plus,
  Minus,
  ArrowUp,
} from "lucide-react";

import { Link } from "@/lib/router";
import { products, categories } from "@/data/products";
import MainHeroSlider, { extractTitleParts } from "./MainHeroSlider";
import { AnnotatorPlugin } from "../annotationPlugin/AnnotatorPlugin";
import GetAllPages from "./GetAllPages";
import { RootState } from "@/lib/store/store";
import { useDispatch, useSelector } from "react-redux";
import { resetPageComments } from "@/lib/store/comments/commentSlice";

// --- Types ---
interface HomePageProps {
  data: {
    content: any[];
    [key: string]: any;
  };
}

// --- Helper to extract section mapping ---
const getSection = (content: any[], adminTitle: string) => 
  content?.find(s => s.adminTitle === adminTitle);

// --- Homepage Specific Components ---

const Hero = ({ section }: { section: any }) => {
  if (!section) return null;
  const carousel = section.columns?.[0]?.[0];
  if (!carousel || !carousel.items) return <section data-annotate-id="home-hero-section"><MainHeroSlider /></section>;

  const parsedSlides = carousel.items.map((slide: any, idx: number) => {
    const leftCol = slide.columns?.[0] || [];
    const rightCol = slide.columns?.[1] || [];
    
    const labelBlock = leftCol.find((b: any) => b.level === "h5");
    const headingBlock = leftCol.find((b: any) => b.level === "h1");
    const descBlock = leftCol.find((b: any) => b.type === "paragraph");
    
    const imgBlock = rightCol.find((b: any) => b.type === "image");
    const cardsBlock = rightCol.find((b: any) => b.type === "cards");
    
    const text = headingBlock?.text || "";
    const { title, highlight, titleEnd } = extractTitleParts(text);
    
    const productCard = cardsBlock?.items?.[0];
    const productDescParts = productCard?.description?.split("\n\n") || [""];
    
    return {
      id: slide.id || idx + 1,
      label: labelBlock?.text || "",
      title,
      highlight,
      titleEnd,
      description: descBlock?.text || "",
      image: imgBlock?.url || "",
      product: productCard?.title || "",
      price: productDescParts[0] || "",
    };
  });

  return (
    <section data-annotate-id="home-hero-section">
      <MainHeroSlider initialSlides={parsedSlides} />
    </section>
  );
};

const USP = ({ section }: { section: any }) => {
  if (!section) return null;
  const features = section.columns?.[0]?.[0];
  const items = features?.items || [
    { title: "Fast Delivery", description: "Doorstep shipping worldwide" },
    { title: "Secure Checkout", description: "Protected payments & data" },
    { title: "Easy Returns", description: "14-day hassle-free policy" },
    { title: "Premium Craft", description: "Materials built for years" },
  ];

  const icons = [Truck, ShieldCheck, RefreshCcw, Sparkles];

  return (
    <section
      data-annotate-id="home-usp-section"
      className="px-[5%] pb-[90px] mt-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-surface border border-border md:shadow-2xl grid sm:grid-cols-2 lg:grid-cols-4 gap-[18px] p-[22px] rounded-lg"
      >
        {items.map((item: any, idx: number) => {
          const Icon = icons[idx % icons.length];
          return (
            <div key={idx} className="flex gap-3 items-start p-[6px_8px]">
              <Icon className="text-secondary mt-0.5" size={22} />
              <div>
                <strong className="block text-[12px] tracking-[2px] uppercase font-black">
                  {item.title}
                </strong>
                <span className="block text-[12px] text-muted mt-0.5 font-bold">
                  {item.description || item.sub}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};

const Services = ({ section }: { section: any }) => {
  if (!section) return null;
  const col = section.columns?.[0] || [];
  const heading = col.find((b: any) => b.type === "heading")?.text || "Our Bespoke Services";
  const cards = col.find((b: any) => b.type === "cards")?.items || [];
  const icons = [PenTool, Hammer, Package];

  return (
    <section
      data-annotate-id="home-services-section"
      className="md:py-[60px] md:px-[5%] py-[50px] px-[5%] "
    >
      <div className="flex justify-between items-end mb-[60px] gap-[18px]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-secondary uppercase tracking-[3px] text-[12px] font-black mb-2.5">
            What we offer
          </p>
          <h2 className="md:text-[38px] text-[28px] font-bold leading-tight tracking-tight">
            {heading}
          </h2>
        </motion.div>
        <Link
          href="/services"
          className="md:px-6 px-2 h-11 rounded-full border border-secondary/45 text-foreground md:text-[14px] text-[12px] font-semibold uppercase tracking-wider hover:bg-secondary/15 transition-all flex items-center md:flex hidden"
        >
          View All Services
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-7">
        {cards.map((item: any, idx: number) => {
          const Icon = icons[idx % icons.length];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-[34px] bg-surface border border-border rounded-lg shadow-lg hover:-translate-y-2.5 hover:border-secondary/55 hover:shadow-2xl transition-all duration-180"
            >
              <Icon className="text-secondary mb-[18px]" size={40} />
              <h4 className="text-[22px] font-bold tracking-tight mb-2">
                {item.title}
              </h4>
              <p className="text-muted font-semibold">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

const Collections = ({ section }: { section: any }) => {
  if (!section) return null;
  const col = section.columns?.[0] || [];
  const heading = col.find((b: any) => b.type === "heading")?.text || "Our Collections";
  const items = col.find((b: any) => b.type === "cards")?.items || [];

  return (
    <section
      data-annotate-id="home-collections-section"
      className="md:py-[60px] md:px-[5%] py-[50px] px-[5%] "
      id="living"
    >
      <div className="flex justify-between items-end mb-[60px] gap-[18px]">
        <h2 className="md:text-[38px] text-[28px] font-bold leading-tight tracking-tight">
          {heading}
        </h2>
        <Link
          href="/shop"
          className="px-6 h-11 rounded-full border border-secondary/45 text-foreground text-[14px] font-semibold uppercase tracking-wider hover:bg-secondary/15 transition-all flex items-center"
        >
          View All
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item: any, idx: number) => (
          <Link
            key={idx}
            href={item.link || "/shop"}
            className="relative h-[450px] overflow-hidden rounded-md border border-border group cursor-pointer block"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="w-full h-full"
            >
              <img
                src={item.image || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80"}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-260 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-85 pointer-events-none" />
              <div className="absolute bottom-7 left-7 text-white z-10">
                <h3 className="text-[26px] font-bold">{item.title}</h3>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const ShopByRoom = () => (
  <section
    data-annotate-id="home-shop-by-room-section"
    className="md:pt-[80px] md:pb-[120px] md:px-[5%] py-[50px] px-[5%]  pt-0"
    id="shop-room"
  >
    <div className="flex justify-between items-end mb-[60px] gap-[18px]">
      <div>
        <p className="text-secondary uppercase tracking-[3px] text-[12px] font-black mb-2.5">
          Shop by Room
        </p>
        <h2 className="md:text-[38px] text-[28px] font-bold leading-tight tracking-tight">
          Find Your Perfect Space
        </h2>
      </div>
      <Link
        href="/shop"
        className="bg-primary text-white px-8 h-11 rounded-full text-[14px] font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center md:flex hidden "
      >
        Browse Rooms
      </Link>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {categories.map((item, idx) => (
        <Link
          key={item.id}
          href={`/category/${item.id}`}
          className="bg-surface border border-border rounded-lg overflow-hidden cursor-pointer shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:border-secondary/55 transition-all duration-180 group block"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="h-[220px] overflow-hidden bg-muted/10">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-260 group-hover:scale-105"
              />
            </div>
            <div className="p-[18px_18px_20px] flex justify-between items-end gap-3">
              <div>
                <h4 className="text-[26px] font-bold leading-tight">
                  {item.name}
                </h4>
                <small className="text-muted font-black tracking-[2px] uppercase text-[11px] block mt-1">
                  Explore Collection
                </small>
              </div>
              <ArrowRight className="text-secondary" size={18} />
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  </section>
);

const FeaturedBanner = ({ section }: { section: any }) => {
  if (!section) return null;
  const leftCol = section.columns?.[0] || [];
  const rightCol = section.columns?.[1] || [];
  
  const imgBlock = leftCol.find((b: any) => b.type === "image");
  const headingBlock = rightCol.find((b: any) => b.type === "heading");
  const pBlock = rightCol.find((b: any) => b.type === "paragraph");
  const btnBlock = rightCol.find((b: any) => b.type === "button");
  const button = btnBlock?.buttons?.[0];

  return (
    <section
      data-annotate-id="home-featured-banner"
      className="bg-primary text-white grid lg:grid-cols-2 items-center overflow-hidden "
      id="bedroom"
    >
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="md:h-[580px] h-[380px]"
      >
        <img
          src={imgBlock?.url || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1200"}
          alt={imgBlock?.alt || "Bed"}
          className="w-full h-full object-cover saturate-[1.02] contrast-[1.02]"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="p-[50px] lg:p-[90px]"
      >
        <span className="text-secondary uppercase text-[12px] tracking-[3px] font-black">
          Materials Matter
        </span>
        <h2 className="text-[38px] lg:text-[48px] font-bold leading-tight mt-2">
          {headingBlock?.text || "The Velvet Retreat Collection"}
        </h2>
        <p className="text-white/80 font-semibold max-w-[540px] mt-3">
          {pBlock?.text || "Crafted with premium Italian velvet and sustainable oak..."}
        </p>
        {button && (
          <Link
            href={button.link || "/shop"}
            className="mt-5 px-6 h-11 inline-flex items-center rounded-full border border-white/70 text-white text-[14px] font-semibold uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            {button.label}
          </Link>
        )}
      </motion.div>
    </section>
  );
};

const ProductSlider = () => {
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const featuredProducts = products.slice(0, 5);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      setActivePage(Math.round(scrollLeft / clientWidth));
    }
  };

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: dir * clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      data-annotate-id="home-product-slider-section"
      className="md:py-[120px] md:px-[5%] py-[50px] px-[5%] "
    >
      <div className="flex justify-between items-end mb-[60px] gap-[18px]">
        <div>
          <p className="text-secondary uppercase tracking-[3px] text-[12px] font-black mb-2.5">
            Best Sellers
          </p>
          <h2 className="md:text-[38px] text-[28px] font-bold leading-tight tracking-tight">
            New Essentials
          </h2>
        </div>
        <Link
          href="/shop"
          className="px-6 h-11 rounded-full border border-secondary/45 text-foreground text-[14px] font-semibold uppercase tracking-wider hover:bg-secondary/15 transition-all flex items-center md:flex hidden"
        >
          View All Products
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-1"
        >
          {featuredProducts.map((p, idx) => (
            <div
              key={p.id}
              className="min-w-[calc(100%-24px)] md:min-w-[calc((100%-48px)/3)] snap-start group"
            >
              <Link href={`/product/${p.id}`} className="block">
                <div className="relative h-[380px] mb-4 overflow-hidden rounded-lg border border-border bg-muted/10">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-260 group-hover:scale-105"
                  />
                  <div className="absolute top-3.5 left-3.5 bg-surface/88 backdrop-blur-md border border-border p-[8px_10px] rounded-full text-[10px] font-black tracking-[2px] uppercase text-foreground">
                    {p.badge}
                  </div>
                  <button
                    className="absolute top-3 right-3 w-[42px] h-[42px] rounded-full bg-surface/88 backdrop-blur-md border border-border flex items-center justify-center hover:-translate-y-0.5 hover:border-secondary/55 transition-all text-foreground/75"
                    onClick={(e) => {
                      e.preventDefault(); /* Handle wishlist */
                    }}
                  >
                    <Heart size={18} />
                  </button>
                  <button
                    className="absolute bottom-0 w-full p-[15px] bg-foreground/92 text-surface text-[12px] font-black tracking-[2px] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-220"
                    onClick={(e) => {
                      e.preventDefault(); /* Handle add to bag */
                    }}
                  >
                    ADD TO BAG — {p.price}
                  </button>
                </div>
                <div>
                  <h4 className="font-heading text-[26px] font-bold leading-tight mb-1.5">
                    {p.title}
                  </h4>
                  <div className="flex justify-between items-center gap-2.5">
                    <div className="text-muted text-[14px] font-black">
                      {p.price}
                    </div>
                    <div className="flex gap-1 items-center">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className="text-secondary fill-secondary"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3.5 mt-[22px]">
          <div className="flex gap-2.5">
            <button
              onClick={() => scroll(-1)}
              className="w-11 h-11 rounded-full border border-border bg-surface flex items-center justify-center hover:-translate-y-0.5 hover:border-secondary/55 transition-all text-foreground"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-11 h-11 rounded-full border border-border bg-surface flex items-center justify-center hover:-translate-y-0.5 hover:border-secondary/55 transition-all text-foreground"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex gap-2.5 justify-center flex-1">
            {Array.from({ length: Math.ceil(featuredProducts.length / 1) }).map(
              (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-160 ${activePage === i ? "bg-secondary scale-125" : "bg-foreground/20"}`}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Craft = ({ section }: { section: any }) => {
  if (!section) return null;
  const leftCol = section.columns?.[0] || [];
  const rightCol = section.columns?.[1] || [];
  
  const imgBlock = leftCol.find((b: any) => b.type === "image");
  const headingBlock = rightCol.find((b: any) => b.type === "heading");
  const pBlock = rightCol.find((b: any) => b.type === "paragraph");
  const listBlock = rightCol.find((b: any) => b.type === "list");
  const btnBlock = rightCol.find((b: any) => b.type === "button");
  const buttons = btnBlock?.buttons || [];

  return (
    <section
      data-annotate-id="home-craft-section"
      className="md:py-[120px] md:px-[5%] py-[50px] px-[5%]  bg-surface/50 border-y border-border"
    >
      <div className="flex justify-between items-end mb-[60px] gap-[18px]">
        <div>
          <p className="text-secondary uppercase tracking-[3px] text-[12px] font-black mb-2.5">
            Craft & Quality
          </p>
          <h2 className="md:text-[38px] text-[28px] font-bold leading-tight tracking-tight">
            Built for Everyday Living
          </h2>
        </div>
        <Link
          href="/about"
          className="px-[18px] h-11 rounded-full bg-secondary/18 text-dark border border-secondary/35 text-[14px] font-semibold uppercase tracking-wider hover:bg-secondary/26 hover:border-secondary/55 transition-all flex items-center md:flex hidden"
        >
          Our Story
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="h-[520px] rounded-lg overflow-hidden bg-muted/10 border border-border "
        >
          <img
            src={imgBlock?.url || "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=1600"}
            alt={imgBlock?.alt || "Materials"}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-background/70 border border-border p-[34px] rounded-lg shadow-sm"
        >
          <h3 className="font-heading md:text-[42px] text-[28px] font-extrabold leading-none">
            {headingBlock?.text || "Premium wood, soft textiles, timeless forms."}
          </h3>
          <p className="text-muted font-semibold mt-2.5">
            {pBlock?.text || "Every piece is engineered for longevity..."}
          </p>

          <div className="grid gap-3 mt-[18px]">
            {(listBlock?.items || ["Solid oak", "Stain-resistant", "Tested"]).map((li: string) => (
              <div
                key={li}
                className="flex gap-2.5 items-start font-bold text-foreground/85"
              >
                <CheckCircle2 className="text-secondary mt-0.5" size={18} /> {li}
              </div>
            ))}
          </div>

          <div className="mt-[22px] flex gap-3 flex-wrap">
            {buttons.map((btn: any, i: number) => (
              <Link
                key={i}
                href={btn.link || "#"}
                className={`px-[18px] h-11 rounded-full text-[14px] font-semibold uppercase tracking-wider transition-all flex items-center ${
                  i === 0 
                  ? "bg-primary text-white hover:bg-primary/90" 
                  : "border border-secondary/45 text-foreground hover:bg-secondary/15"
                }`}
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Testimonials = ({ section }: { section: any }) => {
  if (!section) return null;
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const col = section.columns?.[0] || [];
  const heading = col.find((b: any) => b.type === "heading")?.text || "What People Say";
  const items = col.filter((b: any) => b.type === "testimonial") || [];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      setActivePage(Math.round(scrollLeft / clientWidth));
    }
  };

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: dir * clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      data-annotate-id="home-testimonials-section"
      className="md:py-[120px] md:px-[5%] py-[50px] px-[5%]  bg-surface/55"
    >
      <div className="flex justify-center text-center mb-[60px]">
        <div>
          <p className="text-secondary uppercase tracking-[3px] text-[12px] font-black mb-2.5">
            Client Stories
          </p>
          <h2 className="md:text-[38px] text-[28px] font-bold leading-tight tracking-tight">
            {heading}
          </h2>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-1"
        >
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              className="min-w-[calc(100%-24px)] md:min-w-[calc((100%-48px)/3)] snap-start h-full"
            >
              <div className="p-9 text-center bg-surface/75 border border-border rounded-lg h-full">
                <p className="font-heading text-[22px] italic mb-[22px] leading-[1.4] font-semibold text-foreground/90">
                  {item.quote}
                </p>
                <div className="uppercase text-[11px] tracking-[3px] font-black text-foreground/70">
                  — {item.author}{item.role ? `, ${item.role}` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3.5 mt-[22px]">
          <div className="flex gap-2.5">
            <button
              onClick={() => scroll(-1)}
              className="w-11 h-11 rounded-full border border-border bg-surface flex items-center justify-center hover:-translate-y-0.5 hover:border-secondary/55 transition-all text-foreground"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-11 h-11 rounded-full border border-border bg-surface flex items-center justify-center hover:-translate-y-0.5 hover:border-secondary/55 transition-all text-foreground"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex gap-2.5 justify-center flex-1">
            {Array.from({ length: items.length }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-160 ${activePage === i ? "bg-secondary scale-125" : "bg-foreground/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Blog = ({ section }: { section: any }) => {
  if (!section) return null;
  const [activePage, setActivePage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const col = section.columns?.[0] || [];
  const heading = col.find((b: any) => b.type === "heading")?.text || "The Journal";
  const items = col.find((b: any) => b.type === "cards")?.items || [];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      setActivePage(Math.round(scrollLeft / clientWidth));
    }
  };

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: dir * clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      data-annotate-id="home-blog-section"
      className="md:py-[40px] md:px-[5%] py-[50px] px-[5%] "
    >
      <div className="flex justify-between items-end mb-[60px] gap-[18px]">
        <h2 className="md:text-[38px] text-[28px] font-bold leading-tight tracking-tight">
          {heading}
        </h2>
        <Link
          href="/blog"
          className="bg-primary text-white px-8 h-11 rounded-full text-[14px] font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center md:flex hidden"
        >
          View All Posts
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-1"
        >
          {items.map((post: any, idx: number) => (
            <div
              key={idx}
              className="min-w-[calc(100%-24px)] md:min-w-[calc((100%-48px)/3)] snap-start"
            >
              <div className="group cursor-pointer">
                <div className="h-[250px] overflow-hidden rounded-lg border border-border mb-[18px]">
                  <img
                    src={post.image || "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-260 group-hover:scale-105"
                  />
                </div>
                <span className="text-[11px] text-secondary tracking-[2px] uppercase font-black">
                  {post.description}
                </span>
                <h4 className="font-heading text-[26px] mt-2.5 mb-3 leading-tight font-bold">
                  {post.title}
                </h4>
                <Link
                  href={post.link || "#"}
                  className="inline-block mt-3 text-[12px] font-black tracking-wider uppercase border-b border-secondary hover:text-secondary transition-colors"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3.5 mt-[22px]">
          <div className="flex gap-2.5">
            <button
              onClick={() => scroll(-1)}
              className="w-11 h-11 rounded-full border border-border bg-surface flex items-center justify-center hover:-translate-y-0.5 hover:border-secondary/55 transition-all text-foreground"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-11 h-11 rounded-full border border-border bg-surface flex items-center justify-center hover:-translate-y-0.5 hover:border-secondary/55 transition-all text-foreground"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex gap-2.5 justify-center flex-1">
            {Array.from({ length: items.length }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-160 ${activePage === i ? "bg-secondary scale-125" : "bg-foreground/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = ({ section }: { section: any }) => {
  if (!section) return null;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const col = section.columns?.[0] || [];
  const heading = col.find((b: any) => b.type === "heading")?.text || "Frequently Asked Questions";
  const items = col.find((b: any) => b.type === "features")?.items || [];

  return (
    <section
      data-annotate-id="home-faq-section"
      className="md:py-[120px] md:px-[5%] py-[50px] px-[5%] "
    >
      <div className="flex flex-col items-center text-center mb-[60px]">
        <h2 className="md:text-[38px] text-[28px] font-bold leading-tight tracking-tight mb-4">
          {heading}
        </h2>
        <Link
          href="/faq"
          className="text-secondary font-black tracking-[2px] uppercase text-xs border-b border-secondary pb-1"
        >
          View All FAQs
        </Link>
      </div>

      <div className="max-w-[800px] mx-auto">
        {items.map((faq: any, idx: number) => (
          <div
            key={idx}
            className="border-b border-border py-[22px] cursor-pointer"
            onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
          >
            <div className="flex justify-between items-center gap-3.5">
              <h4 className="font-heading text-[24px] font-bold">{faq.title}</h4>
              {activeIndex === idx ? (
                <Minus className="text-secondary" size={22} />
              ) : (
                <Plus className="text-secondary" size={22} />
              )}
            </div>
            <motion.div
              initial={false}
              animate={{
                height: activeIndex === idx ? "auto" : 0,
                marginTop: activeIndex === idx ? 12 : 0,
              }}
              className="overflow-hidden text-muted text-[15px] font-semibold"
            >
              {faq.description}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Thanks! You're subscribed. 🎉");
    setEmail("");
  };

  return (
    <section
      data-annotate-id="home-newsletter-section"
      className="relative overflow-hidden border-y border-white/10 bg-[#0E6E35] px-[5%] py-[90px] text-white lg:py-[110px]"
    >
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-[280px] w-[280px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-140px] right-[-80px] h-[320px] w-[320px] rounded-full bg-[#B8D35A]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* left content */}
          <div className="max-w-[760px]">
            <div className="mb-5 inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-2">
              <span className="text-[12px] font-extrabold uppercase tracking-[3px] text-[#B8D35A]">
                Members Only
              </span>
            </div>

            <h3 className="max-w-[760px] font-heading text-[42px] font-bold leading-[0.95] tracking-[-0.03em] text-white sm:text-[56px] lg:text-[74px]">
              Get early access to
              <br className="hidden sm:block" />
              new drops.
            </h3>

            <p className="mt-6 max-w-[620px] text-[18px] font-medium leading-8 text-white/80 sm:text-[20px]">
              Weekly inspiration, exclusive offers, and interior tips—straight
              to your inbox.
            </p>

            <div className="mt-10 hidden items-center gap-8 text-white/65 lg:flex">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#B8D35A]" />
                <span className="text-[14px] font-semibold">
                  Exclusive drops
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#B8D35A]" />
                <span className="text-[14px] font-semibold">Interior tips</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#B8D35A]" />
                <span className="text-[14px] font-semibold">
                  Members-only offers
                </span>
              </div>
            </div>
          </div>

          {/* right form card */}
          <div className="lg:justify-self-end">
            <div className="w-full max-w-[540px] rounded-[12px] border border-white/12 bg-white/10 p-4  sm:p-5">
              <div className="mb-4">
                <p className="text-[18px] font-semibold text-white/85">
                  Join the list
                </p>
                <p className="mt-1 text-[13px] leading-6 text-white/80">
                  Be the first to hear about launches, curated inspiration, and
                  private offers.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <div className="flex-1">
                  <input
                    className="py-4 w-full rounded-full border border-white/15 bg-white px-5 text-[16px] font-medium text-black outline-none transition placeholder:text-black/45 focus:border-[#B8D35A] focus:ring-2 focus:ring-[#B8D35A]/30"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  className="inline-flex py-4 items-center justify-center rounded-full bg-[#B8D35A] px-7 text-[14px] font-extrabold uppercase tracking-[0.14em] text-[#14351F] transition hover:translate-y-[-1px] hover:bg-[#c7df72]"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>

              {msg && (
                <p className="mt-3 text-[13px] font-medium text-white/75">
                  {msg}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-medium text-white/55">
                <span>No spam</span>
                <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
                <span>Unsubscribe anytime</span>
                <span className="hidden h-1 w-1 rounded-full bg-white/25 sm:block" />
                <span>Weekly updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InstagramGallery = () => (
  <section
    data-annotate-id="home-instagram-gallery-section"
    className="md:py-[120px] md:px-[5%] py-[50px] px-[5%] "
  >
    <div className="flex justify-between items-end mb-[60px] gap-[18px]">
      <div>
        <p className="text-secondary uppercase tracking-[3px] text-[12px] font-black mb-2.5">
          Community
        </p>
        <h2 className="md:text-[38px] text-[28px] font-bold leading-tight tracking-tight">
          Styled by You
        </h2>
      </div>
      <button className="px-6 h-11 rounded-full border border-secondary/45 text-foreground text-[14px] font-semibold uppercase tracking-wider hover:bg-secondary/15 transition-all">
        Follow Instagram
      </button>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {[
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=900",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=900",
        "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&q=80&w=900",
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=900",
        "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&q=80&w=900",
        "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=900",
      ].map((img, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.02 }}
          className="h-[180px] rounded-lg overflow-hidden bg-muted/10 border border-border relative group cursor-pointer"
        >
          <img
            src={img}
            alt={`Gallery ${idx + 1}`}
            className="w-full h-full object-cover transition-transform duration-260 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-160" />
        </motion.div>
      ))}
    </div>
  </section>
);

const HomePage = ({ data }: HomePageProps) => {
  const { nestCraftUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const content = data?.content || [];

  useEffect(() => {
    dispatch(resetPageComments());
  }, []);

  const ctaSection = getSection(content, "CTA");
  const ctaBlock = ctaSection?.columns?.[0]?.[0];

  return (
    <>
      {/* commentsS Plugin */}
      {nestCraftUser?.role == "admin" && <AnnotatorPlugin />}

      {/* get all page from the database */}
      <GetAllPages />

      <Hero section={getSection(content, "Hero")} />
      <USP section={getSection(content, "USP")} />
      <Services section={getSection(content, "Services")} />
      <Collections section={getSection(content, "Collections")} />
      <ShopByRoom />
      <FeaturedBanner section={getSection(content, "FeaturedBanner")} />
      <ProductSlider />
      <Craft section={getSection(content, "Craft")} />
      <Testimonials section={getSection(content, "Testimonials")} />
      <Blog section={getSection(content, "Blog")} />
      <FAQ section={getSection(content, "FAQ")} />
      <Newsletter />
      <InstagramGallery />

      {ctaBlock && (
        <section
          data-annotate-id="home-cta-section"
          className="bg-foreground/90 text-surface text-center py-[110px] px-[5%] border-t border-border"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[38px] lg:text-[48px] font-bold tracking-tight">
              {ctaBlock.title}
            </h2>
            <p className="text-white/70 font-semibold mt-[18px] mb-[34px] max-w-[600px] mx-auto">
              {ctaBlock.description}
            </p>
            <div className="flex gap-3.5 justify-center flex-wrap">
              <Link
                href={ctaBlock.buttonLink || "/shop"}
                className="bg-primary text-white px-8 h-12 rounded-full text-[14px] font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center"
              >
                {ctaBlock.buttonLabel}
              </Link>
              <Link
                href="/contact"
                className="px-8 h-12 rounded-full border border-white/55 text-white text-[14px] font-semibold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center"
              >
                Book a Consultant
              </Link>
            </div>
          </motion.div>
        </section>
      )}
    </>
  );
};

export default HomePage;
