"use client";
import React from "react";
import { useAdmin } from "@/app/components/AdminContext";
import RoomsPage from "@/app/components/Rooms";

export default function AdminRoomsPage() {
    const { rooms, roomTypes, addRoom, updateRoom, deleteRoom, deleteFloor } = useAdmin();

    return (
        <RoomsPage 
            inventory={rooms} 
            rooms={roomTypes} 
            onAdd={addRoom} 
            onUpdate={updateRoom} 
            onDelete={deleteRoom} 
            onDeleteFloor={deleteFloor} 
        />
    );
}
