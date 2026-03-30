import { createServerClient } from '@newsa/supabase'

/**
 * Creates a Supabase client for use in API route handlers.
 * Uses the @newsa/supabase server client which handles cookie context gracefully.
 * In API routes (no session needed), the cookie adapter is a no-op.
 */
export { createServerClient as createApiClient }
