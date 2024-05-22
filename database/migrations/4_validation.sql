CREATE TYPE origin AS ENUM ('app', 'api');

CREATE TYPE validation_status AS ENUM ('processing', 'failed', 'completed');

CREATE type reachability AS ENUM ('safe', 'risky', 'unknown', 'invalid');

CREATE TABLE IF NOT EXISTS public."validation" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID REFERENCES public."user"(id) NOT NULL,
    "guest_ip" VARCHAR,
    "guest_user_agent" VARCHAR,
    "single_target_email" VARCHAR,
    "single_target_reachability" reachability,
    "bulk_address_count" INT,
    "upload_filename" VARCHAR,
    "report_token" UUID UNIQUE,
    "provider_source" contact_provider_type,
    "origin" origin NOT NULL,
    "status" validation_status NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now()
);