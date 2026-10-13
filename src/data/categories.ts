import type { Category, CategorySlug } from '../types/news'

export const categories: Category[] = [
  {
    slug: 'world',
    name: 'World',
    description: 'Diplomacy, conflict, climate and the people shaping events across every continent.',
    tone: 'text-sky-700 bg-sky-500/10 ring-sky-500/30 dark:text-sky-300',
  },
  {
    slug: 'technology',
    name: 'Technology',
    description: 'Chips, AI, robotics and the platforms quietly rewriting how we live and work.',
    tone: 'text-blue-700 bg-blue-500/10 ring-blue-500/30 dark:text-blue-300',
  },
  {
    slug: 'business',
    name: 'Business',
    description: 'Markets, money and the companies — large and small — moving the global economy.',
    tone: 'text-emerald-700 bg-emerald-500/10 ring-emerald-500/30 dark:text-emerald-300',
  },
  {
    slug: 'science',
    name: 'Science',
    description: 'Discoveries from the lab, the field and deep space, explained without the jargon.',
    tone: 'text-violet-700 bg-violet-500/10 ring-violet-500/30 dark:text-violet-300',
  },
  {
    slug: 'entertainment',
    name: 'Entertainment',
    description: 'Film, music, games and the culture conversations worth having.',
    tone: 'text-fuchsia-700 bg-fuchsia-500/10 ring-fuchsia-500/30 dark:text-fuchsia-300',
  },
]

const bySlug = new Map(categories.map((c) => [c.slug, c]))

export function getCategory(slug: string): Category | undefined {
  return bySlug.get(slug as CategorySlug)
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return bySlug.has(slug as CategorySlug)
}
