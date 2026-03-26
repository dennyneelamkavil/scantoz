import { Metadata } from "next";
import SeoFormClient from "../../components/SeoFormClient";

export const metadata: Metadata = {
  title: "Edit Seo | Scantoz Admin",
  description: "Edit seo in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditSeoPage({ params }: Params) {
  const { id } = await params;
  return <SeoFormClient mode="edit" id={id} />;
}
