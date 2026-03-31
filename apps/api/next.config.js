/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@newsa/shared', '@newsa/supabase'],
}

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  const { withSentryConfig } = require('@sentry/nextjs')
  module.exports = withSentryConfig(nextConfig, {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    disableSourceMapUpload: !process.env.SENTRY_AUTH_TOKEN,
  })
} else {
  module.exports = nextConfig
}
