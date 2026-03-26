import { Metadata } from "next";
import UserFormClient from "../../components/UserFormClient";

export const metadata: Metadata = {
  title: "Edit User | Scantoz Admin",
  description: "Edit user in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditUserPage({ params }: Params) {
  const { id } = await params;
  return <UserFormClient mode="edit" id={id} />;
}
