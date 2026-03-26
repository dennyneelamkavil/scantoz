import { Metadata } from "next";
import SeoViewClient from "../components/SeoViewClient";

export const metadata: Metadata = {
  title: "View Seo | Scantoz Admin",
  description: "View seo details in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewSeoPage({ params }: Params) {
  const { id } = await params;
  return <SeoViewClient id={id} />;
}
