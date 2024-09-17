import { AbstractRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { UserDocument } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
	protected readonly logger = new Logger(UsersRepository.name);

	constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
		super(userModel);
	}
}
