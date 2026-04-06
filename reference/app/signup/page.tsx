"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { User, Mail, Lock, MapPin, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, address }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Account created successfully! Welcome to the family.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 relative z-10 overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Logo & Welcome */}
          <div className="mb-8 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <img
                src="/assets/Image/favicon.svg"
                alt="Nestcraft Logo"
                className="w-10 h-10"
              />
              <span className="text-2xl font-black uppercase tracking-tighter text-[#0d6533]">
                Nestcraft
              </span>
            </div>
            <h1 className="text-3xl font-black text-foreground mb-2 leading-tight">
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm">
              Join our community of design-led interiors.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-6 flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
              <span className="w-1 h-1 rounded-full bg-red-500"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">
                  Full Name / Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#0d6533] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full flex h-11 rounded-xl border border-border bg-white pl-11 pr-4 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#0d6533]/20 focus:border-[#0d6533] shadow-sm"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#0d6533] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full flex h-11 rounded-xl border border-border bg-white pl-11 pr-4 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#0d6533]/20 focus:border-[#0d6533] shadow-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-[#0d6533] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full flex h-11 rounded-xl border border-border bg-white pl-11 pr-4 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#0d6533]/20 focus:border-[#0d6533] shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2 block">
                  Delivery Address (Optional)
                </label>
                <div className="relative group">
                  <div className="absolute top-3 left-3.5 flex items-start pointer-events-none text-muted-foreground group-focus-within:text-[#0d6533] transition-colors">
                    <MapPin size={18} />
                  </div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full flex min-h-[80px] rounded-xl border border-border bg-white pl-11 pr-4 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#0d6533]/20 focus:border-[#0d6533] shadow-sm"
                    placeholder="Enter your street address..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 mt-0.5 rounded border-border text-[#0d6533] focus:ring-[#0d6533]"
              />
              <label
                htmlFor="terms"
                className="text-[11px] font-semibold text-muted-foreground cursor-pointer leading-relaxed"
              >
                I agree to the{" "}
                <Link href="#" className="text-[#0d6533] hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-[#0d6533] hover:underline">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex h-12 mt-4 items-center justify-center rounded-xl bg-[#0d6533] px-4 py-2 text-sm font-black text-white transition-all hover:bg-[#0d6533]/90 hover:shadow-lg hover:shadow-[#0d6533]/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2"
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  Get Started
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#0d6533] font-black hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image Background */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="/assets/Image/login_bg.png"
          alt="Lush green background"
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in duration-1000 scale-105"
        />
        <div className="absolute inset-0 bg-[#0d6533]/15 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-20 bg-gradient-to-t from-[#063A1D]/80 to-transparent">
          <div className="max-w-md">
            <h2 className="text-white text-4xl font-black mb-4 leading-tight">
              Crafting Your Dream Spaces.
            </h2>
            <p className="text-white/80 text-lg font-medium">
              Start your journey today and discover furniture that speaks to
              your soul.
            </p>
            <div className="mt-8 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === 1 ? "w-8 bg-white" : "w-2 bg-white/30"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
