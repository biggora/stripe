import Stripe from 'stripe';
import { describe, expect, it, vi } from 'vitest';

import { createStripeClient, StripeApiError } from '../src';
import { toRequestOptions } from '../src/core/request-options';
import { createFakeStripe, makeAsyncIterable } from './helpers';

function buildClient() {
  const fake = createFakeStripe();
  const client = createStripeClient({ apiKey: 'sk_test_x', stripe: fake });
  return { client, fake };
}

// ---------------------------------------------------------------------------
// toRequestOptions
// ---------------------------------------------------------------------------

describe('toRequestOptions', () => {
  it('returns undefined when called with undefined', () => {
    expect(toRequestOptions(undefined)).toBeUndefined();
  });

  it('maps idempotencyKey', () => {
    expect(toRequestOptions({ idempotencyKey: 'k1' })).toEqual({ idempotencyKey: 'k1' });
  });

  it('maps stripeAccount', () => {
    expect(toRequestOptions({ stripeAccount: 'acct_1' })).toEqual({ stripeAccount: 'acct_1' });
  });

  it('maps apiVersion', () => {
    expect(toRequestOptions({ apiVersion: '2024-06-20' })).toEqual({ apiVersion: '2024-06-20' });
  });

  it('omits keys that are undefined', () => {
    const result = toRequestOptions({ idempotencyKey: 'k1' });
    expect(result).not.toHaveProperty('stripeAccount');
    expect(result).not.toHaveProperty('apiVersion');
  });
});

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

describe('customers resource', () => {
  it('delegates create() to stripe.customers.create with params and options', async () => {
    const { client, fake } = buildClient();
    const params = { email: 'a@b.c' };
    await client.customers.create(params, { idempotencyKey: 'k1' });
    expect(fake.customers.create).toHaveBeenCalledWith(params, { idempotencyKey: 'k1' });
  });

  it('passes undefined as second arg when no options provided', async () => {
    const { client, fake } = buildClient();
    await client.customers.create({ email: 'a@b.c' });
    expect(fake.customers.create).toHaveBeenCalledWith({ email: 'a@b.c' }, undefined);
  });

  it('delegates retrieve() to stripe.customers.retrieve', async () => {
    const { client, fake } = buildClient();
    await client.customers.retrieve('cus_1');
    expect(fake.customers.retrieve).toHaveBeenCalledWith('cus_1', undefined, undefined);
  });

  it('delegates update() to stripe.customers.update', async () => {
    const { client, fake } = buildClient();
    await client.customers.update('cus_1', { name: 'Bob' });
    expect(fake.customers.update).toHaveBeenCalledWith('cus_1', { name: 'Bob' }, undefined);
  });

  it('delegates list() to stripe.customers.list', async () => {
    const { client, fake } = buildClient();
    await client.customers.list();
    expect(fake.customers.list).toHaveBeenCalled();
  });

  it('delegates del() to stripe.customers.del', async () => {
    const { client, fake } = buildClient();
    await client.customers.del('cus_1');
    expect(fake.customers.del).toHaveBeenCalledWith('cus_1', undefined, undefined);
  });

  it('iterateAll collects all items from the async iterable returned by list', async () => {
    const { client, fake } = buildClient();
    const items = [{ id: 'cus_1' }, { id: 'cus_2' }];
    vi.mocked(fake.customers.list).mockReturnValueOnce(makeAsyncIterable(items) as ReturnType<typeof fake.customers.list>);

    const collected: unknown[] = [];
    for await (const item of client.customers.iterateAll()) {
      collected.push(item);
    }
    expect(collected).toEqual(items);
  });
});

// ---------------------------------------------------------------------------
// PaymentIntents
// ---------------------------------------------------------------------------

describe('paymentIntents resource', () => {
  it('delegates create()', async () => {
    const { client, fake } = buildClient();
    await client.paymentIntents.create({ amount: 1000, currency: 'usd' });
    expect(fake.paymentIntents.create).toHaveBeenCalledWith({ amount: 1000, currency: 'usd' }, undefined);
  });

  it('delegates confirm() to stripe.paymentIntents.confirm', async () => {
    const { client, fake } = buildClient();
    await client.paymentIntents.confirm('pi_1');
    expect(fake.paymentIntents.confirm).toHaveBeenCalledWith('pi_1', undefined, undefined);
  });

  it('delegates capture() to stripe.paymentIntents.capture', async () => {
    const { client, fake } = buildClient();
    await client.paymentIntents.capture('pi_1');
    expect(fake.paymentIntents.capture).toHaveBeenCalledWith('pi_1', undefined, undefined);
  });

  it('delegates cancel() to stripe.paymentIntents.cancel', async () => {
    const { client, fake } = buildClient();
    await client.paymentIntents.cancel('pi_1');
    expect(fake.paymentIntents.cancel).toHaveBeenCalledWith('pi_1', undefined, undefined);
  });
});

