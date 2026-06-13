import { useEffect, useState } from "react";

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

function read(): StoredProfile {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem("continuity.profile");
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<StoredProfile>;
    return {
      caregiverName: parsed.caregiverName ?? "",
      caregiverEmail: parsed.caregiverEmail ?? "",
      reasons: parsed.reasons ?? [],
      dependents: parsed.dependents ?? [],
    };
  } catch {
    return EMPTY;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<StoredProfile>(EMPTY);

  useEffect(() => {
    setProfile(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "continuity.profile") setProfile(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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
    hasOnboarded: profile.dependents.length > 0 || !!profile.caregiverName,
  };
}
