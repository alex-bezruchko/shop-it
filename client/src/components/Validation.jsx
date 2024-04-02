export const Validation = (formData, isRegistration) => {
    // Perform your validation logic here
    let errors = [];

    for (const key in formData) {
        if (!formData[key]) {
            errors.push({ field: key, message: `${key.charAt(0).toUpperCase() + key.slice(1)} is required` });
        }
        if (key === 'price' && formData[key] && isNaN(parseFloat(formData[key]))) {
            errors.push({ field: key, message: 'Price must be a numeric value' });
        }
        if (key === 'products' && formData[key].length === 0) {
            errors.push({ field: key, message: 'Products list cannot be empty' });
        }
    }

    if (isRegistration) {
        // Check email format only if not empty
        if (formData.email && !isValidEmail(formData.email)) {
            errors.push({ field: 'email', message: 'Invalid email address' });
        }
        // Check password format only if not empty
        if (formData.password && !isValidPassword(formData.password)) {
            errors.push({ field: 'password', message: 'Password must be at least 6 characters long and contain at least one numerical digit' });
        }
    }
    
    if (errors.length > 0) {
        return errors;
    }

    // Add more validation logic as needed

    // If all validations pass, return true
    return true;
};

const isValidEmail = (email) => {
    // Regular expression for basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password) => {
    // Password should be at least 6 characters long and contain at least one numerical digit
    return /^(?=.*\d).{6,}$/.test(password);
};