// ---------------------------------------------------------------------------
// CheckoutSessions (nested: stripe.checkout.sessions)
// ---------------------------------------------------------------------------

describe('checkoutSessions resource', () => {
  it('delegates create() to stripe.checkout.sessions.create', async () => {
    const { client, fake } = buildClient();
    const params = { success_url: 'https://example.com/ok' };
    await client.checkoutSessions.create(params);
    expect(fake.checkout.sessions.create).toHaveBeenCalledWith(params, undefined);
  });

  it('delegates expire() to stripe.checkout.sessions.expire', async () => {
    const { client, fake } = buildClient();
    await client.checkoutSessions.expire('cs_1');
    expect(fake.checkout.sessions.expire).toHaveBeenCalledWith('cs_1', undefined, undefined);
  });

  it('delegates listLineItems() to stripe.checkout.sessions.listLineItems', async () => {
    const { client, fake } = buildClient();
    await client.checkoutSessions.listLineItems('cs_1');
    expect(fake.checkout.sessions.listLineItems).toHaveBeenCalledWith('cs_1', undefined, undefined);
  });
});

// ---------------------------------------------------------------------------
// PaymentMethods
// ---------------------------------------------------------------------------

describe('paymentMethods resource', () => {
  it('delegates attach() to stripe.paymentMethods.attach', async () => {
    const { client, fake } = buildClient();
    await client.paymentMethods.attach('pm_1', { customer: 'cus_1' });
    expect(fake.paymentMethods.attach).toHaveBeenCalledWith('pm_1', { customer: 'cus_1' }, undefined);
  });

  it('delegates detach() to stripe.paymentMethods.detach', async () => {
    const { client, fake } = buildClient();
    await client.paymentMethods.detach('pm_1');
    expect(fake.paymentMethods.detach).toHaveBeenCalledWith('pm_1', undefined, undefined);
  });
});

// ---------------------------------------------------------------------------
// SetupIntents
// ---------------------------------------------------------------------------

describe('setupIntents resource', () => {
  it('delegates confirm() to stripe.setupIntents.confirm', async () => {
    const { client, fake } = buildClient();
    await client.setupIntents.confirm('seti_1');
    expect(fake.setupIntents.confirm).toHaveBeenCalledWith('seti_1', undefined, undefined);
  });

  it('delegates cancel() to stripe.setupIntents.cancel', async () => {
    const { client, fake } = buildClient();
    await client.setupIntents.cancel('seti_1');
    expect(fake.setupIntents.cancel).toHaveBeenCalledWith('seti_1', undefined, undefined);
  });
});

// ---------------------------------------------------------------------------
// Refunds
// ---------------------------------------------------------------------------

describe('refunds resource', () => {
  it('delegates create() to stripe.refunds.create', async () => {
    const { client, fake } = buildClient();
    await client.refunds.create({ payment_intent: 'pi_1' });
    expect(fake.refunds.create).toHaveBeenCalledWith({ payment_intent: 'pi_1' }, undefined);
  });

  it('delegates cancel() to stripe.refunds.cancel', async () => {
    const { client, fake } = buildClient();
    await client.refunds.cancel('re_1');
    expect(fake.refunds.cancel).toHaveBeenCalledWith('re_1', undefined, undefined);
  });
});

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

describe('products resource', () => {
  it('delegates create() to stripe.products.create', async () => {
    const { client, fake } = buildClient();
    await client.products.create({ name: 'Widget' });
    expect(fake.products.create).toHaveBeenCalledWith({ name: 'Widget' }, undefined);
  });

  it('delegates del() to stripe.products.del', async () => {
    const { client, fake } = buildClient();
    await client.products.del('prod_1');
    expect(fake.products.del).toHaveBeenCalledWith('prod_1', undefined, undefined);
  });
});

// ---------------------------------------------------------------------------
// Prices
// ---------------------------------------------------------------------------

describe('prices resource', () => {
  it('delegates create() to stripe.prices.create', async () => {
    const { client, fake } = buildClient();
    await client.prices.create({ currency: 'usd', unit_amount: 500 });
    expect(fake.prices.create).toHaveBeenCalledWith({ currency: 'usd', unit_amount: 500 }, undefined);
  });

  it('delegates list() to stripe.prices.list', async () => {
    const { client, fake } = buildClient();
    await client.prices.list({ active: true });
    expect(fake.prices.list).toHaveBeenCalledWith({ active: true }, undefined);
  });
});

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

