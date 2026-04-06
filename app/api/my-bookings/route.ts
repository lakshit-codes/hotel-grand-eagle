import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";
import { getSession } from "@/app/utils/auth";

export async function GET() {
    try {
        const session = await getSession();
        
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = session.user;
        const db = await getDatabase();

        // Build the query to find all bookings associated with the logged-in user
        const queryConditions = [];
        if (user.id) {
            queryConditions.push({ customerId: user.id });
        }
        if (user.email) {
            queryConditions.push({ guestEmail: user.email });
        }
        if (user.phone) {
            queryConditions.push({ guestPhone: user.phone });
        }

        if (queryConditions.length === 0) {
            // User somehow has no identifiers
            return NextResponse.json([]);
        }

        const raw = await db.collection("bookings")
            .find({ $or: queryConditions })
            .sort({ createdAt: -1 })
            .toArray();

        // Send back to client
        return NextResponse.json(raw);
    } catch (error: any) {
        console.error("My Bookings Error", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
