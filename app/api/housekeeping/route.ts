import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
    const db = await getDatabase();
    const tasks = await db.collection("housekeeping").find().toArray();
    return NextResponse.json(tasks);
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { id, ...data } = body;
    const db = await getDatabase();
    await db.collection("housekeeping").updateOne({ id }, { $set: { ...data, updatedAt: new Date().toISOString() } });
    return NextResponse.json({ success: true });
}
