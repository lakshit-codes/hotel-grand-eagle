import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { connectTenantDB } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files: any[] = formData.getAll("files") as any[];
    const name: string[] = formData.getAll("name") as string[];
    const altText: string[] = formData.getAll("altText") as string[];
    const foldername: string[] = formData.getAll("foldername") as string[];

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let array: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const singleFile = files[i];
      const singleName = name[i];
      const singleAltText = altText[i] || "ALT TEXT NOT ADDED";
      const singleFoldername = foldername[i] || "Uncategorized";

      const filename: string = singleName
        ? singleName
        : `media-${Date.now()}-${singleFile.name}`;

      const renamedFile = new File([singleFile], filename, {
        type: singleFile.type,
      });

      const buffer: Buffer = Buffer.from(await renamedFile.arrayBuffer());

      await fs.promises.writeFile(path.join(uploadDir, filename), buffer);

      array.push({
        filename: filename,
        alt: singleAltText,
        foldername: singleFoldername,
        url: `/uploads/${filename}`,
        size: buffer.length,
        type: "image",
        createdAt: new Date(),
      });
    }

    if (array.length > 0) {
      const db = await connectTenantDB();
      const mediaColl = await db.collection("media");
      const insertResult = await mediaColl.insertMany(array);
      array = array.map((item: any, index: number) => {
        item._id = insertResult.insertedIds[index];
        return item;
      });
    }

    return NextResponse.json({ success: true, data: array });
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Failed to upload media" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const db = await connectTenantDB();
    const mediaColl = await db.collection("media");
    const media = await mediaColl.find().toArray();
    const groupby = media.reduce((acc: any, item: any) => {
      const foldername = item.foldername;
      if (!acc[foldername]) {
        acc[foldername] = [];
      }
      acc[foldername].push(item);
      return acc;
    }, {});
    return NextResponse.json({ success: true, data: media });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const db = await connectTenantDB();
    const mediaColl = await db.collection("media");
    const deleteResult = await mediaColl.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, data: deleteResult });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 },
    );
  }
}
