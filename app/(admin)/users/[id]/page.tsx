import { Metadata } from "next";
import UserViewClient from "../components/UserViewClient";

export const metadata: Metadata = {
  title: "View User | Scantoz Admin",
  description: "View user details in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function ViewUserPage({ params }: Params) {
  const { id } = await params;
  return <UserViewClient id={id} />;
}
