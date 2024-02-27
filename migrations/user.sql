CREATE TYPE provider AS ENUM ('none', 'google', 'facebook', 'apple', 'salesforce', 'zoho', 'hubspot');

CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" UUID PRIMARY KEY,
    "email" VARCHAR NOT NULL UNIQUE,
    "password" VARCHAR NOT NULL,
    "ip_addresses" VARCHAR NOT NULL,
    "twoFaPrivateKeyHash" VARCHAR,
    "provider" provider NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP
);