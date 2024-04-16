CREATE TYPE origin AS ENUM ('app', 'api');

CREATE TABLE IF NOT EXISTS "public"."validation" (
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID REFERENCES "public"."user"(id),
    "target_email" VARCHAR NOT NULL,
    "origin" origin NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now()
);