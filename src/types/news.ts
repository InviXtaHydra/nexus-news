export type CategorySlug = 'world' | 'technology' | 'business' | 'science' | 'entertainment'

export interface Category {
  slug: CategorySlug
  name: string
  description: string
  /** Tailwind classes for the category badge. */
  tone: string
}

export interface Author {
  name: string
  role: string
}

export interface GeoPoint {
  name: string
  lat: number
  lng: number
}

export interface ArticleImage {
  src: string
  alt: string
  credit: string
}

/** Shape of an article as it would come from a news API. */
export interface Article {
  id: string
  slug: string
  title: string
  summary: string
  category: CategorySlug
  tags: string[]
  author: Author
  /** ISO 8601 timestamp. */
  publishedAt: string
  image: ArticleImage
  content: string[]
  quote?: string
  location?: GeoPoint
  breaking?: boolean
  trending?: boolean
}

/** Article enriched with values derived on the client. */
export interface ArticleWithMeta extends Article {
  readingTime: number
}

export interface Page<T> {
  items: T[]
  total: number
  hasMore: boolean
}
