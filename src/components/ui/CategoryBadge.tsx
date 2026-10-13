import { Link } from 'react-router-dom'
import { getCategory } from '../../data/categories'
import type { CategorySlug } from '../../types/news'

interface CategoryBadgeProps {
  slug: CategorySlug
  /** Render as a link to the category page. Off inside other links. */
  asLink?: boolean
  className?: string
}

export function CategoryBadge({ slug, asLink = false, className = '' }: CategoryBadgeProps) {
  const category = getCategory(slug)
  if (!category) return null
  const classes = `inline-flex items-center rounded-full px-2.5 py-1 eyebrow ring-1 ring-inset backdrop-blur-md ${category.tone} ${className}`

  return asLink ? (
    <Link to={`/category/${slug}`} className={`${classes} transition hover:brightness-125`}>
      {category.name}
    </Link>
  ) : (
    <span className={classes}>{category.name}</span>
  )
}
