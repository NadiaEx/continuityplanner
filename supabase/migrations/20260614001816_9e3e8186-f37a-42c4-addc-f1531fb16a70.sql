-- Care team members
CREATE TABLE public.care_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  category TEXT NOT NULL DEFAULT 'Family',
  email TEXT,
  phone TEXT,
  priority SMALLINT NOT NULL DEFAULT 5,
  is_emergency_contact BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.care_team_members TO authenticated;
GRANT ALL ON public.care_team_members TO service_role;
ALTER TABLE public.care_team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own care team" ON public.care_team_members
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX care_team_members_user_idx ON public.care_team_members (user_id, priority);

-- Emergency plan notes (one row per user per kind)
CREATE TABLE public.emergency_plan_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.emergency_plan_notes TO authenticated;
GRANT ALL ON public.emergency_plan_notes TO service_role;
ALTER TABLE public.emergency_plan_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own emergency notes" ON public.emergency_plan_notes
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- updated_at trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER care_team_members_set_updated_at
BEFORE UPDATE ON public.care_team_members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER emergency_plan_notes_set_updated_at
BEFORE UPDATE ON public.emergency_plan_notes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();