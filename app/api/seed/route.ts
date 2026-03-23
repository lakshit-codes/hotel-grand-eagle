import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

const uid = () => Math.random().toString(36).slice(2, 9);
const bref = () => "BK" + Math.floor(100000 + Math.random() * 900000);

function addDays(base: Date, days: number): string {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

const NOW = new Date("2026-03-09");

const CUSTOMERS = [
    { id: uid(), firstName: "Aryan", lastName: "Sharma", email: "aryan.sharma@gmail.com", phone: "+91 98765 43210", nationality: "Indian", aadharNo: "Z1234567", dob: "1988-04-12", loyaltyTier: "Gold", vip: true, preferredRoom: "Royal Suite", dietaryPref: "Veg", address: "42, Lodhi Estate, New Delhi", company: "TechCorp India", notes: "Prefers high floor, pillow menu" },
    { id: uid(), firstName: "Priya", lastName: "Menon", email: "priya.menon@gmail.com", phone: "+91 99887 76655", nationality: "Indian", aadharNo: "L9876543", dob: "1993-07-21", loyaltyTier: "Silver", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Veg", address: "Koramangala, Bangalore", company: "", notes: "Quiet room please" },
    { id: uid(), firstName: "Riya", lastName: "Kapoor", email: "riya.kapoor@yahoo.com", phone: "+91 97654 32109", nationality: "Indian", aadharNo: "K2233445", dob: "1995-11-03", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Non-Veg", address: "Bandra, Mumbai", company: "", notes: "" },
    { id: uid(), firstName: "Ahmed", lastName: "Al-Rashid", email: "ahmed.rashid@outlook.com", phone: "+971 50 234 5678", nationality: "Emirati", aadharNo: "E9988776", dob: "1980-01-15", loyaltyTier: "Platinum", vip: true, preferredRoom: "Royal Suite", dietaryPref: "Halal", address: "Dubai Hills, Dubai", company: "Al-Rashid Corp", notes: "VIP guest, complimentary upgrade always" },
    { id: uid(), firstName: "Sophia", lastName: "Mueller", email: "sophia.mueller@web.de", phone: "+49 176 9876543", nationality: "German", aadharNo: "D44556677", dob: "1991-06-30", loyaltyTier: "Silver", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Vegan", address: "Berlin, Germany", company: "", notes: "Vegan meals required" },
    { id: uid(), firstName: "James", lastName: "Anderson", email: "james.anderson@gmail.com", phone: "+1 415 987 6543", nationality: "American", aadharNo: "A11223344", dob: "1975-09-08", loyaltyTier: "Gold", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Non-Veg", address: "San Francisco, CA", company: "Anderson LLC", notes: "" },
    { id: uid(), firstName: "Liu", lastName: "Wei", email: "liu.wei@163.com", phone: "+86 138 0013 8000", nationality: "Chinese", aadharNo: "C55667788", dob: "1990-03-22", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Non-Veg", address: "Shanghai, China", company: "", notes: "" },
    { id: uid(), firstName: "Fatima", lastName: "Khan", email: "fatima.khan@gmail.com", phone: "+92 300 123 4567", nationality: "Pakistani", aadharNo: "P88990011", dob: "1985-05-17", loyaltyTier: "Silver", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Halal", address: "Karachi, Pakistan", company: "Khan Textiles", notes: "Early check-in preferred" },
    { id: uid(), firstName: "Carlos", lastName: "Mendez", email: "carlos.mendez@gmail.com", phone: "+34 612 345 678", nationality: "Spanish", aadharNo: "S22334455", dob: "1983-12-01", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Non-Veg", address: "Madrid, Spain", company: "", notes: "" },
    { id: uid(), firstName: "Yuki", lastName: "Tanaka", email: "yuki.tanaka@yahoo.co.jp", phone: "+81 90 1234 5678", nationality: "Japanese", aadharNo: "J33445566", dob: "1997-02-14", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Non-Veg", address: "Tokyo, Japan", company: "", notes: "" },
    { id: uid(), firstName: "Omar", lastName: "Farooq", email: "omar.farooq@gmail.com", phone: "+966 55 987 6543", nationality: "Saudi", aadharNo: "S77889900", dob: "1979-08-25", loyaltyTier: "Gold", vip: true, preferredRoom: "Royal Suite", dietaryPref: "Halal", address: "Riyadh, KSA", company: "Farooq Group", notes: "Requires Halal room service" },
    { id: uid(), firstName: "Emma", lastName: "Williams", email: "emma.w@gmail.com", phone: "+44 7911 123456", nationality: "British", aadharNo: "G99001122", dob: "1992-04-05", loyaltyTier: "Silver", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Non-Veg", address: "London, UK", company: "Williams PR", notes: "" },
    { id: uid(), firstName: "Raj", lastName: "Patel", email: "raj.patel@hotmail.com", phone: "+91 96321 45678", nationality: "Indian", aadharNo: "Z4455667", dob: "1987-10-19", loyaltyTier: "Gold", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Jain", address: "Ahmedabad, Gujarat", company: "Patel Industries", "notes": "Jain food only, no root veg" },
    { id: uid(), firstName: "Maria", lastName: "Santos", email: "maria.santos@uol.com.br", phone: "+55 21 99876 5432", nationality: "Brazilian", aadharNo: "B11223366", dob: "1994-07-11", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Non-Veg", address: "Rio de Janeiro, Brazil", company: "", notes: "" },
    { id: uid(), firstName: "Hassan", lastName: "Abdalla", email: "hassan.a@outlook.com", phone: "+249 912 345 678", nationality: "Sudanese", aadharNo: "S44556699", dob: "1982-03-30", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Halal", address: "Khartoum, Sudan", company: "", notes: "" },
    { id: uid(), firstName: "Nina", lastName: "Ivanova", email: "nina.ivanova@mail.ru", phone: "+7 916 123 45 67", nationality: "Russian", aadharNo: "R22334477", dob: "1989-09-17", loyaltyTier: "Silver", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Non-Veg", address: "Moscow, Russia", company: "Ivanova Imports", "notes": "" },
    { id: uid(), firstName: "Amit", lastName: "Verma", email: "amit.verma@gmail.com", phone: "+91 94567 89012", nationality: "Indian", aadharNo: "Z6677889", dob: "1986-06-23", loyaltyTier: "Silver", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Veg", address: "Gurgaon, Haryana", company: "Verma Tech", notes: "Frequent business traveler" },
    { id: uid(), firstName: "Layla", lastName: "Hassan", email: "layla.hassan@gmail.com", phone: "+971 55 123 4567", nationality: "Emirati", aadharNo: "E5566778", dob: "1996-01-08", loyaltyTier: "Gold", vip: true, preferredRoom: "Royal Suite", dietaryPref: "Halal", address: "Abu Dhabi, UAE", company: "", notes: "Honeymoon arrangement needed" },
    { id: uid(), firstName: "Peter", lastName: "Hoffmann", email: "peter.hoffmann@gmx.de", phone: "+49 173 4567 890", nationality: "German", aadharNo: "D33445588", dob: "1978-11-12", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Non-Veg", address: "Munich, Germany", company: "Hoffmann GmbH", notes: "" },
    { id: uid(), firstName: "Deepa", lastName: "Nair", email: "deepa.nair@gmail.com", phone: "+91 98765 12345", nationality: "Indian", aadharNo: "L1122334", dob: "1991-08-29", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Non-Veg", address: "Thiruvananthapuram, Kerala", company: "", notes: "" },
    { id: uid(), firstName: "Marcus", lastName: "Johnson", email: "mjohnson@gmail.com", phone: "+1 212 555 0198", nationality: "American", aadharNo: "A55667788", dob: "1972-02-28", loyaltyTier: "Gold", vip: false, preferredRoom: "Royal Suite", dietaryPref: "Non-Veg", address: "New York, NY", company: "Johnson VC", notes: "" },
    { id: uid(), firstName: "Zara", lastName: "Sheikh", email: "zara.sheikh@icloud.com", phone: "+92 321 765 4321", nationality: "Pakistani", aadharNo: "P33445566", dob: "1998-04-20", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Halal", address: "Lahore, Pakistan", company: "", notes: "" },
    { id: uid(), firstName: "Luca", lastName: "Ferrari", email: "luca.ferrari@gmail.com", phone: "+39 347 123 4567", nationality: "Italian", aadharNo: "I66778899", dob: "1984-07-14", loyaltyTier: "Silver", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Non-Veg", address: "Milan, Italy", company: "Ferrari Design", notes: "" },
    { id: uid(), firstName: "Noor", lastName: "Khalid", email: "noor.khalid@gmail.com", phone: "+974 5551 2345", nationality: "Qatari", aadharNo: "Q11223355", dob: "1993-10-31", loyaltyTier: "Platinum", vip: true, preferredRoom: "Royal Suite", dietaryPref: "Halal", address: "Doha, Qatar", company: "Khalid Investments", "notes": "Corporate VIP, priority service" },
    { id: uid(), firstName: "Sunita", lastName: "Rao", email: "sunita.rao@yahoo.co.in", phone: "+91 91234 56789", nationality: "Indian", aadharNo: "Z8899001", dob: "1990-12-15", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Veg", address: "Hyderabad, Telangana", company: "", notes: "" },
    { id: uid(), firstName: "Klaus", lastName: "Weber", email: "k.weber@t-online.de", phone: "+49 160 9876 543", nationality: "German", aadharNo: "D55667700", dob: "1969-05-07", loyaltyTier: "Silver", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Non-Veg", address: "Hamburg, Germany", company: "Weber AG", notes: "" },
    { id: uid(), firstName: "Aisha", lastName: "Ibrahim", email: "aisha.ibrahim@gmail.com", phone: "+234 805 123 4567", nationality: "Nigerian", aadharNo: "N88990022", dob: "1995-03-18", loyaltyTier: "Bronze", vip: false, preferredRoom: "Twin Standard", dietaryPref: "Halal", address: "Lagos, Nigeria", company: "", notes: "" },
    { id: uid(), firstName: "Rohan", lastName: "Gupta", email: "rohan.gupta@rediffmail.com", phone: "+91 97890 12345", nationality: "Indian", aadharNo: "Z3344556", dob: "1988-09-02", loyaltyTier: "Gold", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Veg", address: "Pune, Maharashtra", company: "Gupta Pharma", notes: "Allergic to feather pillows" },
    { id: uid(), firstName: "Sarah", lastName: "Connor", email: "sarah.c@gmail.com", phone: "+1 310 555 0105", nationality: "American", aadharNo: "A33667799", dob: "1982-06-10", loyaltyTier: "Silver", vip: false, preferredRoom: "Deluxe King Room", dietaryPref: "Non-Veg", address: "Los Angeles, CA", company: "", notes: "" },
    { id: uid(), firstName: "Tariq", lastName: "Al-Mansouri", email: "tariq.m@outlook.com", phone: "+971 54 321 9876", nationality: "Emirati", aadharNo: "E7788001", dob: "1976-04-25", loyaltyTier: "Platinum", vip: true, preferredRoom: "Royal Suite", dietaryPref: "Halal", address: "Sharjah, UAE", company: "Mansouri Holdings", "notes": "Regularly books entire floor" },
];

// Full room type documents — shape matches the Room TypeScript type
const ROOMS = [
    {
        id: "rm1",
        roomName: "Deluxe King Room",
        slug: "deluxe-king-room",
        roomCategory: "Deluxe",
        bedType: "King",
        maxOccupancy: 2,
        roomSize: 42,
        view: "City View",
        smokingPolicy: "Non-Smoking",
        balconyAvailable: true,
        roomTheme: "Modern",
        soundproofingLevel: "Premium",
        inRoomWorkspace: true,
        entertainmentOptions: "Smart TV + Sound System",
        bathroomType: "Rain Shower + Tub",
        floorPreference: "Upper Floor",
        basePrice: 450,
        extraBedPrice: 80,
        refundable: true,
        currency: "USD",
        amenityIds: ["fb7", "fr6", "fr7", "fr10", "fs4"],
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
        ],
        roomNumbers: ["101", "102", "103", "104", "105", "201", "202", "203"],
    },
    {
        id: "rm2",
        roomName: "Royal Suite",
        slug: "royal-suite",
        roomCategory: "Suite",
        bedType: "Super King",
        maxOccupancy: 3,
        roomSize: 120,
        view: "Panoramic",
        smokingPolicy: "Non-Smoking",
        balconyAvailable: true,
        roomTheme: "Art Deco",
        soundproofingLevel: "Maximum",
        inRoomWorkspace: true,
        entertainmentOptions: "Home Theatre",
        bathroomType: "Spa Bathroom",
        floorPreference: "Top Floor",
        basePrice: 1800,
        extraBedPrice: 0,
        refundable: true,
        currency: "USD",
        amenityIds: ["fw3", "fr2", "fr3", "fr5", "fr9", "fb7", "fs4"],
        images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        ],
        roomNumbers: ["501", "502", "503"],
    },
    {
        id: "rm3",
        roomName: "Twin Standard",
        slug: "twin-standard",
        roomCategory: "Standard",
        bedType: "Twin",
        maxOccupancy: 2,
        roomSize: 28,
        view: "Garden View",
        smokingPolicy: "Non-Smoking",
        balconyAvailable: false,
        roomTheme: "Classic",
        soundproofingLevel: "Standard",
        inRoomWorkspace: false,
        entertainmentOptions: "Smart TV",
        bathroomType: "Walk-in Shower",
        floorPreference: "Lower Floor",
        basePrice: 220,
        extraBedPrice: 50,
        refundable: false,
        currency: "USD",
        amenityIds: ["fb7", "fr10"],
        images: [
            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
        ],
        roomNumbers: ["301", "302", "303", "304", "305", "306", "307", "308", "309", "310"],
    },
];

// Keep a simple version for booking generation
const ROOM_TYPES = ROOMS.map(r => ({ id: r.id, name: r.roomName, basePrice: r.basePrice, rooms: r.roomNumbers }));

const MEAL_PLANS = [
    { id: "mp_ep", code: "EP", name: "European Plan", description: "Room only, no meals included", pricePerPersonPerNight: 0 },
    { id: "mp_cp", code: "CP", name: "Continental Plan", description: "Room + complimentary breakfast", pricePerPersonPerNight: 25 },
    { id: "mp_map", code: "MAP", name: "Modified American Plan", description: "Room + breakfast + dinner", pricePerPersonPerNight: 65 },
    { id: "mp_ap", code: "AP", name: "Full American Plan", description: "Room + all meals (3x per day)", pricePerPersonPerNight: 110 },
];

const BOOKING_SOURCES = ["Direct", "Booking.com", "Expedia", "Agoda", "Walk-in", "Phone", "Corporate"];
const BOOKING_STATUSES = ["confirmed", "checked-in", "checked-out", "cancelled", "no-show", "pending"];
const SPECIAL_REQUESTS = [
    "Late check-out requested", "Early check-in requested", "Airport transfer needed",
    "High floor room", "baby cot required", "Extra towels", "Non-smoking room",
    "Romantic setup for anniversary", "Birthday cake arrangement", "Connecting rooms",
    "", "", "", "", "", // more blanks so most bookings have no special request
];

export async function GET() {
    try {
        const db = await getDatabase();

        // Clear existing data
        await db.collection("customers").deleteMany({});
        await db.collection("bookings").deleteMany({});
        await db.collection("meal_plans").deleteMany({});
        await db.collection("pricing_rules").deleteMany({});
        await db.collection("housekeeping").deleteMany({});
        await db.collection("maintenance").deleteMany({});
        await db.collection("room_types").deleteMany({});
        await db.collection("rooms").deleteMany({});
        await db.collection("amenities").deleteMany({});

        // Insert room types
        await db.collection("room_types").insertMany(ROOMS);

        // Insert amenity categories (with facilities embedded)
        await db.collection("amenities").insertMany([
            {
                id: "cat_basic", name: "Basic Facilities", facilities: [
                    { id: "fb1", name: "Room Service" }, { id: "fb2", name: "Refrigerator" },
                    { id: "fb3", name: "Power Backup" }, { id: "fb4", name: "Elevator / Lift" },
                    { id: "fb5", name: "Housekeeping" }, { id: "fb6", name: "Air Conditioning" },
                    { id: "fb7", name: "Wi-Fi (Free)" }, { id: "fb8", name: "Express Check-out" },
                ]
            },
            {
                id: "cat_room", name: "Room Amenities", facilities: [
                    { id: "fr1", name: "Hairdryer" }, { id: "fr2", name: "Jacuzzi" },
                    { id: "fr3", name: "Bathtub" }, { id: "fr4", name: "Sofa" },
                    { id: "fr5", name: "Minibar" }, { id: "fr6", name: "Work Desk" },
                    { id: "fr7", name: "Coffee Machine" }, { id: "fr8", name: "Iron / Ironing Board" },
                    { id: "fr9", name: "Mineral Water" }, { id: "fr10", name: "Toiletries" },
                ]
            },
            {
                id: "cat_wellness", name: "Health & Wellness", facilities: [
                    { id: "fw1", name: "Gym" }, { id: "fw2", name: "Swimming Pool" },
                    { id: "fw3", name: "Spa" }, { id: "fw4", name: "Steam & Sauna" },
                    { id: "fw5", name: "Yoga Room" },
                ]
            },
            {
                id: "cat_biz", name: "Business", facilities: [
                    { id: "fbz1", name: "Business Centre" }, { id: "fbz2", name: "Conference Room" },
                    { id: "fbz3", name: "Printer" }, { id: "fbz4", name: "Banquet Hall" },
                ]
            },
            {
                id: "cat_security", name: "Safety & Security", facilities: [
                    { id: "fs1", name: "CCTV" }, { id: "fs2", name: "Security Guard" },
                    { id: "fs3", name: "Fire Extinguishers" }, { id: "fs4", name: "Safe Deposit Box" },
                ]
            },
            {
                id: "cat_food", name: "Food & Beverage", facilities: [
                    { id: "ff1", name: "Restaurant (On-site)" }, { id: "ff2", name: "Bar & Lounge" },
                    { id: "ff3", name: "24h Room Dining" }, { id: "ff4", name: "Rooftop Dining" },
                    { id: "ff5", name: "Poolside Snacks" },
                ]
            },
            {
                id: "cat_transport", name: "Transport & Parking", facilities: [
                    { id: "ft1", name: "Airport Transfer" }, { id: "ft2", name: "Valet Parking" },
                    { id: "ft3", name: "Electric Car Charging" }, { id: "ft4", name: "Bicycle Rental" },
                ]
            },
        ]);

        // Insert individual room inventory
        await db.collection("rooms").deleteMany({});
        const STATUSES = ["available", "available", "available", "available", "cleaning", "maintenance", "occupied"] as const;
        const randomStatus = () => STATUSES[Math.floor(Math.random() * STATUSES.length)];
        const DELUXE_FEATURES = ["Corner Room", "Connecting Door", "Accessible", "City View Premium", "Extra Quiet"];
        const SUITE_FEATURES = ["Butler Service", "Private Terrace", "Panoramic View", "Connecting Door", "Extra King Bed"];
        const TWIN_FEATURES = ["Accessible", "Garden View", "Connecting Door", "Ground Floor", "Extra Quiet"];
        await db.collection("rooms").insertMany([
            // Deluxe King Rooms — Floor 1
            ...["101", "102", "103", "104", "105"].map((n, i) => ({
                id: `room_${n}`, roomNumber: n, roomTypeId: "rm1", roomTypeName: "Deluxe King Room",
                floor: 1, status: randomStatus(), isActive: true,
                features: i % 3 === 0 ? [DELUXE_FEATURES[i % DELUXE_FEATURES.length]] : [],
                notes: "", lastCleaned: addDays(NOW, -(i % 3)), createdAt: new Date().toISOString(),
            })),
            // Deluxe King Rooms — Floor 2
            ...["201", "202", "203"].map((n, i) => ({
                id: `room_${n}`, roomNumber: n, roomTypeId: "rm1", roomTypeName: "Deluxe King Room",
                floor: 2, status: randomStatus(), isActive: true,
                features: i === 1 ? ["Corner Room", "City View Premium"] : [],
                notes: "", lastCleaned: addDays(NOW, -(i % 2)), createdAt: new Date().toISOString(),
            })),
            // Twin Standard Rooms — Floor 3
            ...["301", "302", "303", "304", "305"].map((n, i) => ({
                id: `room_${n}`, roomNumber: n, roomTypeId: "rm3", roomTypeName: "Twin Standard",
                floor: 3, status: randomStatus(), isActive: true,
                features: i % 2 === 0 ? [TWIN_FEATURES[i % TWIN_FEATURES.length]] : [],
                notes: "", lastCleaned: addDays(NOW, -(i % 3)), createdAt: new Date().toISOString(),
            })),
            // Twin Standard Rooms — Floor 4
            ...["306", "307", "308", "309", "310"].map((n, i) => ({
                id: `room_${n}`, roomNumber: n, roomTypeId: "rm3", roomTypeName: "Twin Standard",
                floor: 4, status: randomStatus(), isActive: true,
                features: n === "310" ? ["Accessible"] : [],
                notes: "", lastCleaned: addDays(NOW, -(i % 2)), createdAt: new Date().toISOString(),
            })),
            // Royal Suites — Floor 5
            ...["501", "502", "503"].map((n, i) => ({
                id: `room_${n}`, roomNumber: n, roomTypeId: "rm2", roomTypeName: "Royal Suite",
                floor: 5, status: i === 0 ? "occupied" : randomStatus(), isActive: true,
                features: [SUITE_FEATURES[i], SUITE_FEATURES[(i + 1) % SUITE_FEATURES.length]],
                notes: n === "501" ? "VIP suite — dedicated butler" : "",
                lastCleaned: addDays(NOW, -1), createdAt: new Date().toISOString(),
            })),
        ]);

        // Insert customers

        await db.collection("customers").insertMany(CUSTOMERS);

        // Insert meal plans
        await db.collection("meal_plans").insertMany(MEAL_PLANS);

        // Generate bookings
        const bookings: object[] = [];
        let bookingIndex = 0;

        const custLen = CUSTOMERS.length;
        const rtLen = ROOM_TYPES.length;

        // Past bookings (90 days ago to yesterday) — checked-out
        for (let i = 0; i < 50; i++) {
            const customer = CUSTOMERS[bookingIndex % custLen];
            const rt = ROOM_TYPES[Math.floor(Math.random() * rtLen)];
            const checkInOffset = -(Math.floor(Math.random() * 85) + 5);
            const nights = Math.floor(Math.random() * 5) + 1;
            const checkIn = addDays(NOW, checkInOffset);
            const checkOut = addDays(new Date(checkIn), nights);
            const adults = Math.floor(Math.random() * 2) + 1;
            const children = Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : 0;
            const mealPlan = MEAL_PLANS[Math.floor(Math.random() * MEAL_PLANS.length)];
            const roomNo = rt.rooms[Math.floor(Math.random() * rt.rooms.length)];
            const totalMealCost = mealPlan.pricePerPersonPerNight * (adults + children) * nights;
            const totalRoomCost = rt.basePrice * nights;

            bookings.push({
                id: uid(),
                bookingRef: bref(),
                customerId: customer.id,
                guestName: `${customer.firstName} ${customer.lastName}`,
                guestEmail: customer.email,
                guestPhone: customer.phone,
                roomTypeId: rt.id,
                roomTypeName: rt.name,
                roomNumber: roomNo,
                checkIn,
                checkOut,
                nights,
                adults,
                children,
                mealPlanId: mealPlan.id,
                mealPlanCode: mealPlan.code,
                totalRoomCost,
                totalMealCost,
                grandTotal: totalRoomCost + totalMealCost,
                currency: "USD",
                status: checkOut < addDays(NOW, 0) ? "checked-out" : "confirmed",
                bookingSource: BOOKING_SOURCES[Math.floor(Math.random() * BOOKING_SOURCES.length)],
                specialRequests: SPECIAL_REQUESTS[Math.floor(Math.random() * SPECIAL_REQUESTS.length)],
                checkInActual: checkIn + "T14:00:00",
                checkOutActual: checkOut + "T11:30:00",
                createdAt: addDays(new Date(checkIn), -Math.floor(Math.random() * 30)),
            });
            bookingIndex++;
        }

        // Current bookings (today)
        for (let i = 0; i < 8; i++) {
            const customer = CUSTOMERS[(bookingIndex + i) % custLen];
            const rt = ROOM_TYPES[Math.floor(Math.random() * rtLen)];
            const nights = Math.floor(Math.random() * 4) + 1;
            const checkIn = addDays(NOW, -i);
            const checkOut = addDays(new Date(checkIn), nights);
            const adults = Math.floor(Math.random() * 2) + 1;
            const children = Math.random() > 0.8 ? 1 : 0;
            const mealPlan = MEAL_PLANS[Math.floor(Math.random() * MEAL_PLANS.length)];
            const roomNo = rt.rooms[Math.floor(Math.random() * rt.rooms.length)];
            const totalMealCost = mealPlan.pricePerPersonPerNight * (adults + children) * nights;
            const totalRoomCost = rt.basePrice * nights;

            bookings.push({
                id: uid(),
                bookingRef: bref(),
                customerId: customer.id,
                guestName: `${customer.firstName} ${customer.lastName}`,
                guestEmail: customer.email,
                guestPhone: customer.phone,
                roomTypeId: rt.id,
                roomTypeName: rt.name,
                roomNumber: roomNo,
                checkIn,
                checkOut,
                nights,
                adults,
                children,
                mealPlanId: mealPlan.id,
                mealPlanCode: mealPlan.code,
                totalRoomCost,
                totalMealCost,
                grandTotal: totalRoomCost + totalMealCost,
                currency: "USD",
                status: "checked-in",
                bookingSource: BOOKING_SOURCES[Math.floor(Math.random() * BOOKING_SOURCES.length)],
                specialRequests: SPECIAL_REQUESTS[Math.floor(Math.random() * SPECIAL_REQUESTS.length)],
                checkInActual: checkIn + "T14:30:00",
                checkOutActual: null,
                createdAt: addDays(NOW, -Math.floor(Math.random() * 14) - 1),
            });
        }

        // Future bookings (next 30 days)
        for (let i = 0; i < 20; i++) {
            const customer = CUSTOMERS[(bookingIndex + i) % custLen];
            const rt = ROOM_TYPES[Math.floor(Math.random() * rtLen)];
            const checkInOffset = Math.floor(Math.random() * 28) + 1;
            const nights = Math.floor(Math.random() * 5) + 1;
            const checkIn = addDays(NOW, checkInOffset);
            const checkOut = addDays(new Date(checkIn), nights);
            const adults = Math.floor(Math.random() * 2) + 1;
            const children = Math.random() > 0.7 ? 1 : 0;
            const mealPlan = MEAL_PLANS[Math.floor(Math.random() * MEAL_PLANS.length)];
            const totalMealCost = mealPlan.pricePerPersonPerNight * (adults + children) * nights;
            const totalRoomCost = rt.basePrice * nights;

            bookings.push({
                id: uid(),
                bookingRef: bref(),
                customerId: customer.id,
                guestName: `${customer.firstName} ${customer.lastName}`,
                guestEmail: customer.email,
                guestPhone: customer.phone,
                roomTypeId: rt.id,
                roomTypeName: rt.name,
                roomNumber: null,
                checkIn,
                checkOut,
                nights,
                adults,
                children,
                mealPlanId: mealPlan.id,
                mealPlanCode: mealPlan.code,
                totalRoomCost,
                totalMealCost,
                grandTotal: totalRoomCost + totalMealCost,
                currency: "USD",
                status: "confirmed",
                bookingSource: BOOKING_SOURCES[Math.floor(Math.random() * BOOKING_SOURCES.length)],
                specialRequests: SPECIAL_REQUESTS[Math.floor(Math.random() * SPECIAL_REQUESTS.length)],
                checkInActual: null,
                checkOutActual: null,
                createdAt: addDays(NOW, -Math.floor(Math.random() * 10)),
            });
        }

        await db.collection("bookings").insertMany(bookings);

        // Housekeeping tasks for every room
        const hkTasks: object[] = [];
        const HK_STATUSES = ["clean", "dirty", "inspected", "dnd", "out-of-order"];
        const HK_PRIORITY = ["low", "medium", "high"];
        ROOM_TYPES.forEach(rt => {
            rt.rooms.forEach(roomNo => {
                const status = HK_STATUSES[Math.floor(Math.random() * HK_STATUSES.length)];
                hkTasks.push({
                    id: uid(), roomTypeId: rt.id, roomNumber: roomNo,
                    status, priority: HK_PRIORITY[Math.floor(Math.random() * HK_PRIORITY.length)],
                    assignedTo: ["Maria Lopez", "David Chen", "Sundaram K", "Pradeep R", "Arun M"][Math.floor(Math.random() * 5)],
                    lastCleaned: addDays(NOW, -Math.floor(Math.random() * 2)),
                    notes: status === "dnd" ? "Guest requested DND until 2pm" : status === "out-of-order" ? "Bathroom tap repair pending" : "",
                    updatedAt: new Date().toISOString(),
                });
            });
        });
        await db.collection("housekeeping").insertMany(hkTasks);

        // Maintenance requests
        const MAINT_ISSUES = [
            "AC not cooling properly", "Hot water not available", "TV remote missing",
            "Door lock malfunction", "Leaking tap in bathroom", "Window not closing",
            "Elevator button stuck on floor 3", "Pool pump noise",
            "Corridor light flickering", "Lobby carpet stain",
        ];
        const MAINT_STATUSES = ["open", "in-progress", "resolved", "deferred"];
        const maintenanceTasks: object[] = [];
        for (let i = 0; i < 15; i++) {
            const rt = ROOM_TYPES[Math.floor(Math.random() * rtLen)];
            const roomNo = rt.rooms[Math.floor(Math.random() * rt.rooms.length)];
            maintenanceTasks.push({
                id: uid(),
                roomNumber: roomNo,
                roomTypeId: rt.id,
                issue: MAINT_ISSUES[i % MAINT_ISSUES.length],
                priority: HK_PRIORITY[Math.floor(Math.random() * 3)],
                status: MAINT_STATUSES[Math.floor(Math.random() * MAINT_STATUSES.length)],
                reportedBy: ["Front Desk", "Housekeeping", "Guest", "Manager"][Math.floor(Math.random() * 4)],
                assignedTo: ["Raju Singh", "Mehboob Khan", "Thomas V", "Anand R"][Math.floor(Math.random() * 4)],
                reportedAt: addDays(NOW, -Math.floor(Math.random() * 10)),
                resolvedAt: Math.random() > 0.5 ? addDays(NOW, -Math.floor(Math.random() * 5)) : null,
                notes: "",
            });
        }
        await db.collection("maintenance").insertMany(maintenanceTasks);

        // Pricing rules per room
        const pricingRules: object[] = [];
        ROOM_TYPES.forEach(rt => {
            pricingRules.push(
                { id: uid(), roomTypeId: rt.id, type: "last_minute", enabled: true, label: "Last-Minute Discount", threshold: 3, unit: "days", discount: 15 },
                { id: uid(), roomTypeId: rt.id, type: "early_bird", enabled: true, label: "Early Bird Discount", threshold: 30, unit: "days", discount: 10 },
                { id: uid(), roomTypeId: rt.id, type: "long_stay", enabled: true, label: "Long Stay Discount", threshold: 7, unit: "nights", discount: 12 },
                { id: uid(), roomTypeId: rt.id, type: "weekend_surge", enabled: false, label: "Weekend Surge Pricing", threshold: 0, unit: "days", discount: -20 },
            );
        });
        await db.collection("pricing_rules").insertMany(pricingRules);

        // Staff members
        const STAFF = [
            { id: uid(), employeeId: "EMP-001", firstName: "Rajesh", lastName: "Kumar", role: "Front Desk", department: "Operations", shift: "Morning (6AM–2PM)", phone: "+971 55 111 2222", email: "rajesh.k@hotelgrandeagle.com", emergencyContact: "+971 50 999 8888", joinDate: "2022-03-15", status: "Active", notes: "Senior receptionist, handles VIP arrivals", todayAttendance: "present" },
            { id: uid(), employeeId: "EMP-002", firstName: "Meera", lastName: "Pillai", role: "Front Desk", department: "Operations", shift: "Afternoon (2PM–10PM)", phone: "+971 55 222 3333", email: "meera.p@hotelgrandeagle.com", emergencyContact: "+91 98765 43210", joinDate: "2023-06-01", status: "Active", notes: "", todayAttendance: "present" },
            { id: uid(), employeeId: "EMP-003", firstName: "David", lastName: "Chen", role: "Housekeeping", department: "Rooms Division", shift: "Morning (6AM–2PM)", phone: "+971 55 333 4444", email: "david.c@hotelgrandeagle.com", emergencyContact: "+86 138 0000 0001", joinDate: "2021-10-20", status: "Active", notes: "Floor 5 specialist", todayAttendance: "present" },
            { id: uid(), employeeId: "EMP-004", firstName: "Maria", lastName: "Lopez", role: "Housekeeping", department: "Rooms Division", shift: "Morning (6AM–2PM)", phone: "+971 55 444 5555", email: "maria.l@hotelgrandeagle.com", emergencyContact: "+34 612 000 001", joinDate: "2020-08-12", status: "Active", notes: "", todayAttendance: "absent" },
            { id: uid(), employeeId: "EMP-005", firstName: "Arun", lastName: "Menon", role: "Maintenance", department: "Engineering", shift: "Morning (6AM–2PM)", phone: "+971 55 555 6666", email: "arun.m@hotelgrandeagle.com", emergencyContact: "+91 99887 76655", joinDate: "2022-01-05", status: "Active", notes: "Electrical & plumbing specialist", todayAttendance: "present" },
            { id: uid(), employeeId: "EMP-006", firstName: "Thomas", lastName: "Varghese", role: "Maintenance", department: "Engineering", shift: "Afternoon (2PM–10PM)", phone: "+971 55 666 7777", email: "thomas.v@hotelgrandeagle.com", emergencyContact: "+91 97654 32109", joinDate: "2023-02-28", status: "Active", notes: "HVAC specialist", todayAttendance: "present" },
            { id: uid(), employeeId: "EMP-007", firstName: "Khalid", lastName: "Al-Shamsi", role: "Security", department: "Security", shift: "Night (10PM–6AM)", phone: "+971 55 777 8888", email: "khalid.s@hotelgrandeagle.com", emergencyContact: "+971 50 777 0000", joinDate: "2019-05-15", status: "Active", notes: "Senior security officer", todayAttendance: "not-marked" },
            { id: uid(), employeeId: "EMP-008", firstName: "Sunita", lastName: "Sharma", role: "F&B", department: "Food & Beverage", shift: "Morning (6AM–2PM)", phone: "+971 55 888 9999", email: "sunita.s@hotelgrandeagle.com", emergencyContact: "+91 91234 56789", joinDate: "2024-01-15", status: "Active", notes: "Restaurant supervisor", todayAttendance: "present" },
            { id: uid(), employeeId: "EMP-009", firstName: "Ahmed", lastName: "Nasser", role: "Concierge", department: "Operations", shift: "General (9AM–6PM)", phone: "+971 55 999 0000", email: "ahmed.n@hotelgrandeagle.com", emergencyContact: "+971 54 888 0000", joinDate: "2021-07-01", status: "Active", notes: "Multilingual: Arabic, English, French", todayAttendance: "present" },
            { id: uid(), employeeId: "EMP-010", firstName: "Sarah", lastName: "Mitchell", role: "Management", department: "General Management", shift: "General (9AM–6PM)", phone: "+971 55 100 2000", email: "sarah.m@hotelgrandeagle.com", emergencyContact: "+44 7900 000001", joinDate: "2018-11-01", status: "Active", notes: "General Manager", todayAttendance: "present" },
            { id: uid(), employeeId: "EMP-011", firstName: "Pradeep", lastName: "Ramanathan", role: "Housekeeping", department: "Rooms Division", shift: "Afternoon (2PM–10PM)", phone: "+971 55 111 3333", email: "pradeep.r@hotelgrandeagle.com", emergencyContact: "+91 94567 89012", joinDate: "2023-08-10", status: "Active", notes: "", todayAttendance: "late" },
            { id: uid(), employeeId: "EMP-012", firstName: "Nadia", lastName: "Yousuf", role: "Front Desk", department: "Operations", shift: "Night (10PM–6AM)", phone: "+971 55 222 4444", email: "nadia.y@hotelgrandeagle.com", emergencyContact: "+249 912 000 001", joinDate: "2024-04-01", status: "Active", notes: "Night audit duties", todayAttendance: "not-marked" },
        ];
        await db.collection("staff").deleteMany({});
        await db.collection("staff").insertMany(STAFF);

        return NextResponse.json({
            success: true,
            message: "Database seeded successfully",
            counts: {
                customers: CUSTOMERS.length,
                bookings: bookings.length,
                mealPlans: MEAL_PLANS.length,
                housekeepingTasks: hkTasks.length,
                maintenanceTasks: maintenanceTasks.length,
                pricingRules: pricingRules.length,
                staff: STAFF.length,
            }
        });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
