import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";
import { sendAdminBookingNotification } from "@/app/utils/email";

/** Returns true if the given room has any overlapping active booking, excluding `excludeId` */
async function hasRoomConflict(
    db: Awaited<ReturnType<typeof getDatabase>>,
    roomNumber: string,
    roomTypeId: string,
    checkIn: string,
    checkOut: string,
    excludeId?: string
): Promise<boolean> {
    const query: Record<string, unknown> = {
        roomNumber,
        roomTypeId,
        status: { $nin: ["cancelled", "checked-out", "no-show"] },
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
    };
    if (excludeId) query.id = { $ne: excludeId };
    const conflict = await db.collection("bookings").findOne(query);
    return !!conflict;
}

export async function GET() {
    const db = await getDatabase();
    const raw = await db.collection("bookings").find().toArray();
    // Normalise every document on the way out so legacy/website bookings
    // don't crash the admin panel even if stored before this fix.
    const bookings = raw.map(({ _id, ...doc }) => normalizeBooking(doc as Record<string, unknown>));
    return NextResponse.json(bookings);
}


/** Normalise any booking document so it fully matches the admin Booking interface.
 *  Handles field-name mismatches from the website form (email/phone vs guestEmail/guestPhone)
 *  and provides safe defaults for every field. */
function normalizeBooking(body: Record<string, unknown>): Record<string, unknown> {
    // Resolve guest name
    const guestName = (body.guestName as string | undefined)?.trim()
        || `${body.firstName ?? ""} ${body.lastName ?? ""}`.trim()
        || "Guest";

    // Resolve email / phone (website sends plain 'email' and 'phone')
    const guestEmail = (body.guestEmail ?? body.email ?? "") as string;
    const guestPhone = (body.guestPhone ?? body.phone ?? "") as string;

    // Resolve totals  (website sends totalAmount; admin uses grandTotal)
    const totalRoomCost = Number(body.totalRoomCost ?? body.roomCost ?? 0);
    const totalMealCost = Number(body.totalMealCost ?? body.mealCost ?? 0);
    const grandTotal = Number(body.grandTotal ?? body.totalAmount ?? body.total ?? totalRoomCost + totalMealCost);

    // Nights
    const nights = Number(body.nights ?? (() => {
        if (body.checkIn && body.checkOut) {
            const d1 = new Date(body.checkIn as string);
            const d2 = new Date(body.checkOut as string);
            return Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
        }
        return 1;
    })());

    return {
        // IDs
        id: body.id ?? `bk_${Date.now()}`,
        bookingRef: body.bookingRef ?? `BK${Math.floor(Date.now() / 1000).toString().slice(-6)}`,
        customerId: body.customerId ?? "",

        // Guest
        guestName,
        guestEmail,
        guestPhone,

        // Room
        roomTypeId: body.roomTypeId ?? "",
        roomTypeName: body.roomTypeName ?? "",
        roomNumber: body.roomNumber ?? null,

        // Dates
        checkIn: body.checkIn ?? "",
        checkOut: body.checkOut ?? "",
        nights,

        // People
        adults: Number(body.adults ?? body.guests ?? 1),
        children: Number(body.children ?? 0),
        coGuests: Array.isArray(body.coGuests) ? body.coGuests : [],

        // Meal plan
        mealPlanId: body.mealPlanId ?? "",
        mealPlanCode: body.mealPlanCode ?? "RO",

        // Financials
        totalRoomCost,
        totalMealCost,
        grandTotal,
        currency: "INR",

        // Status & source
        status: (body.status as string) ?? "confirmed",
        bookingSource: (body.bookingSource ?? body.source ?? "Direct") as string,

        // Misc
        specialRequests: (body.specialRequests ?? "") as string,
        earlyCheckIn: Boolean(body.earlyCheckIn ?? false),
        lateCheckOut: Boolean(body.lateCheckOut ?? false),
        earlyCheckInTime: (body.earlyCheckInTime ?? "") as string,
        lateCheckOutTime: (body.lateCheckOutTime ?? "") as string,
        checkInActual: body.checkInActual ?? null,
        checkOutActual: body.checkOutActual ?? null,
        primaryAadharNo: (body.primaryAadharNo ?? "") as string,
        primaryAadharFileUrl: (body.primaryAadharFileUrl ?? "") as string,
        createdAt: (body.createdAt as string | undefined) ?? new Date().toISOString(),
    };
}

