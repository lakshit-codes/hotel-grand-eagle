import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
  const db = await getDatabase();
  const bookings = await db.collection("bookings").find().toArray();
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await getDatabase();
  const result = await db.collection("bookings").insertOne(body);

  // Sync room status if checking in immediately or assigning early
  if (body.roomNumber && body.status === "checked-in") {
    await db.collection("rooms").updateOne(
      { roomNumber: body.roomNumber },
      { $set: { status: "occupied" } }
    );
  }

  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...data } = body;
  const db = await getDatabase();
  
  const existing = await db.collection("bookings").findOne({ id });
  await db.collection("bookings").updateOne({ id }, { $set: data });

  // Sync room status based on booking status
  if (data.roomNumber) {
    if (data.status === "checked-in") {
      await db.collection("rooms").updateOne({ roomNumber: data.roomNumber }, { $set: { status: "occupied" } });
    } else if (data.status === "checked-out") {
      await db.collection("rooms").updateOne({ roomNumber: data.roomNumber }, { $set: { status: "cleaning" } });
    } else if (data.status === "cancelled" || data.status === "no-show") {
      // Only free mapping if it wasn't already assigned physically to someone else in the meantime
      const room = await db.collection("rooms").findOne({ roomNumber: data.roomNumber });
      if (room && room.status === "occupied") {
        await db.collection("rooms").updateOne({ roomNumber: data.roomNumber }, { $set: { status: "available" } });
      }
    }
  } else if (existing && existing.roomNumber && (data.status === "cancelled" || data.status === "no-show")) {
    // If they unset the room but cancelled, we should still free the old room if it was occupied
    const room = await db.collection("rooms").findOne({ roomNumber: existing.roomNumber });
    if (room && room.status === "occupied") {
      await db.collection("rooms").updateOne({ roomNumber: existing.roomNumber }, { $set: { status: "available" } });
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const db = await getDatabase();
  await db.collection("bookings").deleteOne({ id });
  return NextResponse.json({ success: true });
}