const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@newsa/shared', '@newsa/supabase'],
}

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  disableSourceMapUpload: !process.env.SENTRY_AUTH_TOKEN,
})
