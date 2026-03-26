import { Metadata } from "next";
import UserFormClient from "../components/UserFormClient";

export const metadata: Metadata = {
  title: "Create User | Scantoz Admin",
  description: "Create a new user in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateUserPage() {
  return <UserFormClient mode="create" />;
}
