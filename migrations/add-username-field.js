export default {
	id: 'add-username-field',
	name: 'Add username field to directus_users',
	timestamp: Date.now(),
	async up(knex) {
		// Add username column if it doesn't exist
		await knex.schema.alterTable('directus_users', (table) => {
			table.string('username', 64).unique().index();
		});

		// Update existing users to use email as username if username is null
		await knex('directus_users')
			.whereNull('username')
			.update({
				username: knex.raw('email'),
			});
	},
	async down(knex) {
		await knex.schema.alterTable('directus_users', (table) => {
			table.dropColumn('username');
		});
	},
};
