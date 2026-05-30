import { Inject, Injectable } from '@nestjs/common';

import { StripeClient } from '../client.js';
import type { StripeEvent } from '../core/types.js';
import { STRIPE_CLIENT } from './tokens.js';

@Injectable()
export class StripeWebhookVerifier {
  constructor(@Inject(STRIPE_CLIENT) private readonly client: StripeClient) {}

  constructEvent(
    payload: string | Buffer,
    signature: string,
    secret?: string,
    tolerance?: number,
  ): StripeEvent {
    return this.client.webhooks.constructEvent(payload, signature, secret, tolerance);
  }
}
