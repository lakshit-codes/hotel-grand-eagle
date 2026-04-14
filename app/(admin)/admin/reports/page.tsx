"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import ReportsPage from "@/app/components/Reports";

export default function AdminReportsPage() {
    const { bookings, customers, roomTypes, rooms, currency } = useAdmin();

    return (
        <ReportsPage 
            bookings={bookings} 
            customers={customers} 
            roomTypes={roomTypes} 
            rooms={rooms} 
            currency={currency} 
        />
    );
}
