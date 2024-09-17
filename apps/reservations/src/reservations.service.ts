import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.respository';
import { PAYMENT_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';

@Injectable()
export class ReservationsService {
	constructor(
		private readonly reservationRepository: ReservationRepository,
		@Inject(PAYMENT_SERVICE) readonly paymentService: ClientProxy,
	) {}

	async create(createReservationDto: CreateReservationDto, { email, _id }: UserDto) {
		return this.paymentService
			.send('create_charge', {
				...createReservationDto.charge,
				email,
			})
			.pipe(
				map((result) => {
					console.log(result, 'result');
					return this.reservationRepository.create({
						...createReservationDto,
						invoiceId: result.id,
						timestamp: new Date(),
						userId: _id,
					});
				}),
				catchError((error) => {
					console.error('Error when creating charge:', error);
					throw new HttpException('Payment service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
				}),
			);
	}

	async findAll() {
		return this.reservationRepository.find({});
	}

	async findOne(_id: string) {
		return this.reservationRepository.findOne({ _id });
	}

	async update(_id: string, updateReservationDto: UpdateReservationDto) {
		return this.reservationRepository.update({ _id }, { $set: updateReservationDto });
	}

	async remove(_id: string) {
		return this.reservationRepository.findOneAndDelete({ _id });
	}
}
