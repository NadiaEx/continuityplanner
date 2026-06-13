import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const APP_REDIRECTS = [
  "/dashboard",
  "/assistant",
  "/one-page",
  "/profile",
  "/medical",
  "/routines",
  "/emergency",
  "/care-team",
  "/documents",
  "/future",
  "/insights",
  "/exports",
  "/settings",
] as const;

export type AppRedirect = (typeof APP_REDIRECTS)[number];

const AUTH_REDIRECT_KEY = "continuity.auth.redirect";

export function getSafeRedirect(value: string | null | undefined): AppRedirect {
  return APP_REDIRECTS.includes(value as AppRedirect) ? (value as AppRedirect) : "/dashboard";
}

export function rememberAuthRedirect(path: AppRedirect) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_REDIRECT_KEY, path);
  } catch {
    // ignore storage errors
  }
}

export function getRememberedAuthRedirect(fallback: AppRedirect = "/dashboard"): AppRedirect {
  if (typeof window === "undefined") return fallback;
  try {
    return getSafeRedirect(localStorage.getItem(AUTH_REDIRECT_KEY) ?? fallback);
  } catch {
    return fallback;
  }
}

export function getAuthRedirectUrl(nextPath: AppRedirect) {
  rememberAuthRedirect(nextPath);
  const url = new URL("/auth", window.location.origin);
  url.searchParams.set("redirect", nextPath);
  return url.toString();
}

async function recoverHashSession(): Promise<Session | null> {
  if (typeof window === "undefined" || !window.location.hash) return null;

  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) return null;

  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !data.session) return null;

  window.history.replaceState(
    window.history.state,
    document.title,
    `${window.location.pathname}${window.location.search}`,
  );

  return data.session;
}

export async function getRestoredSession(waitMs = 1800): Promise<Session | null> {
  const recovered = await recoverHashSession();
  if (recovered) return recovered;

  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session;

  return new Promise((resolve) => {
    let settled = false;
    const finish = (session: Session | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      subscription.subscription.unsubscribe();
      resolve(session);
    };

    const timeout = window.setTimeout(() => finish(null), waitMs);
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) finish(session);
    });
  });
}