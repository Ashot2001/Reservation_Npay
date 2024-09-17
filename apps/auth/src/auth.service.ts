import { Injectable } from '@nestjs/common';
import { UserDocument } from '@app/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPaylod } from './interfaces/token-payload.interfaces';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {}
	login(user: UserDocument, response: Response) {
		const tokenPayload: TokenPaylod = {
			userId: user._id.toHexString(),
		};
		const expires = new Date();
		expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));
		const token = this.jwtService.sign(tokenPayload);
		response.cookie('Authentication', token, {
			httpOnly: true,
			expires,
		});
	}
}
