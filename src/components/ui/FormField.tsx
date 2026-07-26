import { useId } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: (id: string) => React.ReactNode;
}

export function FormField({ label, required, hint, children }: FormFieldProps) {
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-zinc-300"
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children(id)}
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
