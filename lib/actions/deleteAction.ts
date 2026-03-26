import { toast } from "react-toastify";

type DeleteActionOptions = {
  successMessage?: string;
  errorMessage?: string;
};

export async function deleteAction(
  url: string,
  options?: DeleteActionOptions
): Promise<boolean> {
  const {
    successMessage = "Deleted successfully",
    errorMessage = "Failed to delete item",
  } = options ?? {};

  try {
    const res = await fetch(url, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data?.error ?? errorMessage);
      return false;
    }

    toast.success(successMessage);
    return true;
  } catch {
    toast.error("Network error. Please try again.");
    return false;
  }
}
