import { Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				uri: configService.get('DB_CONNECT'),
			}),
			inject: [ConfigService],
		}),
	],
})
export class DatabaseModule {
	static forFeature(models: ModelDefinition[]) {
		// console.log(models);

		return MongooseModule.forFeature(models);
	}
}
