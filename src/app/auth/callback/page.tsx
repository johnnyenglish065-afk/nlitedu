"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) return;

      // The Supabase client automatically handles the token in the URL fragment
      // We just need to check if we have a session now
      const { data: { session }, error } = await supabase.auth.getSession();

      if (session || !error) {
        // Redirect to homepage after successful handshake
        router.push("/");
        router.refresh();
      } else {
        // If there's an error, redirect to signin with error message
        router.push("/signin?error=callback_error");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-dark">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Completing login...
        </h2>
        <p className="text-body-color mt-2">
          Please wait while we set up your session.
        </p>
      </div>
    </div>
  );
}
