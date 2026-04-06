import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectTenantDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, address } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Username, email, and password are required" },
        { status: 400 },
      );
    }

    const db = await connectTenantDB();
    const userColl = db.collection("users");

    // Check if user already exists
    const existingUser = await userColl.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists with this email" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      username,
      name: username, // using username as name
      email,
      password: hashedPassword,
      address: address || "",
      role: "user", // default role for storefront users
      createdAt: new Date(),
    };

    const result = await userColl.insertOne(newUser as any);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error during registration" },
      { status: 500 },
    );
  }
}
