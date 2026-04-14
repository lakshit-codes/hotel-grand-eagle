"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import CheckInPage from "@/app/components/CheckIn";

export default function AdminCheckInPage() {
    const { bookings, customers, roomTypes, mealPlans, availability, handleCheckIn } = useAdmin();

    return (
        <CheckInPage 
            bookings={bookings} 
            customers={customers} 
            rooms={roomTypes} 
            mealPlans={mealPlans} 
            availability={availability} 
            onCheckIn={handleCheckIn} 
        />
    );
}
