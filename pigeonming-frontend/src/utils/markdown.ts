export interface ArticleMeta {
  title: string
  /** ISO 8601 date-time with an explicit time zone. */
  publishedAt?: string
  /** ISO 8601 date-time; defaults to publishedAt. */
  updatedAt?: string
  summary: string
  tags: string[]
  cover?: string
  draft?: boolean
}

export interface ArticlePost {
  slug: string
  meta: ArticleMeta
  body: string
  html: string
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const renderInlineMarkdown = (value: string) => {
  const escaped = escapeHtml(value)

  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\[([^\]]+)\]\((\/[^)\s]+)\)/g, '<a href="$2">$1</a>')
}

export const renderMarkdown = (markdown: string) => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const html: string[] = []
  let paragraph: string[] = []
  let listItems: string[] = []
  let codeLines: string[] = []
  let inCodeBlock = false
  let codeLanguage = ''

  const flushParagraph = () => {
    if (!paragraph.length) return
    html.push(`<p>${renderInlineMarkdown(paragraph.join(' '))}</p>`)
    paragraph = []
  }

  const flushList = () => {
    if (!listItems.length) return
    html.push(`<ul>${listItems.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`)
    listItems = []
  }

  const flushCodeBlock = () => {
    const className = codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : ''
    html.push(`<pre><code${className}>${escapeHtml(codeLines.join('\n'))}</code></pre>`)
    codeLines = []
    codeLanguage = ''
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock()
        inCodeBlock = false
      } else {
        flushParagraph()
        flushList()
        codeLanguage = trimmed.slice(3).trim()
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed)
    if (heading) {
      flushParagraph()
      flushList()
      const marker = heading[1] ?? '#'
      const content = heading[2] ?? ''
      const level = marker.length
      html.push(`<h${level}>${renderInlineMarkdown(content)}</h${level}>`)
      continue
    }

    if (trimmed.startsWith('> ')) {
      flushParagraph()
      flushList()
      html.push(`<blockquote>${renderInlineMarkdown(trimmed.slice(2))}</blockquote>`)
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph()
      listItems.push(trimmed.replace(/^[-*]\s+/, ''))
      continue
    }

    flushList()
    paragraph.push(trimmed)
  }

  if (inCodeBlock) flushCodeBlock()
  flushParagraph()
  flushList()

  return html.join('\n')
}

const parseFrontmatterValue = (value: string) => {
  if (value === 'true') return true
  if (value === 'false') return false
  return value.replace(/^['"]|['"]$/g, '')
}

const parseFrontmatter = (source: string) => {
  const meta: Record<string, unknown> = {}
  const lines = source.split('\n')

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? ''
    const keyValue = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
    if (!keyValue) continue

    const key = keyValue[1]
    const rawValue = keyValue[2] ?? ''
    if (!key) continue

    if (rawValue) {
      meta[key] = parseFrontmatterValue(rawValue)
      continue
    }

    const values: string[] = []
    while (index + 1 < lines.length && /^\s+-\s+/.test(lines[index + 1] ?? '')) {
      index += 1
      values.push((lines[index] ?? '').replace(/^\s+-\s+/, '').trim())
    }
    meta[key] = values
  }

  return meta
}

const parseIsoDateTime = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const dateTime = value.trim()
  const isoPattern = /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/
  if (!isoPattern.test(dateTime) || !Number.isFinite(Date.parse(dateTime))) return undefined

  // Date.parse can normalize invalid calendar dates such as February 30.
  const datePart = dateTime.slice(0, 10)
  const calendarDate = new Date(`${datePart}T00:00:00Z`)
  if (!Number.isFinite(calendarDate.getTime()) || calendarDate.toISOString().slice(0, 10) !== datePart) {
    return undefined
  }
  return dateTime
}

export const parseArticle = (slug: string, rawMarkdown: string): ArticlePost => {
  const normalized = rawMarkdown.replace(/\r\n/g, '\n')
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(normalized)
  const frontmatter = match ? parseFrontmatter(match[1] ?? '') : {}
  const body = match ? normalized.slice(match[0].length).trim() : normalized.trim()
  const publishedAt = parseIsoDateTime(frontmatter.publishedAt)
  const updatedAt = parseIsoDateTime(frontmatter.updatedAt) ?? publishedAt

  const meta: ArticleMeta = {
    title: String(frontmatter.title ?? slug),
    publishedAt,
    updatedAt,
    summary: String(frontmatter.summary ?? ''),
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [],
    cover: typeof frontmatter.cover === 'string' ? frontmatter.cover : undefined,
    draft: frontmatter.draft === true,
  }

  return {
    slug,
    meta,
    body,
    html: renderMarkdown(body),
  }
}
