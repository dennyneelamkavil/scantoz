export interface Media {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  bytes: number;
  alt?: string;
  caption?: string;
}
