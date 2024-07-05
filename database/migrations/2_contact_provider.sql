CREATE TYPE contact_provider_type AS ENUM (
    'salesforce',
    'hubspot',
    'zoho',
    'sendgrid',
    'brevo'
);

-- An account can have multiple providers to import contacts, different from signup provider
CREATE TABLE IF NOT EXISTS public."contact_provider" (
    "id" SERIAL PRIMARY KEY,
    "type" contact_provider_type NOT NULL,
    "user_id" UUID REFERENCES public."user"(id),
    "latest_access_token" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE OR REPLACE TRIGGER update_contact_provider_timestamp
BEFORE UPDATE ON public."contact_provider"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
