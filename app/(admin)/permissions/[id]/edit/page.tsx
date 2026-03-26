import { Metadata } from "next";
import PermissionFormClient from "../../components/PermissionFormClient";

export const metadata: Metadata = {
  title: "Edit Permission | Scantoz Admin",
  description: "Edit permission in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditPermissionPage({ params }: Params) {
  const { id } = await params;
  return <PermissionFormClient mode="edit" id={id} />;
}
