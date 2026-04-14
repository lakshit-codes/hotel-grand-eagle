"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import HousekeepingPage from "@/app/components/Housekeeping";

export default function AdminHkPage() {
    const { hkTasks, staff, updateHkTask } = useAdmin();

    return (
        <HousekeepingPage 
            tasks={hkTasks} 
            staff={staff} 
            onUpdate={updateHkTask} 
        />
    );
}
