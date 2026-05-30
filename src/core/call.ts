import { toStripeApiError } from './error.js';

export async function call<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw toStripeApiError(error);
  }
}

export async function* callIterate<T>(
  factory: () => AsyncIterable<unknown>,
): AsyncGenerator<T, void, undefined> {
  try {
    for await (const item of factory()) {
      yield item as T;
    }
  } catch (error) {
    throw toStripeApiError(error);
  }
}
