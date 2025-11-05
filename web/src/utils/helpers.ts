/**
 * Calcula a distância entre duas coordenadas geográficas usando a fórmula de Haversine
 * @returns Distância em quilômetros
 */
export function calcularDistancia(lat1?: number | null, lon1?: number | null, lat2?: number | null, lon2?: number | null) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Number.POSITIVE_INFINITY
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371 // km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Converte uma string em slug URL-friendly
 */
export function slugify(str: string) {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

/**
 * Alias para slugify (compatibilidade com código antigo)
 */
export const generateSlug = slugify

/**
 * Merge profundo e imutável entre dois objetos.
 * Valores de `override` têm prioridade. Arrays não são mesclados (substituem).
 */
export function deepMerge<T>(base: T, override: Partial<T>): T {
  if (override === null || override === undefined) return base
  if (Array.isArray(base) || Array.isArray(override)) return (override as any) ?? (base as any)
  if (typeof base !== 'object' || typeof override !== 'object') return (override as any) ?? (base as any)

  const out: any = { ...(base as any) }
  for (const key of Object.keys(override)) {
    const ov: any = (override as any)[key]
    const bv: any = (base as any)[key]
    out[key] = deepMerge(bv, ov)
  }
  return out
}

/**
 * Configurações padrão de personalização (molde completo).
 * Agrupadas por domínio para facilitar evolução futura.
 */
export const defaultSettings = {
  identidade: {
    nome_header: '',
    slogan: '',
    logo_url: '',
    preset_cores: '',
    cores: {
      cor_primaria: '#DC143C',
      cor_secundaria: '#FF6B6B',
      cor_fundo: '#FFFFFF',
      cor_header: '#1a1a1a',
      cor_texto: '#1a1a1a',
    },
  },
  layout: {
    header_sticky: true,
    produtos_por_linha: 3,
    mostrar_categorias: true,
  },
  conteudo: {
    exibir_tipo: 'ambos',
    ordem_exibicao: 'produtos_primeiro',
    carrossel_ativado: false,
    carrossel_foto1: '',
    carrossel_foto2: '',
    carrossel_foto3: '',
  },
  integracoes: {
    whatsapp: '',
    instagram: '',
    facebook: '',
  },
} as const
