import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

export async function GET() {
  const db = await getDatabase();
  const availability = await db.collection("availability").find().toArray();

  return NextResponse.json(availability);
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = await getDatabase();

  const result = await db.collection("availability").insertOne(body);

  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const db = await getDatabase();

  await db.collection("availability").updateOne(
    { roomId: body.roomId },
    { $set: body },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}