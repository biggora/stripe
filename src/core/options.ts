import Stripe from 'stripe';

export type StripeClientOptions = {
  apiKey: string;
  apiVersion?: string;
  maxNetworkRetries?: number;
  timeoutMs?: number;
  stripeAccount?: string;
  webhookSecret?: string;
  stripe?: Stripe;
};

type StripeConstructorConfig = NonNullable<ConstructorParameters<typeof Stripe>[1]>;

export function buildStripe(options: StripeClientOptions): Stripe {
  if (options.stripe !== undefined) {
    return options.stripe;
  }

  const config: StripeConstructorConfig = {
    timeout: options.timeoutMs ?? 30_000,
  };

  if (options.apiVersion !== undefined) {
    // Cast through unknown to satisfy the narrow literal union type of apiVersion.
    (config as Record<string, unknown>)['apiVersion'] = options.apiVersion;
  }
  if (options.maxNetworkRetries !== undefined) {
    config.maxNetworkRetries = options.maxNetworkRetries;
  }
  if (options.stripeAccount !== undefined) {
    config.stripeAccount = options.stripeAccount;
  }

  return new Stripe(options.apiKey, config);
}
