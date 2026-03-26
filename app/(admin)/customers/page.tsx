import { Metadata } from "next";
import CustomersListClient from "./components/CustomersListClient";

export const metadata: Metadata = {
  title: "Customers | Scantoz Admin",
  description: "Manage customers in the Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CustomersPage() {
  return <CustomersListClient />;
}
