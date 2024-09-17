import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UserEntities } from './entity/users.entities';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
	constructor(private readonly userRepository: UsersRepository) {}

	async create(createUserDto: CreateUserDto) {
		await this.validateCreateUserDto(createUserDto);
		const newUser = new UserEntities(createUserDto.email, createUserDto.password);
		await newUser.$setPass(createUserDto.password);
		return this.userRepository.create(newUser);
	}

	private async validateCreateUserDto(createUserDto: CreateUserDto) {
		try {
			await this.userRepository.findOne({ email: createUserDto.email });
		} catch (error) {
			return;
		}
		throw new UnprocessableEntityException('Email alredy exists.');
	}

	async verifyUser(email: string, password: string) {
		console.log('Starting verification for:', email);
		const user = await this.userRepository.findOne({ email });
		if (!user) {
			console.log('User not found for:', email);
			throw new UnauthorizedException('User not found.');
		}

		const userEntity = new UserEntities(user.email, user.password);
		const isValidPassword = await userEntity.$validatePass(password, userEntity.password);
		console.log('Password validation result for:', email, isValidPassword);
		if (!isValidPassword) {
			console.log('Invalid credentials for:', email);
			throw new UnauthorizedException('Credentials are not valid.');
		}
		return user;
	}
	async getUser(getUserDto: GetUserDto) {
		return this.userRepository.findOne(getUserDto);
	}
}
