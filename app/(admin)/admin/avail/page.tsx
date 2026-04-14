"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import AdminAvailPage from "@/app/components/AdminAvailPage";

export default function AvailPage() {
    const { roomTypes, availability, setAvailability } = useAdmin();

    return (
        <AdminAvailPage 
            rooms={roomTypes} 
            availability={availability} 
            setAvailability={setAvailability} 
        />
    );
}
