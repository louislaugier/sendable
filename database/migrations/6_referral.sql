CREATE TABLE IF NOT EXISTS public."referral" (
    "id" UUID PRIMARY KEY,
    "referrer_id" UUID REFERENCES public."user"(id) NOT NULL,
    "referee_id" UUID REFERENCES public."user"(id) NOT NULL,
    "is_discount_consumed" BOOLEAN NOT NULL DEFAULT FALSE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- trigger to insert referral when new user is created with non-null referrer_id