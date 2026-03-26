type ListErrorProps = {
  error: string;
  columns: number;
};

export default function ListError({ error, columns }: ListErrorProps) {
  return (
    <tr>
      <td colSpan={columns} className="px-5 py-4 text-center">
        <div className="rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 dark:bg-red-500/10">
          {error}
        </div>
      </td>
    </tr>
  );
}
