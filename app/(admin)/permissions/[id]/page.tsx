import { Metadata } from "next";
import PermissionViewClient from "../components/PermissionViewClient";

export const metadata: Metadata = {
  title: "View Permission | Scantoz Admin",
  description: "View permission details in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewPermissionPage({ params }: Params) {
  const { id } = await params;
  return <PermissionViewClient id={id} />;
}
