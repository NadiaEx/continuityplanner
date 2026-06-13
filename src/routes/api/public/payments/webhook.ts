import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { verifyWebhook, EventName, type PaddleEnv } from "@/lib/paddle.server";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }
  return _supabase;
}

async function handleTransactionCompleted(data: any, env: PaddleEnv) {
  const userId = data.customData?.userId ?? data.customData?.user_id;
  if (!userId) {
    console.warn("transaction.completed missing customData.userId", { id: data.id });
    return;
  }

  // Pull amounts from custom_data first (cents we set ourselves), fall back to
  // totals from Paddle so refunds/adjustments still record sane numbers.
  const amountCents = Number(data.customData?.amountCents ?? data.customData?.amount_cents ?? 0);
  const tipCents = Number(data.customData?.tipCents ?? data.customData?.tip_cents ?? 0);
  const currency = (data.currencyCode ?? "USD").toLowerCase();

  await (getSupabase().from("contributions") as any).upsert(
    {
      user_id: userId,
      paddle_transaction_id: data.id,
      amount_cents: amountCents,
      tip_cents: tipCents,
      currency,
      environment: env,
      status: "completed",
      paid_at: data.billedAt ?? new Date().toISOString(),
    },
    { onConflict: "paddle_transaction_id" },
  );
}

async function handleWebhook(req: Request, env: PaddleEnv) {
  const event = await verifyWebhook(req, env);
  switch (event.eventType) {
    case EventName.TransactionCompleted:
      await handleTransactionCompleted((event as any).data, env);
      break;
    default:
      console.log("Unhandled Paddle event:", event.eventType);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const env = (url.searchParams.get("env") || "sandbox") as PaddleEnv;
        try {
          await handleWebhook(request, env);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Paddle webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
