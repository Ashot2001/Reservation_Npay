import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, PAYMENT_SERVICE } from '@app/common';
import { ReservationRepository } from './reservation.respository';
import { ReservationDocument, ReservationSchema } from './models/reservation.model';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';

@Module({
	imports: [
		DatabaseModule,
		DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema }]),
		LoggerModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				DB_CONNECT: Joi.string().required(),
				PORT: Joi.string().required(),
				AUTH_HOST: Joi.string().required(),
				AUTH_PORT: Joi.string().required(),
				PAYMENTS_HOST: Joi.string().required(),
				PAYMENTS_PORT: Joi.string().required(),
			}),
		}),
		ClientsModule.registerAsync([
			{
				name: AUTH_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get('AUTH_HOST'),
						port: configService.get('AUTH_PORT'),
					},
				}),
				inject: [ConfigService],
			},

			{
				name: PAYMENT_SERVICE,
				useFactory: (configService: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get('PAYMENTS_HOST'),
						port: configService.get('PAYMENTS_PORT'),
					},
				}),
				inject: [ConfigService],
			},
		]),
	],
	controllers: [ReservationsController],
	providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
