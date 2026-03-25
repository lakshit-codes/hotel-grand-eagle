import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

/** Returns true if the given room has any overlapping active booking, excluding `excludeId` */
async function hasRoomConflict(
    db: Awaited<ReturnType<typeof getDatabase>>,
    roomNumber: string,
    roomTypeId: string,
    checkIn: string,
    checkOut: string,
    excludeId?: string
): Promise<boolean> {
    const query: Record<string, unknown> = {
        roomNumber,
        roomTypeId,
        status: { $nin: ["cancelled", "checked-out", "no-show"] },
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
    };
    if (excludeId) query.id = { $ne: excludeId };
    const conflict = await db.collection("bookings").findOne(query);
    return !!conflict;
}

export async function GET() {
    const db = await getDatabase();
    const bookings = await db.collection("bookings").find().toArray();
    return NextResponse.json(bookings);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const db = await getDatabase();

        // Backend double-booking validation
        if (body.roomNumber && body.checkIn && body.checkOut && body.roomTypeId) {
            const conflict = await hasRoomConflict(
                db,
                body.roomNumber,
                body.roomTypeId,
                body.checkIn,
                body.checkOut
            );
            if (conflict) {
                return NextResponse.json(
                    { error: `Room ${body.roomNumber} is already booked for overlapping dates.` },
                    { status: 409 }
                );
            }
        }

        // Ensure currency is always INR
        const doc = { ...body, currency: "INR" };
        const result = await db.collection("bookings").insertOne(doc);

        // Sync room status if checking in immediately
        if (doc.roomNumber && doc.status === "checked-in") {
            await db.collection("rooms").updateOne(
                { roomNumber: doc.roomNumber },
                { $set: { status: "occupied" } }
            );
        }

        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

        const db = await getDatabase();
        const existing = await db.collection("bookings").findOne({ id });

        // Backend double-booking validation (exclude current booking from conflict check)
        if (data.roomNumber && data.checkIn && data.checkOut && data.roomTypeId) {
            const conflict = await hasRoomConflict(
                db,
                data.roomNumber,
                data.roomTypeId,
                data.checkIn,
                data.checkOut,
                id
            );
            if (conflict) {
                return NextResponse.json(
                    { error: `Room ${data.roomNumber} is already booked for overlapping dates.` },
                    { status: 409 }
                );
            }
        }

        // Always store INR
        const updateData = { ...data, currency: "INR" };
        await db.collection("bookings").updateOne({ id }, { $set: updateData });

        // Sync room status based on booking status
        if (updateData.roomNumber) {
            if (updateData.status === "checked-in") {
                await db.collection("rooms").updateOne(
                    { roomNumber: updateData.roomNumber },
                    { $set: { status: "occupied" } }
                );
            } else if (updateData.status === "checked-out") {
                await db.collection("rooms").updateOne(
                    { roomNumber: updateData.roomNumber },
                    { $set: { status: "cleaning" } }
                );
            } else if (updateData.status === "cancelled" || updateData.status === "no-show") {
                const room = await db.collection("rooms").findOne({ roomNumber: updateData.roomNumber });
                if (room && room.status === "occupied") {
                    await db.collection("rooms").updateOne(
                        { roomNumber: updateData.roomNumber },
                        { $set: { status: "available" } }
                    );
                }
            }
        } else if (existing?.roomNumber && (updateData.status === "cancelled" || updateData.status === "no-show")) {
            const room = await db.collection("rooms").findOne({ roomNumber: existing.roomNumber });
            if (room && room.status === "occupied") {
                await db.collection("rooms").updateOne(
                    { roomNumber: existing.roomNumber },
                    { $set: { status: "available" } }
                );
            }
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        const db = await getDatabase();
        await db.collection("bookings").deleteOne({ id });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
    }
}
