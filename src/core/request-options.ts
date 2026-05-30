import type Stripe from 'stripe';

export type StripeRequestOptions = {
  idempotencyKey?: string;
  stripeAccount?: string;
  apiVersion?: string;
};

export function toRequestOptions(options?: StripeRequestOptions): Stripe.RequestOptions | undefined {
  if (options === undefined) {
    return undefined;
  }

  const result: Stripe.RequestOptions = {};
  if (options.idempotencyKey !== undefined) result.idempotencyKey = options.idempotencyKey;
  if (options.stripeAccount !== undefined) result.stripeAccount = options.stripeAccount;
  if (options.apiVersion !== undefined) result.apiVersion = options.apiVersion;
  return result;
}
