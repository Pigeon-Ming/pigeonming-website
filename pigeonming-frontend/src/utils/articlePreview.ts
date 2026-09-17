import { renderMarkdown } from './markdown'
import type { ArticlePost } from './markdown'

export const getPlainText = (html: string) => {
  const template = document.createElement('template')
  template.innerHTML = html
  template.content.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, pre, br')
    .forEach((element) => element.append(' '))
  return (template.content.textContent ?? '').replace(/\s+/g, ' ').trim()
}

export const getArticlePreview = (post: ArticlePost) =>
  getPlainText(post.meta.summary.trim() ? renderMarkdown(post.meta.summary) : post.html)
