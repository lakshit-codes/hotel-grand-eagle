import React from "react";
import { Metadata } from "next";
import VelourHeader from "./components/VelourHeader";
import VelourFooter from "./components/VelourFooter";
import "./velour.css";

export const metadata: Metadata = {
    title: "Hotel Grand Eagle | Timeless Comfort, Reimagined",
    description: "Experience heritage hospitality at Hotel Grand Eagle, Jaipur. Budget-friendly luxury near JECC, Sitapura Industrial Area.",
};

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="velour">
            <VelourHeader />
            <main>{children}</main>
            <VelourFooter />
        </div>
    );
}
