import type Stripe from 'stripe';

import { buildStripe } from './core/options.js';
import type { StripeClientOptions } from './core/options.js';
import { WebhookHelper } from './core/webhook.js';
import { CheckoutSessionsResource } from './resources/checkout-sessions.js';
import { CustomersResource } from './resources/customers.js';
import { EventsResource } from './resources/events.js';
import { InvoicesResource } from './resources/invoices.js';
import { PaymentIntentsResource } from './resources/payment-intents.js';
import { PaymentMethodsResource } from './resources/payment-methods.js';
import { PricesResource } from './resources/prices.js';
import { ProductsResource } from './resources/products.js';
import { RefundsResource } from './resources/refunds.js';
import { SetupIntentsResource } from './resources/setup-intents.js';
import { SubscriptionsResource } from './resources/subscriptions.js';
import { WebhookEndpointsResource } from './resources/webhook-endpoints.js';

export class StripeClient {
  readonly stripe: Stripe;
  readonly customers: CustomersResource;
  readonly paymentIntents: PaymentIntentsResource;
  readonly checkoutSessions: CheckoutSessionsResource;
  readonly paymentMethods: PaymentMethodsResource;
  readonly setupIntents: SetupIntentsResource;
  readonly refunds: RefundsResource;
  readonly products: ProductsResource;
  readonly prices: PricesResource;
  readonly subscriptions: SubscriptionsResource;
  readonly invoices: InvoicesResource;
  readonly webhookEndpoints: WebhookEndpointsResource;
  readonly events: EventsResource;
  readonly webhooks: WebhookHelper;

  constructor(options: StripeClientOptions) {
    this.stripe = buildStripe(options);
    this.customers = new CustomersResource(this.stripe);
    this.paymentIntents = new PaymentIntentsResource(this.stripe);
    this.checkoutSessions = new CheckoutSessionsResource(this.stripe);
    this.paymentMethods = new PaymentMethodsResource(this.stripe);
    this.setupIntents = new SetupIntentsResource(this.stripe);
    this.refunds = new RefundsResource(this.stripe);
    this.products = new ProductsResource(this.stripe);
    this.prices = new PricesResource(this.stripe);
    this.subscriptions = new SubscriptionsResource(this.stripe);
    this.invoices = new InvoicesResource(this.stripe);
    this.webhookEndpoints = new WebhookEndpointsResource(this.stripe);
    this.events = new EventsResource(this.stripe);
    this.webhooks = new WebhookHelper(this.stripe, options.webhookSecret);
  }
}

export function createStripeClient(options: StripeClientOptions): StripeClient {
  return new StripeClient(options);
}
