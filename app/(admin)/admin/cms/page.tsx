"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import PagesCMS from "@/app/components/PagesCMS";

export default function AdminCmsPage() {
    const { cmsPages, addPage, updatePage, deletePage } = useAdmin();

    return (
        <PagesCMS 
            pages={cmsPages} 
            onAdd={addPage} 
            onUpdate={updatePage} 
            onDelete={deletePage} 
        />
    );
}
