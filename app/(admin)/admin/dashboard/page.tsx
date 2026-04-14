"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import Dashboard from "@/app/components/Dashboard";

export default function DashboardPage() {
    const { hotel, roomTypes, availability, bookings, customers, hkTasks, maintenance } = useAdmin();

    return (
        <Dashboard 
            hotel={hotel} 
            rooms={roomTypes} 
            availability={availability} 
            bookings={bookings} 
            customers={customers} 
            hkTasks={hkTasks} 
            maintenance={maintenance} 
        />
    );
}
