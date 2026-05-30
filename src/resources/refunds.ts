import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeList, StripeParams, StripeRefund } from '../core/types.js';

export class RefundsResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripeRefund> {
    return call(() =>
      this.stripe.refunds.create(
        params as Stripe.RefundCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeRefund>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeRefund> {
    return call(() =>
      this.stripe.refunds.retrieve(
        id,
        params as Stripe.RefundRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeRefund>;
  }

  update(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripeRefund> {
    return call(() =>
      this.stripe.refunds.update(
        id,
        params as Stripe.RefundUpdateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeRefund>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripeRefund>> {
    return call(() =>
      this.stripe.refunds.list(
        params as Stripe.RefundListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripeRefund>>;
  }

  cancel(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeRefund> {
    return call(() =>
      this.stripe.refunds.cancel(
        id,
        params as Stripe.RefundCancelParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeRefund>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripeRefund, void, undefined> {
    yield* callIterate<StripeRefund>(() =>
      this.stripe.refunds.list(
        params as Stripe.RefundListParams,
        toRequestOptions(options),
      ),
    );
  }
}
