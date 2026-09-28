import type { InputHTMLAttributes } from "react";

export function Field({
  label,
  hint,
  error,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${id}-hint` : undefined}
        {...props}
      />
      {(error || hint) && (
        <p
          id={`${id}-hint`}
          className={error ? "text-danger" : "text-muted-foreground"}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
