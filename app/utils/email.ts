import nodemailer from "nodemailer";

/**
 * Mailer utility for Hotel Grand Eagle.
 * Uses SMTP settings from environment variables.
 */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendAdminBookingNotification(booking: any) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER;
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER;

  // Verify core configuration
  const requiredEnv = [
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD'
  ];
  
  const missing = requiredEnv.filter(k => !process.env[k]);
  
  if (missing.length > 0) {
    console.warn(`[EmailService] Missing required configuration: ${missing.join(', ')}. Skipping notification.`);
    return;
  }

  if (!adminEmail) {
    console.warn("[EmailService] No ADMIN_EMAIL or EMAIL_SERVER_USER configured. Skipping notification.");
    return;
  }

  const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #D4A857; margin: 0; font-size: 24px;">New Booking Received</h1>
        <p style="color: #666; font-size: 14px;">Hotel Grand Eagle – Administration Alert</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin-bottom: 25px;">
        <h2 style="font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-top: 0; color: #D4A857;">Booking Summary</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #777; width: 150px;">Reference:</td>
            <td style="padding: 8px 0; font-weight: bold;">${booking.bookingRef}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Guest Name:</td>
            <td style="padding: 8px 0;">${booking.guestName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Contact:</td>
            <td style="padding: 8px 0;">${booking.guestPhone} / ${booking.guestEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Dates:</td>
            <td style="padding: 8px 0;">${checkInDate} to <br/>${checkOutDate} (${booking.nights} nights)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #777;">Room:</td>
            <td style="padding: 8px 0;">${booking.roomTypeName} ${booking.roomNumber ? `(Room ${booking.roomNumber})` : ""}</td>
          </tr>
          <tr>
            <td style="padding: 20px 0 8px; color: #777; font-size: 16px;">Total Amount:</td>
            <td style="padding: 20px 0 8px; font-size: 20px; font-weight: bold; color: #D4A857;">₹${booking.grandTotal?.toLocaleString()}</td>
          </tr>
        </table>
      </div>

      ${booking.specialRequests ? `
      <div style="margin-bottom: 25px;">
        <p style="color: #777; font-size: 13px; margin-bottom: 5px;">Special Requests:</p>
        <p style="padding: 10px; background: #fff8eb; border-left: 3px solid #D4A857; font-style: italic; font-size: 14px; margin: 0;">"${booking.specialRequests}"</p>
      </div>
      ` : ""}

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">This is an automated notification from your property management system.</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      subject: `New Booking: ${booking.guestName} (${booking.bookingRef})`,
      html: htmlContent,
      text: `New booking received from ${booking.guestName}. Ref: ${booking.bookingRef}. Check-in: ${booking.checkIn}, Check-out: ${booking.checkOut}, Room: ${booking.roomTypeName}, Total: ₹${booking.grandTotal}.`,
    });
    console.log(`[EmailService] Notification sent for booking ${booking.bookingRef}`);
  } catch (error: any) {
    console.error(`[EmailService] Failed to send notification for ${booking.bookingRef}:`);
    console.error("Error details:", error?.message || error);
    if (error?.code) console.error("Error code:", error.code);
    if (error?.command) console.error("SMTP Command:", error.command);
    // We don't throw the error, allowing the caller (API route) to stay successful
  }
}
