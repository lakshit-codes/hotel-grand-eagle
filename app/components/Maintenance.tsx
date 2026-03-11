"use client";
import React, { useState, useMemo } from "react";
import { MaintenanceItem, MaintenanceComment, StaffMember } from "./types";
import { Btn, Badge, Ic, uid, PRIORITY_COLOR, MAINT_STATUS_COLOR } from "./ui";

interface Props {
    items: MaintenanceItem[];
    staff: StaffMember[];
    onAdd: (item: MaintenanceItem) => void;
    onUpdate: (item: MaintenanceItem) => void;
}

const MAINT_STATUSES = ["open", "in-progress", "resolved", "deferred"] as const;
const PRIORITIES = ["low", "medium", "high"] as const;
const REPORTERS = ["Front Desk", "Housekeeping", "Guest", "Manager", "Engineering"];
const CATEGORIES = ["Electrical", "Plumbing", "HVAC/AC", "Furniture", "Appliance", "IT/Telecom", "Structural", "Safety", "Pest Control", "Other"];

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; emoji: string }> = {
    "open": { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", emoji: "🔴" },
    "in-progress": { color: "#d97706", bg: "#fffbeb", border: "#fde68a", emoji: "🟡" },
    "resolved": { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", emoji: "🟢" },
    "deferred": { color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb", emoji: "⚪" },
};
const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
    "high": { color: "#dc2626", bg: "#fee2e2" },
    "medium": { color: "#d97706", bg: "#fef3c7" },
    "low": { color: "#6b7280", bg: "#f3f4f6" },
};

function hoursAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr + "T00:00:00").getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
}

const BLANK: MaintenanceItem = {
    id: "", roomNumber: "", roomTypeId: "", issue: "", category: "Electrical", priority: "medium",
    status: "open", reportedBy: "Front Desk", assignedTo: "",
    reportedAt: new Date().toISOString().slice(0, 10), resolvedAt: null, notes: "", comments: [], estimatedCost: 0,
};

