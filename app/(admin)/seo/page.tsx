import { Metadata } from "next";
import SeoListClient from "./components/SeoListClient";

export const metadata: Metadata = {
  title: "Seo | Scantoz Admin",
  description: "Manage seo in the Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SeoPage() {
  return <SeoListClient />;
}
