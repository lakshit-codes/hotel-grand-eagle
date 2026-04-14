"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import HotelOverview from "@/app/components/HotelOverview";

export default function AdminOverviewPage() {
    const { hotel, updateHotel } = useAdmin();

    return (
        <HotelOverview 
            hotel={hotel} 
            onSave={updateHotel} 
        />
    );
}
