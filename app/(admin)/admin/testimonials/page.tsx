"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import TestimonialsAdmin from "@/app/components/TestimonialsAdmin";

export default function AdminTestimonialsPage() {
    const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useAdmin();

    return (
        <TestimonialsAdmin 
            testimonials={testimonials} 
            onAdd={addTestimonial} 
            onUpdate={updateTestimonial} 
            onDelete={deleteTestimonial} 
        />
    );
}
