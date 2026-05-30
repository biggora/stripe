import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeList, StripeParams, StripePaymentIntent } from '../core/types.js';

export class PaymentIntentsResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentIntent> {
    return call(() =>
      this.stripe.paymentIntents.create(
        params as unknown as Stripe.PaymentIntentCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentIntent>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentIntent> {
    return call(() =>
      this.stripe.paymentIntents.retrieve(
        id,
        params as Stripe.PaymentIntentRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentIntent>;
  }

  update(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentIntent> {
    return call(() =>
      this.stripe.paymentIntents.update(
        id,
        params as Stripe.PaymentIntentUpdateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentIntent>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripePaymentIntent>> {
    return call(() =>
      this.stripe.paymentIntents.list(
        params as Stripe.PaymentIntentListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripePaymentIntent>>;
  }

  confirm(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentIntent> {
    return call(() =>
      this.stripe.paymentIntents.confirm(
        id,
        params as Stripe.PaymentIntentConfirmParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentIntent>;
  }

  capture(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentIntent> {
    return call(() =>
      this.stripe.paymentIntents.capture(
        id,
        params as Stripe.PaymentIntentCaptureParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentIntent>;
  }

  cancel(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripePaymentIntent> {
    return call(() =>
      this.stripe.paymentIntents.cancel(
        id,
        params as Stripe.PaymentIntentCancelParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripePaymentIntent>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripePaymentIntent, void, undefined> {
    yield* callIterate<StripePaymentIntent>(() =>
      this.stripe.paymentIntents.list(
        params as Stripe.PaymentIntentListParams,
        toRequestOptions(options),
      ),
    );
  }
}
