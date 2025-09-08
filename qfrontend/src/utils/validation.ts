import * as yup from 'yup';

export const urlValidationSchema = yup.object({
  originalUrl: yup
    .string()
    .required('URL is required')
    .matches(
      /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
      'Please enter a valid URL (must start with http:// or https://)'
    ),
  validityMinutes: yup
    .number()
    .min(1, 'Validity must be at least 1 minute')
    .max(1440, 'Validity cannot exceed 24 hours (1440 minutes)')
    .optional(),
});

export const shortCodeValidationSchema = yup.object({
  shortCode: yup
    .string()
    .required('Short code is required')
    .test('is-valid-shortcode', 'Please enter a valid short code (6-8 characters) or full URL', function(value) {
      if (!value) return false;
      
      // If it's a full URL, extract the short code
      if (value.includes('http://') || value.includes('https://')) {
        const urlParts = value.split('/');
        const shortCode = urlParts[urlParts.length - 1];
        return /^[a-zA-Z0-9]{6,8}$/.test(shortCode);
      }
      
      // If it's just a short code, validate it directly
      return /^[a-zA-Z0-9]{6,8}$/.test(value);
    }),
});

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};
