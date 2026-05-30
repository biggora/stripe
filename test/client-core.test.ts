import Stripe from 'stripe';
import { describe, expect, it } from 'vitest';

import { StripeApiError, StripeClient, WebhookHelper, createStripeClient } from '../src';
import { call } from '../src/core/call';
import { toStripeApiError } from '../src/core/error';
import { createFakeStripe } from './helpers';

describe('createStripeClient with injected fake stripe', () => {
  it('returns the injected stripe instance as client.stripe', () => {
    const fake = createFakeStripe();
    const client = createStripeClient({ apiKey: 'sk_test_x', stripe: fake });
    expect(client.stripe).toBe(fake);
  });

  it('creates a StripeClient instance', () => {
    const client = createStripeClient({ apiKey: 'sk_test_x', stripe: createFakeStripe() });
    expect(client).toBeInstanceOf(StripeClient);
  });

  it('exposes all 12 resource namespaces and webhooks helper', () => {
    const client = createStripeClient({ apiKey: 'sk_test_x', stripe: createFakeStripe() });
    expect(client.customers).toBeDefined();
    expect(client.paymentIntents).toBeDefined();
    expect(client.checkoutSessions).toBeDefined();
    expect(client.paymentMethods).toBeDefined();
    expect(client.setupIntents).toBeDefined();
    expect(client.refunds).toBeDefined();
    expect(client.products).toBeDefined();
    expect(client.prices).toBeDefined();
    expect(client.subscriptions).toBeDefined();
    expect(client.invoices).toBeDefined();
    expect(client.webhookEndpoints).toBeDefined();
    expect(client.events).toBeDefined();
    expect(client.webhooks).toBeDefined();
    expect(client.webhooks).toBeInstanceOf(WebhookHelper);
  });
});

describe('createStripeClient without injected stripe', () => {
  it('creates a real Stripe instance under client.stripe', () => {
    const client = createStripeClient({ apiKey: 'sk_test_x' });
    expect(client.stripe).toBeInstanceOf(Stripe);
  });
});

describe('toStripeApiError', () => {
  it('passes through an existing StripeApiError unchanged (identity)', () => {
    const original = new StripeApiError('already wrapped', { code: 'some_code' });
    const result = toStripeApiError(original);
    expect(result).toBe(original);
  });

  it('maps a real Stripe SDK error to StripeApiError with correct fields', () => {
    // Build a real StripeCardError using the SDK's generate helper so instanceof works.
    // NOTE: Stripe.errors.StripeError.generate() sets error.type to the class name
    // ('StripeCardError') not the raw 'card_error' string — that is the actual SDK behaviour.
    const rawInput = {
      type: 'card_error',
      code: 'card_declined',
      decline_code: 'insufficient_funds',
      param: 'card',
      statusCode: 402,
      requestId: 'req_test_123',
      message: 'Your card has insufficient funds.',
    };
    const stripeErr = Stripe.errors.StripeError.generate(rawInput as Parameters<typeof Stripe.errors.StripeError.generate>[0]);

    const result = toStripeApiError(stripeErr);

    expect(result).toBeInstanceOf(StripeApiError);
    // The SDK sets .type to the class name on generated errors.
    expect(result.type).toBe(stripeErr.type);
    expect(result.code).toBe('card_declined');
    expect(result.declineCode).toBe('insufficient_funds');
    expect(result.param).toBe('card');
    expect(result.statusCode).toBe(402);
    expect(result.requestId).toBe('req_test_123');
    expect(result.raw).toBe(stripeErr.raw);
    expect((result as unknown as { cause: unknown }).cause).toBe(stripeErr);
  });

  it('wraps a plain Error as unknown_error', () => {
    const plain = new Error('something broke');
    const result = toStripeApiError(plain);

    expect(result).toBeInstanceOf(StripeApiError);
    expect(result.code).toBe('unknown_error');
    expect(result.message).toBe('something broke');
    expect((result as unknown as { cause: unknown }).cause).toBe(plain);
  });

  it('wraps a non-Error thrown value as unknown_error', () => {
    const result = toStripeApiError('unexpected string');
    expect(result).toBeInstanceOf(StripeApiError);
    expect(result.code).toBe('unknown_error');
  });
});

describe('call()', () => {
  it('returns the resolved value on success', async () => {
    const result = await call(async () => ({ id: 'pi_1' }));
    expect(result).toEqual({ id: 'pi_1' });
  });

  it('rejects with StripeApiError when the fn throws', async () => {
    await expect(
      call(async () => {
        throw new Error('network error');
      }),
    ).rejects.toBeInstanceOf(StripeApiError);
  });

  it('preserves the original error as cause when fn throws', async () => {
    const original = new Error('timeout');
    let caught: unknown;
    try {
      await call(async () => {
        throw original;
      });
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(StripeApiError);
    expect((caught as { cause: unknown }).cause).toBe(original);
  });
});
