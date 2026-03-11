import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
    const db = await getDatabase();
    const staff = await db.collection("staff").find().toArray();
    return NextResponse.json(staff);
}

export async function POST(req: Request) {
    const body = await req.json();
    const db = await getDatabase();
    const result = await db.collection("staff").insertOne(body);
    return NextResponse.json(result);
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { id, ...data } = body;
    const db = await getDatabase();
    await db.collection("staff").updateOne({ id }, { $set: data });
    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const db = await getDatabase();
    await db.collection("staff").deleteOne({ id });
    return NextResponse.json({ success: true });
}
