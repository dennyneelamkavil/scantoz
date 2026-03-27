export interface Media {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  alt?: string;
  caption?: string;
}
