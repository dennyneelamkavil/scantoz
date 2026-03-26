"use client";

type FormSkeletonProps = {
  fields?: number;
  showActions?: boolean;
};

export default function FormSkeleton({
  fields = 4,
  showActions = true,
}: FormSkeletonProps) {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Fields */}
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          {/* Label */}
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />

          {/* Input */}
          <div className="h-11 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      ))}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3 pt-2">
          <div className="h-11 w-32 rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="h-11 w-24 rounded-lg bg-gray-200 dark:bg-gray-800" />
        </div>
      )}
    </div>
  );
}
