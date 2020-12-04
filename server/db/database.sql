/* install uuid on postgres server */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* create tables */
CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    user_access JSONB NOT NULL,
    account_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    email_verified TIMESTAMP WITH TIME ZONE,
);