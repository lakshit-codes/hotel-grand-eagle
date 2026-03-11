import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";


export async function GET() {

  const db = await getDatabase();

  const cats = await db
    .collection("amenity_categories")
    .find()
    .toArray();

  return NextResponse.json(cats);
}

export async function POST(req: Request) {

  const body = await req.json();
  const db = await getDatabase();

  await db.collection("amenity_categories").insertOne({
    _id: body._id,
    name: body.name
  });

  return NextResponse.json({ success: true });
}