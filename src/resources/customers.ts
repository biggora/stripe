import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeCustomer, StripeList, StripeParams } from '../core/types.js';

export class CustomersResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripeCustomer> {
    return call(() =>
      this.stripe.customers.create(
        params as Stripe.CustomerCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeCustomer>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeCustomer> {
    return call(() =>
      this.stripe.customers.retrieve(
        id,
        params as Stripe.CustomerRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeCustomer>;
  }

  update(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripeCustomer> {
    return call(() =>
      this.stripe.customers.update(
        id,
        params as Stripe.CustomerUpdateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeCustomer>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripeCustomer>> {
    return call(() =>
      this.stripe.customers.list(
        params as Stripe.CustomerListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripeCustomer>>;
  }

  del(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeCustomer> {
    return call(() =>
      this.stripe.customers.del(
        id,
        params as Stripe.CustomerDeleteParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeCustomer>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripeCustomer, void, undefined> {
    yield* callIterate<StripeCustomer>(() =>
      this.stripe.customers.list(
        params as Stripe.CustomerListParams,
        toRequestOptions(options),
      ),
    );
  }
}
