"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import StaffPage from "@/app/components/Staff";

export default function AdminStaffPage() {
    const { staff, addStaff, updateStaff, deleteStaff } = useAdmin();

    return (
        <StaffPage 
            staff={staff} 
            onAdd={addStaff} 
            onUpdate={updateStaff} 
            onDelete={deleteStaff} 
        />
    );
}
