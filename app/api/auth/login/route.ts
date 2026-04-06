import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";
import bcrypt from "bcryptjs";
import { login } from "@/app/utils/auth";

export async function POST(req: Request) {
  try {
    const { emailOrPhone, password } = await req.json();

    if (!emailOrPhone || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getDatabase();
    
    // Find user by either email or phone
    const user = await db.collection("users").findOne({
      $or: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Prepare User object without password
    const sessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || "user"
    };

    await login(sessionUser);

    return NextResponse.json({ message: "Success", user: sessionUser }, { status: 200 });
  } catch (error: any) {
    console.error("Login Default Error", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
