"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import AmenityManager from "@/app/components/AmenityManager";

export default function AmenityPage() {
    const { amenityCats, setAmenityCats } = useAdmin();

    return (
        <AmenityManager 
            amenityCats={amenityCats} 
            setAmenityCats={setAmenityCats} 
        />
    );
}
