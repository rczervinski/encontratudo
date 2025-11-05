export function deepMerge<T>(base: T, override: Partial<T>): T {
  if (override === null || override === undefined) return base as T
  if (Array.isArray(base) || Array.isArray(override as any)) return (override as any) ?? (base as any)
  if (typeof base !== 'object' || typeof override !== 'object') return (override as any) ?? (base as any)

  const out: any = { ...(base as any) }
  for (const key of Object.keys(override as any)) {
    const ov: any = (override as any)[key]
    const bv: any = (base as any)[key]
    out[key] = deepMerge(bv, ov)
  }
  return out
}
