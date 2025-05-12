import { defineEndpoint } from '@directus/extensions-sdk';

export default defineEndpoint((router, { services, database, getSchema }) => {
	const { AuthenticationService } = services;

	router.post('/login', async (req, res) => {
		try {
			const { username, email, password, otp, session } = req.body;

			// Get the identifier (username or email)
			const identifier = username || email;
			if (!identifier || !password) {
				return res.status(401).json({ error: 'Invalid credentials' });
			}

			// Get the schema
			const schema = await getSchema();

			// Create authentication service instance
			const authService = new AuthenticationService({
				knex: database,
				schema,
			});

			// Find user by username or email
			const user = await database
				.select([
					'id',
					'first_name',
					'last_name',
					'email',
					'password',
					'status',
					'role',
					'tfa_secret',
					'provider',
					'external_identifier',
					'auth_data',
					'username',
				])
				.from('directus_users')
				.where('username', identifier)
				.orWhere('email', identifier)
				.first();

			if (!user) {
				return res.status(401).json({ error: 'Invalid credentials' });
			}

			// Check user status
			if (user.status !== 'active') {
				if (user.status === 'suspended') {
					return res.status(401).json({ error: 'User is suspended' });
				}
				return res.status(401).json({ error: 'Invalid credentials' });
			}

			// Login using the authentication service
			const loginResult = await authService.login(
				user.provider || 'default',
				{ email: user.email, password },
				{ otp, session },
			);

			res.json(loginResult);
		} catch (error) {
			console.error('Login error:', error);
			res.status(500).json({ error: 'Internal server error' });
		}
	});
});
