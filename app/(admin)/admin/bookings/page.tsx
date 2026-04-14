"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import BookingsPage from "@/app/components/Bookings";

export default function AdminBookingsPage() {
    const { bookings, customers, roomTypes, rooms, hotel, mealPlans, addBooking, updateBooking, deleteBooking } = useAdmin();

    return (
        <BookingsPage 
            bookings={bookings} 
            customers={customers} 
            roomTypes={roomTypes} 
            rooms={rooms} 
            hotel={hotel} 
            mealPlans={mealPlans} 
            onAdd={addBooking} 
            onUpdate={updateBooking} 
            onDelete={deleteBooking} 
        />
    );
}
