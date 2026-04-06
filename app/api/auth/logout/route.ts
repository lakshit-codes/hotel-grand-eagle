import { NextResponse } from "next/server";
import { logout } from "@/app/utils/auth";

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
