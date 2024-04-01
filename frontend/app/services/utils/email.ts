export function extractDomain(email: string): string | null {
    // Split the email address by '@' symbol
    const parts = email.split('@');

    // If the email address doesn't contain '@' or has more than one '@', return null
    if (parts.length !== 2) {
        return null;
    }

    // Return the second part, which is the domain
    return parts[1];
}

export function isValidEmail(email: string): boolean {
    // Regular expression for basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}