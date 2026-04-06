"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "../../lib/store/cart/cartSlice";
import {
  ChevronLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/lib/router";

const CheckoutPage = () => {
  const cart = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const dispatch = useAppDispatch();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsCompleted(true);
        dispatch(clearCart());
      }, 2000);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-[5%] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-muted font-semibold mb-10">
            Thank you for your purchase. Your order #NC-4921 has been placed and
            is being processed. We've sent a confirmation email to your inbox.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-primary text-white px-10 h-14 rounded-full text-[15px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-all"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-12 px-[5%] max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <Link
          href="/cart"
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-surface transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-[42px] font-bold tracking-tight">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start">
        {/* Checkout Form */}
        <div className="space-y-12">
          {/* Steps Indicator */}
          <div className="flex items-center gap-6">
            {[
              { id: 1, label: "Shipping", icon: Truck },
              { id: 2, label: "Payment", icon: CreditCard },
              { id: 3, label: "Review", icon: ShieldCheck },
            ].map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s.id
                      ? "bg-secondary text-white"
                      : "bg-surface text-muted border border-border"
                  }`}
                >
                  {step > s.id ? <CheckCircle2 size={18} /> : s.id}
                </div>
                <span
                  className={`text-sm font-bold uppercase tracking-wider hidden sm:block ${
                    step >= s.id ? "text-foreground" : "text-muted"
                  }`}
                >
                  {s.label}
                </span>
                {s.id < 3 && (
                  <div className="w-8 h-px bg-border hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleNext} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold tracking-tight mb-6">
                    Shipping Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
                        First Name
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
                        Last Name
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
                      Address
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
                        City
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
                        State
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
                        ZIP Code
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold tracking-tight mb-6">
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    <div className="p-6 rounded-2xl border-2 border-secondary bg-secondary/5 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-4">
                        <CreditCard className="text-secondary" />
                        <span className="font-bold">Credit / Debit Card</span>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-secondary flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                      </div>
                    </div>
                    <div className="p-6 rounded-2xl border border-border bg-surface flex items-center justify-between cursor-pointer hover:border-secondary transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-[10px] font-black text-white">
                          UPI
                        </div>
                        <span className="font-bold">UPI / Net Banking</span>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-border" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
                        Card Number
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
                          Expiry Date
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="MM/YY"
                          className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-[2px] text-muted ml-1">
                          CVV
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="123"
                          className="w-full h-14 px-6 rounded-xl bg-surface border border-border outline-none focus:border-secondary transition-all font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-bold tracking-tight mb-6">
                    Review Order
                  </h2>
                  <div className="p-8 rounded-3xl border border-border bg-surface space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[2px] text-muted mb-2">
                          Shipping To
                        </h4>
                        <p className="font-bold">John Doe</p>
                        <p className="text-sm text-muted font-semibold">
                          123 Design District, MG Road, Bangalore
                        </p>
                      </div>
                      <button
                        onClick={() => setStep(1)}
                        className="text-secondary text-xs font-black uppercase tracking-wider"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[2px] text-muted mb-2">
                          Payment Method
                        </h4>
                        <p className="font-bold">Visa ending in 4242</p>
                      </div>
                      <button
                        onClick={() => setStep(2)}
                        className="text-secondary text-xs font-black uppercase tracking-wider"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 pt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 h-14 rounded-full border border-border text-foreground font-bold uppercase tracking-wider hover:bg-surface transition-all"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-[2] bg-primary text-white h-14 rounded-full text-[15px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {step === 3
                      ? "Complete Order"
                      : "Continue to " + (step === 1 ? "Payment" : "Review")}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-8 sticky top-[140px]">
          <div className="bg-surface border border-border p-8 rounded-3xl">
            <h3 className="text-xl font-bold mb-6 tracking-tight">Summary</h3>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-background rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="font-bold text-sm line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted font-bold uppercase tracking-wider">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-black text-secondary mt-1">
                      {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-border my-6" />
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-muted font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted font-semibold">
                <span>Shipping</span>
                <span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-sm text-muted font-semibold">
                <span>Tax (GST 18%)</span>
                <span>{formatPrice(cartTotal * 0.18)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-black pt-4 border-t border-border">
              <span>Total</span>
              <span className="text-secondary">
                {formatPrice(cartTotal * 1.18)}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4 items-start">
            <ShieldCheck className="text-emerald-600 flex-shrink-0" size={24} />
            <div>
              <p className="text-sm font-bold text-emerald-900">
                Secure Payment
              </p>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Your data is protected by 256-bit SSL encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
