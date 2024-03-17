CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" UUID PRIMARY KEY,
    "email" VARCHAR NOT NULL UNIQUE,
    "password" VARCHAR NOT NULL,
    "ip_addresses" VARCHAR NOT NULL,
    "twoFaPrivateKeyHash" VARCHAR,
    "provider" provider,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    "deletedAt" TIMESTAMP
);