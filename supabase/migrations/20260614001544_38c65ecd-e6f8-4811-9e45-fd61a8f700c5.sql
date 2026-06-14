CREATE TABLE public.reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  score SMALLINT NOT NULL CHECK (score >= 0 AND score <= 4),
  score_label TEXT,
  note TEXT,
  page_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reflections TO authenticated;
GRANT ALL ON public.reflections TO service_role;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own reflections" ON public.reflections
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own reflections" ON public.reflections
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE INDEX reflections_user_created_idx ON public.reflections (user_id, created_at DESC);