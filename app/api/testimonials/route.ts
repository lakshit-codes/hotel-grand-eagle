import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
    try {
        const db = await getDatabase();
        const data = await db.collection("testimonials").find().sort({ createdAt: -1 }).toArray();
        return NextResponse.json(data.map(({ _id, ...rest }) => rest));
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
        
        const db = await getDatabase();
        const testimonial = {
            id: `tst_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            name: body.name.trim(),
            location: body.location?.trim() ?? "",
            text: body.text?.trim() ?? "",
            rating: Number(body.rating) || 5,
            isActive: body.isActive ?? true,
            stayDate: body.stayDate ?? "",
            createdAt: new Date().toISOString(),
        };
        
        await db.collection("testimonials").insertOne(testimonial);
        const { _id, ...saved } = testimonial as any;
        return NextResponse.json({ success: true, testimonial: saved });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
        
        const db = await getDatabase();
        await db.collection("testimonials").updateOne(
            { id },
            { $set: { ...data, updatedAt: new Date().toISOString() } }
        );
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
        
        const db = await getDatabase();
        await db.collection("testimonials").deleteOne({ id });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
