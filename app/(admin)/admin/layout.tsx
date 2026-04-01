import React from "react";
import { Metadata } from "next";
import { AdminProvider } from "../../components/AdminContext";
import { AdminLayoutContent } from "../../components/AdminLayoutContent";

export const metadata: Metadata = {
    title: "Admin Panel | Hotel Grand Eagle",
    description: "Hotel Management and Operations",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminProvider>
            <AdminLayoutContent>
                {children}
            </AdminLayoutContent>
        </AdminProvider>
    );
}
