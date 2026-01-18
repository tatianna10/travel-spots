export function validateBody(rules = {}) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body?.[field];

      if (rule.required) {
        const missing =
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.trim() === '');

        if (missing) {
          errors.push(`${field} is required`);
          continue;
        }
      }

      if (value === undefined || value === null) continue;

      if (rule.type) {
        if (rule.type === 'string' && typeof value !== 'string') {
          errors.push(`${field} must be a string`);
        }
        if (rule.type === 'number' && typeof value !== 'number') {
          errors.push(`${field} must be a number`);
        }
        if (rule.type === 'boolean' && typeof value !== 'boolean') {
          errors.push(`${field} must be a boolean`);
        }
        if (rule.type === 'array' && !Array.isArray(value)) {
          errors.push(`${field} must be an array`);
        }
      }

      if (rule.minLength && typeof value === 'string') {
        if (value.trim().length < rule.minLength) {
          errors.push(`${field} must be at least ${rule.minLength} characters`);
        }
      }

      if (rule.pattern && typeof value === 'string') {
        if (!rule.pattern.test(value)) {
          errors.push(rule.message || `${field} is invalid`);
        }
      }

      if (rule.oneOf) {
        if (!rule.oneOf.includes(value)) {
          errors.push(`${field} must be one of: ${rule.oneOf.join(', ')}`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation error', errors });
    }

    next();
  };
}
