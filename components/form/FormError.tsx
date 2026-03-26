type FormErrorProps = {
  error: string;
};

export default function FormError({ error }: FormErrorProps) {
  return (
    <div className="rounded-md bg-red-50 px-4 py-2 my-2 text-sm text-red-600 dark:bg-red-500/10">
      {error}
    </div>
  );
}
