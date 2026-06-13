-- Contributions: one row per successful payment (and per $0 "can't pay" entry)
CREATE TABLE public.contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paddle_transaction_id text UNIQUE,
  amount_cents integer NOT NULL DEFAULT 0,
  tip_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'usd',
  environment text NOT NULL DEFAULT 'sandbox',
  status text NOT NULL DEFAULT 'completed',
  paid_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contributions_user_id ON public.contributions(user_id);
CREATE INDEX idx_contributions_paid_at ON public.contributions(paid_at DESC);

GRANT SELECT, INSERT ON public.contributions TO authenticated;
GRANT ALL ON public.contributions TO service_role;

ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own contributions"
  ON public.contributions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Free ($0) contributions are recorded directly by the user; paid ones come via
-- the webhook using service_role.
CREATE POLICY "Users can insert their own free contributions"
  ON public.contributions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND amount_cents = 0 AND tip_cents = 0 AND paddle_transaction_id IS NULL);