function IssueCard({ item, staff, onUpdate, onEdit }: { item: MaintenanceItem; staff: StaffMember[]; onUpdate: (i: MaintenanceItem) => void; onEdit: () => void; }) {
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState("");
    const sc = STATUS_CONFIG[item.status];
    const pc = PRIORITY_CONFIG[item.priority];
    const engineeringStaff = staff.filter(s => s.role === "Maintenance");

    const addComment = () => {
        if (!comment.trim()) return;
        const c: MaintenanceComment = { id: uid(), author: "Manager", text: comment.trim(), timestamp: new Date().toISOString() };
        onUpdate({ ...item, comments: [...(item.comments ?? []), c] });
        setComment("");
    };

    const quickStatus = (status: MaintenanceItem["status"]) => {
        onUpdate({ ...item, status, resolvedAt: status === "resolved" ? new Date().toISOString().slice(0, 10) : item.resolvedAt });
    };

    return (
        <div style={{ background: "#fff", border: `1px solid ${sc.border}`, borderLeft: `4px solid ${sc.color}`, borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
            {/* Card header */}
            <div style={{ padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    {/* Priority indicator */}
                    <div style={{ width: 4, minWidth: 4, height: "100%", display: "none" }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                            <span style={{ fontWeight: 700, fontSize: 14.5 }}>{item.issue}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: pc.bg, color: pc.color }}>{item.priority.toUpperCase()}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: "#f3f4f6", color: "#374151" }}>{item.category}</span>
                        </div>
                        <div style={{ fontSize: 12.5, color: "#6b7280", display: "flex", flexWrap: "wrap", gap: 12 }}>
                            <span>🏨 Room {item.roomNumber || "—"}</span>
                            <span>👤 Reported by {item.reportedBy}</span>
                            <span>🔧 Assigned: {item.assignedTo || "Unassigned"}</span>
                            <span style={{ color: "#9ca3af" }}>⏱ {hoursAgo(item.reportedAt)}</span>
                            {item.estimatedCost > 0 && <span style={{ color: "#16a34a" }}>💰 Est. ${item.estimatedCost}</span>}
                        </div>
                        {item.resolvedAt && <div style={{ fontSize: 12, color: "#16a34a", marginTop: 4 }}>✅ Resolved: {item.resolvedAt}</div>}
                        {item.notes && <div style={{ fontSize: 12.5, color: "#374151", marginTop: 6, fontStyle: "italic", background: "#f9fafb", borderRadius: 6, padding: "6px 10px" }}>{item.notes}</div>}
                    </div>
                    {/* Right: status + actions */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, whiteSpace: "nowrap" }}>
                                {sc.emoji} {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                            {item.status !== "in-progress" && item.status !== "resolved" && (
                                <button onClick={() => quickStatus("in-progress")} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid #fde68a", background: "#fffbeb", color: "#d97706", cursor: "pointer", fontWeight: 600 }}>→ Working</button>
                            )}
                            {item.status !== "resolved" && (
                                <button onClick={() => quickStatus("resolved")} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#16a34a", cursor: "pointer", fontWeight: 600 }}>✓ Resolve</button>
                            )}
                            <Btn size="sm" variant="ghost" onClick={onEdit}><Ic.Edit /></Btn>
                        </div>
                        <button onClick={() => setShowComments(v => !v)} style={{ fontSize: 11.5, color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                            💬 {(item.comments?.length ?? 0)} comment(s) {showComments ? "▲" : "▼"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments timeline */}
            {showComments && (
                <div style={{ borderTop: "1px solid #f3f4f6", background: "#fafafa", padding: "12px 16px" }}>
                    {(item.comments ?? []).length === 0 && <div style={{ fontSize: 12.5, color: "#9ca3af", marginBottom: 8 }}>No comments yet.</div>}
                    {(item.comments ?? []).map(c => (
                        <div key={c.id} style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>{c.author[0]}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, fontWeight: 600 }}>{c.author} <span style={{ color: "#9ca3af", fontWeight: 400 }}>{new Date(c.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span></div>
                                <div style={{ fontSize: 13, color: "#374151" }}>{c.text}</div>
                            </div>
                        </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                        <input className="inp" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..." style={{ flex: 1, fontSize: 13 }} onKeyDown={e => e.key === "Enter" && addComment()} />
                        <Btn size="sm" variant="secondary" onClick={addComment}>Post</Btn>
                    </div>
                </div>
            )}
        </div>
    );
}

function IssueModal({ item, staff, onSave, onClose }: { item: MaintenanceItem; staff: StaffMember[]; onSave: (i: MaintenanceItem) => void; onClose: () => void; }) {
    const [f, setF] = useState<MaintenanceItem>({ ...item });
    const s = (k: keyof MaintenanceItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF(p => ({ ...p, [k]: e.target.value }));
    const engineeringStaff = staff.filter(s => s.role === "Maintenance");
    const assignableStaff = [...engineeringStaff.map(s => `${s.firstName} ${s.lastName}`), "External Contractor"];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <span className="modal-title">{f.id ? "Edit Issue" : "Report New Issue"}</span>
                    <button className="modal-close" onClick={onClose}><Ic.X /></button>
                </div>
                <div className="modal-body">
                    <div className="grid-2 mb-12">
                        <div><label className="field-label">Room Number</label><input className="inp" value={f.roomNumber} onChange={s("roomNumber")} placeholder="e.g. 201" /></div>
                        <div><label className="field-label">Category</label><select className="sel" value={f.category} onChange={s("category")}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    </div>
                    <div className="mb-12"><label className="field-label">Issue Description *</label><input className="inp" value={f.issue} onChange={s("issue")} placeholder="Describe the issue clearly..." /></div>
                    <div className="mb-12"><label className="field-label">Notes / Observations</label><textarea className="textarea" value={f.notes} onChange={e => setF(p => ({ ...p, notes: e.target.value }))} placeholder="Additional details..." /></div>
                    <div className="grid-3 mb-12">
                        <div><label className="field-label">Priority</label><select className="sel" value={f.priority} onChange={s("priority")}>{PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}</select></div>
                        <div><label className="field-label">Status</label><select className="sel" value={f.status} onChange={s("status")}>{MAINT_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}</select></div>
                        <div><label className="field-label">Est. Cost ($)</label><input type="number" className="inp" value={f.estimatedCost} onChange={s("estimatedCost")} min={0} /></div>
                    </div>
                    <div className="grid-2 mb-12">
                        <div><label className="field-label">Reported By</label><select className="sel" value={f.reportedBy} onChange={s("reportedBy")}>{REPORTERS.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                        <div><label className="field-label">Assigned To</label><select className="sel" value={f.assignedTo} onChange={s("assignedTo")}><option value="">— Unassigned —</option>{assignableStaff.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    </div>
                    <div><label className="field-label">Reported Date</label><input type="date" className="inp" value={f.reportedAt} onChange={s("reportedAt")} /></div>
                </div>
                <div className="modal-footer">
                    <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
                    <Btn disabled={!f.issue.trim()} onClick={() => { onSave({ ...f, id: f.id || uid() }); onClose(); }}>Save Issue</Btn>
                </div>
            </div>
        </div>
    );
}

export default function MaintenancePage({ items, staff, onAdd, onUpdate }: Props) {
    const [modal, setModal] = useState<MaintenanceItem | null>(null);
    const [filter, setFilter] = useState("all");
    const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

    const counts = useMemo(() => ({
        open: items.filter(i => i.status === "open").length,
        inProg: items.filter(i => i.status === "in-progress").length,
        resolved: items.filter(i => i.status === "resolved").length,
        deferred: items.filter(i => i.status === "deferred").length,
    }), [items]);

    const filtered = filter === "all" ? items : items.filter(i => i.status === filter);

    const filterBtn = (key: string, label: string, count: number, color = "#374151") => {
        const active = filter === key;
        return <button onClick={() => setFilter(key)} style={{ padding: "7px 14px", borderRadius: 8, border: `2px solid ${active ? "#2563eb" : "#e5e7eb"}`, background: active ? "#eff6ff" : "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", color: active ? "#2563eb" : color }}>{label} ({count})</button>;
    };

    return (
        <div>
            {modal && <IssueModal item={modal} staff={staff} onSave={i => { i.id ? onUpdate(i) : onAdd(i); setModal(null); }} onClose={() => setModal(null)} />}
            <div className="page-header">
                <div>
                    <div className="page-title">Maintenance</div>
                    <div className="page-sub">{counts.open} open · {counts.inProg} in-progress · {counts.resolved} resolved · {counts.deferred} deferred</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setViewMode(v => v === "list" ? "kanban" : "list")} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                        {viewMode === "list" ? "⬛ Kanban" : "☰ List"}
                    </button>
                    <Btn onClick={() => setModal({ ...BLANK })}><Ic.Plus /> Report Issue</Btn>
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {filterBtn("all", "All", items.length)}
                {filterBtn("open", "🔴 Open", counts.open, "#dc2626")}
                {filterBtn("in-progress", "🟡 In Progress", counts.inProg, "#d97706")}
                {filterBtn("resolved", "🟢 Resolved", counts.resolved, "#16a34a")}
                {filterBtn("deferred", "⚪ Deferred", counts.deferred)}
            </div>

            {viewMode === "list" && (
                <div>
                    {filtered.length === 0 && <div style={{ textAlign: "center", color: "#9ca3af", padding: "48px 20px", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>No maintenance items for this filter.</div>}
                    {filtered.map(item => (
                        <IssueCard key={item.id} item={item} staff={staff} onUpdate={onUpdate} onEdit={() => setModal({ ...item })} />
                    ))}
                </div>
            )}

            {viewMode === "kanban" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, alignItems: "start" }}>
                    {(["open", "in-progress", "resolved", "deferred"] as const).map(col => {
                        const sc = STATUS_CONFIG[col];
                        const colItems = items.filter(i => i.status === col);
                        return (
                            <div key={col}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "8px 12px", background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 8 }}>
                                    <span style={{ fontSize: 16 }}>{sc.emoji}</span>
                                    <span style={{ fontWeight: 700, fontSize: 13, color: sc.color }}>{col.charAt(0).toUpperCase() + col.slice(1)}</span>
                                    <span style={{ marginLeft: "auto", fontWeight: 700, fontSize: 13, color: sc.color }}>{colItems.length}</span>
                                </div>
                                {colItems.map(item => (
                                    <div key={item.id} style={{ background: "#fff", border: `1px solid ${sc.border}`, borderLeft: `3px solid ${sc.color}`, borderRadius: 8, padding: "10px 12px", marginBottom: 8, cursor: "pointer" }} onClick={() => setModal({ ...item })}>
                                        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.issue}</div>
                                        <div style={{ fontSize: 11.5, color: "#6b7280" }}>Rm {item.roomNumber || "—"} · {item.category}</div>
                                        <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{item.assignedTo || "Unassigned"}</div>
                                        <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: PRIORITY_CONFIG[item.priority].bg, color: PRIORITY_CONFIG[item.priority].color }}>{item.priority}</span>
                                            <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: "auto" }}>{hoursAgo(item.reportedAt)}</span>
                                        </div>
                                    </div>
                                ))}
                                {colItems.length === 0 && <div style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", padding: "16px 0" }}>No items</div>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
