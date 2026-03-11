"use client";
import React, { useState, useMemo } from "react";
import { StaffMember, StaffRole, StaffShift, StaffStatus } from "./types";
import { Btn, Badge, Field, Inp, Sel, Ic, uid } from "./ui";

interface Props {
    staff: StaffMember[];
    onAdd: (s: StaffMember) => void;
    onUpdate: (s: StaffMember) => void;
    onDelete: (id: string) => void;
}

const ROLES: StaffRole[] = ["Front Desk", "Housekeeping", "Maintenance", "F&B", "Security", "Management", "Concierge"];
const SHIFTS: StaffShift[] = ["Morning (6AM–2PM)", "Afternoon (2PM–10PM)", "Night (10PM–6AM)", "General (9AM–6PM)"];
const STATUSES: StaffStatus[] = ["Active", "On Leave", "Off Duty", "Resigned"];
const ATTENDANCE = ["present", "absent", "late", "not-marked"] as const;

const ROLE_COLORS: Record<string, string> = {
    "Front Desk": "blue", "Housekeeping": "green", "Maintenance": "amber",
    "F&B": "purple", "Security": "red", "Management": "indigo", "Concierge": "teal",
};
const ATTENDANCE_COLORS: Record<string, { bg: string; color: string }> = {
    "present": { bg: "#f0fdf4", color: "#16a34a" },
    "absent": { bg: "#fef2f2", color: "#dc2626" },
    "late": { bg: "#fffbeb", color: "#d97706" },
    "not-marked": { bg: "#f9fafb", color: "#9ca3af" },
};

const BLANK: StaffMember = {
    id: "", employeeId: "", firstName: "", lastName: "", role: "Front Desk",
    department: "Operations", shift: "Morning (6AM–2PM)", phone: "", email: "",
    emergencyContact: "", joinDate: "", status: "Active", notes: "", todayAttendance: "not-marked",
};

function StaffModal({ initial, onSave, onClose }: { initial: StaffMember; onSave: (s: StaffMember) => void; onClose: () => void; }) {
    const [f, setF] = useState<StaffMember>({ ...initial });
    const s = (k: keyof StaffMember) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF(p => ({ ...p, [k]: e.target.value }));
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box modal-box-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{initial.firstName ? "Edit Staff Member" : "Add Staff Member"}</span>
                    <button className="modal-close" onClick={onClose}><Ic.X /></button>
                </div>
                <div className="modal-body">
                    <div className="grid-3 mb-12">
                        <Field label="First Name *"><Inp value={f.firstName} onChange={s("firstName")} /></Field>
                        <Field label="Last Name *"><Inp value={f.lastName} onChange={s("lastName")} /></Field>
                        <Field label="Employee ID *"><Inp value={f.employeeId} onChange={s("employeeId")} placeholder="EMP-001" /></Field>
                    </div>
                    <div className="grid-3 mb-12">
                        <Field label="Role"><Sel value={f.role} onChange={e => setF(p => ({ ...p, role: e.target.value as StaffRole }))} opts={ROLES} /></Field>
                        <Field label="Department"><Inp value={f.department} onChange={s("department")} /></Field>
                        <Field label="Shift"><Sel value={f.shift} onChange={e => setF(p => ({ ...p, shift: e.target.value as StaffShift }))} opts={SHIFTS} /></Field>
                    </div>
                    <div className="grid-3 mb-12">
                        <Field label="Phone"><Inp value={f.phone} onChange={s("phone")} /></Field>
                        <Field label="Email"><Inp value={f.email} onChange={s("email")} type="email" /></Field>
                        <Field label="Emergency Contact"><Inp value={f.emergencyContact} onChange={s("emergencyContact")} /></Field>
                    </div>
                    <div className="grid-2 mb-12">
                        <Field label="Join Date"><Inp type="date" value={f.joinDate} onChange={s("joinDate")} /></Field>
                        <Field label="Status"><Sel value={f.status} onChange={e => setF(p => ({ ...p, status: e.target.value as StaffStatus }))} opts={STATUSES} /></Field>
                    </div>
                    <Field label="Notes">
                        <textarea className="textarea" value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} placeholder="Any additional notes..." />
                    </Field>
                </div>
                <div className="modal-footer">
                    <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
                    <Btn disabled={!f.firstName.trim() || !f.lastName.trim()} onClick={() => { onSave({ ...f, id: f.id || uid() }); onClose(); }}>Save</Btn>
                </div>
            </div>
        </div>
    );
}

