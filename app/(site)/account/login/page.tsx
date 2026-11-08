import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SignInCard } from "./SignInCard";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Voltra with a one-time code sent to your phone.",
  robots: { index: false, follow: true },
};

/**
 * Sign in and sign up (DS-PG-AUTH).
 *
 * One centred card, max 440px. Phone or email with a one-time code is the
 * primary path; a password is optional (FR-USR-01). There is no separate
 * sign-up screen, because entering a number that has no account creates one.
 */
export default function SignInPage() {
  return (
    <Container className="flex justify-center py-12 lg:py-20">
      <SignInCard />
    </Container>
  );
}
