import { useState, useMemo } from "react"
import type { Product } from "@/types"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import imageUrlBuilder from "@sanity/image-url"
import { sanityClient } from "sanity:client"

import { Funnel } from "lucide-react"

type FilterableProductsProps = {
  products: Product[]
  collectionSlug: string
  collectionName: string
}

export function FilterableProducts({
  products,
  collectionSlug,
  collectionName,
}: FilterableProductsProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])

  // Extract all unique filter options from products
  const filterOptions = useMemo(() => {
    const types = new Map<string, string>() // slug -> name
    const colors = new Map<string, { name: string; hex: string }>()
    const sizes = new Set<string>()

    products.forEach((product) => {
      // Safely iterate over types with null checks
      product.type?.forEach((t) => {
        if (t?.slug?.current && t?.name) {
          types.set(t.slug.current, t.name)
        }
      })
      
      // Safely iterate over colors
      product.colors?.forEach((c) => {
        if (c?.name) {
          colors.set(c.name, c)
        }
      })
      
      // Safely iterate over sizes
      product.sizes?.forEach((s) => {
        if (s) {
          sizes.add(s)
        }
      })
    })

    return {
      types: Array.from(types.entries()).map(([slug, name]) => ({
        slug,
        name,
      })),
      colors: Array.from(colors.values()),
      sizes: Array.from(sizes).sort((a, b) => {
        const order = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"]
        return order.indexOf(a) - order.indexOf(b)
      }),
    }
  }, [products])

  // Filter products based on selections
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // If no filters selected, show all
      const hasTypeFilter = selectedTypes.length > 0
      const hasColorFilter = selectedColors.length > 0
      const hasSizeFilter = selectedSizes.length > 0

      if (!hasTypeFilter && !hasColorFilter && !hasSizeFilter) {
        return true
      }

      // Check type match with null safety
      const typeMatch =
        !hasTypeFilter ||
        (product.type?.some((t) => t?.slug?.current && selectedTypes.includes(t.slug.current)) ?? false)

      // Check color match with null safety
      const colorMatch =
        !hasColorFilter ||
        (product.colors?.some((c) => c?.name && selectedColors.includes(c.name)) ?? false)

      // Check size match with null safety
      const sizeMatch =
        !hasSizeFilter ||
        (product.sizes?.some((s) => s && selectedSizes.includes(s)) ?? false)

      return typeMatch && colorMatch && sizeMatch
    })
  }, [products, selectedTypes, selectedColors, selectedSizes])

  const toggleFilter = (
    value: string,
    currentSelection: string[],
    setter: (value: string[]) => void
  ) => {
    if (currentSelection.includes(value)) {
      setter(currentSelection.filter((v) => v !== value))
    } else {
      setter([...currentSelection, value])
    }
  }

  const clearAllFilters = () => {
    setSelectedTypes([])
    setSelectedColors([])
    setSelectedSizes([])
  }

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0

  // Filter out products without any valid images for accurate count
  const renderableProducts = useMemo(() => {
    return filteredProducts.filter((product) => {
      // Find first valid image (has asset._ref, not just _upload)
      const validImage = product.images?.find((image) => image?.asset?._ref)
      
      if (!validImage) {
        console.warn(`⚠️ ${product.name}: No valid images found. Check if images are fully uploaded in Sanity.`)
      }
      
      return !!validImage
    })
  }, [filteredProducts])

  const builder = imageUrlBuilder(sanityClient)

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary font-sans">
          {collectionName}
        </h1>
        <Sheet>
          <SheetTrigger asChild>
            <button className="relative cursor-pointer p-4 border border-border rounded-md bg-primary text-primary-foreground flex items-center gap-2">
              <Funnel className="w-4 h-4" />
              {
                hasActiveFilters ? (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white h-4 w-4 rounded-full text-xs" />
                )
                : null
              }
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Funnel className="w-4 h-4" />
                Filtrar Produtos
                </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-6 overflow-y-auto flex-1 p-4">
              {/* Type Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Tipo
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.types.map((type) => (
                    <button
                      key={type.slug}
                      onClick={() =>
                        toggleFilter(type.slug, selectedTypes, setSelectedTypes)
                      }
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        selectedTypes.includes(type.slug)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Cor
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() =>
                        toggleFilter(color.name, selectedColors, setSelectedColors)
                      }
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        selectedColors.includes(color.name)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {color.hex && (
                        <span
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: color.hex }}
                        />
                      )}
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Tamanho
                </h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        toggleFilter(size, selectedSizes, setSelectedSizes)
                      }
                      className={`px-3 py-1.5 rounded-md text-sm font-medium uppercase transition-colors ${
                        selectedSizes.includes(size)
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <SheetFooter>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 grow gap-4">
        {filteredProducts.map((product) => {
          // Try to find cover image first, then any valid image (with asset._ref)
          const coverImage = 
            product.images?.find((image) => image?.coverImage && image?.asset?._ref) ||
            product.images?.find((image) => image?.asset?._ref)
          
          // Skip rendering if no valid images at all
          if (!coverImage?.asset?._ref) {
            return null
          }
          
          return (
            <a
              key={product.slug.current}
              href={`/colecoes/${collectionSlug}/produtos/${product.slug.current}`}
              className="relative rounded-md p-4 col-span-1 h-[calc(50dvh-1rem)] overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:z-10"
            >
              <img
                src={builder.image(coverImage.asset._ref).url()}
                alt={coverImage.alt || product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
              />
              <div className="absolute inset-0 w-full h-full object-cover object-center bg-linear-to-b from-transparent to-black opacity-40 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 p-4">
                <span className="text-primary-foreground text-2xl font-bold font-sans">
                  {product.name}
                </span>
              </div>
            </a>
          )
        })}
      </div>

      {/* No Results Message */}
      {renderableProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center grow text-center p-8">
          <p className="text-2xl font-semibold text-muted-foreground mb-2">
            Nenhum produto encontrado
          </p>
          <p className="text-muted-foreground mb-4">
            Tente ajustar os filtros para ver mais produtos
          </p>
          <Button onClick={clearAllFilters} variant="outline">
            Limpar Filtros
          </Button>
        </div>
      )}
    </>
  )
}

