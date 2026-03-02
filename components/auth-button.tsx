"use client";

/**
 * Auth Button
 *
 * Displays a "Sign in with Google" button when the user is not authenticated,
 * or a user avatar / sign-out option when the user is signed in.
 */

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User avatar"}
            width={28}
            height={28}
            className="rounded-full"
          />
        )}
        <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
          {session.user.name}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signIn("google")}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Sign in
    </Button>
  );
}
