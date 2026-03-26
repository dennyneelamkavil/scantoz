import { Metadata } from "next";
import RoleFormClient from "../../components/RoleFormClient";

export const metadata: Metadata = {
  title: "Edit Role | Scantoz Admin",
  description: "Edit role in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditRolePage({ params }: Params) {
  const { id } = await params;
  return <RoleFormClient mode="edit" id={id} />;
}
