"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

/**
 * Checkbox, radio and switch (DS-CMP-CHECK).
 *
 * Each is a real `<input>` with a visually hidden box and a drawn indicator, so
 * keyboard, screen readers and form submission all behave natively. The control
 * is 22–26px but the clickable label row clears 44px (DS-A11Y-04).
 *
 * Groups get a visible legend — see `ChoiceGroup`.
 */

type BaseProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "className" | "children"
>;

interface SharedProps extends BaseProps {
  label: ReactNode;
  /** Secondary line under the label, e.g. a count or a note. */
  description?: ReactNode;
  className?: string;
}

function Row({
  htmlFor,
  indicator,
  label,
  description,
  disabled,
  className,
}: {
  htmlFor: string;
  indicator: ReactNode;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "flex min-h-11 cursor-pointer items-center gap-2.5 text-sm",
        "has-disabled:cursor-not-allowed has-disabled:opacity-40",
        className,
      )}
      aria-disabled={disabled || undefined}
    >
      {indicator}
      <span className="flex min-w-0 flex-col">
        <span className="text-ink">{label}</span>
        {description ? (
          <span className="text-caption text-secondary">{description}</span>
        ) : null}
      </span>
    </label>
  );
}

/* -------------------------------------------------------------- Checkbox */

export function Checkbox({
  label,
  description,
  className,
  id,
  disabled,
  ...rest
}: SharedProps) {
  const generated = useId();
  const inputId = id ?? generated;

  return (
    <Row
      htmlFor={inputId}
      disabled={disabled}
      label={label}
      description={description}
      className={className}
      indicator={
        <span className="relative inline-flex shrink-0">
          <input
            type="checkbox"
            id={inputId}
            disabled={disabled}
            className="peer sr-only"
            {...rest}
          />
          <span
            aria-hidden="true"
            className={cn(
              "inline-flex size-[22px] items-center justify-center rounded-xs",
              "border-[1.5px] border-border-strong bg-canvas text-canvas",
              "transition-colors duration-[--motion-fast] ease-[--ease-standard]",
              "peer-checked:border-ink peer-checked:bg-ink",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
              "peer-focus-visible:outline-accent",
              /* The tick lives inside this span, so it cannot use a peer
                 variant of its own — drive it from here instead. */
              "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100",
            )}
          >
            <Icon name="check" size={16} strokeWidth={3} />
          </span>
        </span>
      }
    />
  );
}

/* ----------------------------------------------------------------- Radio */

export function Radio({
  label,
  description,
  className,
  id,
  disabled,
  ...rest
}: SharedProps) {
  const generated = useId();
  const inputId = id ?? generated;

  return (
    <Row
      htmlFor={inputId}
      disabled={disabled}
      label={label}
      description={description}
      className={className}
      indicator={
        <span className="relative inline-flex shrink-0">
          <input
            type="radio"
            id={inputId}
            disabled={disabled}
            className="peer sr-only"
            {...rest}
          />
          <span
            aria-hidden="true"
            className={cn(
              "inline-block size-[22px] rounded-pill bg-canvas",
              "border-[1.5px] border-border-strong",
              "transition-[border-width,border-color] duration-[--motion-fast]",
              "ease-[--ease-standard]",
              "peer-checked:border-[7px] peer-checked:border-ink",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
              "peer-focus-visible:outline-accent",
            )}
          />
        </span>
      }
    />
  );
}

/* ---------------------------------------------------------------- Switch */

export function Switch({
  label,
  description,
  className,
  id,
  disabled,
  ...rest
}: SharedProps) {
  const generated = useId();
  const inputId = id ?? generated;

  return (
    <Row
      htmlFor={inputId}
      disabled={disabled}
      label={label}
      description={description}
      className={cn("justify-between", className)}
      indicator={
        <span className="relative order-last inline-flex shrink-0">
          <input
            type="checkbox"
            role="switch"
            id={inputId}
            disabled={disabled}
            className="peer sr-only"
            {...rest}
          />
          <span
            aria-hidden="true"
            className={cn(
              "relative inline-block h-[26px] w-11 rounded-pill bg-border-strong",
              "transition-colors duration-[--motion-fast] ease-[--ease-standard]",
              "peer-checked:bg-ink",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2",
              "peer-focus-visible:outline-accent",
              "after:absolute after:top-[3px] after:left-[3px] after:size-5",
              "after:rounded-pill after:bg-canvas after:transition-transform",
              "after:duration-[--motion-fast] after:ease-[--ease-standard]",
              "peer-checked:after:translate-x-[18px]",
            )}
          />
        </span>
      }
    />
  );
}

/* ------------------------------------------------------------ Group shell */

/** A fieldset with a visible legend, as every choice group needs. */
export function ChoiceGroup({
  legend,
  children,
  className,
  hint,
}: {
  legend: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <fieldset className={cn("flex flex-col gap-1", className)}>
      <legend className="mb-2 text-sm font-medium text-ink">
        {legend}
        {hint ? (
          <span className="ml-2 font-normal text-secondary">{hint}</span>
        ) : null}
      </legend>
      {children}
    </fieldset>
  );
}
