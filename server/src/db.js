
import { Pool } from 'pg';

const pool = new Pool({
	user: 'postgress',
	host: 'localhost',
	database: 'postgress',
	password: 'docker',
	port: 5432,
});

module.exports = pool;
