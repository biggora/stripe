import type { DynamicModule, FactoryProvider, ModuleMetadata, Provider } from '@nestjs/common';
import { Module } from '@nestjs/common';

import { StripeClient } from '../client.js';
import type { StripeClientOptions } from '../core/options.js';
import { STRIPE_CLIENT, STRIPE_MODULE_OPTIONS } from './tokens.js';
import { StripeWebhookVerifier } from './webhook-verifier.js';

export type StripeModuleAsyncOptions = {
  imports?: ModuleMetadata['imports'];
  inject?: FactoryProvider<StripeClientOptions>['inject'];
  useFactory: (...args: any[]) => Promise<StripeClientOptions> | StripeClientOptions;
};

function createClientProvider(): Provider {
  return {
    provide: STRIPE_CLIENT,
    inject: [STRIPE_MODULE_OPTIONS],
    useFactory: (options: StripeClientOptions) => new StripeClient(options),
  };
}

@Module({})
export class StripeModule {
  static forRoot(options: StripeClientOptions): DynamicModule {
    return {
      module: StripeModule,
      providers: [
        {
          provide: STRIPE_MODULE_OPTIONS,
          useValue: options,
        },
        createClientProvider(),
        StripeWebhookVerifier,
      ],
      exports: [STRIPE_CLIENT, StripeWebhookVerifier],
    };
  }

  static forRootAsync(options: StripeModuleAsyncOptions): DynamicModule {
    return {
      module: StripeModule,
      imports: options.imports ?? [],
      providers: [
        {
          provide: STRIPE_MODULE_OPTIONS,
          inject: options.inject ?? [],
          useFactory: options.useFactory,
        },
        createClientProvider(),
        StripeWebhookVerifier,
      ],
      exports: [STRIPE_CLIENT, StripeWebhookVerifier],
    };
  }
}
