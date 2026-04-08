import type { CatalogCategory, CatalogProduct } from '~/mocks/catalog'
import { catalogCategories, catalogProducts } from '~/mocks/catalog'

export interface CatalogQuery {
  q: string
  categoryId: string | null
  moqMax: number | null
}

/**
 * Phase 2 mock catalog composable.
 * Replace internals with `useApi().api('/products')` once the Node backend is ready.
 */
export function useCatalog() {
  const categories = ref<CatalogCategory[]>(catalogCategories)
  const products = ref<CatalogProduct[]>(catalogProducts)

  const query = reactive<CatalogQuery>({
    q: '',
    categoryId: null,
    moqMax: null,
  })

  const filtered = computed(() => {
    const q = query.q.trim().toLowerCase()
    return products.value.filter((p) => {
      const matchesText =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      const matchesCategory =
        !query.categoryId || p.categoryId === query.categoryId
      const matchesMoq =
        query.moqMax == null ? true : Number(p.moq) <= query.moqMax
      return matchesText && matchesCategory && matchesMoq
    })
  })

  function getCategoryLabel(categoryId: string) {
    return categories.value.find((c) => c.id === categoryId)?.label || '—'
  }

  function getProductById(id: string) {
    return products.value.find((p) => p.id === id) || null
  }

  return {
    categories,
    products,
    query,
    filtered,
    getCategoryLabel,
    getProductById,
  }
}
