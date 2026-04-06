"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, CheckCircle2, ArrowRight, Globe, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { AnnotatorPlugin } from '../annotationPlugin/AnnotatorPlugin';
import GetAllPages from './GetAllPages';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

      const {nestCraftUser}= useSelector((state:RootState)=>state.auth)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
        <>
        {/* commentsS Plugin */}
   {nestCraftUser?.role=="admin" && <AnnotatorPlugin />}
   {/* get all page from the database */}
   <GetAllPages/>
    <div className="pb-20 bg-background">
      {/* Editorial Hero Section */}
      <section className="relative min-h-[70vh] flex items-center px-[5%] overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
            alt="Office" 
            className="w-full h-full object-cover opacity-10 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-secondary uppercase tracking-[6px] text-[11px] font-black mb-6">Connect with us</p>
              <h1 className="text-[64px] lg:text-[92px] font-black leading-[0.9] tracking-tighter mb-8">
                Let's start a <br /> <span className="text-secondary italic font-serif font-normal">conversation.</span>
              </h1>
              <p className="text-xl text-muted font-semibold max-w-[500px] leading-relaxed">
                Whether you're looking to transform your home or have a specific inquiry about our collections, our design experts are ready to assist you.
              </p>
              
              <div className="mt-12 flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[2px] text-muted mb-2">Our Signature Showroom</span>
                  <span className="font-bold text-lg">Raja Park, Jaipur</span>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[2px] text-muted mb-2">Support Hours</span>
                  <span className="font-bold text-lg">10:30 AM — 9:00 PM</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="aspect-[4/5] rounded-[40px] overflow-hidden border border-border shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200" 
                  alt="Studio" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary rounded-full flex items-center justify-center text-white p-8 text-center leading-tight font-black uppercase tracking-widest text-xs shadow-2xl animate-pulse">
                Available <br /> for bespoke <br /> projects
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-32 px-[5%] max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1.2fr_1.8fr] gap-24">
          {/* Left Side: Info Cards */}
          <div className="space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-black mb-10 tracking-tight">Reach Out</h2>
              <div className="space-y-12">
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                      <Mail size={18} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[2px] text-muted">Email</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight">nestcraftmail.com</p>
                  <div className="w-0 group-hover:w-full h-px bg-secondary transition-all duration-500 mt-2" />
                </div>

                <div className="group cursor-pointer">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                      <Phone size={18} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[2px] text-muted">Phone</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight">+91 9810159604</p>
                  <div className="w-0 group-hover:w-full h-px bg-secondary transition-all duration-500 mt-2" />
                </div>

                <div className="group cursor-pointer">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                      <MapPin size={18} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[2px] text-muted">Studio</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight">8A, Excellency Trade Square, Govind Marg, Rajapark Jaipur 302004</p>
                  <div className="w-0 group-hover:w-full h-px bg-secondary transition-all duration-500 mt-2" />
                </div>
              </div>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[32px] bg-surface border border-border shadow-sm"
            >
              <h3 className="text-xl font-black mb-6 tracking-tight">Global Presence</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-muted">London</span>
                  <span className="text-sm font-black uppercase tracking-wider">Coming 2026</span>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-muted">New York</span>
                  <span className="text-sm font-black uppercase tracking-wider">Partner Showroom</span>
                </div>
                <div className="h-px bg-border/50" />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-muted">Dubai</span>
                  <span className="text-sm font-black uppercase tracking-wider">Design Hub</span>
                </div>
              </div>
            </motion.div> */}
          </div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
            
            <div className="bg-surface border border-border p-10 lg:p-16 rounded-[48px] shadow-2xl relative z-10">
              {isSubmitted ? (
                <div className="py-20 text-center">
                  <div className="w-24 h-24 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-4xl font-black mb-4 tracking-tight">Message Received</h3>
                  <p className="text-muted font-semibold mb-10 text-lg">
                    Thank you for reaching out. A design consultant will contact you shortly to discuss your vision.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="bg-primary text-white px-12 h-14 rounded-full text-[15px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tight mb-2">Send an Inquiry</h3>
                    <p className="text-muted font-semibold">Fill out the form below and we'll get back to you within 24 hours.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-muted ml-1">Your Name</label>
                      <input 
                        required
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-transparent border-b-2 border-border py-4 outline-none focus:border-secondary transition-all font-bold text-xl placeholder:text-muted/30"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[3px] text-muted ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-transparent border-b-2 border-border py-4 outline-none focus:border-secondary transition-all font-bold text-xl placeholder:text-muted/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[3px] text-muted ml-1">What can we help with?</label>
                    <select 
                      required
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 border-border py-4 outline-none focus:border-secondary transition-all font-bold text-xl appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-surface">Select an option</option>
                      <option value="bespoke" className="bg-surface">Bespoke Furniture Design</option>
                      <option value="interior" className="bg-surface">Full Interior Consultation</option>
                      <option value="order" className="bg-surface">Order Status & Support</option>
                      <option value="trade" className="bg-surface">Trade & Partnership</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[3px] text-muted ml-1">Your Message</label>
                    <textarea 
                      required
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your space..."
                      className="w-full bg-transparent border-b-2 border-border py-4 outline-none focus:border-secondary transition-all font-bold text-xl resize-none placeholder:text-muted/30"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full bg-primary text-white h-20 rounded-full overflow-hidden transition-all disabled:opacity-70"
                  >
                    <div className="absolute inset-0 bg-secondary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-4 text-[15px] font-black uppercase tracking-[3px]">
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Send Message <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section - Minimalist */}
      <section className="px-[5%] max-w-7xl mx-auto pb-32">
        <div className="relative h-[600px] rounded-[60px] overflow-hidden border border-border shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000" 
            alt="Map" 
            className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-opacity duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="bg-surface/80 backdrop-blur-xl p-10 rounded-[40px] border border-border max-w-md shadow-2xl">
              <h4 className="text-2xl font-black mb-4 tracking-tight">Visit the Showroom</h4>
              <p className="text-muted font-semibold mb-6">Experience premium furniture and free design consultations at our Raja Park showroom. Feel the quality of our craftsmanship in person.</p>
              <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-widest text-xs">
                <Clock size={16} /> Mon - Sat: 10:30 - 9:00
              </div>
            </div>
            
            <a 
              href="https://share.google/UcBYZ8kXdPXVpuhBt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-500"
            >
              <MapPin className="text-primary" size={32} />
            </a>
          </div>
        </div>
      </section>
    </div>
      </>
  );
};

export default ContactPage;
