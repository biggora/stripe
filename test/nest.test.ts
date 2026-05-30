import 'reflect-metadata';

import { Inject } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';

import { StripeClient } from '../src';
import {
  InjectStripeClient,
  STRIPE_CLIENT,
  StripeModule,
  StripeWebhookVerifier,
} from '../src/nest';
import { createFakeStripe } from './helpers';

class DirectInjectService {
  constructor(@Inject(STRIPE_CLIENT) readonly client: StripeClient) {}
}

class DecoratorInjectService {
  constructor(@InjectStripeClient() readonly client: StripeClient) {}
}

describe('StripeModule.forRoot', () => {
  it('resolves STRIPE_CLIENT token', async () => {
    const fake = createFakeStripe();
    const moduleRef = await Test.createTestingModule({
      imports: [StripeModule.forRoot({ apiKey: 'sk_test_x', stripe: fake })],
    }).compile();

    const client = moduleRef.get<StripeClient>(STRIPE_CLIENT);
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(StripeClient);
  });

  it('direct @Inject(STRIPE_CLIENT) and @InjectStripeClient() resolve to the same instance', async () => {
    const fake = createFakeStripe();
    const moduleRef = await Test.createTestingModule({
      imports: [StripeModule.forRoot({ apiKey: 'sk_test_x', stripe: fake })],
      providers: [DirectInjectService, DecoratorInjectService],
    }).compile();

    const direct = moduleRef.get(DirectInjectService);
    const decorated = moduleRef.get(DecoratorInjectService);

    expect(direct.client).toBeDefined();
    expect(decorated.client).toBe(direct.client);
  });
});

describe('StripeModule.forRootAsync', () => {
  it('builds the client through a useFactory', async () => {
    const fake = createFakeStripe();
    const moduleRef = await Test.createTestingModule({
      imports: [
        StripeModule.forRootAsync({
          useFactory: async () => ({ apiKey: 'sk_test_x', stripe: fake }),
        }),
      ],
    }).compile();

    const client = moduleRef.get<StripeClient>(STRIPE_CLIENT);
    expect(client).toBeDefined();
    expect(client.paymentIntents).toBeDefined();
    expect(client.customers).toBeDefined();
  });
});

describe('StripeWebhookVerifier', () => {
  it('resolves from the NestJS container', async () => {
    const fake = createFakeStripe();
    const moduleRef = await Test.createTestingModule({
      imports: [StripeModule.forRoot({ apiKey: 'sk_test_x', stripe: fake })],
    }).compile();

    const verifier = moduleRef.get(StripeWebhookVerifier);
    expect(verifier).toBeDefined();
    expect(verifier).toBeInstanceOf(StripeWebhookVerifier);
  });

  it('constructEvent delegates to fake stripe.webhooks.constructEvent', async () => {
    const fake = createFakeStripe();
    vi.mocked(fake.webhooks.constructEvent).mockReturnValueOnce({
      id: 'evt_webhook_1',
      type: 'customer.created',
    } as ReturnType<typeof fake.webhooks.constructEvent>);

    const moduleRef = await Test.createTestingModule({
      imports: [StripeModule.forRoot({ apiKey: 'sk_test_x', stripe: fake })],
    }).compile();

    const verifier = moduleRef.get(StripeWebhookVerifier);
    const event = verifier.constructEvent('payload', 'sig', 'whsec_x');

    expect(fake.webhooks.constructEvent).toHaveBeenCalledWith('payload', 'sig', 'whsec_x', undefined);
    expect(event).toMatchObject({ id: 'evt_webhook_1', type: 'customer.created' });
  });
});
