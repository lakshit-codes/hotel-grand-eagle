import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const filename = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const uploadsDir = join(process.cwd(), "public", "uploads");

        await mkdir(uploadsDir, { recursive: true });
        await writeFile(join(uploadsDir, filename), buffer);

        return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
