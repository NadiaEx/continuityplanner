import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { initializePaddle, getPaddleEnvironment } from "@/lib/paddle";
import {
  createContinuityTransaction,
  recordFreeContribution,
} from "@/utils/payments.functions";
import { supabase } from "@/integrations/supabase/client";

export function usePaddleCheckout() {
  const [loading, setLoading] = useState(false);
  const createTx = useServerFn(createContinuityTransaction);
  const recordFree = useServerFn(recordFreeContribution);

  const contribute = async (opts: {
    amountCents: number;
    tipCents: number;
    onClose?: () => void;
    successUrl: string;
  }) => {
    setLoading(true);
    try {
      const environment = getPaddleEnvironment();
      const { transactionId } = await createTx({
        data: {
          amountCents: opts.amountCents,
          tipCents: opts.tipCents,
          environment,
        },
      });
      await initializePaddle();

      const { data: sessionData } = await supabase.auth.getSession();
      const email = sessionData.session?.user?.email;

      window.Paddle.Checkout.open({
        transactionId,
        customer: email ? { email } : undefined,
        settings: {
          displayMode: "overlay",
          successUrl: opts.successUrl,
          allowLogout: false,
          variant: "one-page",
        },
        eventCallback: (ev: any) => {
          if (ev?.name === "checkout.closed") opts.onClose?.();
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const contributeFree = async () => {
    setLoading(true);
    try {
      await recordFree({ data: { environment: getPaddleEnvironment() } });
    } finally {
      setLoading(false);
    }
  };

  return { contribute, contributeFree, loading };
}
