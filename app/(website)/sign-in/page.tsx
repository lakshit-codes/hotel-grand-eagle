"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
            const payload = isLogin 
                ? { emailOrPhone, password }
                : { 
                    name, 
                    email: emailOrPhone.includes('@') ? emailOrPhone : "", 
                    phone: !emailOrPhone.includes('@') ? emailOrPhone : "", 
                    password 
                  };

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Authentication failed");
            } else {
                // Success
                if (data.user?.role === "admin") {
                    window.location.href = "/admin";
                } else {
                    window.location.href = "/";
                }
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, paddingBottom: 112, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="max-w" style={{ width: "100%", maxWidth: 500 }}>
                <div className="fade-in-up" style={{ animation: "fadeInUp 0.8s ease forwards" }}>
                    <div className="form-card" style={{ padding: "40px 48px" }}>
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <h1 className="form-title font-display" style={{ fontSize: 32, marginBottom: 8, color: "var(--gold)" }}>
                                {isLogin ? "Sign In" : "Create Account"}
                            </h1>
                            <p style={{ fontSize: 14, color: "var(--ivory-dim)" }}>
                                {isLogin ? "Access your bookings and account." : "Join us for an exclusive experience."}
                            </p>
                        </div>

                        {error && (
                            <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)", color: "#ff9999", fontSize: 12, padding: 12, marginBottom: 24, textAlign: "center" }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="input-group" style={{ marginBottom: 20 }}>
                                    <label className="input-label" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="John Doe" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                        required={!isLogin}
                                        style={{ width: "100%", padding: "14px 16px", background: "var(--charcoal)", border: "1px solid var(--muted)", color: "var(--ivory)", outline: "none" }}
                                    />
                                </div>
                            )}
                            
                            <div className="input-group" style={{ marginBottom: 20 }}>
                                <label className="input-label" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email or Phone</label>
                                <input 
                                    type="text" 
                                    className="form-input" 
                                    placeholder="Enter your email or phone" 
                                    value={emailOrPhone} 
                                    onChange={e => setEmailOrPhone(e.target.value)} 
                                    required
                                    style={{ width: "100%", padding: "14px 16px", background: "var(--charcoal)", border: "1px solid var(--muted)", color: "var(--ivory)", outline: "none" }}
                                />
                            </div>

                            <div className="input-group" style={{ marginBottom: 24 }}>
                                <label className="input-label" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Password</label>
                                <div style={{ position: "relative" }}>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        className="form-input" 
                                        placeholder="Enter your password" 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        required
                                        style={{ width: "100%", padding: "14px 16px", background: "var(--charcoal)", border: "1px solid var(--muted)", color: "var(--ivory)", outline: "none" }}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--gold)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {isLogin && (
                                <div style={{ textAlign: "right", marginTop: "-12px", marginBottom: 28 }}>
                                    <a href="#" style={{ fontSize: 12, color: "var(--ivory-dim)", textDecoration: "none" }}>Forgot Password?</a>
                                </div>
                            )}

                            <button type="submit" className="btn-submit" disabled={loading} style={{ width: "100%", padding: "16px", background: "var(--gold)", color: "var(--midnight)", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                                {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                            </button>
                        </form>

                        <div style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: "var(--ivory-dim)" }}>
                            {isLogin ? (
                                <p>
                                    Don't have an account?{" "}
                                    <button type="button" onClick={() => { setIsLogin(false); setError(""); }} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontWeight: 500 }}>
                                        Create Account
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{" "}
                                    <button type="button" onClick={() => { setIsLogin(true); setError(""); }} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontWeight: 500 }}>
                                        Sign In
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