export async function POST(req: Request) {
    try {
        const raw = await req.json();
        const body = normalizeBooking(raw);
        const db = await getDatabase();

        // Backend double-booking validation
        if (body.roomNumber && body.checkIn && body.checkOut && body.roomTypeId) {
            const conflict = await hasRoomConflict(
                db,
                body.roomNumber as string,
                body.roomTypeId as string,
                body.checkIn as string,
                body.checkOut as string
            );
            if (conflict) {
                return NextResponse.json(
                    { error: `Room ${body.roomNumber} is already booked for overlapping dates.` },
                    { status: 409 }
                );
            }
        }

        const result = await db.collection("bookings").insertOne(body);

        // Notify Admin (Await for reliability)
        await sendAdminBookingNotification(body);

        // Sync room status if checking in immediately
        if (body.roomNumber && body.status === "checked-in") {
            await db.collection("rooms").updateOne(
                { roomNumber: body.roomNumber },
                { $set: { status: "occupied" } }
            );
        }

        return NextResponse.json(result);
    } catch (err) {
        console.error("[POST /api/bookings]", err);
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}


export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

        const db = await getDatabase();
        const existing = await db.collection("bookings").findOne({ id });

        // Backend double-booking validation (exclude current booking from conflict check)
        if (data.roomNumber && data.checkIn && data.checkOut && data.roomTypeId) {
            const conflict = await hasRoomConflict(
                db,
                data.roomNumber,
                data.roomTypeId,
                data.checkIn,
                data.checkOut,
                id
            );
            if (conflict) {
                return NextResponse.json(
                    { error: `Room ${data.roomNumber} is already booked for overlapping dates.` },
                    { status: 409 }
                );
            }
        }

        // Always store INR
        const updateData = { ...data, currency: "INR" };
        await db.collection("bookings").updateOne({ id }, { $set: updateData });

        // Sync room status based on booking status
        if (updateData.roomNumber) {
            if (updateData.status === "checked-in") {
                await db.collection("rooms").updateOne(
                    { roomNumber: updateData.roomNumber },
                    { $set: { status: "occupied" } }
                );
            } else if (updateData.status === "checked-out") {
                await db.collection("rooms").updateOne(
                    { roomNumber: updateData.roomNumber },
                    { $set: { status: "cleaning" } }
                );
            } else if (updateData.status === "cancelled" || updateData.status === "no-show") {
                const room = await db.collection("rooms").findOne({ roomNumber: updateData.roomNumber });
                if (room && room.status === "occupied") {
                    await db.collection("rooms").updateOne(
                        { roomNumber: updateData.roomNumber },
                        { $set: { status: "available" } }
                    );
                }
            }
        } else if (existing?.roomNumber && (updateData.status === "cancelled" || updateData.status === "no-show")) {
            const room = await db.collection("rooms").findOne({ roomNumber: existing.roomNumber });
            if (room && room.status === "occupied") {
                await db.collection("rooms").updateOne(
                    { roomNumber: existing.roomNumber },
                    { $set: { status: "available" } }
                );
            }
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
        
        const db = await getDatabase();
        
        // Before deleting, check if we need to free up a room
        const booking = await db.collection("bookings").findOne({ id });
        if (booking && booking.status === "checked-in" && booking.roomNumber) {
            await db.collection("rooms").updateOne(
                { roomNumber: booking.roomNumber },
                { $set: { status: "available" } }
            );
        }

        await db.collection("bookings").deleteOne({ id });
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[DELETE /api/bookings]", err);
        return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
    }
}
