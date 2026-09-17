import { parseArticle } from '@/utils/markdown'
import type { ArticlePost } from '@/utils/markdown'

const modules = import.meta.glob<string>('../content/article/*.md', {
  import: 'default',
  query: '?raw',
})

const getSlugFromPath = (path: string) => path.split('/').pop()?.replace(/\.md$/, '') ?? path

const loaders = Object.fromEntries(
  Object.entries(modules).map(([path, loader]) => [getSlugFromPath(path), loader]),
)

const cache = new Map<string, ArticlePost>()

const loadPost = async (slug: string, loader: () => Promise<string>) => {
  const cached = cache.get(slug)
  if (cached) return cached

  const markdown = await loader()
  const post = parseArticle(slug, markdown)
  cache.set(slug, post)
  return post
}

export const loadArticles = async (): Promise<ArticlePost[]> => {
  const posts = await Promise.all(
    Object.entries(loaders).map(([slug, loader]) => loadPost(slug, loader)),
  )

  return posts
    .filter((post) => !post.meta.draft)
    .sort((left, right) => {
      if (left.meta.publishedAt === undefined) return right.meta.publishedAt === undefined ? 0 : 1
      if (right.meta.publishedAt === undefined) return -1
      return Date.parse(right.meta.publishedAt) - Date.parse(left.meta.publishedAt)
    })
}

export const loadArticleBySlug = async (slug: string) => {
  const loader = loaders[slug]
  if (!loader) return undefined

  const post = await loadPost(slug, loader)
  return post.meta.draft ? undefined : post
}
