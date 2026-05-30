import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeList, StripeParams, StripeSetupIntent } from '../core/types.js';

export class SetupIntentsResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripeSetupIntent> {
    return call(() =>
      this.stripe.setupIntents.create(
        params as Stripe.SetupIntentCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeSetupIntent>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeSetupIntent> {
    return call(() =>
      this.stripe.setupIntents.retrieve(
        id,
        params as Stripe.SetupIntentRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeSetupIntent>;
  }

  update(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripeSetupIntent> {
    return call(() =>
      this.stripe.setupIntents.update(
        id,
        params as Stripe.SetupIntentUpdateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeSetupIntent>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripeSetupIntent>> {
    return call(() =>
      this.stripe.setupIntents.list(
        params as Stripe.SetupIntentListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripeSetupIntent>>;
  }

  confirm(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeSetupIntent> {
    return call(() =>
      this.stripe.setupIntents.confirm(
        id,
        params as Stripe.SetupIntentConfirmParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeSetupIntent>;
  }

  cancel(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeSetupIntent> {
    return call(() =>
      this.stripe.setupIntents.cancel(
        id,
        params as Stripe.SetupIntentCancelParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeSetupIntent>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripeSetupIntent, void, undefined> {
    yield* callIterate<StripeSetupIntent>(() =>
      this.stripe.setupIntents.list(
        params as Stripe.SetupIntentListParams,
        toRequestOptions(options),
      ),
    );
  }
}
