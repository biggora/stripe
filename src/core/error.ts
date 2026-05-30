import Stripe from 'stripe';

export type StripeApiErrorOptions = {
  type?: string | undefined;
  code?: string | undefined;
  declineCode?: string | undefined;
  param?: string | undefined;
  statusCode?: number | undefined;
  requestId?: string | undefined;
  raw?: unknown;
  cause?: unknown;
};

export class StripeApiError extends Error {
  type: string | undefined;
  code: string | undefined;
  declineCode: string | undefined;
  param: string | undefined;
  statusCode: number | undefined;
  requestId: string | undefined;
  raw: unknown;

  constructor(message: string, options: StripeApiErrorOptions = {}) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = 'StripeApiError';
    this.type = options.type;
    this.code = options.code;
    this.declineCode = options.declineCode;
    this.param = options.param;
    this.statusCode = options.statusCode;
    this.requestId = options.requestId;
    this.raw = options.raw;
  }
}

export function toStripeApiError(error: unknown): StripeApiError {
  if (error instanceof StripeApiError) {
    return error;
  }

  if (error instanceof Stripe.errors.StripeError) {
    const opts: StripeApiErrorOptions = { cause: error, raw: error.raw };
    if (error.type !== undefined) opts.type = error.type;
    if (error.code !== undefined) opts.code = error.code;
    if (error.decline_code !== undefined) opts.declineCode = error.decline_code;
    if (error.param !== undefined) opts.param = error.param;
    if (error.statusCode !== undefined) opts.statusCode = error.statusCode;
    if (error.requestId !== undefined) opts.requestId = error.requestId;
    return new StripeApiError(error.message, opts);
  }

  const message = error instanceof Error ? error.message : 'Stripe API request failed.';
  return new StripeApiError(message, { code: 'unknown_error', cause: error });
}
