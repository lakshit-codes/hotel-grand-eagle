import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await getDatabase();
        const page = await db.collection("pages").findOne({ id });

        if (!page) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, page });
    } catch (error) {
        console.error("GET /api/pages/[id] error:", error);
        return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const db = await getDatabase();

        // Check slug uniqueness if slug is being changed
        if (body.slug) {
            const existing = await db.collection("pages").findOne({ slug: body.slug, id: { $ne: id } });
            if (existing) {
                return NextResponse.json({ error: "A page with this slug already exists" }, { status: 409 });
            }
        }

        const updateData = { ...body, updatedAt: new Date().toISOString() };
        delete updateData._id; // Don't attempt to update MongoDB internal _id

        await db.collection("pages").updateOne({ id }, { $set: updateData });

        return NextResponse.json({ success: true, updated: updateData });
    } catch (error) {
        console.error("PUT /api/pages/[id] error:", error);
        return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await getDatabase();

        const result = await db.collection("pages").deleteOne({ id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/pages/[id] error:", error);
        return NextResponse.json({ error: "Failed to delete page" }, { status: 500 });
    }
}
