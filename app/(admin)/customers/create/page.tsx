import { Metadata } from "next";
import CustomerFormClient from "../components/CustomerFormClient";

export const metadata: Metadata = {
  title: "Create Customer | Scantoz Admin",
  description: "Create a new customer in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreateCustomerPage() {
  return <CustomerFormClient mode="create" />;
}
