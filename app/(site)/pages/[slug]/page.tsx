"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { contentPages, getContentPage } from "@/data/content";
import { formatDate } from "@/lib/format";

export async function generateStaticParams() {
  return contentPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata(
  props: PageProps<"/pages/[slug]">,
): Promise<Metadata> {
  "use cache";
  const { slug } = await props.params;
  const page = getContentPage(slug);
  if (!page) return { title: "Page not found" };

  return {
    title: page.title,
    description: page.intro,
    alternates: { canonical: `/pages/${page.slug}` },
  };
}

/** Turns a heading into a stable anchor id. */
function anchor(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Help, policies, about and contact (DS-PG-CONTENT).
 *
 * Single column at a 680px measure, the intro in the larger body size, and a
 * table of contents once the page runs long enough to need one.
 */
export default async function ContentPage(props: PageProps<"/pages/[slug]">) {
  const { slug } = await props.params;
  const page = getContentPage(slug);
  if (!page) notFound();

  /* A contents list only earns its place on a long page. */
  const showContents = page.sections.length >= 4;

  return (
    <Container className="py-8 lg:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Help", href: "/pages/help" },
          { label: page.title },
        ]}
        className="mb-6"
      />

      <article className="max-w-[680px]">
        <header>
          <h1 className="type-display text-ink">{page.title}</h1>
          <p className="mt-3 text-lg text-body">{page.intro}</p>
          <p className="mt-3 text-caption text-secondary">
            Last updated {formatDate(page.updated)}
          </p>
        </header>

        {showContents ? (
          <nav
            aria-labelledby="contents-heading"
            className="mt-8 rounded-md bg-surface p-5"
          >
            <h2
              id="contents-heading"
              className="text-sm font-semibold text-ink"
            >
              On this page
            </h2>
            <ol className="mt-2 flex flex-col">
              {page.sections.map((section) => (
                <li key={section.heading}>
                  <a
                    href={`#${anchor(section.heading)}`}
                    className="flex min-h-11 items-center rounded-xs text-sm text-body hover:text-ink hover:underline focus-ring"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="mt-10 flex flex-col gap-10">
          {page.sections.map((section) => (
            <section
              key={section.heading}
              id={anchor(section.heading)}
              aria-labelledby={`${anchor(section.heading)}-heading`}
              /* Clears the sticky header when jumped to from the contents. */
              className="scroll-mt-28"
            >
              <h2
                id={`${anchor(section.heading)}-heading`}
                className="text-title text-ink"
              >
                {section.heading}
              </h2>
              <div className="mt-3 flex flex-col gap-4">
                {section.body.map((paragraph, index) => (
                  <p key={index} className="text-base text-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </Container>
  );
}
