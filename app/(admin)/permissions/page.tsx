import { Metadata } from "next";
import PermissionsListClient from "./components/PermissionsListClient";

export const metadata: Metadata = {
  title: "Permissions | Scantoz Admin",
  description: "Manage permissions in the Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PermissionsPage() {
  return <PermissionsListClient />;
}
