import { describe, expect, it } from 'vitest';

import * as root from '../src';
import * as nest from '../src/nest';

describe('root barrel exports', () => {
  it('exports StripeClient', () => {
    expect(root.StripeClient).toBeDefined();
    expect(typeof root.StripeClient).toBe('function');
  });

  it('exports createStripeClient', () => {
    expect(root.createStripeClient).toBeDefined();
    expect(typeof root.createStripeClient).toBe('function');
  });

  it('exports StripeApiError', () => {
    expect(root.StripeApiError).toBeDefined();
    expect(typeof root.StripeApiError).toBe('function');
  });

  it('exports WebhookHelper', () => {
    expect(root.WebhookHelper).toBeDefined();
    expect(typeof root.WebhookHelper).toBe('function');
  });
});

describe('nest barrel exports', () => {
  it('exports StripeModule', () => {
    expect(nest.StripeModule).toBeDefined();
    expect(typeof nest.StripeModule).toBe('function');
  });

  it('exports STRIPE_CLIENT token', () => {
    expect(nest.STRIPE_CLIENT).toBeDefined();
    expect(typeof nest.STRIPE_CLIENT).toBe('symbol');
  });

  it('exports InjectStripeClient decorator', () => {
    expect(nest.InjectStripeClient).toBeDefined();
    expect(typeof nest.InjectStripeClient).toBe('function');
  });

  it('exports StripeWebhookVerifier', () => {
    expect(nest.StripeWebhookVerifier).toBeDefined();
    expect(typeof nest.StripeWebhookVerifier).toBe('function');
  });
});
