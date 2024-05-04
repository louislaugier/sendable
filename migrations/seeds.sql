INSERT INTO
    "public"."user" (
        "id",
        "email",
        "is_email_confirmed",
        "email_confirmation_code",
        "password_sha256",
        "last_ip_addresses",
        "last_user_agent",
        "two_fa_private_key_hash",
        "auth_provider",
        "created_at",
        "updated_at",
        "deleted_at"
    )
VALUES
    (
        '66608f5e-82fb-4e80-b069-40f852cac076',
        'louis.laugier12@gmail.com',
        't',
        NULL,
        NULL,
        '172.19.0.1',
        'insomnia/8.6.1',
        NULL,
        'hubspot',
        '2024-04-25 00:34:02.828087',
        '2024-04-25 00:34:02.828087',
        NULL
    );

INSERT INTO
    "public"."order" (
        "id",
        "user_id",
        "duration",
        "type",
        "created_at",
        "cancelled_at"
    )
VALUES
    (
        1,
        '66608f5e-82fb-4e80-b069-40f852cac076',
        'yearly',
        'enterprise',
        '2024-05-03 14:10:20.996654',
        NULL
    );