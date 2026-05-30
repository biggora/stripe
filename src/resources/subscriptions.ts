import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeList, StripeParams, StripeSubscription } from '../core/types.js';

export class SubscriptionsResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripeSubscription> {
    return call(() =>
      this.stripe.subscriptions.create(
        params as Stripe.SubscriptionCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeSubscription>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeSubscription> {
    return call(() =>
      this.stripe.subscriptions.retrieve(
        id,
        params as Stripe.SubscriptionRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeSubscription>;
  }

  update(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripeSubscription> {
    return call(() =>
      this.stripe.subscriptions.update(
        id,
        params as Stripe.SubscriptionUpdateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeSubscription>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripeSubscription>> {
    return call(() =>
      this.stripe.subscriptions.list(
        params as Stripe.SubscriptionListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripeSubscription>>;
  }

  cancel(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeSubscription> {
    return call(() =>
      this.stripe.subscriptions.cancel(
        id,
        params as Stripe.SubscriptionCancelParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeSubscription>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripeSubscription, void, undefined> {
    yield* callIterate<StripeSubscription>(() =>
      this.stripe.subscriptions.list(
        params as Stripe.SubscriptionListParams,
        toRequestOptions(options),
      ),
    );
  }
}
