"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import CustomersPage from "@/app/components/Customers";

export default function AdminGuestsPage() {
    const { customers, bookings, mealPlans, addCustomer, updateCustomer } = useAdmin();

    return (
        <CustomersPage 
            customers={customers} 
            bookings={bookings} 
            mealPlans={mealPlans} 
            onAdd={addCustomer} 
            onUpdate={updateCustomer} 
        />
    );
}
