CREATE TYPE subscription_billing_frequency AS ENUM ('monthly', 'yearly');

CREATE TYPE subscription_type AS ENUM ('premium', 'enterprise');

CREATE TABLE IF NOT EXISTS public."subscription" (
    "id" UUID PRIMARY KEY,
    "user_id" UUID REFERENCES public."user"(id) NOT NULL,
    "billing_frequency" subscription_billing_frequency NOT NULL,
    "type" subscription_type NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "cancelled_at" TIMESTAMP
);