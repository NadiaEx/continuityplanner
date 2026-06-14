CREATE TABLE public.profile_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  dependent_id TEXT NOT NULL,
  section TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_notes TO authenticated;
GRANT ALL ON public.profile_notes TO service_role;
ALTER TABLE public.profile_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile notes" ON public.profile_notes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX profile_notes_user_dep_section_idx ON public.profile_notes (user_id, dependent_id, section, created_at DESC);
CREATE TRIGGER set_profile_notes_updated_at
  BEFORE UPDATE ON public.profile_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.profile_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  dependent_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_documents TO authenticated;
GRANT ALL ON public.profile_documents TO service_role;
ALTER TABLE public.profile_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile documents" ON public.profile_documents
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX profile_documents_user_dep_idx ON public.profile_documents (user_id, dependent_id, created_at DESC);