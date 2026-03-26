type ViewRatingProps = {
  average: number;
  count: number;
};

export default function ViewRating({ average, count }: ViewRatingProps) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-2">Rating</p>
      <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
        <span className="text-yellow-500">★</span>
        <span className="font-mono">{average.toFixed(1)}</span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-600 dark:text-gray-300">
          {count} {count === 1 ? "review" : "reviews"}
        </span>
      </div>
    </div>
  );
}
