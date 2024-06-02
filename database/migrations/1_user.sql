CREATE TYPE auth_provider AS ENUM (
    'google',
    'linkedin',
    'salesforce',
    'zoho',
    'hubspot',
    'mailchimp'
);

CREATE TABLE IF NOT EXISTS public."user" (
    "id" UUID PRIMARY KEY,
    "email" VARCHAR NOT NULL,
    "is_email_confirmed" BOOLEAN NOT NULL DEFAULT FALSE,
    "email_confirmation_code" INT,
    "password_sha256" VARCHAR,
    "last_ip_addresses" VARCHAR NOT NULL,
    "last_user_agent" VARCHAR NOT NULL DEFAULT 'unknown',
    "2fa_secret" VARCHAR,
    "auth_provider" auth_provider,
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,
    CONSTRAINT password_or_auth_provider_not_empty CHECK (
        "password_sha256" IS NOT NULL
        OR "auth_provider" IS NOT NULL
    )
);

CREATE
OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $ $ BEGIN NEW.updated_at = NOW();

RETURN NEW;

END;

$ $ language 'plpgsql';

CREATE TRIGGER update_user_timestamp BEFORE
UPDATE
    ON public."user" FOR EACH ROW EXECUTE PROCEDURE update_timestamp();