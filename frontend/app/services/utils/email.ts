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
    // Regular expression for email validation
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    // Length check
    if (email.length < 5 || email.length > 255) {
        return false;
    }

    // Domain check
    const domainRegex = /^[A-Za-z0-9.-]+$/;
    const domain = email.split('@')[1];
    if (!domainRegex.test(domain)) {
        return false;
    }

    return regex.test(email);
}
