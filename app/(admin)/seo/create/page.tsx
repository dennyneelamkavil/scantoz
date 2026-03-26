import { Metadata } from "next";
import SeoFormClient from "../components/SeoFormClient";

export const metadata: Metadata = {
  title: "Create Seo | Scantoz Admin",
  description: "Create a new seo in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateSeoPage() {
  return <SeoFormClient mode="create" />;
}
