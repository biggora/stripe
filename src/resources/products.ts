import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeList, StripeParams, StripeProduct } from '../core/types.js';

export class ProductsResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripeProduct> {
    return call(() =>
      this.stripe.products.create(
        params as unknown as Stripe.ProductCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeProduct>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeProduct> {
    return call(() =>
      this.stripe.products.retrieve(
        id,
        params as Stripe.ProductRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeProduct>;
  }

  update(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripeProduct> {
    return call(() =>
      this.stripe.products.update(
        id,
        params as Stripe.ProductUpdateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeProduct>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripeProduct>> {
    return call(() =>
      this.stripe.products.list(
        params as Stripe.ProductListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripeProduct>>;
  }

  del(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeProduct> {
    return call(() =>
      this.stripe.products.del(
        id,
        params as Stripe.ProductDeleteParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeProduct>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripeProduct, void, undefined> {
    yield* callIterate<StripeProduct>(() =>
      this.stripe.products.list(
        params as Stripe.ProductListParams,
        toRequestOptions(options),
      ),
    );
  }
}
