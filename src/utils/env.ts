import { z } from 'zod';

/**
 * Strict Environment Variable Validation Schema
 */
export const envSchema = z.object({
  PUBLIC_SITE_URL: z.string().url().default('https://sportiverf.com'),
  PUBLIC_DEFAULT_LOCALE: z.enum(['en', 'tr']).default('en'),
  PUBLIC_API_BASE_URL: z.string().url().optional().default('https://api.sportiverf.com/v1'),
  PUBLIC_API_TIMEOUT_MS: z.coerce.number().default(10000),
  PUBLIC_CMS_PROVIDER: z.enum(['mock', 'strapi', 'contentful', 'sanity', 'api']).default('mock'),
  PUBLIC_CMS_URL: z.string().optional().default('https://cms.sportiverf.com'),
  PUBLIC_BOOKING_SERVICE_URL: z.string().optional().default('https://booking.sportiverf.com/api')
});

/**
 * Validates and returns parsed environment variables
 */
export function getValidatedEnv(): z.infer<typeof envSchema> {
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    console.error('Invalid Environment Configuration:', result.error.format());
    throw new Error('Environment variable validation failed.');
  }
  return result.data;
}
