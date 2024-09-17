import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPaylod } from '../interfaces/token-payload.interfaces';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly userService: UsersService,
	) {
		console.log('Amennnn angam mtneluccccc');

		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: any) => request?.cookies?.Authentication || request?.Authentication,
			]),
			secretOrKey: configService.get<string>('JWT_SECRET'),
		});
	}

	async validate({ userId }: TokenPaylod) {
		return this.userService.getUser({ _id: userId });
	}
}
