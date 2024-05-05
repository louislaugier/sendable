CREATE TYPE origin AS ENUM ('app', 'api');

CREATE TYPE validation_type AS ENUM ('single', 'bulk');

CREATE TYPE validation_status AS ENUM ('processing', 'failed', 'completed');

CREATE TABLE IF NOT EXISTS public."validation" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID REFERENCES public."user"(id),
    "guest_ip" VARCHAR,
    "guest_user_agent" VARCHAR,
    "single_target_email" VARCHAR,
    "upload_filename" VARCHAR,
    "origin" origin NOT NULL,
    "type" validation_type NOT NULL,
    "status" validation_status NOT NULL DEFAULT 'processing',
    "created_at" TIMESTAMP NOT NULL DEFAULT now()
);