"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import HotelOverview from "@/app/components/HotelOverview";

export default function AdminOverviewPage() {
    const { hotel, roomTypes, updateHotel } = useAdmin();

    return (
        <HotelOverview 
            hotel={hotel} 
            rooms={roomTypes}
            onUpdate={updateHotel} 
        />
    );
}
