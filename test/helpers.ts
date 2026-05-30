import { vi } from 'vitest';

import type Stripe from 'stripe';

function makeCrud() {
  return {
    create: vi.fn(async (p: unknown) => ({ id: 'obj_1', ...((p as object) ?? {}) })),
    retrieve: vi.fn(async (id: string) => ({ id })),
    update: vi.fn(async (id: string, p: unknown) => ({ id, ...((p as object) ?? {}) })),
    list: vi.fn(async () => ({ object: 'list', data: [], has_more: false })),
    del: vi.fn(async (id: string) => ({ id, deleted: true })),
  };
}

export function createFakeStripe() {
  return {
    customers: makeCrud(),
    paymentIntents: {
      ...makeCrud(),
      confirm: vi.fn(async (id: string) => ({ id, status: 'succeeded' })),
      capture: vi.fn(async (id: string) => ({ id, status: 'requires_capture' })),
      cancel: vi.fn(async (id: string) => ({ id, status: 'canceled' })),
    },
    checkout: {
      sessions: {
        ...makeCrud(),
        expire: vi.fn(async (id: string) => ({ id, status: 'expired' })),
        listLineItems: vi.fn(async () => ({ object: 'list', data: [] })),
      },
    },
    paymentMethods: {
      ...makeCrud(),
      attach: vi.fn(async (id: string) => ({ id })),
      detach: vi.fn(async (id: string) => ({ id })),
    },
    setupIntents: {
      ...makeCrud(),
      confirm: vi.fn(async (id: string) => ({ id, status: 'succeeded' })),
      cancel: vi.fn(async (id: string) => ({ id, status: 'canceled' })),
    },
    refunds: {
      ...makeCrud(),
      cancel: vi.fn(async (id: string) => ({ id, status: 'canceled' })),
    },
    products: makeCrud(),
    prices: makeCrud(),
    subscriptions: {
      ...makeCrud(),
      cancel: vi.fn(async (id: string) => ({ id, status: 'canceled' })),
    },
    invoices: {
      ...makeCrud(),
      finalizeInvoice: vi.fn(async (id: string) => ({ id })),
      pay: vi.fn(async (id: string) => ({ id })),
      voidInvoice: vi.fn(async (id: string) => ({ id, status: 'void' })),
      sendInvoice: vi.fn(async (id: string) => ({ id })),
    },
    webhookEndpoints: makeCrud(),
    events: {
      retrieve: vi.fn(async (id: string) => ({ id })),
      list: vi.fn(async () => ({ object: 'list', data: [], has_more: false })),
    },
    webhooks: {
      constructEvent: vi.fn(() => ({ id: 'evt_1', type: 'payment_intent.succeeded' })),
    },
  } as unknown as Stripe;
}

/** Returns an async-iterable that yields `items` one by one. */
export function makeAsyncIterable<T>(items: T[]): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator](): AsyncIterator<T> {
      let index = 0;
      return {
        async next() {
          if (index < items.length) {
            return { value: items[index++] as T, done: false };
          }
          return { value: undefined as unknown as T, done: true };
        },
      };
    },
  };
}
