<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleLayout from '@/components/ArticleLayout.vue'
import { loadArticleBySlug } from '@/data/article'
import type { ArticlePost } from '@/utils/markdown'

const route = useRoute()
const router = useRouter()

const slug = computed(() => String(route.params.slug ?? ''))
const post = ref<ArticlePost>()
const isLoading = ref(true)
const isDarkMode = ref(false)
const syncTheme = () => {
  isDarkMode.value = document.documentElement.getAttribute('data-theme') === 'dark'
}
let themeObserver: MutationObserver | null = null

onMounted(() => {
  syncTheme()
  themeObserver = new MutationObserver(syncTheme)
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
  themeObserver = null
})

const buttonTheme = computed<'light' | 'dark'>(() => (isDarkMode.value ? 'dark' : 'light'))
const buttonBackground = computed(() =>
  isDarkMode.value ? 'rgba(125, 195, 255, 0.14)' : 'rgba(255, 255, 255, 0.85)',
)
const buttonForeground = computed(() => (isDarkMode.value ? '#d8ebff' : '#005a9e'))
const buttonBorderColor = computed(() =>
  isDarkMode.value ? 'rgba(125, 195, 255, 0.28)' : 'rgba(0, 90, 158, 0.2)',
)

watch(
  slug,
  async (currentSlug) => {
    isLoading.value = true
    const loadedPost = await loadArticleBySlug(currentSlug)
    if (slug.value !== currentSlug) return

    post.value = loadedPost
    isLoading.value = false
    document.title = loadedPost
      ? `${loadedPost.meta.title} - Pigeon_Ming's Blog`
      : "文章不存在 - Pigeon_Ming's Blog"
  },
  { immediate: true },
)

const goBack = async () => {
  await router.push('/article')
}
</script>

<template>
  <section class="article-page">
    <FvButton
      class="back-button"
      icon="Back"
      :theme="buttonTheme"
      :background="buttonBackground"
      :foreground="buttonForeground"
      :border-color="buttonBorderColor"
      :is-box-shadow="false"
      :border-radius="8"
      @click="goBack"
    >
      返回文章列表
    </FvButton>

    <p v-if="isLoading" class="loading-text">文章加载中...</p>

    <ArticleLayout v-else-if="post" :post="post" />

    <div v-else class="not-found">
      <h1>文章不存在</h1>
      <p>这篇文章可能已经移动或还没有发布。</p>
    </div>
  </section>
</template>

<style scoped>
.article-page {
  width: 100%;
  padding-bottom: 2rem;
}

:deep(.back-button.fv-Button) {
  width: 132px;
  height: 34px;
  margin-bottom: 0.8rem;
}

.not-found {
  width: min(860px, 100%);
  margin: 0 auto;
  padding: 2rem 0;
}

.loading-text {
  width: min(860px, 100%);
  margin: 0 auto;
  padding: 2rem 0;
  color: var(--color-text);
  opacity: 0.72;
}

.not-found h1 {
  color: var(--color-heading);
  font-size: 1.8rem;
  font-weight: 650;
}

.not-found p {
  margin-top: 0.4rem;
  color: var(--color-text);
  opacity: 0.76;
}
</style>
