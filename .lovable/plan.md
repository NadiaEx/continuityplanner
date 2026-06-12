## Where users land after paying

Build a single `/welcome` page that handles all three outcomes (paid, paid-with-tip, $0). It reads the result from URL params so it works today with the toast-stub checkout and tomorrow with real Stripe `success_url`.

### 1. New route: `/welcome`

A new file at `src/routes/welcome.tsx`. Public route (no auth wall), no header nav so it feels like a destination not a page-in-the-app.

**What it shows:**

- A calm hero — no confetti, no exclamation marks. One line, big.
  - $0: *"You're in."*
  - Paid: *"Thank you."*
- A subhead that adapts:
  - $0: *"Continuity is yours. Nothing to confirm, nothing to verify. Go build your plan."*
  - Paid: *"$X received. One time. Lifetime. That's it."*
  - Tipped: adds *"You also covered another caregiver who couldn't pay. They'll never know it was you."*
- A small "what just happened" card: amount, date, "no subscription, no renewals." Acts as a soft receipt without feeling like a Stripe email.
- **Two equal CTAs side-by-side** (per your answer):
  - *"Download what I came for"* → `/exports`
  - *"Take me to my dashboard"* → `/dashboard`
- A quiet tertiary line below: *"Or start a new conversation about someone you love"* → `/assistant`.

**How it knows what happened:**

Reads `useSearch()`:
- `?free=1` → $0 path
- `?amount=40&tip=5` → paid path with optional tip
- No params → fall back to the paid path with generic copy (safety net if someone bookmarks the URL)

This shape is exactly what Stripe's `success_url` can carry later (or a server-validated `session_id` that resolves to the same fields).

### 2. Wire `/pricing` to actually go there

In `src/routes/pricing.tsx`, the `submit()` function currently fires a toast and stops. Replace with a `navigate()` to `/welcome` carrying the right params:

- $0 mode → `navigate({ to: "/welcome", search: { free: 1 } })`
- Paid → `navigate({ to: "/welcome", search: { amount, tip } })`

(Real Stripe handoff will replace this with a redirect to Stripe Checkout, whose `success_url` points back at `/welcome` with the same shape. The page doesn't change.)

### 3. Retire "Founding Family"

You asked to drop it — touching every spot it appears so the launch is consistent:

- `src/components/founding-badge.tsx` — delete the file.
- `src/components/app-sidebar.tsx` (line 18, 51) — remove import + `<FoundingBadge>` render.
- `src/routes/_app.dashboard.tsx` (line 3, 52) — remove import + render.
- `src/routes/_app.insights.tsx` (line 3, 12, 50) — remove import + render; relabel the "Active founding families" stat to just "Active families."
- `src/routes/onboarding.tsx` (line 5, 512, 518) — remove import + the post-onboarding badge block; rewrite the success line to *"You're in. Next, the assistant turns what you know into a plan."*
- `src/routes/index.tsx` (lines 77, 109, 494, 512) — change the landing-page section anchor from "Founding pilot" to "Pricing" (or "How it works"); rewrite the "Lifetime Founding Family status" feature card to *"Lifetime access — yours to keep."*; replace the pilot-badge eyebrow with something tied to the product itself.
- `src/components/waitlist-modal.tsx` (lines 57, 79, 151) — rewrite three strings to remove pilot/founding framing. (Or, optionally, delete the modal entirely if it's no longer wired anywhere — I'll check during build.)

### Technical notes

- `/welcome` will use `createFileRoute("/welcome")` at `src/routes/welcome.tsx`. TanStack file-based routing picks it up automatically; no edits to `routeTree.gen.ts`.
- Use TanStack's typed search-param validation (`validateSearch`) so `amount`, `tip`, and `free` are typed as `number | undefined` / `boolean | undefined` instead of raw strings.
- `<Link to="/exports">` and `<Link to="/dashboard">` for the two CTAs — preserves preloading and type safety.
- The page has no DB calls, no auth dependency. Safe for SSR/prerender.
- `head()` meta: `title: "Welcome to Continuity"`, simple description. No og:image needed.

### What this does NOT do

- Doesn't wire real Stripe payments yet. The flow is end-to-end testable today with the stub; when you're ready to enable Lovable's built-in Stripe payments, the only change is `submit()` in `pricing.tsx` calling a server function that creates a Checkout Session whose `success_url` points at `/welcome?amount=…&tip=…`.
- Doesn't add a receipt email or DB record of the contribution. That comes with real payments.
