import { Metadata } from "next";
import RoleViewClient from "../components/RoleViewClient";

export const metadata: Metadata = {
  title: "View Role | Scantoz Admin",
  description: "View role details in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewRolePage({ params }: Params) {
  const { id } = await params;
  return <RoleViewClient id={id} />;
}
