import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/rbac";
import { uploadToCloudinary } from "@/server/media/media.provider";
import { TempMediaFolder } from "@/lib/types";

/* ================= UPLOAD ================= */

export async function POST(req: Request) {
  await requirePermission([
    "category:create",
    "category:update",
    "subcategory:create",
    "subcategory:update",
    "product:create",
    "product:update",
  ]);

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") as TempMediaFolder | null;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  // Optional: file size limit (10MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 10MB)" },
      { status: 400 }
    );
  }

  // Convert File -> Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const media = await uploadToCloudinary(buffer, {
      folder: folder ?? undefined,
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("Media upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
