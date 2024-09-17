import { compare, hash } from 'bcryptjs';

export class UserEntities {
	email: string;
	password: string;

	constructor(email: string, password: string) {
		this.email = email;
		this.password = password;
	}

	async $setPass(password: string) {
		this.password = await hash(password, 10);
		return this.password;
	}

	async $validatePass(password: string, hashPassword: string) {
		const isValidPassword = await compare(password, hashPassword);
		return isValidPassword;
	}
}
