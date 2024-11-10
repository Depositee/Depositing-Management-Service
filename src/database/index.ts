import { Client } from 'pg';
import { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } from '@config';

export const client = new Client({
  connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
});

const initSQL = `
-- Drop existing tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(48) NOT NULL,
    createdAt TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW() AT TIME ZONE 'utc'),
    updatedAt TIMESTAMP WITHOUT TIME ZONE
);

-- Create orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    depositor_id VARCHAR(48) NOT NULL,
    depositee_id VARCHAR(48),
    package_id VARCHAR(48) NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    package_description TEXT,
    package_weight VARCHAR(20),
    payment_type VARCHAR(20) NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE
);
`;
client.connect()
export default client;
export {initSQL} 
