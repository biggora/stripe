import type Stripe from 'stripe';

import { call, callIterate } from '../core/call.js';
import { toRequestOptions } from '../core/request-options.js';
import type { StripeRequestOptions } from '../core/request-options.js';
import type { StripeInvoice, StripeList, StripeParams } from '../core/types.js';

export class InvoicesResource {
  constructor(private readonly stripe: Stripe) {}

  create(params: StripeParams, options?: StripeRequestOptions): Promise<StripeInvoice> {
    return call(() =>
      this.stripe.invoices.create(
        params as Stripe.InvoiceCreateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeInvoice>;
  }

  retrieve(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeInvoice> {
    return call(() =>
      this.stripe.invoices.retrieve(
        id,
        params as Stripe.InvoiceRetrieveParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeInvoice>;
  }

  update(id: string, params: StripeParams, options?: StripeRequestOptions): Promise<StripeInvoice> {
    return call(() =>
      this.stripe.invoices.update(
        id,
        params as Stripe.InvoiceUpdateParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeInvoice>;
  }

  list(params?: StripeParams, options?: StripeRequestOptions): Promise<StripeList<StripeInvoice>> {
    return call(() =>
      this.stripe.invoices.list(
        params as Stripe.InvoiceListParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeList<StripeInvoice>>;
  }

  del(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeInvoice> {
    return call(() =>
      this.stripe.invoices.del(
        id,
        params as Stripe.InvoiceDeleteParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeInvoice>;
  }

  finalizeInvoice(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeInvoice> {
    return call(() =>
      this.stripe.invoices.finalizeInvoice(
        id,
        params as Stripe.InvoiceFinalizeInvoiceParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeInvoice>;
  }

  pay(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeInvoice> {
    return call(() =>
      this.stripe.invoices.pay(
        id,
        params as Stripe.InvoicePayParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeInvoice>;
  }

  voidInvoice(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeInvoice> {
    return call(() =>
      this.stripe.invoices.voidInvoice(
        id,
        params as Stripe.InvoiceVoidInvoiceParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeInvoice>;
  }

  sendInvoice(id: string, params?: StripeParams, options?: StripeRequestOptions): Promise<StripeInvoice> {
    return call(() =>
      this.stripe.invoices.sendInvoice(
        id,
        params as Stripe.InvoiceSendInvoiceParams,
        toRequestOptions(options),
      ),
    ) as unknown as Promise<StripeInvoice>;
  }

  async *iterateAll(
    params?: StripeParams,
    options?: StripeRequestOptions,
  ): AsyncGenerator<StripeInvoice, void, undefined> {
    yield* callIterate<StripeInvoice>(() =>
      this.stripe.invoices.list(
        params as Stripe.InvoiceListParams,
        toRequestOptions(options),
      ),
    );
  }
}
