-- An account can have multiple providers to import contacts, different from signup provider
CREATE TABLE IF NOT EXISTS public."contact_provider" (
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID REFERENCES public."user"(id),
    "latest_access_token" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now()
);