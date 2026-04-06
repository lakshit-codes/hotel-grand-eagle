import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";
import bcrypt from "bcryptjs";
import { login } from "@/app/utils/auth";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || (!email && !phone) || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDatabase();
    
    // Check if user exists
    const query = [];
    if (email) query.push({ email });
    if (phone) query.push({ phone });
    
    const existingUser = await db.collection("users").findOne({ $or: query });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with that email or phone" }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    const sessionUser = {
      id: result.insertedId.toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role
    };

    await login(sessionUser);

    return NextResponse.json({ message: "Success", user: sessionUser }, { status: 201 });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Server Error: " + error.message }, { status: 500 });
  }
}
