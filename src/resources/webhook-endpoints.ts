import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeList, StripeParams, StripeWebhookEndpoint } from '../core/types.js';

export class WebhookEndpointsResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripeWebhookEndpoint> {
    return call(() =>
      this.stripe.webhookEndpoints.create(
        params as unknown as Stripe.WebhookEndpointCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeWebhookEndpoint>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeWebhookEndpoint> {
    return call(() =>
      this.stripe.webhookEndpoints.retrieve(
        id,
        params as Stripe.WebhookEndpointRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeWebhookEndpoint>;
  }

  update(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripeWebhookEndpoint> {
    return call(() =>
      this.stripe.webhookEndpoints.update(
        id,
        params as Stripe.WebhookEndpointUpdateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeWebhookEndpoint>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripeWebhookEndpoint>> {
    return call(() =>
      this.stripe.webhookEndpoints.list(
        params as Stripe.WebhookEndpointListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripeWebhookEndpoint>>;
  }

  del(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeWebhookEndpoint> {
    return call(() =>
      this.stripe.webhookEndpoints.del(
        id,
        params as Stripe.WebhookEndpointDeleteParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeWebhookEndpoint>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripeWebhookEndpoint, void, undefined> {
    yield* callIterate<StripeWebhookEndpoint>(() =>
      this.stripe.webhookEndpoints.list(
        params as Stripe.WebhookEndpointListParams,
        toRequestOptions(options),
      ),
    );
  }
}
