import type Stripe from 'stripe';

import { StripeApiError } from './error.js';
import type { StripeEvent } from './types.js';

export class WebhookHelper {
  constructor(
    private readonly stripe: Stripe,
    private readonly defaultSecret?: string,
  ) {}

  constructEvent(
    payload: string | Buffer,
    signature: string,
    secret?: string,
    tolerance?: number,
  ): StripeEvent {
    const signingSecret = secret ?? this.defaultSecret;

    if (signingSecret === undefined) {
      throw new StripeApiError('Webhook signing secret is required.', {
        code: 'missing_webhook_secret',
      });
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        signingSecret,
        tolerance,
      ) as unknown as StripeEvent;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Webhook signature verification failed.';
      throw new StripeApiError(message, {
        code: 'signature_verification_failed',
        cause: error,
      });
    }
  }
}
