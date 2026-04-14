"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import MealPlansPage from "@/app/components/MealPlans";

export default function AdminMealsPage() {
    const { mealPlans, bookings, addMealPlan, updateMealPlan, deleteMealPlan } = useAdmin();

    return (
        <MealPlansPage 
            mealPlans={mealPlans} 
            bookings={bookings}
            onAdd={addMealPlan} 
            onUpdate={updateMealPlan} 
            onDelete={deleteMealPlan} 
        />
    );
}
