const DEFAULT_DEPLOYMENT_ENVIRONMENT = 'development'
const PRODUCTION_LIKE_ENVIRONMENTS = new Set(['pre-production', 'production'])

export function getCanonicalSiteUrl(fallback: string) {
  const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (productionDomain) {
    return `https://${productionDomain}`
  }

  return fallback.replace(/\/$/, '')
}

export function isProductionLikeEnvironment() {
  return PRODUCTION_LIKE_ENVIRONMENTS.has(getDeploymentEnvironment())
}

function getDeploymentEnvironment() {
  return (
    process.env.SITE_ENV ??
    process.env.VERCEL_TARGET_ENV ??
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV ??
    DEFAULT_DEPLOYMENT_ENVIRONMENT
  )
}
