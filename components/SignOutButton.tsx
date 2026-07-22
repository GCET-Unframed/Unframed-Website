"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="text-sm text-stone hover:text-royal"
    >
      Sign out
    </button>
  );
}
