import React from "react";

export function SectionCard({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center">
          {icon}
        </div>
        <div
          className="font-bold text-slate-600 tracking-[0.1em] uppercase"
          style={{ fontSize: "11px", lineHeight: "1", fontFamily: "inherit" }}
        >
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

export function InputLabel({ label }: { label: string }) {
  return (
    <label
      className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1 pl-0.5"
      style={{ fontFamily: "inherit" }}
    >
      {label}
    </label>
  );
}

export function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`w-8 h-4.5 rounded-full transition-all relative ${checked ? "bg-slate-900" : "bg-slate-200"}`}
      >
        <div
          className={`absolute h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-all top-0.5 ${checked ? "left-4" : "left-0.5"}`}
        />
      </div>
      <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors uppercase tracking-tight">
        {label}
      </span>
    </label>
  );
}
