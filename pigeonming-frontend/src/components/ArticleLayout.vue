<script setup lang="ts">
import type { ArticlePost } from '@/utils/markdown'

defineProps<{
  post: ArticlePost
}>()
</script>

<template>
  <article class="article-layout">
    <header class="article-header">
      <h1>{{ post.meta.title }}</h1>
      <div class="article-meta">
        <time v-if="post.meta.date" :datetime="post.meta.date">{{ post.meta.date }}</time>
        <span v-for="tag in post.meta.tags" :key="tag" class="article-tag">{{ tag }}</span>
      </div>
      <p v-if="post.meta.summary" class="article-summary">{{ post.meta.summary }}</p>
    </header>

    <div v-if="post.meta.cover" class="article-cover">
      <img :src="post.meta.cover" :alt="`${post.meta.title} 封面`" />
    </div>

    <section class="article-body" v-html="post.html" />
  </article>
</template>

<style scoped>
.article-layout {
  width: min(860px, 100%);
  margin: 0 auto;
  color: var(--color-text);
}

.article-header {
  padding: 1.2rem 0 1.4rem;
  border-bottom: 1px solid var(--color-border);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.48rem;
  margin-top: 0.72rem;
  color: var(--color-text);
  font-size: 0.82rem;
  opacity: 0.76;
}

.article-tag {
  padding: 0.12rem 0.42rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-background) 86%, var(--color-heading) 14%);
}

h1 {
  margin: 0;
  color: var(--color-heading);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.12;
}

.article-summary {
  max-width: 62ch;
  margin-top: 0.78rem;
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.75;
  opacity: 0.84;
}

.article-cover {
  margin: 1.25rem 0 0;
  overflow: hidden;
  border-radius: 12px;
}

.article-cover img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.article-body {
  padding: 1.6rem 0 2.6rem;
}

:deep(.article-body h1),
:deep(.article-body h2),
:deep(.article-body h3) {
  margin: 1.6rem 0 0.72rem;
  color: var(--color-heading);
  font-weight: 650;
  line-height: 1.25;
}

:deep(.article-body h1) {
  font-size: 1.8rem;
}

:deep(.article-body h2) {
  font-size: 1.38rem;
}

:deep(.article-body h3) {
  font-size: 1.12rem;
}

:deep(.article-body p),
:deep(.article-body li),
:deep(.article-body blockquote) {
  color: var(--color-text);
  font-size: 0.98rem;
  line-height: 1.85;
}

:deep(.article-body p) {
  margin: 0.88rem 0;
}

:deep(.article-body ul) {
  margin: 0.88rem 0;
  padding-left: 1.25rem;
}

:deep(.article-body blockquote) {
  margin: 1rem 0;
  padding: 0.72rem 1rem;
  border-left: 3px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 86%, var(--color-heading) 14%);
}

:deep(.article-body a) {
  color: var(--article-link);
  text-decoration: none;
}

:deep(.article-body a:hover) {
  text-decoration: underline;
}

:deep(.article-body code) {
  padding: 0.1rem 0.3rem;
  border-radius: 5px;
  background: var(--code-background);
  color: var(--code-text);
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.9em;
}

:deep(.article-body pre) {
  margin: 1rem 0;
  padding: 1rem;
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--pre-background);
}

:deep(.article-body pre code) {
  padding: 0;
  background: transparent;
  color: var(--pre-text);
}

:global(:root[data-theme='light']) .article-layout {
  --article-link: #005a9e;
  --code-background: rgba(15, 23, 42, 0.08);
  --code-text: #172033;
  --pre-background: #f1f5f9;
  --pre-text: #172033;
}

:global(:root[data-theme='dark']) .article-layout {
  --article-link: #7dc3ff;
  --code-background: rgba(226, 232, 240, 0.12);
  --code-text: #e5edf7;
  --pre-background: #111827;
  --pre-text: #e5edf7;
}
</style>
