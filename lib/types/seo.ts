import type { Media } from "./media";

export interface Seo {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  noIndex?: boolean;
  ogImage?: Media;
}
