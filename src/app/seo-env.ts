export function getProductionSiteUrl(fallback: string) {
  const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (productionDomain) {
    return `https://${productionDomain}`
  }

  return fallback.replace(/\/$/, '')
}

export function isProductionLikeEnvironment() {
  const vercelEnv = process.env.VERCEL_ENV
  const vercelTargetEnv = process.env.VERCEL_TARGET_ENV

  if (!vercelEnv && !vercelTargetEnv) {
    return true
  }

  return vercelEnv === 'production' || vercelTargetEnv === 'pre-production' || vercelTargetEnv === 'production'
}
