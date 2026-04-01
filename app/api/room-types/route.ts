import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

// GET all room types
export async function GET() {
  try {
    const db = await getDatabase();
    const rooms = await db.collection("room_types").find({}).toArray();
    // Strip MongoDB internal _id from results
    const clean = rooms.map(({ _id, ...rest }) => rest);
    return NextResponse.json(clean);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

// POST — create a new room type
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await getDatabase();
    await db.collection("room_types").insertOne(body);
    return NextResponse.json({ success: true, id: body.id });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}

// PUT — update existing room type by its string id field
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = await getDatabase();
    const result = await db.collection("room_types").updateOne(
      { id },
      { $set: data }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}

// DELETE — remove room by string id query param
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const db = await getDatabase();
    const result = await db.collection("room_types").deleteOne({ id });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}