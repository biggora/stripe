import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeList, StripeParams, StripePrice } from '../core/types.js';

export class PricesResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripePrice> {
    return call(() =>
      this.stripe.prices.create(
        params as unknown as Stripe.PriceCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePrice>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripePrice> {
    return call(() =>
      this.stripe.prices.retrieve(
        id,
        params as Stripe.PriceRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePrice>;
  }

  update(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripePrice> {
    return call(() =>
      this.stripe.prices.update(
        id,
        params as Stripe.PriceUpdateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePrice>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripePrice>> {
    return call(() =>
      this.stripe.prices.list(
        params as Stripe.PriceListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripePrice>>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripePrice, void, undefined> {
    yield* callIterate<StripePrice>(() =>
      this.stripe.prices.list(
        params as Stripe.PriceListParams,
        toRequestOptions(options),
      ),
    );
  }
}
