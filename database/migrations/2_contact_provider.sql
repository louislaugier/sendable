CREATE TYPE contact_provider_type AS ENUM (
    'sendgrid',
    'brevo'
);

-- An account can have multiple providers to import contacts, different from signup provider
CREATE TABLE IF NOT EXISTS public."contact_provider" (
    "id" UUID PRIMARY KEY,
    "type" contact_provider_type UNIQUE NOT NULL,
    "user_id" UUID REFERENCES public."user"(id),
    "latest_contacts_count" INTEGER NOT NULL,
    "api_key" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP
);

CREATE OR REPLACE TRIGGER update_contact_provider_timestamp
BEFORE UPDATE ON public."contact_provider"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();