CREATE TABLE IF NOT EXISTS public."api_key" (
    "id" UUID PRIMARY KEY,
    "key_sha256" VARCHAR NOT NULL,
    "label" VARCHAR NOT NULL,
    "last_chars" VARCHAR NOT NULL,
    "user_id" UUID REFERENCES public."user"(id) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "deleted_at" TIMESTAMP
);