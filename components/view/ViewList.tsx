type ViewListProps = {
  label: string;
  items: string[];
  emptyText?: string;
};

export default function ViewList({
  label,
  items,
  emptyText = "—",
}: ViewListProps) {
  if (!items.length) {
    return (
      <div>
        <p className="text-md text-gray-500">{label}</p>
        <p className="text-md text-gray-400">{emptyText}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-md text-gray-500">{label}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
