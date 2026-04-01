import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
    const db = await getDatabase();
    const items = await db.collection("lost_found").find().sort({ foundDate: -1 }).toArray();
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    const body = await req.json();
    const db = await getDatabase();
    const result = await db.collection("lost_found").insertOne(body);
    return NextResponse.json(result);
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { id, ...data } = body;
    const db = await getDatabase();
    await db.collection("lost_found").updateOne({ id }, { $set: data });
    return NextResponse.json({ success: true });
}
