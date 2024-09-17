import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '@app/common';
import { UserDocument } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}
	@Post()
	async createUser(@Body() createUSerDto: CreateUserDto) {
		return this.userService.create(createUSerDto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getUser(@CurrentUser() user: UserDocument) {
		return user;
	}
}
