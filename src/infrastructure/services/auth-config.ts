export interface PublicAuthConfig {
  supabaseUrl?: string
  supabasePublishableKey?: string
}

export function resolveAuthConfig(config: PublicAuthConfig): Required<PublicAuthConfig> | null {
  const supabasePublishableKey = config.supabasePublishableKey?.trim() ?? ''
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(supabasePublishableKey)) return null
  try {
    const url = new URL(config.supabaseUrl?.trim() ?? '')
    const localHttp = url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    if ((url.protocol !== 'https:' && !localHttp) || url.username || url.password || url.search || url.hash || url.pathname !== '/') return null
    return { supabaseUrl: url.href, supabasePublishableKey }
  } catch { return null }
}
