CREATE TYPE order_duration AS ENUM ('monthly', 'yearly', 'lifetime');

CREATE TYPE order_type AS ENUM ('premium', 'enterprise');

CREATE TABLE IF NOT EXISTS "public"."order" (
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID REFERENCES "public"."user"(id),
    "duration" order_duration NOT NULL,
    "type" order_type NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "cancelled_at" TIMESTAMP
);

-- prevent more than 1 at the same time except if (in that case cancel current one):
-- - OLD latest order is user's only order and is less than 7 days old (ongoing trial)
-- - OLD order = premium and NEW order = enterprise