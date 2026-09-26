import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  async createPaymentSession(
    @Body() dto: CreatePaymentSessionDto,
  ): Promise<Stripe.Checkout.Session> {
    const session = await this.paymentsService.createPaymentSession(dto);
    return session;
  }

  @Get('success')
  paymentSuccess() {
    return { ok: true, message: 'Payment successful' };
  }

  @Get('cancel')
  paymentCancel() {
    return { ok: false, message: 'Payment cancelled' };
  }

  @Post('webhook')
  @HttpCode(200)
  handleWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!request.rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    let event: Stripe.Event;

    try {
      event = this.paymentsService.constructWebhookEvent(
        request.rawBody,
        signature,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err}`);
      throw new BadRequestException('Webhook Error');
    }

    if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      const orderId = charge.metadata?.orderId;
      this.logger.log(`charge.succeeded recibido. orderId: ${orderId}`);
    } else {
      this.logger.log(`Evento no manejado: ${event.type}`);
    }

    return { received: true };
  }
}