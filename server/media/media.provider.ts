import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { FinalMediaFolder, Media, TempMediaFolder } from "@/lib/types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const BASE_FOLDER = "scantoz";

export async function uploadToCloudinary(
  file: Buffer,
  options?: {
    folder?: TempMediaFolder;
    publicId?: string;
  }
) {
  const folder = options?.folder
    ? `${BASE_FOLDER}/${options.folder}`
    : BASE_FOLDER;

  return new Promise<Media>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          public_id: options?.publicId,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type as "image" | "video",
          });
        }
      )
      .end(file);
  });
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}

export async function moveMediaToFinalFolder(
  media: Media,
  targetFolder: FinalMediaFolder
): Promise<Media> {
  // Upload again using the existing URL
  const uploaded = await cloudinary.uploader.upload(media.url, {
    folder: `${BASE_FOLDER}/${targetFolder}`,
    resource_type: media.resourceType,
  });

  // Delete temp asset
  await deleteFromCloudinary(media.publicId, media.resourceType);

  return {
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    resourceType: uploaded.resource_type as "image" | "video",
    alt: media.alt,
    caption: media.caption,
  };
}

export async function finalizeMediaArray(
  media: Media[] | undefined,
  targetFolder: FinalMediaFolder
): Promise<Media[]> {
  if (!media?.length) return [];

  return Promise.all(
    media.map((m) =>
      m.publicId.includes("/temp/")
        ? moveMediaToFinalFolder(m, targetFolder)
        : m
    )
  );
}

export async function cleanupOldTempMedia(options?: {
  olderThanHours?: number;
}) {
  const olderThanHours = options?.olderThanHours ?? 24;

  const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);

  // List temp assets
  const result = await cloudinary.search
    .expression(`folder:${BASE_FOLDER}/temp/*`)
    .sort_by("created_at", "asc")
    .max_results(100)
    .execute();

  for (const asset of result.resources) {
    if (new Date(asset.created_at) < cutoff) {
      await cloudinary.uploader.destroy(asset.public_id, {
        resource_type: asset.resource_type,
      });
    }
  }
}
