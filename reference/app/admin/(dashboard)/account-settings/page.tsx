"use client";

import { useState, useRef } from "react";
import {
  User,
  Mail,
  Lock,
  Shield,
  Bell,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Save,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

export default function AccountSettingsPage() {
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  const [logoPreview, setLogoPreview] = useState<string | null>("/assets/Image/logo.png");
  const [faviconPreview, setFaviconPreview] = useState<string | null>("/assets/Image/favicon.svg");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFaviconPreview(URL.createObjectURL(file));
  };

  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@nestcraft.com",
    role: "Superadmin",
    phone: "",
    bio: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new_: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    orders: true,
    products: true,
    system: false,
    marketing: false,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    showToast("Profile updated successfully!");
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new_ || !passwords.confirm) {
      showToast("Please fill in all password fields.");
      return;
    }
    if (passwords.new_ !== passwords.confirm) {
      showToast("New passwords do not match.");
      return;
    }
    if (passwords.new_.length < 8) {
      showToast("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setPasswords({ current: "", new_: "", confirm: "" });
    showToast("Password changed successfully!");
    setSaving(false);
  };

  const handleSaveAssets = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    showToast("Brand assets saved successfully!");
    setSaving(false);
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0d6533]/30 focus:border-[#0d6533]/60 transition-all";

  const labelClass = "block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1.5";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-xl bg-[#0d6533] px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-[#0d6533]/30 ring-1 ring-[#0d6533]/50">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* ── HERO HEADER ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* decorative gradient blob */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[#0d6533]/8 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#98c45f]/10 blur-2xl" />
        </div>

        <div className="relative px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Logo + Favicon block */}
          <div className="flex items-center gap-5">
            {/* Favicon / brand icon */}
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#0d6533]/20 bg-white shadow-lg shadow-[#0d6533]/10 p-2">
                <img
                  src="/assets/Image/favicon.svg"
                  alt="NestCraft favicon"
                  className="h-full w-full object-contain"
                />
              </div>
              {/* Camera overlay for avatar upload hint */}
              <button className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-[#0d6533] text-white shadow hover:bg-[#0b5429] transition-colors">
                <Camera size={12} />
              </button>
            </div>

            {/* Brand wordmark */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black uppercase tracking-tight text-foreground leading-none">
                  Nestcraft
                </span>
                <span className="rounded-full bg-[#0d6533]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#0d6533]">
                  Admin
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#0d6533] tracking-[0.22em] mt-0.5">
                LIVING ADMIN PANEL
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-16 bg-border/60 mx-2" />

          {/* User info */}
          <div className="flex flex-col gap-1">
            <p className="text-xl font-extrabold text-foreground leading-none">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#0d6533]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#0d6533]">
              <Shield size={11} />
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── LEFT COLUMN ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile Info */}
          <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border/60 bg-[#0d6533]/5 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0d6533]/15 text-[#0d6533]">
                <User size={16} />
              </div>
              <div>
                <h2 className="font-bold text-sm text-foreground">Profile Information</h2>
                <p className="text-[11px] text-muted-foreground">Update your personal details</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className={inputClass}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className={inputClass}
                    placeholder="+91 00000 00000"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                    className={`${inputClass} pl-9`}
                    placeholder="admin@nestcraft.com"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Bio</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  className={inputClass}
                  placeholder="A short bio about you..."
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0d6533] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0b5429] disabled:opacity-60 transition-colors shadow-md shadow-[#0d6533]/20"
                >
                  <Save size={14} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>

          {/* Brand Assets */}
          <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border/60 bg-[#98c45f]/10 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#98c45f]/20 text-[#063A1D]">
                <ImageIcon size={16} />
              </div>
              <div>
                <h2 className="font-bold text-sm text-foreground">Brand Assets</h2>
                <p className="text-[11px] text-muted-foreground">Manage your store logo and favicon</p>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Logo Upload */}
              <div className="space-y-3">
                <label className={labelClass}>Main Logo</label>
                <div className="rounded-xl border-2 border-dashed border-[#0d6533]/20 bg-muted/20 p-4 text-center hover:bg-[#0d6533]/5 hover:border-[#0d6533]/40 transition-colors">
                  <div className="mx-auto flex h-16 w-32 items-center justify-center rounded-lg bg-white shadow-sm border border-border mb-3 p-2">
                    <img src={logoPreview || "/assets/Image/logo.png"} alt="Preview Logo" className="max-h-12 max-w-full object-contain" />
                  </div>
                  <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                  <button onClick={() => logoInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-[#98c45f] px-4 py-2 text-xs font-bold text-[#063A1D] hover:bg-[#86b052] transition-colors shadow-sm">
                    <Upload size={14} /> Upload Logo
                  </button>
                  <p className="mt-2 text-[10px] text-muted-foreground">Recommended: 512x128px (PNG, SVG)</p>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-3">
                <label className={labelClass}>Favicon</label>
                <div className="rounded-xl border-2 border-dashed border-[#0d6533]/20 bg-muted/20 p-4 text-center hover:bg-[#0d6533]/5 hover:border-[#0d6533]/40 transition-colors">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm border border-border mb-3 p-2">
                    <img src={faviconPreview || "/assets/Image/favicon.svg"} alt="Preview Favicon" className="h-full w-full object-contain" />
                  </div>
                  <input type="file" ref={faviconInputRef} onChange={handleFaviconUpload} accept="image/*" className="hidden" />
                  <button onClick={() => faviconInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-[#98c45f] px-4 py-2 text-xs font-bold text-[#063A1D] hover:bg-[#86b052] transition-colors shadow-sm">
                    <Upload size={14} /> Upload Favicon
                  </button>
                  <p className="mt-2 text-[10px] text-muted-foreground">Recommended: 32x32px (ICO, PNG)</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border/60 bg-muted/10 px-6 py-4 flex justify-end">
              <button
                onClick={handleSaveAssets}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0d6533] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0b5429] disabled:opacity-60 transition-colors shadow-md shadow-[#0d6533]/20"
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save Assets"}
              </button>
            </div>
          </section>

          {/* Password */}
          <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border/60 bg-amber-500/5 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
                <Lock size={16} />
              </div>
              <div>
                <h2 className="font-bold text-sm text-foreground">Change Password</h2>
                <p className="text-[11px] text-muted-foreground">Update your login credentials</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Current Password", key: "current", show: showCurrentPwd, toggle: setShowCurrentPwd },
                { label: "New Password", key: "new_", show: showNewPwd, toggle: setShowNewPwd },
                { label: "Confirm New Password", key: "confirm", show: showConfirmPwd, toggle: setShowConfirmPwd },
              ].map(({ label, key, show, toggle }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={(passwords as any)[key]}
                      onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                      className={`${inputClass} pr-10`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => toggle((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-60 transition-colors shadow-md shadow-amber-600/20"
                >
                  <Lock size={14} />
                  {saving ? "Saving..." : "Update Password"}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────── */}
        <div className="space-y-6">

          {/* Notification Preferences */}
          <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border/60 bg-blue-500/5 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
                <Bell size={16} />
              </div>
              <div>
                <h2 className="font-bold text-sm text-foreground">Notifications</h2>
                <p className="text-[11px] text-muted-foreground">Control your alerts</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {(
                [
                  { key: "orders", label: "New Orders", desc: "Get notified on every new order" },
                  { key: "products", label: "Product Updates", desc: "Stock & inventory alerts" },
                  { key: "system", label: "System Alerts", desc: "Server & system uptime alerts" },
                  { key: "marketing", label: "Marketing", desc: "Promotional updates & campaigns" },
                ] as const
              ).map(({ key, label, desc }) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-start gap-3 rounded-xl p-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="relative shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={(e) =>
                        setNotifications((n) => ({ ...n, [key]: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="h-5 w-9 rounded-full bg-muted peer-checked:bg-[#0d6533] transition-colors" />
                    <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-[11px] text-muted-foreground">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Role / Security summary */}
          <section className="rounded-2xl border border-[#0d6533]/20 bg-[#0d6533]/5 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={16} className="text-[#0d6533]" />
              <h2 className="font-bold text-sm text-[#0d6533]">Account Security</h2>
            </div>
            <ul className="space-y-3 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#0d6533] shrink-0" />
                Role: <span className="ml-auto font-bold text-foreground">{profile.role}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#0d6533] shrink-0" />
                2FA Enabled: <span className="ml-auto font-bold text-foreground">No</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#0d6533] shrink-0" />
                Last Login: <span className="ml-auto font-bold text-foreground">Today</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
