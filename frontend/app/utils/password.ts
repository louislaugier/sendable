export function isValidPassword(password: string) {
    // Check length
    if (password.length < 8 || password.length > 64) {
        return false;
    }

    // Check complexity
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        return false;
    }

    // Check for spaces
    if (/\s/.test(password)) {
        return false;
    }

    // Check for easily guessable information
    // Note: This is a simple check, real implementation might require more comprehensive user data
    const guessablePatterns = [/username/i, /email/i, /firstname/i, /lastname/i, /\d{4}/]; // Example patterns
    for (let pattern of guessablePatterns) {
        if (pattern.test(password)) {
            return false;
        }
    }

    return true;
}