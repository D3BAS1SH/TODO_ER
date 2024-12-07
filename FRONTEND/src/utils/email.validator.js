class ValidationUtils {
    /**
     * Secure email validation regex
     * Comprehensive checks to prevent potential injection and ensure valid format
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    validateEmail(email) {
        const emailRegex = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/;
      return (
        emailRegex.test(email) &&
        email.length <= 254 &&
        email.split('@')[0].length <= 64 &&
        !this.containsSQLInjectionRisk(email)
      );
    }
  
    /**
     * Secure username validation
     * @param {string} username - Username to validate
     * @returns {boolean} - Whether username is valid
     */
    validateUsername(username) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      return (
        usernameRegex.test(username) &&
        !this.containsSQLInjectionRisk(username) &&
        !this.containsUnicodeHomoglyphs(username)
      );
    }
  
    /**
     * Prevent SQL Injection risks
     * @param {string} input - Input to check
     * @returns {boolean} - Whether input contains injection risks
     */
    containsSQLInjectionRisk(input) {
      const sqlInjectionPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TABLE|FROM|WHERE)\b)/i,
        /('|"|;|\(|\)|\[|\]|{|}|--|\/)/,
        /[\u0000-\u001F\u007F-\u009F]/,
      ];
      return sqlInjectionPatterns.some(pattern => pattern.test(input));
    }
  
    /**
     * Check for Unicode homoglyphs that could be used for spoofing
     * @param {string} input - Input to check
     * @returns {boolean} - Whether input contains suspicious homoglyphs
     */
    containsUnicodeHomoglyphs(input) {
      const homoglyphPatterns = [
        /[\u0391-\u03CE]/,
        /[Ａ-Ｚａ-ｚ０-９]/,
        /[ꜰ-ꞩ]/,
      ];
      return homoglyphPatterns.some(pattern => pattern.test(input));
    }
}

export const validator = new ValidationUtils();