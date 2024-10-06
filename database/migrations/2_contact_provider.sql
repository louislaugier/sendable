CREATE TYPE contact_provider_type AS ENUM (
    'sendgrid',
    'brevo',

    'salesforce',
    'zoho',
    'hubspot',
    'mailchimp'
);

-- An account can have multiple providers to import contacts, different from signup provider
CREATE TABLE IF NOT EXISTS public."contact_provider" (
    "id" UUID PRIMARY KEY,
    "type" contact_provider_type NOT NULL,
    "user_id" UUID REFERENCES public."user"(id),
    "api_key" VARCHAR NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP,

    CONSTRAINT cp_type CHECK (type IN ('sendgrid', 'brevo')),
    UNIQUE(type, user_id)
);

CREATE OR REPLACE TRIGGER update_contact_provider_timestamp
BEFORE UPDATE ON public."contact_provider"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();