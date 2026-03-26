import type { TempMediaFolder } from "@/lib/types";

export async function uploadMedia(file: File, folder: TempMediaFolder) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`/api/admin/media/upload?folder=${folder}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error ?? "Upload failed");
  }

  return res.json();
}
