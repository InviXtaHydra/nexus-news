import { articles as mockArticles } from '../data/articles'
import { readingTime } from '../lib/format'
import type { Article, ArticleWithMeta, CategorySlug, Page } from '../types/news'

/**
 * Single entry point for news data. Every function is async so the UI
 * already handles loading states; to plug in a real API, replace
 * `fetchAll` (or each function) with HTTP calls returning the same shapes.
 */

const LATENCY_MS = 450

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

const enrich = (a: Article): ArticleWithMeta => ({ ...a, readingTime: readingTime(a.content) })

const byNewest = (a: Article, b: Article) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()

let store: ArticleWithMeta[] | null = null

async function fetchAll(): Promise<ArticleWithMeta[]> {
  if (!store) {
    await wait(LATENCY_MS)
    store = mockArticles.map(enrich).sort(byNewest)
  }
  return store
}

export async function getFeatured(): Promise<ArticleWithMeta> {
  const all = await fetchAll()
  return all.find((a) => a.breaking) ?? all[0]
}

export async function getTrending(limit = 6): Promise<ArticleWithMeta[]> {
  const all = await fetchAll()
  return all.filter((a) => a.trending && !a.breaking).slice(0, limit)
}

export async function getLatest(offset: number, limit: number): Promise<Page<ArticleWithMeta>> {
  const all = await fetchAll()
  // Simulate the network round trip a paginated API would have.
  if (offset > 0) await wait(LATENCY_MS)
  const items = all.slice(offset, offset + limit)
  return { items, total: all.length, hasMore: offset + limit < all.length }
}

export async function getByCategory(slug: CategorySlug): Promise<ArticleWithMeta[]> {
  const all = await fetchAll()
  return all.filter((a) => a.category === slug)
}

export async function getArticle(slug: string): Promise<ArticleWithMeta | undefined> {
  const all = await fetchAll()
  return all.find((a) => a.slug === slug)
}

/** Same-category stories first, then stories sharing a tag. */
export async function getRelated(article: Article, limit = 3): Promise<ArticleWithMeta[]> {
  const all = await fetchAll()
  const score = (a: Article) =>
    (a.category === article.category ? 2 : 0) + a.tags.filter((t) => article.tags.includes(t)).length
  return all
    .filter((a) => a.id !== article.id)
    .map((a) => ({ a, s: score(a) }))
    .filter(({ s }) => s > 0)
    .sort((x, y) => y.s - x.s)
    .slice(0, limit)
    .map(({ a }) => a)
}

export async function searchArticles(query: string): Promise<ArticleWithMeta[]> {
  const all = await fetchAll()
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return all.filter((a) => {
    const haystack = [a.title, a.summary, a.category, a.author.name, ...a.tags, a.location?.name ?? '']
      .join(' ')
      .toLowerCase()
    return terms.every((t) => haystack.includes(t))
  })
}

export async function getGeoStories(): Promise<ArticleWithMeta[]> {
  const all = await fetchAll()
  return all.filter((a) => a.location)
}

/** Neighbouring stories in publication order, for previous/next navigation. */
export async function getAdjacent(
  slug: string,
): Promise<{ newer?: ArticleWithMeta; older?: ArticleWithMeta }> {
  const all = await fetchAll()
  const i = all.findIndex((a) => a.slug === slug)
  if (i === -1) return {}
  return { newer: all[i - 1], older: all[i + 1] }
}
