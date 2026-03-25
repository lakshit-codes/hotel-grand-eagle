"use client";
import React, { useEffect } from "react";
import { GlobalStyles } from "./ui";
import { Sidebar, Topbar, SearchOverlay } from "./AdminShell";
import { useAdmin } from "./AdminContext";

export function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { searchOpen, setSearchOpen } = useAdmin();

    // Ctrl+K search listener
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(o => !o); } };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [setSearchOpen]);

    return (
        <div className="admin-root">
            <GlobalStyles />
            {searchOpen && <SearchOverlay />}
            <div className="app-shell">
                <Sidebar />
                <div className="main-area">
                    <Topbar />
                    <div className="page-content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
