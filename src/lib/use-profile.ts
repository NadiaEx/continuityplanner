import { useCallback, useEffect, useState } from "react";
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

export function makeDependent(
  patch: Partial<StoredDependent> = {},
): StoredDependent {
  return {
    id: Math.random().toString(36).slice(2, 9),
    persona: null,
    name: "",
    living: null,
    complexity: [],
    ...patch,
  };
}

export type LatestContribution = {
  amountCents: number;
  tipCents: number;
  currency: string;
  paidAt: string;
  status: string;
};

export function useProfile() {
  const [profile, setProfile] = useState<StoredProfile>(EMPTY);
  const [activeIdx, setActiveIdx] = useState(0);
  const [registeredAt, setRegisteredAt] = useState<string | null>(null);
  const [contribution, setContribution] = useState<LatestContribution | null>(null);

  useEffect(() => {
    let cancelled = false;
    const local = readLocal();
    if (isPopulated(local)) setProfile(local);

    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) return;

      const { data: profileRow } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", session.user.id)
        .maybeSingle();
      if (!cancelled) {
        const ts = profileRow?.created_at ?? session.user.created_at ?? null;
        if (ts) setRegisteredAt(ts);
      }

      const { data: contribRow } = await (supabase.from("contributions") as any)
        .select("amount_cents, tip_cents, currency, paid_at, status")
        .eq("user_id", session.user.id)
        .order("paid_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled && contribRow) {
        setContribution({
          amountCents: contribRow.amount_cents,
          tipCents: contribRow.tip_cents,
          currency: contribRow.currency,
          paidAt: contribRow.paid_at,
          status: contribRow.status,
        });
      }

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

  // 1-year clock starts at first paid contribution if there is one;
  // otherwise it starts at account registration.
  const clockStart = contribution?.paidAt ?? registeredAt;
  const oneYearMark = clockStart
    ? new Date(new Date(clockStart).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const saveProfile = useCallback(async (next: StoredProfile) => {
    setProfile(next);
    writeLocal(next);
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) return;
    try {
      await supabase
        .from("responses")
        .delete()
        .eq("user_id", session.user.id)
        .eq("section_id", "onboarding");
      await supabase.from("responses").insert({
        user_id: session.user.id,
        section_id: "onboarding",
        extracted_data: JSON.parse(JSON.stringify(next)),
      });
    } catch {
      // best effort
    }
  }, []);

  const addDependent = useCallback(
    async (patch: Partial<StoredDependent>) => {
      const dep = makeDependent(patch);
      const next: StoredProfile = {
        ...profile,
        dependents: [...profile.dependents, dep],
      };
      await saveProfile(next);
      setActiveIdx(next.dependents.length - 1);
      return dep;
    },
    [profile, saveProfile],
  );

  const safeIdx = Math.min(activeIdx, Math.max(0, profile.dependents.length - 1));
  const activeDependent = profile.dependents[safeIdx];
  const lovedOneName = activeDependent?.name?.trim() || "your loved one";
  const caregiverName = profile.caregiverName?.trim() || "there";
  const caregiverFirstName = caregiverName.split(/\s+/)[0] || "there";

  return {
    profile,
    lovedOneName,
    caregiverName,
    caregiverFirstName,
    caregiverEmail: profile.caregiverEmail,
    dependents: profile.dependents,
    activeIdx: safeIdx,
    setActiveIdx,
    activeDependent,
    addDependent,
    saveProfile,
    hasOnboarded: isPopulated(profile),
    registeredAt,
    oneYearMark,
  };
}
