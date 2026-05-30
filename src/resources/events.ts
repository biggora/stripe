import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeEvent, StripeList, StripeParams } from '../core/types.js';

export class EventsResource {
  constructor(private readonly stripe: Stripe) {}

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeEvent> {
    return call(() =>
      this.stripe.events.retrieve(
        id,
        params as Stripe.EventRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeEvent>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripeEvent>> {
    return call(() =>
      this.stripe.events.list(
        params as Stripe.EventListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripeEvent>>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripeEvent, void, undefined> {
    yield* callIterate<StripeEvent>(() =>
      this.stripe.events.list(
        params as Stripe.EventListParams,
        toRequestOptions(options),
      ),
    );
  }
}
