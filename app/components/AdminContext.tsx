"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { RoomItem, Room, Availability, Pricing, SeasonalPrice, AmenityCat, Hotel, Customer, Booking, MealPlan, HousekeepingTask, MaintenanceItem, PricingRule, StaffMember } from "./types";
import { uid } from "./ui";

interface AdminContextType {
    page: string;
    setPage: (p: string) => void;
    collapsed: boolean;
    setCollapsed: (v: boolean | ((p: boolean) => boolean)) => void;
    mobileNavOpen: boolean;
    setMobileNavOpen: (v: boolean | ((p: boolean) => boolean)) => void;
    searchOpen: boolean;
    setSearchOpen: (v: boolean | ((p: boolean) => boolean)) => void;
    hotel: Hotel;
    setHotel: (h: Hotel | ((p: Hotel) => Hotel)) => void;
    roomTypes: Room[];
    setRoomTypes: (r: Room[] | ((p: Room[]) => Room[])) => void;
    bookings: Booking[];
    setBookings: (b: Booking[] | ((p: Booking[]) => Booking[])) => void;
    customers: Customer[];
    setCustomers: (c: Customer[] | ((p: Customer[]) => Customer[])) => void;
    rooms: RoomItem[];
    setRooms: (r: RoomItem[] | ((p: RoomItem[]) => RoomItem[])) => void;
    mealPlans: MealPlan[];
    setMealPlans: (m: MealPlan[] | ((p: MealPlan[]) => MealPlan[])) => void;
    hkTasks: HousekeepingTask[];
    setHkTasks: (t: HousekeepingTask[] | ((p: HousekeepingTask[]) => HousekeepingTask[])) => void;
    maintenance: MaintenanceItem[];
    setMaintenance: (m: MaintenanceItem[] | ((p: MaintenanceItem[]) => MaintenanceItem[])) => void;
    pricingRules: PricingRule[];
    setPricingRules: (p: PricingRule[] | ((p: PricingRule[]) => PricingRule[])) => void;
    staff: StaffMember[];
    setStaff: (s: StaffMember[] | ((p: StaffMember[]) => StaffMember[])) => void;
    amenityCats: AmenityCat[];
    setAmenityCats: (a: AmenityCat[] | ((p: AmenityCat[]) => AmenityCat[])) => void;
    pricing: Record<string, Pricing>;
    setPricing: (p: Record<string, Pricing> | ((p: Record<string, Pricing>) => Record<string, Pricing>)) => void;
    availability: Record<string, Availability>;
    setAvailability: (a: Record<string, Availability> | ((p: Record<string, Availability>) => Record<string, Availability>)) => void;
    currency: string;
    setCurrency: (s: string) => void;
    runSeed: () => Promise<void>;
    updateHotel: (h: Hotel) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [page, setPage] = useState("dashboard");
    const [collapsed, setCollapsed] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [hotel, setHotel] = useState<Hotel>({ name: "HOTEL GRAND EAGLE", shortDescription: "", address: "", city: "", country: "", contactNumber: "", email: "", checkInTime: "", checkOutTime: "", starRating: 0 });
    const [roomTypes, setRoomTypes] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [rooms, setRooms] = useState<RoomItem[]>([]);
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [hkTasks, setHkTasks] = useState<HousekeepingTask[]>([]);
    const [maintenance, setMaintenance] = useState<MaintenanceItem[]>([]);
    const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [amenityCats, setAmenityCats] = useState<AmenityCat[]>([]);
    const [pricing, setPricing] = useState<Record<string, Pricing>>({});
    const [availability, setAvailability] = useState<Record<string, Availability>>({});
    const [currency, setCurrency] = useState("INR");

    useEffect(() => { fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/room-types").then(r => r.json()).then(d => { if (d.length) setRoomTypes(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/amenities").then(r => r.json()).then(d => { if (d.length) setAmenityCats(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/bookings").then(r => r.json()).then(d => setBookings(d)).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/customers").then(r => r.json()).then(d => setCustomers(d)).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/meal-plans").then(r => r.json()).then(d => { if (d.length) setMealPlans(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/housekeeping").then(r => r.json()).then(d => setHkTasks(d)).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/maintenance").then(r => r.json()).then(d => setMaintenance(d)).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/pricing-rules").then(r => r.json()).then(d => { if (d.length) setPricingRules(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/staff").then(r => r.json()).then(d => { if (d.length) setStaff(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/rooms").then(r => r.json()).then(d => { if (d.length) setRooms(d); }).catch(() => { }); }, []);

    const runSeed = async () => {
        const res = await fetch("/api/seed");
        const data = await res.json();
        if (data.success) {
            const [b, c, mp, hk, mn, pr, st, rm, am, ri] = await Promise.all([
                fetch("/api/bookings").then(r => r.json()),
                fetch("/api/customers").then(r => r.json()),
                fetch("/api/meal-plans").then(r => r.json()),
                fetch("/api/housekeeping").then(r => r.json()),
                fetch("/api/maintenance").then(r => r.json()),
                fetch("/api/pricing-rules").then(r => r.json()),
                fetch("/api/staff").then(r => r.json()),
                fetch("/api/room-types").then(r => r.json()),
                fetch("/api/amenities").then(r => r.json()),
                fetch("/api/rooms").then(r => r.json()),
            ]);
            setBookings(b); setCustomers(c); if (mp.length) setMealPlans(mp);
            setHkTasks(hk); setMaintenance(mn); if (pr.length) setPricingRules(pr);
            if (st.length) setStaff(st); if (rm.length) setRoomTypes(rm);
            if (am.length) setAmenityCats(am);
            fetch("/api/hotel-settings").then(r => r.json()).then(d => { if (d.name) setHotel(d); });
        }
    };

    const updateHotel = async (h: Hotel) => {
        await fetch("/api/hotel-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(h) });
        setHotel(h);
    };

    const value = {
        page, setPage, collapsed, setCollapsed, mobileNavOpen, setMobileNavOpen, searchOpen, setSearchOpen,
        hotel, setHotel, roomTypes, setRoomTypes, bookings, setBookings, customers, setCustomers,
        rooms, setRooms, mealPlans, setMealPlans, hkTasks, setHkTasks, maintenance, setMaintenance,
        pricingRules, setPricingRules, staff, setStaff, amenityCats, setAmenityCats,
        pricing, setPricing, availability, setAvailability, currency, setCurrency, runSeed, updateHotel
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) throw new Error("useAdmin must be used within an AdminProvider");
    return context;
}
