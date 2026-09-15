<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadArticles } from '@/data/article'
import type { ArticlePost } from '@/utils/markdown'

const router = useRouter()
const articles = ref<ArticlePost[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    articles.value = await loadArticles()
  } finally {
    isLoading.value = false
  }
})

const openPost = async (slug: string) => {
  await router.push(`/article/${slug}`)
}
</script>

<template>
  <section class="article-list-page">
    <header class="article-list-header">
      <h1>文章列表</h1>
    </header>

    <p v-if="isLoading" class="empty-text">文章加载中...</p>

    <div v-else-if="articles.length" class="post-list">
      <article v-for="post in articles" :key="post.slug" class="post-card">
        <button type="button" class="post-button" @click="openPost(post.slug)">
          <div class="post-content">
            <div class="post-meta">
              <time v-if="post.meta.date" :datetime="post.meta.date">{{ post.meta.date }}</time>
              <span v-for="tag in post.meta.tags" :key="tag" class="post-tag">{{ tag }}</span>
            </div>
            <h2>{{ post.meta.title }}</h2>
            <p>{{ post.meta.summary }}</p>
          </div>
          <i class="ms-Icon ms-Icon--ChevronRight post-arrow" />
        </button>
      </article>
    </div>

    <p v-else class="empty-text">暂时还没有文章。</p>
  </section>
</template>

<style scoped>
.article-list-page {
  width: min(980px, 100%);
  margin: 0 auto;
  padding-bottom: 2rem;
}

.article-list-header {
  padding: 1.1rem 0 1.35rem;
}

.article-list-header h1 {
  margin: 0;
  color: var(--color-heading);
  font-size: clamp(2rem, 5vw, 3.1rem);
  font-weight: 700;
  line-height: 1.1;
}

.post-list {
  display: grid;
  gap: 0.78rem;
}

.post-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--article-card-background);
}

.post-button {
  width: 100%;
  min-height: 132px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  border: 0;
  padding: 1rem 1.1rem;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.post-button:hover {
  background: var(--article-card-hover);
}

.post-content {
  min-width: 0;
}

.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.42rem;
  color: var(--color-text);
  font-size: 0.8rem;
  line-height: 1.5;
  opacity: 0.72;
}

.post-meta time,
.post-tag {
  white-space: nowrap;
}

.post-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.08rem 0.38rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
}

.post-card h2 {
  margin-top: 0.52rem;
  color: var(--color-heading);
  font-size: 1.12rem;
  font-weight: 650;
  line-height: 1.35;
}

.post-card p {
  margin-top: 0.42rem;
  color: var(--color-text);
  font-size: 0.92rem;
  line-height: 1.65;
  opacity: 0.82;
}

.post-arrow {
  color: var(--color-text);
  font-size: 0.9rem;
  opacity: 0.58;
}

.empty-text {
  color: var(--color-text);
  opacity: 0.72;
}

:global(:root[data-theme='light']) .article-list-page {
  --article-card-background: rgba(255, 255, 255, 0.7);
  --article-card-hover: rgba(0, 90, 158, 0.06);
}

:global(:root[data-theme='dark']) .article-list-page {
  --article-card-background: rgba(255, 255, 255, 0.035);
  --article-card-hover: rgba(125, 195, 255, 0.08);
}
</style>
