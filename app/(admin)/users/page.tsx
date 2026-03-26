import { Metadata } from "next";
import UsersListClient from "./components/UsersListClient";

export const metadata: Metadata = {
  title: "Users | Scantoz Admin",
  description: "Manage users in the Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UsersPage() {
  return <UsersListClient />;
}
