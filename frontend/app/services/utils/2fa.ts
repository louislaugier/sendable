import { siteName } from '~/constants/app';

export function generate2faSecret(): string {
    let secret = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

    // Adjust the length of the secret to be a multiple of 8
    for (let i = 0; i < 16; i++) {
        secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return secret;
}

export function getQrCodeUrl(accountName: string, secret: string): string {
    const encodedSecret = encodeURIComponent(secret);
    const encodedIssuer = encodeURIComponent(siteName);
    const encodedAccountName = encodeURIComponent(accountName);

    return `otpauth://totp/${encodedIssuer}:${encodedAccountName}?secret=${encodedSecret}&issuer=${encodedIssuer}`;
}

