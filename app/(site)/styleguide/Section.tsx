import { cn } from "@/lib/cn";

/** Shared scaffolding for the styleguide's sections and specimen rows. */

export function Group({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-16 lg:mt-24">
      <div className="border-b border-hairline pb-3">
        <h2 id={id} className="text-title text-ink">
          {title}
        </h2>
        {note ? (
          <p className="mt-1 max-w-2xl text-sm text-secondary">{note}</p>
        ) : null}
      </div>
      <div className="mt-8 flex flex-col gap-10">{children}</div>
    </section>
  );
}

export function Specimen({
  label,
  note,
  children,
  /** Stacks the samples instead of laying them out in a row. */
  column = false,
  /** Constrains the sample area, e.g. for a 320px form field. */
  narrow = false,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
  column?: boolean;
  narrow?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-ink">{label}</h3>
        {note ? (
          <p className="mt-0.5 text-caption text-secondary">{note}</p>
        ) : null}
      </div>
      <div
        className={cn(
          "flex gap-5 rounded-md bg-surface p-5",
          column ? "flex-col items-start" : "flex-wrap items-start",
          narrow && "max-w-md",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** A labelled cell, so each variant in a row says what it is. */
export function Sample({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {children}
      <span className="text-caption text-secondary">{label}</span>
    </div>
  );
}
