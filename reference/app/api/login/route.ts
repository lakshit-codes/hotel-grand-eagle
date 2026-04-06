import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { connectTenantDB } from "@/lib/db";
import { ObjectId } from "mongodb";

const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function GET(req: NextRequest) {
  try {
    const db = await connectTenantDB();

    // 1. Get token from cookie
    let token = req.cookies.get("auth_token")?.value;

    // 2. If not in cookie, check Authorization header
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // 3. If still no token → Unauthorized
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 4. Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const userColl = db.collection("users");
    const users = await userColl
      .find({
        _id: new ObjectId(decoded.id),
      })
      .toArray();

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const db = await connectTenantDB();
    const userColl = await db.collection("users");
    let user = await userColl.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt
      .compare(password, user.password)
      .catch((err) => {
        console.error("Bcrypt error:", err);
        return false;
      });

    if (!isValid && password !== user.password) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const { password: userPassword, ...userWithoutPassword } = user;

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role || "admin",
        isTenantOwner: user.isTenantOwner,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Set HTTP-only cookie
    const cookieString = serialize("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    const response = NextResponse.json({
      success: true,
      user: { ...userWithoutPassword, _id: user._id.toString() },
    });

    response.headers.set("Set-Cookie", cookieString);
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    response.headers.set(
      "Set-Cookie",
      serialize("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      }),
    );
    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}
