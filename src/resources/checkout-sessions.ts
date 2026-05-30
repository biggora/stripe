import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeCheckoutSession, StripeList, StripeParams } from '../core/types.js';

export class CheckoutSessionsResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripeCheckoutSession> {
    return call(() =>
      this.stripe.checkout.sessions.create(
        params as Stripe.Checkout.SessionCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeCheckoutSession>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeCheckoutSession> {
    return call(() =>
      this.stripe.checkout.sessions.retrieve(
        id,
        params as Stripe.Checkout.SessionRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeCheckoutSession>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripeCheckoutSession>> {
    return call(() =>
      this.stripe.checkout.sessions.list(
        params as Stripe.Checkout.SessionListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripeCheckoutSession>>;
  }

  expire(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeCheckoutSession> {
    return call(() =>
      this.stripe.checkout.sessions.expire(
        id,
        params as Stripe.Checkout.SessionExpireParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeCheckoutSession>;
  }

  listLineItems(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList> {
    return call(() =>
      this.stripe.checkout.sessions.listLineItems(
        id,
        params as Stripe.Checkout.SessionListLineItemsParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripeCheckoutSession, void, undefined> {
    yield* callIterate<StripeCheckoutSession>(() =>
      this.stripe.checkout.sessions.list(
        params as Stripe.Checkout.SessionListParams,
        toRequestOptions(options),
      ),
    );
  }
}
