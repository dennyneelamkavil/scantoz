import type { Seo } from "./seo";

export interface PageSeo {
  id: string;
  pageKey: string;
  seo: Seo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
