"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { RoomItem, Room, Availability, Pricing, SeasonalPrice, AmenityCat, Hotel, Customer, Booking, MealPlan, HousekeepingTask, MaintenanceItem, PricingRule, StaffMember, NearbyPlace, CMSPage, GalleryImage, Testimonial } from "./types";
import { uid } from "./ui";

interface AdminContextType {
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
    nearbyPlaces: NearbyPlace[];
    setNearbyPlaces: (n: NearbyPlace[] | ((p: NearbyPlace[]) => NearbyPlace[])) => void;
    cmsPages: CMSPage[];
    setCmsPages: (p: CMSPage[] | ((p: CMSPage[]) => CMSPage[])) => void;
    galleryImages: GalleryImage[];
    setGalleryImages: (g: GalleryImage[] | ((p: GalleryImage[]) => GalleryImage[])) => void;
    testimonials: Testimonial[];
    setTestimonials: (t: Testimonial[] | ((p: Testimonial[]) => Testimonial[])) => void;
    runSeed: () => Promise<void>;
    updateHotel: (h: Hotel) => Promise<void>;

    // CRUD Handlers moved from AdminPage
    addPage: (p: CMSPage) => Promise<void>;
    updatePage: (p: CMSPage) => Promise<void>;
    deletePage: (id: string) => Promise<void>;
    addGalleryImage: (img: GalleryImage) => Promise<void>;
    updateGalleryImage: (img: GalleryImage) => Promise<void>;
    deleteGalleryImage: (id: string) => Promise<void>;
    reorderGallery: (imgs: GalleryImage[]) => Promise<void>;
    addBooking: (b: Booking) => Promise<boolean>;
    updateBooking: (b: Booking) => Promise<boolean>;
    deleteBooking: (id: string) => Promise<void>;
    addCustomer: (c: Customer) => Promise<void>;
    updateCustomer: (c: Customer) => Promise<void>;
    deleteCustomer: (id: string) => Promise<void>;
    addRoomType: (r: Room) => Promise<void>;
    editRoomType: (r: Room) => Promise<void>;
    deleteRoomType: (id: string) => Promise<void>;
    addRoom: (r: RoomItem) => Promise<void>;
    updateRoom: (r: RoomItem) => Promise<void>;
    deleteRoom: (id: string) => Promise<void>;
    deleteFloor: (floor: number) => Promise<void>;
    updateHkTask: (t: HousekeepingTask) => Promise<void>;
    addMaintenance: (item: MaintenanceItem) => Promise<void>;
    updateMaintenance: (item: MaintenanceItem) => Promise<void>;
    addStaff: (s: StaffMember) => Promise<void>;
    updateStaff: (s: StaffMember) => Promise<void>;
    deleteStaff: (id: string) => Promise<void>;
    addMealPlan: (mp: MealPlan) => Promise<void>;
    updateMealPlan: (mp: MealPlan) => Promise<void>;
    deleteMealPlan: (id: string) => Promise<void>;
    addNearbyPlace: (place: NearbyPlace) => Promise<void>;
    updateNearbyPlace: (place: NearbyPlace) => Promise<void>;
    deleteNearbyPlace: (id: string) => Promise<void>;
    addTestimonial: (t: Testimonial) => Promise<void>;
    updateTestimonial: (t: Testimonial) => Promise<void>;
    deleteTestimonial: (id: string) => Promise<void>;
    handleCheckIn: (bookingId: string, roomNumber: string, mealPlanId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
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
    const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
    const [cmsPages, setCmsPages] = useState<CMSPage[]>([]);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    // ── CMS Handlers ──
    const addPage = async (p: CMSPage) => {
        const res = await fetch("/api/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
        if (res.ok) {
            const data = await res.json();
            setCmsPages(curr => [...curr, data]);
        } else {
            const err = await res.json();
            alert(`Error: ${err.error}`);
        }
    };
    const updatePage = async (p: CMSPage) => {
        const res = await fetch(`/api/pages/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
        if (res.ok) {
            setCmsPages(curr => curr.map(x => x.id === p.id ? p : x));
        } else {
            const err = await res.json();
            alert(`Error: ${err.error}`);
        }
    };
    const deletePage = async (id: string) => {
        const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
        if (res.ok) {
            setCmsPages(curr => curr.filter(x => x.id !== id));
        } else {
            const err = await res.json();
            alert(`Error: ${err.error}`);
        }
    };

    // ── Gallery Handlers ──
    const addGalleryImage = async (img: GalleryImage) => {
        const res = await fetch("/api/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(img) });
        if (res.ok) { const data = await res.json(); setGalleryImages(curr => [...curr, data]); }
    };
    const updateGalleryImage = async (img: GalleryImage) => {
        await fetch("/api/gallery", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(img) });
        setGalleryImages(curr => curr.map(x => x.id === img.id ? img : x));
    };
    const deleteGalleryImage = async (id: string) => {
        await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
        setGalleryImages(curr => curr.filter(x => x.id !== id));
    };
    const reorderGallery = async (imgs: GalleryImage[]) => {
        setGalleryImages(imgs);
        for (const img of imgs) {
            await fetch("/api/gallery", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: img.id, order: img.order }) });
        }
    };

    // ── Booking Handlers ──
    const addBooking = async (b: Booking): Promise<boolean> => {
        try {
            const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
            if (res.status === 409) {
                const data = await res.json();
                alert(`⚠️ Booking Conflict\n\n${data.error || "Room is already booked for overlapping dates."}`);
                return false;
            }
            setBookings(p => [...p, { ...b, currency: "INR" }]);
            fetch("/api/rooms").then(r => r.json()).then(d => { if (d.length) setRooms(d); }).catch(() => { });
            return true;
        } catch {
            alert("Failed to create booking. Please try again.");
            return false;
        }
    };
    const updateBooking = async (b: Booking): Promise<boolean> => {
        try {
            const res = await fetch("/api/bookings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
            if (res.status === 409) {
                const data = await res.json();
                alert(`⚠️ Booking Conflict\n\n${data.error || "Room is already booked for overlapping dates."}`);
                return false;
            }
            setBookings(p => p.map(x => x.id === b.id ? { ...b, currency: "INR" } : x));
            fetch("/api/rooms").then(r => r.json()).then(d => { if (d.length) setRooms(d); }).catch(() => { });
            return true;
        } catch {
            alert("Failed to update booking. Please try again.");
            return false;
        }
    };
    const deleteBooking = async (id: string) => { await fetch(`/api/bookings?id=${id}`, { method: "DELETE" }); setBookings(p => p.filter(x => x.id !== id)); };

    // ── Customer Handlers ──
    const addCustomer = async (c: Customer) => { await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) }); setCustomers(p => [...p, c]); };
    const updateCustomer = async (c: Customer) => { await fetch("/api/customers", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c) }); setCustomers(p => p.map(x => x.id === c.id ? c : x)); };
    const deleteCustomer = async (id: string) => { await fetch(`/api/customers?id=${id}`, { method: "DELETE" }); setCustomers(p => p.filter(x => x.id !== id)); };

    // ── Room Type Handlers ──
    const addRoomType = async (r: Room) => {
        await fetch("/api/room-types", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
        setRoomTypes(p => [...p, r]);
    };
    const editRoomType = async (r: Room) => {
        await fetch("/api/room-types", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
        setRoomTypes(p => p.map(x => x.id === r.id ? r : x));
    };
    const deleteRoomType = async (id: string) => {
        await fetch(`/api/room-types?id=${id}`, { method: "DELETE" });
        setRoomTypes(p => p.filter(x => x.id !== id));
    };

    // ── Rooms Handlers ──
    const addRoom = async (r: RoomItem) => {
        await fetch("/api/rooms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
        setRooms(p => [...p, r]);
        const res = await fetch("/api/housekeeping", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
        const hk = await res.json();
        if (hk.task) setHkTasks(p => [...p, hk.task]);
    };
    const updateRoom = async (r: RoomItem) => {
        await fetch("/api/rooms", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
        setRooms(p => p.map(x => x.id === r.id ? r : x));
    };
    const deleteRoom = async (id: string) => {
        const room = rooms.find(x => x.id === id);
        await fetch(`/api/rooms?id=${id}`, { method: "DELETE" });
        setRooms(p => p.filter(x => x.id !== id));
        if (room) {
            await fetch(`/api/housekeeping?roomNumber=${room.roomNumber}`, { method: "DELETE" });
            setHkTasks(p => p.filter(x => x.roomNumber !== room.roomNumber));
        }
    };
    const deleteFloor = async (floor: number) => {
        await fetch(`/api/rooms?floor=${floor}`, { method: "DELETE" });
        setRooms(p => p.filter(x => x.floor !== floor));
        await fetch(`/api/housekeeping?floor=${floor}`, { method: "DELETE" });
        setHkTasks(p => p.filter(x => x.floor !== floor));
    };

    // ── Housekeeping ──
    const updateHkTask = async (t: HousekeepingTask) => { await fetch("/api/housekeeping", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) }); setHkTasks(p => p.map(x => x.id === t.id ? t : x)); };

    // ── Maintenance ──
    const addMaintenance = async (item: MaintenanceItem) => { await fetch("/api/maintenance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }); setMaintenance(p => [...p, item]); };
    const updateMaintenance = async (item: MaintenanceItem) => { await fetch("/api/maintenance", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) }); setMaintenance(p => p.map(x => x.id === item.id ? item : x)); };

    // ── Staff ──
    const addStaff = async (s: StaffMember) => { await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) }); setStaff(p => [...p, s]); };
    const updateStaff = async (s: StaffMember) => { await fetch("/api/staff", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) }); setStaff(p => p.map(x => x.id === s.id ? s : x)); };
    const deleteStaff = async (id: string) => { await fetch(`/api/staff?id=${id}`, { method: "DELETE" }); setStaff(p => p.filter(x => x.id !== id)); };

    // ── Meal Plans ──
    const addMealPlan = async (mp: MealPlan) => { await fetch("/api/meal-plans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mp) }); setMealPlans(p => [...p, mp]); };
    const updateMealPlan = async (mp: MealPlan) => { await fetch("/api/meal-plans", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(mp) }); setMealPlans(p => p.map(x => x.id === mp.id ? mp : x)); };
    const deleteMealPlan = async (id: string) => { await fetch(`/api/meal-plans?id=${id}`, { method: "DELETE" }); setMealPlans(p => p.filter(x => x.id !== id)); };

    // ── Nearby Places ──
    const addNearbyPlace = async (place: NearbyPlace) => {
        const res = await fetch("/api/nearby", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(place) });
        const data = await res.json();
        if (data.place) setNearbyPlaces(p => [...p, data.place]);
    };
    const updateNearbyPlace = async (place: NearbyPlace) => {
        await fetch("/api/nearby", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(place) });
        setNearbyPlaces(p => p.map(x => x.id === place.id ? place : x));
    };
    const deleteNearbyPlace = async (id: string) => {
        await fetch(`/api/nearby?id=${id}`, { method: "DELETE" });
        setNearbyPlaces(p => p.filter(x => x.id !== id));
    };

    // ── Testimonials ──
    const addTestimonial = async (t: Testimonial) => {
        const res = await fetch("/api/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) });
        const data = await res.json();
        if (data.testimonial) setTestimonials(p => [data.testimonial, ...p]);
    };
    const updateTestimonial = async (t: Testimonial) => {
        await fetch("/api/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) });
        setTestimonials(p => p.map(x => x.id === t.id ? t : x));
    };
    const deleteTestimonial = async (id: string) => {
        await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
        setTestimonials(p => p.filter(x => x.id !== id));
    };

    // ── Quick check-in ──
    const handleCheckIn = (bookingId: string, roomNumber: string, mealPlanId: string) => {
        const mp = mealPlans.find(m => m.id === mealPlanId);
        updateBooking({ ...bookings.find(b => b.id === bookingId)!, roomNumber, mealPlanId, mealPlanCode: mp?.code ?? "", status: "checked-in", checkInActual: new Date().toISOString() });
    };

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
    useEffect(() => { fetch("/api/nearby").then(r => r.json()).then(d => { if (Array.isArray(d)) setNearbyPlaces(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/pages").then(r => r.json()).then(d => { if (Array.isArray(d)) setCmsPages(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/gallery").then(r => r.json()).then(d => { if (Array.isArray(d)) setGalleryImages(d); }).catch(() => { }); }, []);
    useEffect(() => { fetch("/api/testimonials").then(r => r.json()).then(d => { if (Array.isArray(d)) setTestimonials(d); }).catch(() => { }); }, []);

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
        collapsed, setCollapsed, mobileNavOpen, setMobileNavOpen, searchOpen, setSearchOpen,
        hotel, setHotel, roomTypes, setRoomTypes, bookings, setBookings, customers, setCustomers,
        rooms, setRooms, mealPlans, setMealPlans, hkTasks, setHkTasks, maintenance, setMaintenance,
        pricingRules, setPricingRules, staff, setStaff, amenityCats, setAmenityCats,
        pricing, setPricing, availability, setAvailability, currency, setCurrency,
        nearbyPlaces, setNearbyPlaces, cmsPages, setCmsPages, galleryImages, setGalleryImages,
        testimonials, setTestimonials, runSeed, updateHotel,
        
        // CRUD Handlers
        addPage, updatePage, deletePage,
        addGalleryImage, updateGalleryImage, deleteGalleryImage, reorderGallery,
        addBooking, updateBooking, deleteBooking,
        addCustomer, updateCustomer, deleteCustomer,
        addRoomType, editRoomType, deleteRoomType,
        addRoom, updateRoom, deleteRoom, deleteFloor,
        updateHkTask,
        addMaintenance, updateMaintenance,
        addStaff, updateStaff, deleteStaff,
        addMealPlan, updateMealPlan, deleteMealPlan,
        addNearbyPlace, updateNearbyPlace, deleteNearbyPlace,
        addTestimonial, updateTestimonial, deleteTestimonial,
        handleCheckIn
    };

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) throw new Error("useAdmin must be used within an AdminProvider");
    return context;
}
