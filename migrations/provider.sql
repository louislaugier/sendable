CREATE TYPE auth_provider AS ENUM (
    'google',
    'linkedin',
    -- 'facebook',
    -- 'apple',
    'salesforce',
    'zoho',
    'hubspot',
    'mailchimp'
);

-- An account can have multiple providers to import contacts, different from signup provider
CREATE TABLE IF NOT EXISTS "public"."contact_provider" (
    
);