"use client";

type TableSkeletonProps = {
  rows?: number;
  columns: number;
};

export default function TableSkeleton({
  rows = 6,
  columns,
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-gray-200 dark:border-gray-800"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-5 py-4">
              <div className="h-4 w-[80%] animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
