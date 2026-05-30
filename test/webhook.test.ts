import { describe, expect, it, vi } from 'vitest';

import { StripeApiError, createStripeClient } from '../src';
import { createFakeStripe } from './helpers';

describe('WebhookHelper.constructEvent', () => {
  it('delegates to stripe.webhooks.constructEvent with the per-call secret', () => {
    const fake = createFakeStripe();
    const client = createStripeClient({ apiKey: 'sk_test_x', stripe: fake });

    const payload = 'raw-body';
    const sig = 'sig-header';
    const result = client.webhooks.constructEvent(payload, sig, 'whsec_x');

    expect(fake.webhooks.constructEvent).toHaveBeenCalledWith(payload, sig, 'whsec_x', undefined);
    expect(result).toMatchObject({ id: 'evt_1', type: 'payment_intent.succeeded' });
  });

  it('delegates to stripe.webhooks.constructEvent with tolerance when provided', () => {
    const fake = createFakeStripe();
    const client = createStripeClient({ apiKey: 'sk_test_x', stripe: fake });

    client.webhooks.constructEvent('payload', 'sig', 'whsec_x', 300);

    expect(fake.webhooks.constructEvent).toHaveBeenCalledWith('payload', 'sig', 'whsec_x', 300);
  });

  it('falls back to the default webhookSecret when no per-call secret is provided', () => {
    const fake = createFakeStripe();
    const client = createStripeClient({
      apiKey: 'sk_test_x',
      webhookSecret: 'whsec_default',
      stripe: fake,
    });

    client.webhooks.constructEvent('payload', 'sig');

    expect(fake.webhooks.constructEvent).toHaveBeenCalledWith('payload', 'sig', 'whsec_default', undefined);
  });

  it('throws StripeApiError with code missing_webhook_secret when no secret is available', () => {
    const fake = createFakeStripe();
    const client = createStripeClient({ apiKey: 'sk_test_x', stripe: fake });

    expect(() => client.webhooks.constructEvent('payload', 'sig')).toThrow(StripeApiError);

    let caught: unknown;
    try {
      client.webhooks.constructEvent('payload', 'sig');
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(StripeApiError);
    expect((caught as StripeApiError).code).toBe('missing_webhook_secret');
    expect(fake.webhooks.constructEvent).not.toHaveBeenCalled();
  });

  it('throws StripeApiError with code signature_verification_failed when constructEvent throws', () => {
    const fake = createFakeStripe();
    vi.mocked(fake.webhooks.constructEvent).mockImplementationOnce(() => {
      throw new Error('No signatures found matching the expected signature for payload.');
    });

    const client = createStripeClient({ apiKey: 'sk_test_x', stripe: fake });

    let caught: unknown;
    try {
      client.webhooks.constructEvent('tampered-payload', 'bad-sig', 'whsec_x');
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(StripeApiError);
    expect((caught as StripeApiError).code).toBe('signature_verification_failed');
    expect((caught as unknown as { cause: unknown }).cause).toBeInstanceOf(Error);
  });
});
