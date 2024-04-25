CREATE TYPE origin AS ENUM ('app', 'api');
CREATE TYPE validation_type AS ENUM ('single', 'bulk');

CREATE TABLE IF NOT EXISTS public."validation" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID REFERENCES public."user"(id),
    "guest_ip" VARCHAR,
    "guest_user_agent" VARCHAR,
    "single_target_email" VARCHAR,
    "raw_bulk_request_log_filepath" VARCHAR,
    "upload_filename" VARCHAR,
    "origin" origin NOT NULL,
    "type" validation_type NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now()
);