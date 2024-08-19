CREATE TYPE contact_provider_type AS ENUM (
    'salesforce',
    'hubspot',
    'zoho',
    'sendgrid',
    'brevo'
);

-- An account can have multiple providers to import contacts, different from signup provider
CREATE TABLE IF NOT EXISTS public."contact_provider" (
    "id" UUID PRIMARY KEY,
    "type" contact_provider_type NOT NULL,
    "user_id" UUID REFERENCES public."user"(id),
    "latest_access_token" VARCHAR,
    "api_key" VARCHAR,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP
);

CREATE OR REPLACE TRIGGER update_contact_provider_timestamp
BEFORE UPDATE ON public."contact_provider"
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Check if either latest_access_token or api_key is provided
CREATE OR REPLACE FUNCTION ensure_contact_provider_credentials()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latest_access_token IS NULL AND NEW.api_key IS NULL THEN
        RAISE EXCEPTION 'Either latest_access_token or api_key must be provided';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_credentials
BEFORE INSERT OR UPDATE ON public."contact_provider"
FOR EACH ROW
EXECUTE FUNCTION ensure_contact_provider_credentials();