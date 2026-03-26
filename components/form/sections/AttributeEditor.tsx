"use client";

import Button from "@/components/ui/button/Button";
import { Input } from "@/components/form";

export type AttributeRow = {
  id: string;
  key: string;
  value: string;
};

type Props = {
  value: AttributeRow[];
  onChange: (value: AttributeRow[]) => void;
  config?: {
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    addButtonLabel?: string;
    helperText?: string;
  };
};

export default function AttributeEditor({ value, onChange, config }: Props) {
  const {
    keyPlaceholder = "Attribute name",
    valuePlaceholder = "Value",
    addButtonLabel = "+ Add Attribute",
    helperText,
  } = config || {};

  function update(id: string, field: "key" | "value", val: string) {
    onChange(
      value.map((row) => (row.id === id ? { ...row, [field]: val } : row))
    );
  }

  function remove(id: string) {
    onChange(value.filter((row) => row.id !== id));
  }

  function add() {
    onChange([...value, { id: crypto.randomUUID(), key: "", value: "" }]);
  }

  return (
    <div className="space-y-3">
      {helperText && (
        <p className="text-sm text-muted-foreground text-gray-500">
          {helperText}
        </p>
      )}

      {value.map((row) => (
        <div key={row.id} className="flex gap-2">
          <Input
            placeholder={keyPlaceholder}
            value={row.key}
            onChange={(e) => update(row.id, "key", e.target.value)}
          />
          <Input
            placeholder={valuePlaceholder}
            value={row.value}
            onChange={(e) => update(row.id, "value", e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => remove(row.id)}
          >
            ✕
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={add}>
        {addButtonLabel}
      </Button>
    </div>
  );
}