export default function StaffPage({ staff, onAdd, onUpdate, onDelete }: Props) {
    const [modal, setModal] = useState<StaffMember | null>(null);
    const [roleFilter, setRoleFilter] = useState("all");
    const [shiftFilter, setShiftFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return staff.filter(s => {
            const matchRole = roleFilter === "all" || s.role === roleFilter;
            const matchShift = shiftFilter === "all" || s.shift === shiftFilter;
            const matchSearch = !q || `${s.firstName} ${s.lastName} ${s.employeeId} ${s.role}`.toLowerCase().includes(q);
            return matchRole && matchShift && matchSearch && s.status !== "Resigned";
        });
    }, [staff, roleFilter, shiftFilter, search]);

    // Today's on-shift staff
    const now = new Date();
    const hour = now.getHours();
    const onShiftNow = staff.filter(s => {
        if (s.status !== "Active") return false;
        if (s.shift === "Morning (6AM–2PM)") return hour >= 6 && hour < 14;
        if (s.shift === "Afternoon (2PM–10PM)") return hour >= 14 && hour < 22;
        if (s.shift === "Night (10PM–6AM)") return hour >= 22 || hour < 6;
        if (s.shift === "General (9AM–6PM)") return hour >= 9 && hour < 18;
        return false;
    });

    const roleCounts = ROLES.reduce((acc, r) => { acc[r] = staff.filter(s => s.role === r && s.status === "Active").length; return acc; }, {} as Record<string, number>);
    const presentCount = staff.filter(s => s.todayAttendance === "present").length;
    const absentCount = staff.filter(s => s.todayAttendance === "absent").length;
    const lateCount = staff.filter(s => s.todayAttendance === "late").length;

    return (
        <div>
            {modal && <StaffModal initial={modal} onSave={s => { s.id && modal.firstName ? onUpdate(s) : onAdd(s); setModal(null); }} onClose={() => setModal(null)} />}

            <div className="page-header">
                <div><div className="page-title">Staff Management</div><div className="page-sub">{staff.filter(s => s.status === "Active").length} active staff · {onShiftNow.length} on shift now</div></div>
                <Btn onClick={() => setModal({ ...BLANK })}><Ic.Plus /> Add Staff</Btn>
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                {[
                    { label: "Total Active", value: staff.filter(s => s.status === "Active").length, color: "#111827" },
                    { label: "Present Today", value: presentCount, color: "#16a34a" },
                    { label: "Absent", value: absentCount, color: "#dc2626" },
                    { label: "On Shift Now", value: onShiftNow.length, color: "#2563eb" },
                ].map(k => (
                    <div key={k.label} className="kpi-card">
                        <div className="kpi-label">{k.label}</div>
                        <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
                    </div>
                ))}
            </div>

            {/* Today's shift roster */}
            <div className="card mb-16">
                <div className="card-header"><span className="card-title">🕐 Currently On Shift ({onShiftNow.length})</span></div>
                {onShiftNow.length === 0 && <div className="card-body text-gray text-center">No staff currently on shift based on schedule.</div>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: onShiftNow.length > 0 ? "16px 20px" : "0" }}>
                    {onShiftNow.map(s => (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "10px 14px", minWidth: 200 }}>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>{s.firstName[0]}{s.lastName[0]}</div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.firstName} {s.lastName}</div>
                                <div style={{ fontSize: 11.5, color: "#6b7280" }}>{s.role} · {s.shift.split("(")[0].trim()}</div>
                            </div>
                            <div style={{ marginLeft: "auto" }}>
                                {(() => { const ac = ATTENDANCE_COLORS[s.todayAttendance]; return <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: ac.bg, color: ac.color }}>{s.todayAttendance}</span>; })()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Role breakdown */}
            <div className="card mb-16">
                <div className="card-header"><span className="card-title">👔 Department Overview</span></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: "16px 20px" }}>
                    {ROLES.map(r => (
                        <button key={r} onClick={() => setRoleFilter(roleFilter === r ? "all" : r)}
                            style={{ padding: "8px 14px", borderRadius: 8, border: `2px solid ${roleFilter === r ? "#2563eb" : "#e5e7eb"}`, background: roleFilter === r ? "#eff6ff" : "#fff", cursor: "pointer", textAlign: "left", minWidth: 120 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: roleFilter === r ? "#2563eb" : "#111827" }}>{roleCounts[r] || 0}</div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>{r}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Staff table */}
            <div className="card">
                <div className="card-header" style={{ gap: 10, flexWrap: "wrap" }}>
                    <Inp value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, ID, role..." style={{ flex: 1, minWidth: 200 }} />
                    <select className="sel" style={{ width: 170 }} value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
                        <option value="all">All Shifts</option>
                        {SHIFTS.map(s => <option key={s} value={s}>{s.split("(")[0].trim()}</option>)}
                    </select>
                </div>
                <table className="data-table">
                    <thead><tr><th>Employee</th><th>Role</th><th>Shift</th><th>Contact</th><th>Status</th><th>Attendance</th><th></th></tr></thead>
                    <tbody>
                        {filtered.map(s => (
                            <tr key={s.id}>
                                <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#2563eb", flexShrink: 0, fontSize: 13 }}>{s.firstName[0]}{s.lastName[0]}</div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{s.firstName} {s.lastName}</div>
                                            <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{s.employeeId} · {s.joinDate ? `Since ${s.joinDate}` : ""}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><Badge color={ROLE_COLORS[s.role] ?? "gray"}>{s.role}</Badge></td>
                                <td style={{ fontSize: 12 }}>{s.shift.split("(")[0].trim()}<br /><span style={{ color: "#9ca3af" }}>{s.shift.match(/\(([^)]+)\)/)?.[1] ?? ""}</span></td>
                                <td>
                                    <div style={{ fontSize: 12.5 }}>{s.phone}</div>
                                    <div style={{ fontSize: 11.5, color: "#6b7280" }}>{s.email}</div>
                                </td>
                                <td><Badge color={s.status === "Active" ? "green" : s.status === "On Leave" ? "amber" : "gray"}>{s.status}</Badge></td>
                                <td>
                                    <select style={{ fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #e5e7eb", background: ATTENDANCE_COLORS[s.todayAttendance].bg, color: ATTENDANCE_COLORS[s.todayAttendance].color, fontWeight: 600, cursor: "pointer" }}
                                        value={s.todayAttendance} onChange={e => onUpdate({ ...s, todayAttendance: e.target.value as StaffMember["todayAttendance"] })}>
                                        {ATTENDANCE.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </td>
                                <td>
                                    <div style={{ display: "flex", gap: 4 }}>
                                        <Btn size="sm" variant="ghost" onClick={() => setModal({ ...s })}><Ic.Edit /></Btn>
                                        <Btn size="sm" variant="ghost" style={{ color: "#dc2626" }} onClick={() => onDelete(s.id)}><Ic.Trash /></Btn>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="card-body text-gray text-center">No staff found.</div>}
            </div>
        </div>
    );
}
