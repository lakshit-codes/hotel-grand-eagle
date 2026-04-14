"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import GalleryAdmin from "@/app/components/GalleryAdmin";

export default function AdminGalleryPage() {
    const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage, reorderGallery } = useAdmin();

    return (
        <GalleryAdmin 
            images={galleryImages} 
            onAdd={addGalleryImage} 
            onUpdate={updateGalleryImage} 
            onDelete={deleteGalleryImage} 
            onReorder={reorderGallery} 
        />
    );
}
