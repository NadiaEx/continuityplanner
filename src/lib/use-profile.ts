import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type StoredDependent = {
  id: string;
  persona: string | null;
  name: string;
  living: string | null;
  complexity: string[];
};

export type StoredProfile = {
  caregiverName: string;
  caregiverEmail: string;
  reasons: string[];
  dependents: StoredDependent[];
};

const EMPTY: StoredProfile = {
  caregiverName: "",
  caregiverEmail: "",
  reasons: [],
  dependents: [],
};

function normalize(parsed: Partial<StoredProfile> | null | undefined): StoredProfile {
  if (!parsed) return EMPTY;
  return {
    caregiverName: parsed.caregiverName ?? "",
    caregiverEmail: parsed.caregiverEmail ?? "",
    reasons: parsed.reasons ?? [],
    dependents: parsed.dependents ?? [],
  };
}

function readLocal(): StoredProfile {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem("continuity.profile");
    if (!raw) return EMPTY;
    return normalize(JSON.parse(raw) as Partial<StoredProfile>);
  } catch {
    return EMPTY;
  }
}

function writeLocal(profile: StoredProfile) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("continuity.profile", JSON.stringify(profile));
  } catch {
    // ignore
  }
}

function isPopulated(p: StoredProfile) {
  return p.dependents.length > 0 || !!p.caregiverName;
}

export function useProfile() {
  const [profile, setProfile] = useState<StoredProfile>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    // 1. Seed from localStorage immediately for fast paint
    const local = readLocal();
    if (isPopulated(local)) setProfile(local);

    // 2. Fetch authoritative copy from Supabase
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) return;
      const { data, error } = await supabase
        .from("responses")
        .select("extracted_data")
        .eq("user_id", session.user.id)
        .eq("section_id", "onboarding")
        .maybeSingle();
      if (cancelled || error || !data?.extracted_data) return;
      const remote = normalize(data.extracted_data as Partial<StoredProfile>);
      if (isPopulated(remote)) {
        setProfile(remote);
        writeLocal(remote);
      }
    })();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "continuity.profile") setProfile(readLocal());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const firstDependent = profile.dependents[0];
  const lovedOneName = firstDependent?.name?.trim() || "your loved one";
  const caregiverName = profile.caregiverName?.trim() || "there";
  const caregiverFirstName = caregiverName.split(/\s+/)[0] || "there";

  return {
    profile,
    lovedOneName,
    caregiverName,
    caregiverFirstName,
    caregiverEmail: profile.caregiverEmail,
    dependents: profile.dependents,
    hasOnboarded: isPopulated(profile),
  };
}
