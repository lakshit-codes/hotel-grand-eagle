import { NextResponse } from "next/server";
import { getDatabase } from "@/app/utils/getDatabase";

/**
 * One-time migration endpoint — GET /api/migrate
 * 
 * Normalizes all currency fields across:
 *   - bookings       → currency: "INR"
 *   - room_types     → currency: "INR"
 *   - rooms          → (no currency field, skipped)
 *   - pricing        → currency: "INR"  (if collection exists)
 * 
 * Safe to run multiple times (idempotent).
 */
export async function GET() {
    try {
        const db = await getDatabase();
        const results: Record<string, number> = {};

        // 1. Migrate bookings
        const bookingsResult = await db.collection("bookings").updateMany(
            { currency: { $ne: "INR" } },
            { $set: { currency: "INR" } }
        );
        results.bookings_updated = bookingsResult.modifiedCount;

        // 2. Also ensure bookings with no currency field get INR
        const bookingsMissingCurrency = await db.collection("bookings").updateMany(
            { currency: { $exists: false } },
            { $set: { currency: "INR" } }
        );
        results.bookings_missing_currency_fixed = bookingsMissingCurrency.modifiedCount;

        // 3. Migrate room_types (collection may be named "room_types" or "rooms" for types)
        const roomTypesResult = await db.collection("room_types").updateMany(
            { $or: [{ currency: { $ne: "INR" } }, { currency: { $exists: false } }] },
            { $set: { currency: "INR" } }
        );
        results.room_types_updated = roomTypesResult.modifiedCount;

        // 4. Migrate pricing collection if it exists
        try {
            const pricingResult = await db.collection("pricing").updateMany(
                { $or: [{ currency: { $ne: "INR" } }, { currency: { $exists: false } }] },
                { $set: { currency: "INR" } }
            );
            results.pricing_updated = pricingResult.modifiedCount;
        } catch {
            results.pricing_updated = 0; // collection may not exist
        }

        const totalUpdated = Object.values(results).reduce((s, v) => s + v, 0);

        return NextResponse.json({
            success: true,
            message: totalUpdated > 0
                ? `Migration complete. ${totalUpdated} records standardized to INR.`
                : "All records already use INR. No changes needed.",
            details: results,
        });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
