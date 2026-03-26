import React from "react";

type ViewFieldProps = {
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
  valueClass?: string;
};

export default function ViewField({
  label,
  value,
  mono = false,
  valueClass = "",
}: ViewFieldProps) {
  return (
    <div>
      <p className="text-md text-gray-500">{label}</p>
      <p
        className={`mt-0.5 text-md text-gray-900 dark:text-white ${
          mono ? "font-mono" : ""
        } ${valueClass}`}
      >
        {value ?? "—"}
      </p>
    </div>
  );
}
