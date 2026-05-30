import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeList, StripeParams, StripePaymentMethod } from '../core/types.js';

export class PaymentMethodsResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentMethod> {
    return call(() =>
      this.stripe.paymentMethods.create(
        params as Stripe.PaymentMethodCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentMethod>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentMethod> {
    return call(() =>
      this.stripe.paymentMethods.retrieve(
        id,
        params as Stripe.PaymentMethodRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentMethod>;
  }

  update(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentMethod> {
    return call(() =>
      this.stripe.paymentMethods.update(
        id,
        params as Stripe.PaymentMethodUpdateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentMethod>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripePaymentMethod>> {
    return call(() =>
      this.stripe.paymentMethods.list(
        params as Stripe.PaymentMethodListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripePaymentMethod>>;
  }

  attach(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentMethod> {
    return call(() =>
      this.stripe.paymentMethods.attach(
        id,
        params as Stripe.PaymentMethodAttachParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentMethod>;
  }

  detach(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentMethod> {
    return call(() =>
      this.stripe.paymentMethods.detach(
        id,
        params as Stripe.PaymentMethodDetachParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentMethod>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripePaymentMethod, void, undefined> {
    yield* callIterate<StripePaymentMethod>(() =>
      this.stripe.paymentMethods.list(
        params as Stripe.PaymentMethodListParams,
        toRequestOptions(options),
      ),
    );
  }
}
