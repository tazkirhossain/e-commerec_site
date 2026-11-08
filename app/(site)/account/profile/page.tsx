import type { Metadata } from "next";
import { AccountPageHeader } from "../AccountNav";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

/**
 * Profile (DS-PG-ACCOUNT, FR-USR-02 and FR-USR-07).
 *
 * Name, phone, email and preferred language, plus the data export and
 * deletion requests the platform has to honour.
 */
export default function ProfilePage() {
  return (
    <>
      <AccountPageHeader
        title="Profile"
        description="Your details and language preference."
      />
      <ProfileForm />
    </>
  );
}
