"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import NearbyAdmin from "@/app/components/NearbyAdmin";

export default function AdminNearbyPage() {
    const { nearbyPlaces, addNearbyPlace, updateNearbyPlace, deleteNearbyPlace } = useAdmin();

    return (
        <NearbyAdmin 
            places={nearbyPlaces} 
            onAdd={addNearbyPlace} 
            onUpdate={updateNearbyPlace} 
            onDelete={deleteNearbyPlace} 
        />
    );
}
