"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Search, MessageCircle, Phone, Mail } from 'lucide-react';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { 
      category: 'General',
      q: 'What materials do you use?', 
      a: 'We use sustainably sourced European Oak, Italian Velvet, and high-grade Belgian linens. All materials are selected for longevity and ethical impact.' 
    },
    { 
      category: 'Shipping',
      q: 'How long does shipping take?', 
      a: 'Standard pieces ship within 2-3 weeks. Custom bespoke orders typically take 8-10 weeks to allow for artisanal crafting and quality control.' 
    },
    { 
      category: 'Shipping',
      q: 'Do you offer international shipping?', 
      a: 'Yes, we provide white-glove international shipping to over 40 countries, including full assembly in your room of choice.' 
    },
    { 
      category: 'Orders',
      q: 'Can I cancel or modify my order?', 
      a: 'Orders can be modified or cancelled within 24 hours of placement. After this period, production begins, and modifications may incur a fee.' 
    },
    { 
      category: 'Returns',
      q: 'What is your return policy?', 
      a: 'We offer a 14-day return policy for standard items in original condition. Custom bespoke pieces are non-refundable unless defective.' 
    },
    { 
      category: 'Care',
      q: 'How do I care for my oak furniture?', 
      a: 'We recommend using a soft, dry cloth for regular dusting. Avoid direct sunlight and extreme humidity. A detailed care guide is included with every order.' 
    },
    { 
      category: 'General',
      q: 'Do you have a physical showroom?', 
      a: 'Currently, we operate exclusively online to provide the best value. However, we offer material swatches and virtual consultations to help you decide.' 
    },
    { 
      category: 'Orders',
      q: 'Do you offer trade discounts?', 
      a: 'Yes, we have a dedicated trade program for interior designers, architects, and developers. Please contact our trade team for more information.' 
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="py-24 px-[5%] bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary uppercase tracking-[4px] text-sm font-black mb-4"
          >
            Support Center
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[48px] lg:text-[64px] font-bold leading-tight tracking-tight mb-6"
          >
            How can we help?
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-[600px] mx-auto relative mt-10"
          >
            <input 
              type="text" 
              placeholder="Search for answers..." 
              className="w-full h-14 pl-14 pr-6 rounded-full bg-background border border-border outline-none focus:border-secondary transition-all font-semibold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted" size={20} />
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 px-[5%] max-w-4xl mx-auto">
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-border rounded-2xl overflow-hidden bg-background hover:border-secondary/50 transition-all"
              >
                <button 
                  className="w-full p-8 flex justify-between items-center gap-6 text-left"
                  onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-secondary">{faq.category}</span>
                    <h4 className="text-xl font-bold tracking-tight">{faq.q}</h4>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${activeIndex === idx ? 'bg-secondary text-white' : 'bg-muted/10 text-muted'}`}>
                    {activeIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                <AnimatePresence>
                  {activeIndex === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 pt-0 text-muted font-semibold leading-relaxed border-t border-border/50 mt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-muted font-bold text-lg">No results found for "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-secondary font-black tracking-[2px] uppercase text-xs border-b border-secondary"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-24 px-[5%] bg-surface/50 border-y border-border">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-[38px] font-bold tracking-tight mb-12">Still have questions?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MessageCircle, title: 'Live Chat', sub: 'Chat with our support team in real-time.', action: 'Start Chat' },
              { icon: Phone, title: 'Phone Support', sub: 'Call us at +91 123 456 7890 (Mon-Fri).', action: 'Call Now' },
              { icon: Mail, title: 'Email Us', sub: 'Send us an email at support@nestcraft.com.', action: 'Send Email' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 bg-background border border-border rounded-2xl shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <item.icon size={28} />
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-sm text-muted font-semibold mb-8">{item.sub}</p>
                <button className="text-xs font-black tracking-[2px] uppercase text-secondary border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-all">
                  {item.action}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
