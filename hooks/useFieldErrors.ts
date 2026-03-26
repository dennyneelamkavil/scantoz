import { useState } from "react";

type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function useFieldErrors<T extends string>() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<T>>({});

  function setFieldError(field: T, message: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: message }));
  }

  function clearFieldError(field: T) {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function clearAllFieldErrors() {
    setFieldErrors({});
  }

  return {
    fieldErrors,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    setFieldErrors,
  };
}
