
CREATE TABLE public.routine_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dependent_id text NOT NULL,
  title text NOT NULL,
  time_label text,
  tip text,
  steps text[] NOT NULL DEFAULT '{}',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX routine_blocks_user_dep_idx
  ON public.routine_blocks (user_id, dependent_id, position, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.routine_blocks TO authenticated;
GRANT ALL ON public.routine_blocks TO service_role;

ALTER TABLE public.routine_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own routine blocks"
  ON public.routine_blocks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER set_routine_blocks_updated_at
  BEFORE UPDATE ON public.routine_blocks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
