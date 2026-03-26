type ViewBadgeVariant = "success" | "danger" | "warning" | "info";

type ViewBadgeProps = {
  label: string;
  variant?: ViewBadgeVariant;
};

const VARIANTS: Record<ViewBadgeVariant, string> = {
  success:
    "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  danger: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  warning:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  info: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export default function ViewBadge({ label, variant = "info" }: ViewBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${VARIANTS[variant]}`}
    >
      {label}
    </span>
  );
}
