"use client";

import { createPersistedStore, usePersisted } from "@/lib/client-store";
import { cn } from "@/lib/cn";

/**
 * Language switch (DS-UX-02, NFR-I18N-01).
 *
 * Always visible in the header menu, keeps the current page, and is
 * remembered. Translation files are a platform concern (NFR-I18N-02) and are
 * not wired up here, so this records and reflects the preference rather than
 * swapping the copy — which is why it also sets `lang` on the document: that
 * is the part that changes real behaviour today, switching the font and line
 * height for Bangla.
 */

type Lang = "en" | "bn";

const languageStore = createPersistedStore<Lang>("voltra.language", "en");

export function LanguageSwitch({ className }: { className?: string }) {
  const lang = usePersisted(languageStore);

  function choose(next: Lang) {
    languageStore.set(next);
    document.documentElement.lang = next;
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn("flex items-center gap-1 text-sm", className)}
    >
      <LangButton
        active={lang === "en"}
        onClick={() => choose("en")}
        label="English"
      >
        English
      </LangButton>
      <span aria-hidden="true" className="text-border-strong">
        ·
      </span>
      <LangButton
        active={lang === "bn"}
        onClick={() => choose("bn")}
        label="Bangla"
      >
        <span lang="bn">বাংলা</span>
      </LangButton>
    </div>
  );
}

function LangButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Switch to ${label}`}
      className={cn(
        "inline-flex min-h-11 items-center rounded-xs px-1 focus-ring",
        active ? "font-semibold text-ink" : "text-secondary hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
