CREATE TYPE order_duration AS ENUM ('monthly', 'yearly');

CREATE TYPE order_type AS ENUM ('premium', 'enterprise');

CREATE TABLE IF NOT EXISTS public."order" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID REFERENCES public."user"(id) NOT NULL,
    "duration" order_duration NOT NULL,
    "type" order_type NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "cancelled_at" TIMESTAMP
);