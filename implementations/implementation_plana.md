# Improving Rooms & Bookings Logic

This implementation plan focuses on making room assignment robust, syncing room availability, and improving the calendar layout.

## User Review Required
No breaking changes. The main updates enforce logical consistency between Bookings and Room statuses.

## Proposed Changes

### Sync Room Statuses with Bookings
We will modify the backend and frontend to sync `rooms` automatically when a `booking` changes.

#### [MODIFY] app/api/bookings/route.ts
- [POST](file:///c:/Users/Laksh/hotel-admin/app/api/bookings/route.ts#10-16): If a booking is created with `status="checked-in"`, update the corresponding `room`'s status to `occupied`.
- [PUT](file:///c:/Users/Laksh/hotel-admin/app/api/bookings/route.ts#17-24): When a booking is updated:
  - If `checked-in`, set room to `occupied`.
  - If `checked-out`, set room to `cleaning`.
  - If `cancelled`/`no-show` (and room was occupied by it), set room back to `available`.

#### [MODIFY] app/page.tsx
- Add a client-side state sync or trigger `fetch("/api/rooms")` again after [addBooking](file:///c:/Users/Laksh/hotel-admin/app/page.tsx#647-649) and [updateBooking](file:///c:/Users/Laksh/hotel-admin/app/page.tsx#649-650) to ensure [RoomsPage](file:///c:/Users/Laksh/hotel-admin/app/components/Rooms.tsx#185-325) (and all components using `rooms`) displays the refreshed status immediately.

### Dynamic Room Filtering in Bookings Form
#### [MODIFY] app/components/Bookings.tsx
- **Booking Modal**: The [RoomPicker](file:///c:/Users/Laksh/hotel-admin/app/components/Bookings.tsx#88-139) needs to guarantee that all non-conflicting rooms appear correctly, but conflicting rooms are hidden.
- If the selected date overlaps with ANY valid booking in [isRoomConflict](file:///c:/Users/Laksh/hotel-admin/app/components/Bookings.tsx#44-54), that room is skipped.
- Explicitly add filtering logic that disables or hides rooms that have `{ status: "maintenance" }` or `"out-of-order"` inside `visibleRooms`.

### Bookings Calendar UI Improvements
#### [MODIFY] app/components/Bookings.tsx
- **Calendar Layout**:
  - Show empty available grid blocks.
  - Render check-in and check-out days more clearly (e.g., using visual boundaries).
  - Add text "Check-in" / "Check-out" directly on the left/right boundaries of the booking bars to highlight them visually.
  - Distinguish strictly Occupied (Checked-in) vs Upcoming (Confirmed) vs Available dates.
- Keep room assignment buttons logical, rejecting overlap.

## Verification Plan

### Automated Tests
None applicable out of the box, as this is a Next.js frontend with mocked/simple API routes.

### Manual Verification
1. Open the app > Bookings.
2. Click **New Booking**. Set check-in to today, check-out to tomorrow.
3. Observe the **Room Assignment** buttons.
4. Book a room, set status to `checked-in`. Save.
5. Navigate to **Rooms** page. Ensure that the room's status is now `Occupied`.
6. Return to Bookings. Change the booking to `checked-out`.
7. Navigate to **Rooms** page. Ensure that the room's status is now `Cleaning`.
8. Review the Calendar UI. Ensure bookings visually indicate Check-in and Check-out edges.
