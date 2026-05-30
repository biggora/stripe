# @biggora/stripe

[![npm version](https://img.shields.io/npm/v/@biggora/stripe.svg)](https://www.npmjs.com/package/@biggora/stripe)
[![Unit Tests](https://github.com/biggora/stripe/actions/workflows/unit-tests.yml/badge.svg)](https://github.com/biggora/stripe/actions/workflows/unit-tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript SDK and NestJS adapter for the Stripe API, built as a thin wrapper over the official [`stripe`](https://www.npmjs.com/package/stripe) (stripe-node) package.

Targets Node.js `20+`. Ships dual `ESM`/`CommonJS` builds and a first-class NestJS subpath export.

## Install

```bash
npm install @biggora/stripe
```

The official `stripe` package is a regular dependency and is installed automatically.

NestJS apps also need peer deps:

```bash
npm install @nestjs/common @nestjs/core reflect-metadata rxjs
```

## Quick Start

```ts
import { createStripeClient } from '@biggora/stripe';

const client = createStripeClient({
  apiKey: process.env.STRIPE_SECRET_KEY!,
});

const intent = await client.paymentIntents.create({
  amount: 1000,
  currency: 'eur',
  automatic_payment_methods: { enabled: true },
});

console.log(intent.id, intent.client_secret);
```

`createStripeClient` accepts the full `StripeClientOptions`:

```ts
const client = createStripeClient({
  apiKey: process.env.STRIPE_SECRET_KEY!,
  apiVersion: '2025-03-31.basil',
  maxNetworkRetries: 2,
  timeoutMs: 30_000,
  stripeAccount: 'acct_123',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
});
```

| Option | Type | Description |
| --- | --- | --- |
| `apiKey` | `string` | Stripe secret key. Required. |
| `apiVersion` | `string` | Pin the Stripe API version. Defaults to the version bundled with `stripe`. |
| `maxNetworkRetries` | `number` | Automatic retries for failed requests. |
| `timeoutMs` | `number` | Request timeout in milliseconds. Defaults to `30000`. |
| `stripeAccount` | `string` | Connected account id used for all requests (Stripe Connect). |
| `webhookSecret` | `string` | Default signing secret for webhook verification. |
| `stripe` | `Stripe` | Inject a preconfigured official `Stripe` instance instead of the options above. |

The underlying official SDK is always available on `client.stripe` as an escape hatch for endpoints, options, or fully typed parameters this wrapper does not expose:

```ts
const balance = await client.stripe.balance.retrieve();
```

## Resources

Every resource exposes the same shape over the official SDK: `create`/`retrieve`/`update`/`list` (where applicable), resource-specific actions, and an `iterateAll()` async iterator that auto-paginates. Each method takes optional per-call `StripeRequestOptions` as its last argument (`idempotencyKey`, `stripeAccount`, `apiVersion`).

`list()` returns a single page as `StripeList<T>`. `iterateAll()` returns an async generator that walks every page transparently:

```ts
const page = await client.customers.list({ limit: 20 });

for await (const customer of client.customers.iterateAll({ limit: 100 })) {
  console.log(customer.id);
}
```

### Customers

`create`, `retrieve`, `update`, `list`, `del`, `iterateAll`

```ts
const customer = await client.customers.create(
  { email: 'buyer@example.com', name: 'Ada Lovelace' },
  { idempotencyKey: 'cust-create-1001' },
);

await client.customers.update(customer.id, { metadata: { plan: 'pro' } });
await client.customers.del(customer.id);
```

### Payment Intents

`create`, `retrieve`, `update`, `list`, `confirm`, `capture`, `cancel`, `iterateAll`

```ts
const intent = await client.paymentIntents.create({
  amount: 2500,
  currency: 'eur',
  capture_method: 'manual',
});

await client.paymentIntents.confirm(intent.id, { payment_method: 'pm_card_visa' });
await client.paymentIntents.capture(intent.id, { amount_to_capture: 2000 });
await client.paymentIntents.cancel(intent.id);
```

### Checkout Sessions

`create`, `retrieve`, `list`, `expire`, `listLineItems`, `iterateAll`

```ts
const session = await client.checkoutSessions.create({
  mode: 'payment',
  line_items: [{ price: 'price_123', quantity: 1 }],
  success_url: 'https://shop.example/checkout/success',
  cancel_url: 'https://shop.example/checkout/cancel',
});

console.log(session.url);

const lineItems = await client.checkoutSessions.listLineItems(session.id);
await client.checkoutSessions.expire(session.id);
```

### Payment Methods

`create`, `retrieve`, `update`, `list`, `attach`, `detach`, `iterateAll`

```ts
await client.paymentMethods.attach('pm_123', { customer: 'cus_123' });
await client.paymentMethods.detach('pm_123');
```

### Setup Intents

`create`, `retrieve`, `update`, `list`, `confirm`, `cancel`, `iterateAll`

```ts
const setup = await client.setupIntents.create({ customer: 'cus_123' });
await client.setupIntents.confirm(setup.id, { payment_method: 'pm_card_visa' });
```

### Refunds

`create`, `retrieve`, `update`, `list`, `cancel`, `iterateAll`

```ts
const refund = await client.refunds.create({ payment_intent: 'pi_123' });
await client.refunds.cancel(refund.id);
```

### Products

`create`, `retrieve`, `update`, `list`, `del`, `iterateAll`

```ts
const product = await client.products.create({ name: 'Pro plan' });
```

### Prices

`create`, `retrieve`, `update`, `list`, `iterateAll`

```ts
const price = await client.prices.create({
  product: 'prod_123',
  currency: 'eur',
  unit_amount: 1999,
  recurring: { interval: 'month' },
});
```

### Subscriptions

`create`, `retrieve`, `update`, `list`, `cancel`, `iterateAll`

```ts
const subscription = await client.subscriptions.create({
  customer: 'cus_123',
  items: [{ price: 'price_123' }],
});

await client.subscriptions.cancel(subscription.id);
```

### Invoices

`create`, `retrieve`, `update`, `list`, `del`, `finalizeInvoice`, `pay`, `voidInvoice`, `sendInvoice`, `iterateAll`

```ts
const invoice = await client.invoices.create({ customer: 'cus_123' });

await client.invoices.finalizeInvoice(invoice.id);
await client.invoices.pay(invoice.id);
await client.invoices.sendInvoice(invoice.id);
await client.invoices.voidInvoice(invoice.id);
```

### Webhook Endpoints

`create`, `retrieve`, `update`, `list`, `del`, `iterateAll`

```ts
await client.webhookEndpoints.create({
  url: 'https://shop.example/stripe/webhook',
  enabled_events: ['payment_intent.succeeded', 'charge.refunded'],
});
```

### Events

`retrieve`, `list`, `iterateAll`

```ts
const event = await client.events.retrieve('evt_123');

for await (const e of client.events.iterateAll({ type: 'payment_intent.succeeded' })) {
  console.log(e.id);
}
```

## Webhooks

Verify and parse incoming webhooks with `client.webhooks.constructEvent`. It wraps the official `stripe.webhooks.constructEvent` and returns a typed `StripeEvent`.

```ts
import type { StripeEvent } from '@biggora/stripe';

export function handleStripeWebhook(rawBody: Buffer, signature: string) {
  const event: StripeEvent = client.webhooks.constructEvent(rawBody, signature);

  if (event.type === 'payment_intent.succeeded') {
    // update order state from event.data.object
  }

  return 'OK';
}
```

Signature: `constructEvent(rawBody, signature, secret?, tolerance?)`.

- `rawBody` must be the **raw request body** (`Buffer` or `string`), not the JSON-parsed object. Body parsers that mutate the payload break signature verification.
- `signature` is the value of the `Stripe-Signature` request header.
- `secret` is optional. When omitted, the `webhookSecret` from `StripeClientOptions` is used as a fallback.
- `tolerance` is optional and forwarded to Stripe for timestamp drift checks.

A `StripeApiError` is thrown when no signing secret is available (`code: 'missing_webhook_secret'`) and when verification fails (`code: 'signature_verification_failed'`).

## NestJS

Register the module with `StripeModule.forRoot`:

```ts
import { Module } from '@nestjs/common';
import { StripeModule } from '@biggora/stripe/nestjs';

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_SECRET_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    }),
  ],
})
export class AppModule {}
```

Async config keeps credentials in your existing config service:

```ts
import { ConfigService } from '@nestjs/config';

StripeModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    apiKey: config.getOrThrow('STRIPE_SECRET_KEY'),
    webhookSecret: config.get('STRIPE_WEBHOOK_SECRET'),
  }),
});
```

Inject the client with `@InjectStripeClient()` and verify webhooks with the provided `StripeWebhookVerifier`:

```ts
import { Controller, Injectable, Post, Headers, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { InjectStripeClient, StripeWebhookVerifier } from '@biggora/stripe/nestjs';
import type { StripeClient } from '@biggora/stripe';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectStripeClient() private readonly stripe: StripeClient,
  ) {}

  createIntent() {
    return this.stripe.paymentIntents.create({
      amount: 1000,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    });
  }
}

@Controller('stripe')
export class StripeController {
  constructor(private readonly webhooks: StripeWebhookVerifier) {}

  @Post('webhook')
  handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const event = this.webhooks.constructEvent(req.rawBody!, signature);
    return { received: true, type: event.type };
  }
}
```

Enable raw body before registering webhook routes so the signature can be verified:

```ts
const app = await NestFactory.create(AppModule, { rawBody: true });
```

## Errors

Failed API responses and request failures throw `StripeApiError`. It normalizes the official `Stripe.errors.StripeError` into a stable shape.

```ts
import { StripeApiError } from '@biggora/stripe';

try {
  await client.paymentIntents.retrieve('pi_missing');
} catch (error) {
  if (error instanceof StripeApiError) {
    console.log(error.type, error.code, error.declineCode);
    console.log(error.param, error.statusCode, error.requestId);
    // error.raw  -> original Stripe payload
    // error.cause -> original thrown error
  }
}
```

`StripeApiError` fields: `type`, `code`, `declineCode`, `param`, `statusCode`, `requestId`, `raw`, and `cause` (standard `Error` cause).

`type` mirrors the official `stripe` error class name (e.g. `'StripeCardError'`, `'StripeInvalidRequestError'`), while `code` is the granular error code (e.g. `'card_declined'`). The raw Stripe API error type string (e.g. `'card_error'`) is preserved on `error.raw`.

## Scripts

```bash
npm test
npm run test:watch
npm run typecheck
npm run build
```
