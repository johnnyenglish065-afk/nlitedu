/**
 * Validates email structure and checks for common typos in domain and extension names.
 */
export const validateEmail = (email: string): { valid: boolean; message: string | null } => {
  if (!email) {
    return { valid: false, message: "Email is required." };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Basic regex check for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return { valid: false, message: "Please enter a valid email address." };
  }

  // Specific check for typos in the Top-Level Domain (TLD)
  if (cleanEmail.endsWith(".con")) {
    return {
      valid: false,
      message: "Invalid email extension: did you mean '.com' instead of '.con'?",
    };
  }

  if (
    cleanEmail.endsWith(".col") ||
    cleanEmail.endsWith(".cmo") ||
    cleanEmail.endsWith(".cm")
  ) {
    return {
      valid: false,
      message: "Invalid email extension: did you mean '.com'?",
    };
  }

  // Check for common domain typos
  if (
    cleanEmail.includes("@gamil.") ||
    cleanEmail.includes("@gmal.") ||
    cleanEmail.includes("@gmaill.")
  ) {
    return {
      valid: false,
      message: "Invalid email domain: did you mean '@gmail.com'?",
    };
  }

  if (cleanEmail.includes("@yaho.")) {
    return {
      valid: false,
      message: "Invalid email domain: did you mean '@yahoo.com'?",
    };
  }

  return { valid: true, message: null };
};
