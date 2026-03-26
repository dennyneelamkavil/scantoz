import { Metadata } from "next";
import CustomerFormClient from "../../components/CustomerFormClient";

export const metadata: Metadata = {
  title: "Edit Customer | Scantoz Admin",
  description: "Edit customer in Scantoz admin dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

interface Params {
  params: { id: string };
}

export default async function EditCustomerPage({ params }: Params) {
  const { id } = await params;
  return <CustomerFormClient mode="edit" id={id} />;
}
