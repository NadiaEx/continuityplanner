import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { gatewayFetch, type PaddleEnv } from "@/lib/paddle.server";

const PRODUCT_EXTERNAL_ID = "continuity_one_year";

async function resolveProductId(env: PaddleEnv): Promise<string> {
  const res = await gatewayFetch(
    env,
    `/products?external_id=${encodeURIComponent(PRODUCT_EXTERNAL_ID)}`,
  );
  const json: any = await res.json();
  const id = json?.data?.[0]?.id;
  if (!id) throw new Error(`Product ${PRODUCT_EXTERNAL_ID} not found in ${env}`);
  return id;
}

/**
 * Create a Paddle transaction with custom unit prices for the contribution and
 * optional "cover another caregiver" tip. Returns the transaction ID; the
 * frontend then opens Paddle.Checkout with { transactionId }.
 */
export const createContinuityTransaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      amountCents: number;
      tipCents: number;
      environment: PaddleEnv;
    }) => {
      if (!Number.isInteger(data.amountCents) || data.amountCents < 70) {
        throw new Error("Minimum contribution is $0.70 (Paddle minimum).");
      }
      if (data.amountCents > 10_000_000) throw new Error("Amount too large.");
      if (!Number.isInteger(data.tipCents) || data.tipCents < 0) {
        throw new Error("Invalid tip.");
      }
      if (data.tipCents > 10_000_000) throw new Error("Tip too large.");
      if (data.environment !== "sandbox" && data.environment !== "live") {
        throw new Error("Invalid environment.");
      }
      return data;
    },
  )
  .handler(async ({ data, context }) => {
    const { amountCents, tipCents, environment } = data;
    const productId = await resolveProductId(environment);

    const items: any[] = [
      {
        quantity: 1,
        price: {
          description: "Continuity — 1 year of secure storage",
          product_id: productId,
          unit_price: { amount: String(amountCents), currency_code: "USD" },
          quantity: { minimum: 1, maximum: 1 },
          tax_mode: "account_setting",
        },
      },
    ];

    if (tipCents > 0) {
      items.push({
        quantity: 1,
        price: {
          description: "Cover another caregiver",
          product_id: productId,
          unit_price: { amount: String(tipCents), currency_code: "USD" },
          quantity: { minimum: 1, maximum: 1 },
          tax_mode: "account_setting",
        },
      });
    }

    const res = await gatewayFetch(environment, "/transactions", {
      method: "POST",
      body: JSON.stringify({
        items,
        custom_data: {
          user_id: context.userId,
          tip_cents: tipCents,
          amount_cents: amountCents,
        },
      }),
    });
    const json: any = await res.json();
    if (!res.ok || !json.data?.id) {
      console.error("Paddle transaction create failed", json);
      throw new Error(json.error?.detail ?? "Could not start checkout.");
    }
    return { transactionId: json.data.id as string };
  });

/**
 * Record a $0 ("I can't pay right now") contribution directly — no Paddle
 * round-trip. RLS allows the authenticated user to insert their own free row.
 */
export const recordFreeContribution = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: PaddleEnv }) => {
    if (data.environment !== "sandbox" && data.environment !== "live") {
      throw new Error("Invalid environment.");
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("contributions").insert({
      user_id: context.userId,
      amount_cents: 0,
      tip_cents: 0,
      currency: "usd",
      environment: data.environment,
      status: "free",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
