import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

/**
 * Amenities API — collection: "amenities"
 * Each document: { id, name, facilities: { id, name }[] }
 */

export async function GET() {
  try {
    const db = await getDatabase();
    const cats = await db.collection("amenities").find({}).toArray();
    const clean = cats.map(({ _id, ...rest }) => rest);
    return NextResponse.json(clean);
  } catch {
    return NextResponse.json({ error: "Failed to fetch amenities" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ error: "id and name required" }, { status: 400 });
    }
    const db = await getDatabase();
    const exists = await db.collection("amenities").findOne({ id: body.id });
    if (exists) return NextResponse.json({ error: "Category id already exists" }, { status: 409 });
    await db.collection("amenities").insertOne({ id: body.id, name: body.name, facilities: body.facilities ?? [] });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to create amenity category" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = await getDatabase();
    const result = await db.collection("amenities").updateOne({ id }, { $set: data });
    if (result.matchedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update amenity category" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = await getDatabase();
    const result = await db.collection("amenities").deleteOne({ id });
    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete amenity category" }, { status: 500 });
  }
}