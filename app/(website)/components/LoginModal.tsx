"use client";
import React, { useState } from "react";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean, onClose: () => void, onLoginSuccess: (user: any) => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

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
                onLoginSuccess(data.user);
                onClose();
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vh-modal-overlay" onClick={onClose}>
            <div className="vh-modal-content" onClick={e => e.stopPropagation()}>
                <button className="vh-modal-close" onClick={onClose} aria-label="Close modal">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <h2 className="vh-modal-title">{isLogin ? "Sign In" : "Create Account"}</h2>
                <p className="vh-modal-subtitle">
                    {isLogin ? "Access your bookings and account." : "Join us for an exclusive experience."}
                </p>

                {error && <div className="vh-modal-error">{error}</div>}

                <form onSubmit={handleSubmit} className="vh-modal-form">
                    {!isLogin && (
                        <div className="input-group">
                            <label className="input-label">Full Name</label>
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="John Doe" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                required={!isLogin}
                            />
                        </div>
                    )}
                    
                    <div className="input-group">
                        <label className="input-label">Email or Phone</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Enter your email or phone" 
                            value={emailOrPhone} 
                            onChange={e => setEmailOrPhone(e.target.value)} 
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div className="vh-password-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="form-input" 
                                placeholder="Enter your password" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required
                            />
                            <button 
                                type="button" 
                                className="vh-btn-show-pass" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {isLogin && (
                        <div className="vh-forgot-pass">
                            <a href="#">Forgot Password?</a>
                        </div>
                    )}

                    <button type="submit" className="btn-submit vh-modal-submit" disabled={loading}>
                        {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                    </button>
                </form>

                <div className="vh-modal-footer">
                    {isLogin ? (
                        <p>Don't have an account? <button type="button" onClick={() => { setIsLogin(false); setError(""); }}>Create Account</button></p>
                    ) : (
                        <p>Already have an account? <button type="button" onClick={() => { setIsLogin(true); setError(""); }}>Sign In</button></p>
                    )}
                </div>
            </div>
        </div>
    );
}
