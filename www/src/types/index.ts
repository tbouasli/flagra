export type Collection = {
    name: string
    slug: {
        current: string
    }
    description: string
    image: {
        asset: {
            _ref: string
            _type: string
        }
        alt: string
    }
    products: Product[]
        
}

export type Product = {
    name: string
        slug: {
            current: string
        }
        description: string
        type: {
            name: string
            slug: {
                current: string
            }
        }[]
        colors: {
            name: string
            hex: string
        }[]
        sizes: string[]
        images: {
            asset: {
                _ref: string
                _type: string
            }
            alt: string
            coverImage: boolean
        }[]
        featured: boolean
}