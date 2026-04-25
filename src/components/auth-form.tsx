"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { StatusPill } from "@/components/status-pill";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "sign-in" | "sign-up";
type FeedbackTone = "default" | "success" | "warning";

type FeedbackState = {
  tone: FeedbackTone;
  title: string;
  message: string;
};

type AuthFormProps = {
  supabaseConfigured: boolean;
  showSignedOutMessage: boolean;
  showMissingEnvMessage: boolean;
};

const signedOutFeedback: FeedbackState = {
  tone: "success",
  title: "Signed out",
  message: "You have been signed out and the app is locked again until you sign back in.",
};

const missingEnvFeedback: FeedbackState = {
  tone: "warning",
  title: "Supabase setup needed",
  message:
    "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your local environment before using auth.",
};

function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "That email and password combination did not match an account.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }

  if (normalized.includes("user already registered")) {
    return "An account with that email already exists. Try signing in instead.";
  }

  if (normalized.includes("password should be at least")) {
    return "Choose a longer password before creating your account.";
  }

  return "Something went wrong while talking to Supabase. Please try again.";
}

export function AuthForm({
  supabaseConfigured,
  showSignedOutMessage,
  showMissingEnvMessage,
}: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(() => {
    if (showMissingEnvMessage) {
      return missingEnvFeedback;
    }

    if (showSignedOutMessage) {
      return signedOutFeedback;
    }

    return null;
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabaseConfigured) {
      setFeedback(missingEnvFeedback);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setFeedback(missingEnvFeedback);
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setFeedback({
            tone: "warning",
            title: "Sign-in failed",
            message: getAuthErrorMessage(error.message),
          });
          return;
        }

        router.replace("/app");
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setFeedback({
          tone: "warning",
          title: "Account setup failed",
          message: getAuthErrorMessage(error.message),
        });
        return;
      }

      if (data.session) {
        router.replace("/app");
        router.refresh();
        return;
      }

      setFeedback({
        tone: "success",
        title: "Check your email",
        message:
          "Your account was created. Open the confirmation email from Supabase, then come back here to sign in.",
      });
      setPassword("");
      setMode("sign-in");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isDisabled = isSubmitting || !supabaseConfigured;

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur sm:p-8">
      <StatusPill tone={supabaseConfigured ? "success" : "warning"}>
        {supabaseConfigured ? "Supabase auth ready" : "Supabase setup needed"}
      </StatusPill>

      <h1 className="mt-5 text-3xl font-semibold">Welcome back to your plant care space.</h1>
      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)] sm:text-base">
        Sign in to reach the app shell, or create your account so your future plant records
        belong to a real signed-in user.
      </p>

      <div className="mt-7 grid grid-cols-2 rounded-full border border-[color:var(--border)] bg-white/70 p-1">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "sign-in"
              ? "bg-[color:var(--accent)] text-white"
              : "text-[color:var(--muted)] hover:bg-[color:var(--accent-soft)]"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("sign-up")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "sign-up"
              ? "bg-[color:var(--accent)] text-white"
              : "text-[color:var(--muted)] hover:bg-[color:var(--accent-soft)]"
          }`}
        >
          Create account
        </button>
      </div>

      {feedback ? (
        <div className="mt-6 rounded-[1.5rem] border border-[color:var(--border)] bg-white/80 px-4 py-4">
          <StatusPill tone={feedback.tone}>{feedback.title}</StatusPill>
          <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{feedback.message}</p>
        </div>
      ) : null}

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--foreground)]">
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-[1.25rem] border border-[color:var(--border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[color:var(--accent)]"
            placeholder="you@example.com"
            disabled={isDisabled}
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[color:var(--foreground)]">
          Password
          <input
            type="password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-[1.25rem] border border-[color:var(--border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[color:var(--accent)]"
            placeholder={mode === "sign-in" ? "Enter your password" : "Choose a secure password"}
            disabled={isDisabled}
            required
          />
        </label>

        <button
          type="submit"
          disabled={isDisabled}
          className="mt-2 inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? mode === "sign-in"
              ? "Signing in..."
              : "Creating account..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-sm leading-6 text-[color:var(--muted)]">
        {mode === "sign-in"
          ? "Use the account tied to your future plant collection."
          : "If email confirmation is enabled in Supabase, you will confirm first and then sign in."}
      </p>
    </div>
  );
}
