import { Metadata } from "next";
import RolesListClient from "./components/RolesListClient";

export const metadata: Metadata = {
  title: "Roles | Scantoz Admin",
  description: "Manage roles in the Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RolesPage() {
  return <RolesListClient />;
}
