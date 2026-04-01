import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
    try {
        const db = await getDatabase();
        const places = await db.collection("nearby").find().sort({ createdAt: 1 }).toArray();
        // Remove MongoDB _id from response
        return NextResponse.json(places.map(({ _id, ...rest }) => rest));
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
        const db = await getDatabase();
        const place = {
            id: `np_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            name: body.name.trim(),
            description: body.description?.trim() ?? "",
            distance: body.distance?.trim() ?? "",
            image: body.image?.trim() ?? "",
            createdAt: new Date().toISOString(),
        };
        await db.collection("nearby").insertOne(place);
        const { _id, ...saved } = place as typeof place & { _id?: unknown };
        return NextResponse.json({ success: true, place: saved });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        const db = await getDatabase();
        await db.collection("nearby").updateOne({ id }, { $set: { ...data, updatedAt: new Date().toISOString() } });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        const db = await getDatabase();
        await db.collection("nearby").deleteOne({ id });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