describe('subscriptions resource', () => {
  it('delegates create() to stripe.subscriptions.create', async () => {
    const { client, fake } = buildClient();
    await client.subscriptions.create({ customer: 'cus_1' });
    expect(fake.subscriptions.create).toHaveBeenCalledWith({ customer: 'cus_1' }, undefined);
  });

  it('delegates cancel() to stripe.subscriptions.cancel', async () => {
    const { client, fake } = buildClient();
    await client.subscriptions.cancel('sub_1');
    expect(fake.subscriptions.cancel).toHaveBeenCalledWith('sub_1', undefined, undefined);
  });
});

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

describe('invoices resource', () => {
  it('delegates finalizeInvoice() to stripe.invoices.finalizeInvoice', async () => {
    const { client, fake } = buildClient();
    await client.invoices.finalizeInvoice('in_1');
    expect(fake.invoices.finalizeInvoice).toHaveBeenCalledWith('in_1', undefined, undefined);
  });

  it('delegates voidInvoice() to stripe.invoices.voidInvoice', async () => {
    const { client, fake } = buildClient();
    await client.invoices.voidInvoice('in_1');
    expect(fake.invoices.voidInvoice).toHaveBeenCalledWith('in_1', undefined, undefined);
  });

  it('delegates pay() to stripe.invoices.pay', async () => {
    const { client, fake } = buildClient();
    await client.invoices.pay('in_1');
    expect(fake.invoices.pay).toHaveBeenCalledWith('in_1', undefined, undefined);
  });

  it('delegates sendInvoice() to stripe.invoices.sendInvoice', async () => {
    const { client, fake } = buildClient();
    await client.invoices.sendInvoice('in_1');
    expect(fake.invoices.sendInvoice).toHaveBeenCalledWith('in_1', undefined, undefined);
  });
});

// ---------------------------------------------------------------------------
// WebhookEndpoints
// ---------------------------------------------------------------------------

describe('webhookEndpoints resource', () => {
  it('delegates create() to stripe.webhookEndpoints.create', async () => {
    const { client, fake } = buildClient();
    const params = { url: 'https://example.com/hook', enabled_events: ['payment_intent.succeeded'] };
    await client.webhookEndpoints.create(params);
    expect(fake.webhookEndpoints.create).toHaveBeenCalledWith(params, undefined);
  });

  it('delegates del() to stripe.webhookEndpoints.del', async () => {
    const { client, fake } = buildClient();
    await client.webhookEndpoints.del('we_1');
    expect(fake.webhookEndpoints.del).toHaveBeenCalledWith('we_1', undefined, undefined);
  });
});

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

describe('events resource', () => {
  it('delegates retrieve() to stripe.events.retrieve', async () => {
    const { client, fake } = buildClient();
    await client.events.retrieve('evt_1');
    expect(fake.events.retrieve).toHaveBeenCalledWith('evt_1', undefined, undefined);
  });

  it('delegates list() to stripe.events.list', async () => {
    const { client, fake } = buildClient();
    await client.events.list({ type: 'payment_intent.succeeded' });
    expect(fake.events.list).toHaveBeenCalledWith({ type: 'payment_intent.succeeded' }, undefined);
  });
});

// ---------------------------------------------------------------------------
// iterateAll error normalization
// ---------------------------------------------------------------------------

describe('iterateAll error normalization', () => {
  function stripeError() {
    return Stripe.errors.StripeError.generate({
      type: 'api_error',
      message: 'pagination failed',
    } as Parameters<typeof Stripe.errors.StripeError.generate>[0]);
  }

  it('wraps an error thrown while auto-paginating into StripeApiError', async () => {
    const { client, fake } = buildClient();
    const err = stripeError();
    const failing: AsyncIterable<unknown> = {
      [Symbol.asyncIterator]() {
        return {
          next: async () => {
            throw err;
          },
        };
      },
    };
    vi.mocked(fake.customers.list).mockReturnValueOnce(
      failing as ReturnType<typeof fake.customers.list>,
    );

    const run = (async () => {
      for await (const item of client.customers.iterateAll()) {
        void item;
      }
    })();

    await expect(run).rejects.toBeInstanceOf(StripeApiError);
  });

  it('wraps a synchronous list() failure into StripeApiError', async () => {
    const { client, fake } = buildClient();
    const err = stripeError();
    vi.mocked(fake.products.list).mockImplementationOnce(() => {
      throw err;
    });

    const run = (async () => {
      for await (const item of client.products.iterateAll()) {
        void item;
      }
    })();

    await expect(run).rejects.toBeInstanceOf(StripeApiError);
  });
});
