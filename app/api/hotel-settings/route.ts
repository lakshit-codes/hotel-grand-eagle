import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

const DEFAULT_SETTINGS = {
    name: "HOTEL GRAND EAGLE",
    shortDescription: "Iconic 5-star urban retreat with panoramic city views.",
    address: "123 Eagle Avenue, Downtown District",
    city: "Metropolis",
    country: "United Arab Emirates",
    contactNumber: "+91 63678 50548",
    email: "reservations@hotelgrandeagle.com",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    starRating: 5,
    logoUrl: "/logo.png",
    gstNumber: "",
    website: "",
    bankDetails: "",
};

export async function GET() {
    try {
        const db = await getDatabase();
        const doc = await db.collection("hotel_settings").findOne({});
        if (!doc) return NextResponse.json(DEFAULT_SETTINGS);
        const { _id, ...rest } = doc;
        return NextResponse.json(rest);
    } catch {
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const db = await getDatabase();
        await db.collection("hotel_settings").updateOne(
            {},
            { $set: { ...body, updatedAt: new Date().toISOString() } },
            { upsert: true }
        );
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
