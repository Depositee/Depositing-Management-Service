-- If Exists Table Drop
DROP TABLE IF EXISTS users cascade;
-- ================
--   TABLE [users]
-- ================
-- create users table
CREATE TABLE users(
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(32) UNIQUE NOT NULL,
    "password" VARCHAR(48) NOT NULL,
    "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT(NOW() AT TIME ZONE 'utc'),
    "updatedAt" TIMESTAMP WITHOUT TIME ZONE
);

DROP TABLE IF EXISTS orders cascade;
CREATE TABLE orders (
    "id" SERIAL PRIMARY KEY,
    "depositor_id" INT NOT NULL,
    "depositee_id" INT NOT NULL,
    "package_id" INT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    "updated_at" TIMESTAMP WITHOUT TIME ZONE
);
