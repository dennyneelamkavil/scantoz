import Label from "./Label";

type FormFieldProps = {
  label: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
};

export default function FormField({
  label,
  required,
  htmlFor,
  children,
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={htmlFor}>
        {label} {required && <span className="text-error-500">*</span>}
      </Label>
      {children}
    </div>
  );
}
