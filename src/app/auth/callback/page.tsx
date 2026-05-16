"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) return;

      // Extract PKCE auth code from the URL search parameters
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      let exchangeError = null;
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          exchangeError = error;
          console.error("Error exchanging code for session:", error.message);
        }
      }

      // Retrieve and verify if we now have a valid active session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (session && !exchangeError && !sessionError) {
        // Redirect to homepage after successful handshake
        router.push("/");
        router.refresh();
      } else {
        // If there's an error or no session, redirect to signin with error message
        console.error("Auth callback failed. Session:", session, "Error:", exchangeError || sessionError);
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
