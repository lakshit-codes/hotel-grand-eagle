import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

/**
 * Individual Room Inventory API — collection: "rooms"
 * 
 * Manages physical rooms (room numbers like 101, 102, 201 etc.)
 * Each document:
 * {
 *   id: string,
 *   roomNumber: string,     // "101", "202"
 *   roomTypeId: string,     // ref to room_types collection
 *   roomTypeName: string,   // denormalized for display
 *   floor: number,
 *   status: "available" | "occupied" | "cleaning" | "maintenance" | "out-of-order" | "blocked",
 *   isActive: boolean,
 *   features: string[],     // "Corner Room", "Connecting Door", "Accessible"
 *   notes: string,
 *   lastCleaned: string,    // ISO date
 *   createdAt: string,
 * }
 *
 * Query params for GET:
 *   ?roomTypeId=   — filter by room type
 *   ?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&roomTypeId=  — additionally exclude rooms with
 *       overlapping active bookings (returns only bookable rooms for the date range)
 */

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const roomTypeId = searchParams.get("roomTypeId");
        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");

        const db = await getDatabase();

        // Base filter by roomTypeId if provided
        const filter: Record<string, unknown> = roomTypeId ? { roomTypeId } : {};
        const rooms = await db.collection("rooms").find(filter).sort({ floor: 1, roomNumber: 1 }).toArray();
        let clean = rooms.map(({ _id, ...rest }) => rest);

        // Date-range availability filtering: exclude rooms with overlapping active bookings
        if (checkIn && checkOut && roomTypeId) {
            const overlapping = await db.collection("bookings").find({
                roomTypeId,
                roomNumber: { $ne: null, $exists: true },
                status: { $nin: ["cancelled", "checked-out", "no-show"] },
                checkIn: { $lt: checkOut },
                checkOut: { $gt: checkIn },
            }).toArray();

            const occupiedRooms = new Set(overlapping.map((b) => String(b.roomNumber)));

            clean = clean.filter((r) => {
                const hasDateConflict = occupiedRooms.has(String(r.roomNumber));
                const isUnavailableStatus = r.status === "maintenance" || r.status === "out-of-order";
                return !hasDateConflict && !isUnavailableStatus;
            });
        }

        return NextResponse.json(clean);
    } catch {
        return NextResponse.json({ error: "Failed to fetch room inventory" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.roomNumber || !body.roomTypeId) {
            return NextResponse.json({ error: "roomNumber and roomTypeId are required" }, { status: 400 });
        }
        const db = await getDatabase();
        const exists = await db.collection("rooms").findOne({ roomNumber: body.roomNumber });
        if (exists) return NextResponse.json({ error: `Room ${body.roomNumber} already exists` }, { status: 409 });

        const doc = {
            id: body.id || `room_${body.roomNumber}`,
            roomNumber: body.roomNumber,
            roomTypeId: body.roomTypeId,
            roomTypeName: body.roomTypeName ?? "",
            floor: body.floor ?? Math.floor(parseInt(body.roomNumber) / 100),
            status: body.status ?? "available",
            isActive: body.isActive ?? true,
            features: body.features ?? [],
            notes: body.notes ?? "",
            lastCleaned: body.lastCleaned ?? new Date().toISOString().slice(0, 10),
            createdAt: new Date().toISOString(),
        };
        await db.collection("rooms").insertOne(doc);
        return NextResponse.json({ success: true, id: doc.id });
    } catch {
        return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        const db = await getDatabase();
        const result = await db.collection("rooms").updateOne({ id }, { $set: data });
        if (result.matchedCount === 0) return NextResponse.json({ error: "Room not found" }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const floor = searchParams.get("floor");

        const db = await getDatabase();

        if (id) {
            const result = await db.collection("rooms").deleteOne({ id });
            if (result.deletedCount === 0) return NextResponse.json({ error: "Room not found" }, { status: 404 });
            return NextResponse.json({ success: true });
        }

        if (floor) {
            const floorNum = parseInt(floor);
            const result = await db.collection("rooms").deleteMany({ floor: floorNum });
            return NextResponse.json({ success: true, deletedCount: result.deletedCount });
        }

        return NextResponse.json({ error: "id or floor required" }, { status: 400 });
    } catch {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
