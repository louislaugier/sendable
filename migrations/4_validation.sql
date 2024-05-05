CREATE TYPE origin AS ENUM ('app', 'api');

CREATE TYPE validation_status AS ENUM ('processing', 'failed', 'completed');

CREATE TABLE IF NOT EXISTS public."validation" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID REFERENCES public."user"(id),
    "guest_ip" VARCHAR,
    "guest_user_agent" VARCHAR,
    "single_target_email" VARCHAR,
    "bulk_address_count" INT,
    "upload_filename" VARCHAR,
    "report_token" UUID,
    "origin" origin NOT NULL,
    "status" validation_status NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now()
);