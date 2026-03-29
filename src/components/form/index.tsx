import type { FormEventHandler } from "react";

export function Form({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement> | undefined;
}) {
  return (
    <form className="mx-auto mb-12" onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export function FormWrapper({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto mb-12 max-w-prose">{children}</div>;
}

export function Fieldset({ children }: { children: React.ReactNode }) {
  return <fieldset className="mb-6">{children}</fieldset>;
}

export function FieldsetHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 font-bold text-lg">{children}</div>;
}
export function FieldsetSubHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 text-muted-foreground italic">{children}</div>;
}
