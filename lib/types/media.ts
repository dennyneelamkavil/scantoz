export interface Media {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  alt?: string;
  caption?: string;
}

export type TempMediaFolder =
  | "temp/categories"
  | "temp/subcategories"
  | "temp/products/covers"
  | "temp/products/images"
  | "temp/products/videos"
  | "temp/seo";

export type FinalMediaFolder =
  | "categories"
  | "subcategories"
  | "products/covers"
  | "products/images"
  | "products/videos"
  | "seo";

export type MediaFolder = TempMediaFolder | FinalMediaFolder;
