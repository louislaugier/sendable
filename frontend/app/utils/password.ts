export function isValidPassword(password: string) {
    let errorMessage = '';

    // Check length
    if (password.length < 8 || password.length > 64) {
        errorMessage = 'Password must be between 8-64 characters long.';
        return { isValid: false, errorMessage };
    }

    // Check complexity
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUppercase) {
        errorMessage = 'Password must contain at least 1 uppercase letter (A-Z).';
        return { isValid: false, errorMessage };
    }

    if (!hasLowercase) {
        errorMessage = 'Password must contain at least 1 lowercase letter (a-z).';
        return { isValid: false, errorMessage };
    }

    if (!hasNumber) {
        errorMessage = 'Password must contain at least 1 numeral (0-9).';
        return { isValid: false, errorMessage };
    }

    if (!hasSpecialChar) {
        errorMessage = 'Password must contain at least 1 special character.';
        return { isValid: false, errorMessage };
    }

    // Check for spaces
    if (/\s/.test(password)) {
        errorMessage = 'Password must not contain any spaces.';
        return { isValid: false, errorMessage };
    }

    return { isValid: true, errorMessage };
}