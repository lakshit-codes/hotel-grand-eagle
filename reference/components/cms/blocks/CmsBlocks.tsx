"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Zap, Quote } from "lucide-react";

// SECTION Component
export const CmsSection = ({ children, layout, isNested }: { children: React.ReactNode, layout?: string, isNested?: boolean }) => {
  const getGridClass = (l?: string) => {
    switch (l) {
      case "grid-1": return "grid-cols-1";
      case "grid-2": return "grid-cols-1 md:grid-cols-2";
      case "grid-3": return "grid-cols-1 md:grid-cols-3";
      case "grid-4": return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default: return "grid-cols-1";
    }
  };

  return (
    <section className={cn(
      isNested ? "py-4 px-0 w-full" : "py-12 md:py-20 px-6 max-w-7xl mx-auto",
      "grid gap-8",
      getGridClass(layout)
    )}>
      {children}
    </section>
  );
};

export const CmsHeading = ({ text, level }: { text: string, level?: string }) => {
  const Tag = (level || "h2") as any;
  const styles = {
    h1: "text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6",
    h2: "text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-5",
    h3: "text-2xl md:text-3xl font-bold text-slate-900 mb-4",
    h4: "text-xl md:text-2xl font-bold text-slate-900 mb-3",
    h5: "text-lg font-bold text-slate-900 mb-2",
    h6: "text-base font-bold text-slate-900 mb-2",
  };
  
  return <Tag className={styles[level as keyof typeof styles] || styles.h2}>{text}</Tag>;
};

// PARAGRAPH Component
export const CmsParagraph = ({ text }: { text: string }) => {
  return (
    <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mb-6">
      {text}
    </p>
  );
};

// IMAGE Component
export const CmsImage = ({ url, alt }: { url: string, alt?: string }) => {
  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
      <img src={url} alt={alt || ""} className="w-full h-auto object-cover" />
    </div>
  );
};

// BUTTON Component
export const CmsButton = ({ label, link }: { label: string, link: string }) => {
  const isExternal = link.startsWith("http");
  const Component = isExternal ? "a" : Link;
  const extraProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <div className="mb-6">
      <Component 
        href={link} 
        {...(extraProps as any)}
        className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0"
      >
        {label}
      </Component>
    </div>
  );
};

// CTA Component
export const CmsCta = ({ title, subtitle, description, buttonLabel, buttonLink }: any) => {
  return (
    <div className="my-12 p-8 md:p-12 rounded-[2.5rem] bg-slate-900 text-white text-center">
      {subtitle && <span className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 block">{subtitle}</span>}
      {title && <h2 className="text-3xl md:text-5xl font-bold mb-6">{title}</h2>}
      {description && <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">{description}</p>}
      {buttonLabel && <CmsButton label={buttonLabel} link={buttonLink} />}
    </div>
  );
};

// CARDS Component
export const CmsCards = ({ items }: { items: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
      {items.map((card, i) => (
        <div key={i} className="group p-6 rounded-3xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all">
          {card.image && (
            <div className="h-48 rounded-2xl overflow-hidden mb-6">
               <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
          )}
          <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">{card.description}</p>
          {card.link && <Link href={card.link} className="text-sm font-bold text-slate-900 hover:underline">Learn More →</Link>}
        </div>
      ))}
    </div>
  );
};

// FEATURES Component
export const CmsFeatures = ({ items }: { items: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-12">
      {items.map((feat, i) => (
        <div key={i} className="flex gap-6">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 flex-shrink-0">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
            <p className="text-slate-500 leading-relaxed">{feat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// TESTIMONIAL Component
export const CmsTestimonial = ({ quote, author, role, avatar }: any) => {
  return (
    <div className="my-12 max-w-3xl mx-auto text-center">
       <div className="inline-flex h-12 w-12 rounded-full bg-slate-100 items-center justify-center text-slate-300 mb-8">
          <Quote size={24} />
       </div>
       <blockquote className="text-2xl md:text-3xl font-medium text-slate-800 leading-tight mb-8">
         "{quote}"
       </blockquote>
       <div className="flex flex-col items-center">
          {avatar && <img src={avatar} alt={author} className="h-14 w-14 rounded-full object-cover mb-4 ring-4 ring-slate-50" />}
          <span className="font-bold text-slate-900">{author}</span>
          <span className="text-sm text-slate-400">{role}</span>
       </div>
    </div>
  );
};

// LIST Component
export const CmsList = ({ items }: { items: string[] }) => {
  return (
    <ul className="space-y-3 mb-8">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 items-start text-slate-600">
          <div className="h-2 w-2 rounded-full bg-slate-900 mt-2.5 flex-shrink-0" />
          <span className="text-lg">{item}</span>
        </li>
      ))}
    </ul>
  );
};
