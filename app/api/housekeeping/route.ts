import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
    const db = await getDatabase();
    const tasks = await db.collection("housekeeping").find().toArray();
    return NextResponse.json(tasks);
}

/** Create a housekeeping task — called when a new room is added */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const db = await getDatabase();
        // Avoid duplicate tasks for same room number
        const existing = await db.collection("housekeeping").findOne({ roomNumber: body.roomNumber });
        if (existing) return NextResponse.json({ success: true, skipped: true });
        const task = {
            id: `hk_${body.roomNumber}`,
            roomNumber: body.roomNumber,
            roomTypeId: body.roomTypeId ?? "",
            roomTypeName: body.roomTypeName ?? "",
            floor: body.floor ?? Math.floor(parseInt(body.roomNumber) / 100),
            status: "clean",
            assignedTo: "",
            priority: "low",
            notes: "",
            lastCleaned: new Date().toISOString().slice(0, 10),
            createdAt: new Date().toISOString(),
        };
        await db.collection("housekeeping").insertOne(task);
        return NextResponse.json({ success: true, task });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

/** Update a housekeeping task */
export async function PUT(req: Request) {
    const body = await req.json();
    const { id, ...data } = body;
    const db = await getDatabase();
    await db.collection("housekeeping").updateOne({ id }, { $set: { ...data, updatedAt: new Date().toISOString() } });
    return NextResponse.json({ success: true });
}

/** Delete housekeeping task — by roomNumber or floor */
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const roomNumber = searchParams.get("roomNumber");
        const floor = searchParams.get("floor");
        const db = await getDatabase();
        if (roomNumber) {
            await db.collection("housekeeping").deleteMany({ roomNumber });
            return NextResponse.json({ success: true });
        }
        if (floor) {
            const floorNum = parseInt(floor);
            await db.collection("housekeeping").deleteMany({ floor: floorNum });
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: "roomNumber or floor required" }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
