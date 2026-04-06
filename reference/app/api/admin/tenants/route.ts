import { NextResponse } from "next/server";
import { getTenantsCollection } from "@/models";
import { authenticateAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const Tenants = await getTenantsCollection();
    const tenants = await Tenants.find({}).toArray();
    return NextResponse.json(tenants);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
