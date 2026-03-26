import { toast } from "react-toastify";

type ToggleActionOptions = {
  successMessage?: string;
  errorMessage?: string;
};

export async function toggleAction(
  url: string,
  payload: Record<string, any>,
  options?: ToggleActionOptions
): Promise<boolean> {
  const {
    successMessage = "Status updated successfully",
    errorMessage = "Failed to update status",
  } = options ?? {};

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

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
