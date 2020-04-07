require('dotenv').config();
module.exports = {
	development: {
		username: 'postgres',
		password: '',
		database: 'covid_19',
		host: '127.0.0.1',
		dialect: 'postgres',
		operatorsAliases: false,
		logging: false,
	},
	test: {
		username: 'root',
		password: null,
		database: 'database_test',
		host: '127.0.0.1',
		dialect: 'mysql',
		operatorsAliases: false,
	},
	production: {
		use_env_variable: 'DATABASE_URL',
		dialect: 'postgres',
		logging: false,
		dialectOptions: {
			ssl: true,
		},
	},
};
