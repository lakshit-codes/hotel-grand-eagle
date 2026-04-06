import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}
