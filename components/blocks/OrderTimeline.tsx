import { Icon } from "@/components/ui/Icon";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Order status timeline (DS-PG-TRACK, DS-PG-ACCOUNT).
 *
 * A vertical list of status events. Completed steps carry a check, the first
 * pending step is marked as the one in progress, and later steps are quiet —
 * state is never carried by the dot colour alone.
 */
export function OrderTimeline({
  timeline,
  className,
}: {
  timeline: { status: string; at: string; note?: string; done: boolean }[];
  className?: string;
}) {
  const nextIndex = timeline.findIndex((event) => !event.done);

  return (
    <ol className={cn("flex flex-col", className)}>
      {timeline.map((event, index) => {
        const isLast = index === timeline.length - 1;
        const current = index === nextIndex;

        return (
          <li key={event.status} className="flex gap-4">
            {/* Dot and connector. */}
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-pill",
                  event.done
                    ? "bg-success-surface text-success"
                    : current
                      ? "border-2 border-accent bg-canvas text-accent"
                      : "border border-hairline bg-canvas text-disabled",
                )}
              >
                {event.done ? (
                  <Icon name="check" size={16} strokeWidth={2.5} />
                ) : (
                  <span className="size-1.5 rounded-pill bg-current" />
                )}
              </span>

              {!isLast ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "w-0.5 flex-1",
                    event.done ? "bg-success" : "bg-hairline",
                  )}
                />
              ) : null}
            </div>

            <div className={cn("min-w-0 pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-medium",
                  event.done || current ? "text-ink" : "text-secondary",
                )}
              >
                {event.status}
                {current ? (
                  <span className="ml-2 font-normal text-accent">
                    In progress
                  </span>
                ) : null}
                {event.done ? <span className="sr-only"> — done</span> : null}
              </p>
              <p className="mt-0.5 text-caption text-secondary tabular">
                {formatDate(event.at)}
                {event.note ? ` · ${event.note}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
