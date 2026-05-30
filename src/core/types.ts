export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonRecord = Record<string, JsonValue>;

export type QueryPrimitive = string | number | boolean;
export type QueryValue = QueryPrimitive | QueryPrimitive[] | null | undefined;
export type QueryRecord = Record<string, QueryValue>;

export type StripeList<TItem = JsonRecord> = {
  object?: 'list' | string;
  data?: TItem[];
  has_more?: boolean;
  url?: string;
  [key: string]: unknown;
};

export type StripeParams = JsonRecord;

export type StripePaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded'
  | string;

export type StripeSetupIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'canceled'
  | 'succeeded'
  | string;

export type StripeSubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'paused'
  | string;

export type StripeInvoiceStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void' | string;

export type StripeRefundStatus = 'pending' | 'succeeded' | 'failed' | 'canceled' | string;

export type StripeCheckoutSessionStatus = 'open' | 'complete' | 'expired' | string;

export type StripeCustomer = JsonRecord & {
  id?: string;
  email?: string;
  name?: string;
};

export type StripePaymentIntent = JsonRecord & {
  id?: string;
  status?: StripePaymentIntentStatus;
  amount?: number;
  currency?: string;
  client_secret?: string;
};

export type StripeCheckoutSession = JsonRecord & {
  id?: string;
  status?: StripeCheckoutSessionStatus;
  url?: string;
  payment_intent?: string;
};

export type StripePaymentMethod = JsonRecord & {
  id?: string;
  type?: string;
};

export type StripeSetupIntent = JsonRecord & {
  id?: string;
  status?: StripeSetupIntentStatus;
  client_secret?: string;
};

export type StripeRefund = JsonRecord & {
  id?: string;
  status?: StripeRefundStatus;
  amount?: number;
  currency?: string;
};

export type StripeProduct = JsonRecord & {
  id?: string;
  name?: string;
  active?: boolean;
};

export type StripePrice = JsonRecord & {
  id?: string;
  currency?: string;
  unit_amount?: number;
};

export type StripeSubscription = JsonRecord & {
  id?: string;
  status?: StripeSubscriptionStatus;
  customer?: string;
};

export type StripeInvoice = JsonRecord & {
  id?: string;
  status?: StripeInvoiceStatus;
  customer?: string;
  amount_due?: number;
};

export type StripeWebhookEndpoint = JsonRecord & {
  id?: string;
  url?: string;
  enabled_events?: string[];
};

export type StripeEvent<TData = JsonRecord> = JsonRecord & {
  id?: string;
  type?: string;
  data?: { object?: TData; [key: string]: unknown };
};
