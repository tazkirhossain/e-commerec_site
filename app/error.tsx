"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";

/**
 * 500 (DS-PG-ERR).
 *
 * One headline, one sentence, one primary action. The primary action here is
 * Retry rather than Home, because most render errors are transient and
 * retrying is what the visitor actually wants.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* The real deployment reports this to error tracking (NFR-OPS-01). */
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-16 text-center lg:py-24">
      <span className="flex size-14 items-center justify-center rounded-pill bg-danger-surface text-danger">
        <Icon name="alert-triangle" size={28} />
      </span>

      <h1 className="mt-5 type-hero text-ink">Something went wrong</h1>
      <p className="mt-3 max-w-md text-lg text-body">
        The page didn&rsquo;t load. It is usually temporary — try again, and if
        it keeps happening, call us on 01700-000100.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button onClick={reset} iconLeading="undo">
          Try again
        </Button>
        <ButtonLink href="/" variant="secondary">
          Go to home
        </ButtonLink>
      </div>

      {error.digest ? (
        <p className="mt-6 text-caption text-secondary tabular">
          Reference {error.digest}
        </p>
      ) : null}
    </Container>
  );
}
