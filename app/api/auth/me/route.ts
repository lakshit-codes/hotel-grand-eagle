import { NextResponse } from "next/server";
import { getSession } from "@/app/utils/auth";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: session.user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
