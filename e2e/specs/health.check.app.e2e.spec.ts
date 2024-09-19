import { ping } from 'tcp-ping';

describe('Health', () => {
	describe('Reservations', () => {
		it('should get a successful response', async () => {
			const response = await fetch('http://reservations:3000');
			expect(response.ok).toBeTruthy();
		});
	});
});

describe('Auth', () => {
	it('Should get a successful response', async () => {
		const res = await fetch('http://auth:3001');

		console.log(res);

		expect(res.ok).toBeTruthy();
	});

	test('Payments', (done) => {
		ping({ address: 'payments', port: 3003 }, (err) => {
			if (err) {
				fail();
			}
			done();
		});
	});

	test('Notifications', (done) => {
		ping({ address: 'notifications', port: 3004 }, (err) => {
			if (err) {
				fail();
			}
			done();
		});
	});
});
