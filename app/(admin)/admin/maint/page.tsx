"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import MaintenancePage from "@/app/components/Maintenance";

export default function AdminMaintPage() {
    const { maintenance, staff, rooms, addMaintenance, updateMaintenance } = useAdmin();

    return (
        <MaintenancePage 
            items={maintenance} 
            staff={staff}
            physicalRooms={rooms} 
            onAdd={addMaintenance} 
            onUpdate={updateMaintenance} 
        />
    );
}
