import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
    try {
        const db = await getDatabase();
        const images = await db.collection("gallery").find().sort({ order: 1, createdAt: -1 }).toArray();
        return NextResponse.json(images);
    } catch (error) {
        console.error("GET /api/gallery error:", error);
        return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const db = await getDatabase();

        if (!body.url) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        const count = await db.collection("gallery").countDocuments();
        const newImage = {
            id: body.id || `gal_${Date.now()}`,
            url: body.url,
            label: body.label || "",
            order: body.order ?? count,
            createdAt: new Date().toISOString()
        };

        await db.collection("gallery").insertOne(newImage);
        return NextResponse.json(newImage, { status: 201 });
    } catch (error) {
        console.error("POST /api/gallery error:", error);
        return NextResponse.json({ error: "Failed to add image" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const db = await getDatabase();
        const { id, ...updateData } = body;
        delete updateData._id;
        await db.collection("gallery").updateOne({ id }, { $set: updateData });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PUT /api/gallery error:", error);
        return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
        const db = await getDatabase();
        await db.collection("gallery").deleteOne({ id });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/gallery error:", error);
        return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
    }
}
