import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const stripeSecret =
      this.configService.getOrThrow<string>('STRIPE_SECRET');
    this.stripe = new Stripe(stripeSecret);
  }

  async createPaymentSession(
    dto: CreatePaymentSessionDto,
  ): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: dto.items.map((item) => ({
        price_data: {
          currency: dto.currency,
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: this.configService.get<string>('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.get<string>('STRIPE_CANCEL_URL'),
      payment_intent_data: {
        metadata: {
          orderId: dto.orderId,
        },
      },
    });

    return session;
  }

  constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
    const endpointSecret = this.configService.getOrThrow<string>(
      'STRIPE_ENDPOINT_SECRET',
    );

    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      endpointSecret,
    );
  }
}
/*
dhsaj
*/