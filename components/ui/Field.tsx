"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/cn";

/**
 * Text input, select and textarea (DS-CMP-INPUT).
 *
 * The label sits inside the bordered box, above the value — never as a
 * placeholder, because a placeholder disappears as soon as you type. Helper
 * text sits below in secondary ink; an error replaces it and the border turns
 * danger with an icon, so the state is not carried by colour alone
 * (DS-FND-01a).
 *
 * The control's font size stays 16px so iOS does not zoom on focus
 * (DS-FND-02a).
 */

interface FieldShellProps {
  label: string;
  htmlFor: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  /** Marks the field optional in the label rather than starring the required. */
  optional?: boolean;
  className?: string;
  children: ReactNode;
  /** Trailing adornment inside the box — the select chevron, a unit, a button. */
  adornment?: ReactNode;
  /** Textarea needs a taller box with the label pinned to the top. */
  tall?: boolean;
}

function FieldShell({
  label,
  htmlFor,
  helper,
  error,
  disabled,
  optional,
  className,
  children,
  adornment,
  tall,
}: FieldShellProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div
        className={cn(
          "flex rounded-sm border bg-canvas px-3 py-2 transition-colors",
          "duration-[--motion-fast] ease-[--ease-standard]",
          tall ? "min-h-28 items-start" : "h-14 items-center",
          error
            ? "border-2 border-danger bg-danger-surface"
            : "border-hairline focus-within:border-2 focus-within:border-ink",
          disabled && "bg-surface text-disabled",
          /* The 2px focus border must not shift the content by 1px. */
          !error && "focus-within:px-[11px] focus-within:py-[7px]",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <label
            htmlFor={htmlFor}
            className="text-[12px] leading-4 font-medium text-secondary"
          >
            {label}
            {optional ? (
              <span className="font-normal"> (optional)</span>
            ) : null}
          </label>
          {children}
        </div>
        {adornment ? (
          <div className="flex shrink-0 items-center self-center pl-2 text-ink">
            {adornment}
          </div>
        ) : null}
      </div>

      {error ? (
        <p
          id={`${htmlFor}-error`}
          className="mt-1.5 flex items-center gap-1.5 text-caption text-danger"
        >
          <Icon name="alert-triangle" size={16} />
          {error}
        </p>
      ) : helper ? (
        <p
          id={`${htmlFor}-helper`}
          className="mt-1.5 text-caption text-secondary"
        >
          {helper}
        </p>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------------- Input */

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  helper?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  adornment?: ReactNode;
  /** React 19 passes `ref` as an ordinary prop; forwarded to the input. */
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  label,
  helper,
  error,
  optional,
  className,
  adornment,
  id,
  disabled,
  ...rest
}: InputProps) {
  const generated = useId();
  const inputId = id ?? generated;

  return (
    <FieldShell
      label={label}
      htmlFor={inputId}
      helper={helper}
      error={error}
      optional={optional}
      disabled={disabled}
      className={className}
      adornment={adornment}
    >
      <input
        id={inputId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helper
              ? `${inputId}-helper`
              : undefined
        }
        className={cn(
          "w-full bg-transparent text-base text-ink outline-none",
          "placeholder:text-secondary disabled:text-disabled",
        )}
        {...rest}
      />
    </FieldShell>
  );
}

/* ---------------------------------------------------------------- Select */

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  label: string;
  helper?: string;
  error?: string;
  className?: string;
  /** When set, a disabled first option acts as the empty prompt. */
  placeholder?: string;
  options: readonly string[] | readonly { value: string; label: string }[];
}

export function Select({
  label,
  helper,
  error,
  className,
  placeholder,
  options,
  id,
  disabled,
  ...rest
}: SelectProps) {
  const generated = useId();
  const selectId = id ?? generated;

  const normalised = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );

  return (
    <FieldShell
      label={label}
      htmlFor={selectId}
      helper={helper}
      error={error}
      disabled={disabled}
      className={className}
      adornment={<Icon name="chevron-down" size={18} />}
    >
      <select
        id={selectId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error
            ? `${selectId}-error`
            : helper
              ? `${selectId}-helper`
              : undefined
        }
        className={cn(
          "w-full appearance-none bg-transparent text-base text-ink outline-none",
          "disabled:text-disabled",
        )}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {normalised.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/* -------------------------------------------------------------- Textarea */

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label: string;
  helper?: string;
  error?: string;
  optional?: boolean;
  className?: string;
}

export function Textarea({
  label,
  helper,
  error,
  optional,
  className,
  id,
  disabled,
  rows = 3,
  ...rest
}: TextareaProps) {
  const generated = useId();
  const areaId = id ?? generated;

  return (
    <FieldShell
      label={label}
      htmlFor={areaId}
      helper={helper}
      error={error}
      optional={optional}
      disabled={disabled}
      className={className}
      tall
    >
      <textarea
        id={areaId}
        rows={rows}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${areaId}-error` : helper ? `${areaId}-helper` : undefined
        }
        className={cn(
          "w-full resize-y bg-transparent pt-1 text-base text-ink outline-none",
          "placeholder:text-secondary disabled:text-disabled",
        )}
        {...rest}
      />
    </FieldShell>
  );
}
