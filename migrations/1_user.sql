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
    "email" VARCHAR NOT NULL UNIQUE,
    "is_email_confirmed" BOOLEAN NOT NULL DEFAULT FALSE,
    "email_confirmation_code" INT,
    "password_sha256" VARCHAR,
    "last_ip_addresses" VARCHAR NOT NULL,
    "last_user_agent" VARCHAR NOT NULL DEFAULT 'unknown',
    "two_fa_private_key_hash" VARCHAR,
    "auth_provider" auth_provider,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    "deleted_at" TIMESTAMP,
    CONSTRAINT password_or_auth_provider_not_empty CHECK (
        "password_sha256" IS NOT NULL
        OR "auth_provider" IS NOT NULL
    )
);