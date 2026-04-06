import React from "react";
import { Metadata } from "next";
import { AdminProvider } from "../../components/AdminContext";
import { AdminLayoutContent } from "../../components/AdminLayoutContent";
import { getSession } from "@/app/utils/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Admin Panel | Hotel Grand Eagle",
    description: "Hotel Management and Operations",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session?.user || session.user.role !== "admin") {
        redirect("/");
    }

    return (
        <AdminProvider>
            <AdminLayoutContent>
                {children}
            </AdminLayoutContent>
        </AdminProvider>
    );
}
