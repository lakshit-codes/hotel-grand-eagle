import React from "react";
import { Metadata } from "next";
import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";

export const metadata: Metadata = {
    title: "Hotel Grand Eagle | Official Site",
    description: "Experience luxury and comfort at Hotel Grand Eagle.",
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
