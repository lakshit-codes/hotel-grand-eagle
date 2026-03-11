import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
    const db = await getDatabase();
    const items = await db.collection("maintenance").find().toArray();
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    const body = await req.json();
    const db = await getDatabase();
    const result = await db.collection("maintenance").insertOne(body);
    return NextResponse.json(result);
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { id, ...data } = body;
    const db = await getDatabase();
    await db.collection("maintenance").updateOne({ id }, { $set: data });
    return NextResponse.json({ success: true });
}
