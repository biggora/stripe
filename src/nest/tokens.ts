import { Inject } from '@nestjs/common';

export const STRIPE_CLIENT = Symbol('STRIPE_CLIENT');
export const STRIPE_MODULE_OPTIONS = Symbol('STRIPE_MODULE_OPTIONS');

export function InjectStripeClient(): ParameterDecorator {
  return Inject(STRIPE_CLIENT);
}
