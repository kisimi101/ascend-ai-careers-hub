import { supabase } from "@/integrations/supabase/client";

export const POLAR_PRODUCTS = {
  pro: "d0cd8c03-c0b8-49b2-921d-21a1564855c2",
  enterprise: "c547e521-c8e9-4e1d-b1b1-d33e5606f5d5",
} as const;

export const createCheckout = async (productId: string): Promise<string> => {
  const successUrl = `${window.location.origin}/tools`;

  const { data, error } = await supabase.functions.invoke("polar-checkout", {
    body: { productId, successUrl },
  });

  if (error) throw error;
  if (!data?.url) throw new Error("No checkout URL returned");

  return data.url;
};
