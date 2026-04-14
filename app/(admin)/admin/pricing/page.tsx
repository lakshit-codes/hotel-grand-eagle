"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import AdminPricingPage from "@/app/components/AdminPricingPage";

export default function PricingPage() {
    const { roomTypes, pricing, setPricing, pricingRules, setPricingRules, currency, setCurrency } = useAdmin();

    return (
        <AdminPricingPage 
            rooms={roomTypes} 
            pricing={pricing} 
            setPricing={setPricing} 
            pricingRules={pricingRules} 
            setPricingRules={setPricingRules} 
            currency={currency} 
            setCurrency={setCurrency} 
        />
    );
}
