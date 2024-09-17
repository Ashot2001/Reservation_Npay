import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { Injectable, Inject } from '@nestjs/common';
import { NOTIFY_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {
	private readonly stripe: Stripe;

	constructor(
		private readonly configService: ConfigService,
		@Inject(NOTIFY_SERVICE) private readonly notificationService: ClientProxy,
	) {
		this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
			apiVersion: '2024-06-20',
		});
	}

	async createCharge({ amount, email }: PaymentsCreateChargeDto) {
		const paymentIntent = await this.stripe.paymentIntents.create({
			amount: amount * 100,
			currency: 'usd',
			payment_method: 'pm_card_visa',
			confirm: true,
			automatic_payment_methods: {
				enabled: true,
				allow_redirects: 'never',
			},
		});

		this.notificationService.emit('notify_email', {
			email,
			text: `Your Payment of $${amount} has completed successfully !`,
		});

		return paymentIntent;
	}
}
