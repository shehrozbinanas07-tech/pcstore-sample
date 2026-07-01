'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Product = {
  id: string
  name: string
  description: string | null
  base_price: number
  sale_price: number | null
  is_on_sale: boolean
  image_url: string | null
  category: string | null
  created_at: string
}

const PRODUCT_CATEGORIES = [
  'CPUs',
  'Graphics Cards',
  'Motherboards',
  'PC Cases',
  'RAM',
  'Power Supplies',
  'Storage',
] as const

const inputClassName =
  'w-full rounded-xl border border-line bg-paper-2 px-4 py-3 text-[0.95rem] text-ink outline-none transition placeholder:text-muted/70 focus:border-ink focus:ring-2 focus:ring-ink/10'

const labelClassName =
  'block font-mono text-[0.72rem] uppercase tracking-[0.04em] text-muted'

function formatPrice(amount: number) {
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

function ProductModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>(PRODUCT_CATEGORIES[0])
  const [basePrice, setBasePrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [isOnSale, setIsOnSale] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function resetForm() {
    setName('')
    setDescription('')
    setCategory(PRODUCT_CATEGORIES[0])
    setBasePrice('')
    setSalePrice('')
    setIsOnSale(false)
    setImageFile(null)
    setError(null)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  async function uploadProductImage(file: File): Promise<string> {
    const supabase = createClient()
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filePath = `${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(filePath)

    return publicUrl
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const parsedBasePrice = parseFloat(basePrice)
    const parsedSalePrice = salePrice ? parseFloat(salePrice) : null

    if (Number.isNaN(parsedBasePrice) || parsedBasePrice < 0) {
      setError('Please enter a valid base price.')
      setLoading(false)
      return
    }

    if (isOnSale && (parsedSalePrice === null || Number.isNaN(parsedSalePrice) || parsedSalePrice < 0)) {
      setError('Please enter a valid sale price when the product is on sale.')
      setLoading(false)
      return
    }

    try {
      let imageUrl: string | null = null

      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile)
      }

      const supabase = createClient()
      const { error: insertError } = await supabase.from('products').insert({
        name: name.trim(),
        description: description.trim() || null,
        category,
        base_price: parsedBasePrice,
        sale_price: isOnSale ? parsedSalePrice : null,
        is_on_sale: isOnSale,
        image_url: imageUrl,
      })

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }

      resetForm()
      onSuccess()
      onClose()
    } catch (uploadErr) {
      setError(uploadErr instanceof Error ? uploadErr.message : 'Image upload failed.')
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-line bg-white p-6 shadow-[0_8px_40px_rgba(24,26,31,0.12)]"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-warm">
              New product
            </p>
            <h2
              id="product-modal-title"
              className="mt-1 font-display text-2xl font-semibold tracking-tight"
            >
              Add product
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-muted transition hover:bg-paper hover:text-ink"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="product-name" className={labelClassName}>
              Product name
            </label>
            <input
              id="product-name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Aurora RTX 4080 Gaming PC"
              className={inputClassName}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="product-category" className={labelClassName}>
              Category
            </label>
            <select
              id="product-category"
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClassName}
            >
              {PRODUCT_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="product-description" className={labelClassName}>
              Description
            </label>
            <textarea
              id="product-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Brief product description…"
              className={`${inputClassName} resize-none`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="product-base-price" className={labelClassName}>
                Base price
              </label>
              <input
                id="product-base-price"
                type="number"
                min="0"
                step="0.01"
                required
                value={basePrice}
                onChange={(event) => setBasePrice(event.target.value)}
                placeholder="450000"
                className={inputClassName}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="product-sale-price" className={labelClassName}>
                Sale price
              </label>
              <input
                id="product-sale-price"
                type="number"
                min="0"
                step="0.01"
                value={salePrice}
                onChange={(event) => setSalePrice(event.target.value)}
                placeholder="399000"
                disabled={!isOnSale}
                className={`${inputClassName} disabled:cursor-not-allowed disabled:opacity-50`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-line bg-paper-2 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-ink">Is on sale</p>
              <p className="text-xs text-ink-soft">Show the sale price on the storefront</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isOnSale}
              onClick={() => setIsOnSale((current) => !current)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                isOnSale ? 'bg-warm' : 'bg-line-strong'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  isOnSale ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="product-image" className={labelClassName}>
              Product image
            </label>
            <input
              id="product-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
              className={`${inputClassName} file:mr-4 file:rounded-lg file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-medium file:text-paper hover:file:bg-ink/90`}
            />
            {imageFile && (
              <p className="text-xs text-ink-soft">
                Selected: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-line px-4 py-3 text-sm font-medium text-ink-soft transition hover:bg-paper"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-paper transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Create product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function EmptyState({ onAddProduct }: { onAddProduct: () => void }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-white px-8 py-16 text-center shadow-[0_1px_2px_rgba(24,26,31,0.04),0_4px_16px_rgba(24,26,31,0.05)]">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-paper text-warm">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </span>
      <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight">No products found yet</h2>
      <p className="mt-2 max-w-sm text-sm text-ink-soft">
        Your catalog is empty. Add your first product to start building your storefront inventory.
      </p>
      <button
        type="button"
        onClick={onAddProduct}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-warm px-6 py-3.5 text-sm font-medium text-white shadow-[0_4px_14px_rgba(184,80,43,0.35)] transition hover:bg-warm-light"
      >
        Add Your First Product
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  )
}

function ProductsTable({
  products,
  onDelete,
  deletingId,
}: {
  products: Product[]
  onDelete: (id: string) => void
  deletingId: string | null
}) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(24,26,31,0.04),0_4px_16px_rgba(24,26,31,0.05)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-2/80">
              <th className="px-5 py-3.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted">
                Image
              </th>
              <th className="px-5 py-3.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted">
                Name
              </th>
              <th className="px-5 py-3.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted">
                Category
              </th>
              <th className="px-5 py-3.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted">
                Price
              </th>
              <th className="px-5 py-3.5 text-right font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((product) => (
              <tr key={product.id} className="transition hover:bg-paper-2/50">
                <td className="px-5 py-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg border border-line object-cover"
                    />
                  ) : (
                    <span className="grid h-12 w-12 place-items-center rounded-lg border border-line bg-paper text-muted">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-ink">{product.name}</p>
                  {product.description && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft">{product.description}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full border border-line bg-paper-2 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.06em] text-ink-soft">
                    {product.category ?? 'Uncategorized'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {product.is_on_sale && product.sale_price != null ? (
                    <div>
                      <p className="font-medium text-warm">{formatPrice(product.sale_price)}</p>
                      <p className="text-xs text-muted line-through">{formatPrice(product.base_price)}</p>
                    </div>
                  ) : (
                    <p className="font-medium text-ink">{formatPrice(product.base_price)}</p>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === product.id ? 'Deleting…' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function loadProducts() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch products:', error.message)
      setProducts([])
    } else {
      setProducts((data as Product[]) ?? [])
    }

    setLoading(false)
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  function handleRefresh() {
    void loadProducts()
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this product? This action cannot be undone.')) return

    setDeletingId(id)
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      window.alert(error.message)
      setDeletingId(null)
      return
    }

    setDeletingId(null)
    handleRefresh()
  }

  return (
    <>
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.04em] text-warm">/ Content</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">Products</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Manage your product catalog, pricing, and inventory from this section.
      </p>

      {loading ? (
        <p className="mt-10 text-sm text-ink-soft">Loading products…</p>
      ) : (
        <>
          {products.length > 0 && (
            <div className="mt-8 flex items-center justify-between gap-4">
              <p className="text-sm text-ink-soft">
                {products.length} product{products.length === 1 ? '' : 's'} in catalog
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-ink/90"
              >
                Add product
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          )}

          {products.length === 0 ? (
            <EmptyState onAddProduct={() => setModalOpen(true)} />
          ) : (
            <ProductsTable products={products} onDelete={handleDelete} deletingId={deletingId} />
          )}
        </>
      )}

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleRefresh}
      />
    </>
  )
}
