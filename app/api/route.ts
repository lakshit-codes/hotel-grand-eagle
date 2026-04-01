import { NextResponse } from "next/server";
import { getDatabase } from "../utils/getDatabase";

export async function GET() {
  try {

    const db = await getDatabase();

    // simple ping query
    const result = await db.command({ ping: 1 });

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      data: result
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: String(error),
      },
      { status: 500 }
    );

  }
}