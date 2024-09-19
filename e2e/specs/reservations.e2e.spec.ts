describe('Reservations', () => {
	const user = {
		email: 'ashothovhannisyan088@gmail.com',
		password: 'Ejmiacin7',
	};

	beforeAll(async () => {
		await fetch('http://auth/3001', {
			method: 'POST',
			body: JSON.stringify(user),
		});
	});
	it('Add Reservations', () => {});
});
