<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'
import PlanetMusicPlayer from '@/components/HomeCarouselSlide/PlanetMusicPlayer.vue'
import { loadArticleBySlug } from '@/data/article'
import { renderMarkdown } from '@/utils/markdown'
import { formatArticleTime } from '@/utils/articleTime'
import { getArticlePreview, getPlainText } from '@/utils/articlePreview'

interface CarouselSlide {
  key: string
  component: Component
}

interface QuickLinkItem {
  key: string
  label: string
  icon: string
  link: string
}

interface FeaturedArticleItem {
  key: string
  title: string
  summary?: string
  updatedAt?: string
  tags?: string[]
  link: string
  coverImage?: string
}

const router = useRouter()

// 后续新增轮播页时，继续在这里导入组件并加入数组即可。
const carouselSlides = ref<CarouselSlide[]>([
  {
    key: 'planet-music-player',
    component: PlanetMusicPlayer,
  },
])

const quickLinks = ref<QuickLinkItem[]>([
  { key: 'quick-1', label: '微软商店页面', icon: 'Shop', link: 'https://apps.microsoft.com/search/publisher?name=Pigeon_Ming&hl=zh-CN&gl=HK' },
  { key: 'quick-2', label: '即将推出', icon: 'Help', link: '' },
  // { key: 'quick-3', label: 'JigsawOS开发者中心', icon: 'Rocket', link: '' },
  { key: 'quick-3', label: '即将推出', icon: 'Rocket', link: '' },
  // { key: 'quick-4', label: 'PlanetMusicPlayer支持', icon: 'Contact', link: '' },
  { key: 'quick-4', label: '即将推出', icon: 'Contact', link: '' },
])

const featuredArticles = ref<FeaturedArticleItem[]>([])

const addFeaturedArticle = (article: FeaturedArticleItem) => {
  featuredArticles.value.push(article)
}

addFeaturedArticle({
  key: 'article-1',
  title: 'PlanetMusicPlayer 更新日志',
  link: '/article/PMPUpdateLog',
  coverImage: ''
})

onMounted(async () => {
  await Promise.all(featuredArticles.value.map(async (article) => {
    if (article.summary?.trim()) article.summary = getPlainText(renderMarkdown(article.summary))
    if (!article.link.startsWith('/article/')) return

    const route = router.resolve(article.link)
    if (route.name !== 'article-detail') return

    try {
      const post = await loadArticleBySlug(String(route.params.slug))
      if (post) {
        article.updatedAt = post.meta.updatedAt
        article.tags = post.meta.tags
        if (!article.summary?.trim()) {
          article.summary = getArticlePreview(post)
        }
      }
    } catch (error) {
      console.warn(`无法加载精选文章信息：${article.link}`, error)
    }
  }))
})

const carouselSlidesForComponent = computed(() => carouselSlides.value as never[])

const handleCarouselSlidesUpdate = (value: never[]) => {
  carouselSlides.value = value as unknown as CarouselSlide[]
}

const handleQuickLinkClick = async (item: QuickLinkItem) => {
  if (!item.link) return

  if (/^https?:\/\//.test(item.link)) {
    window.open(item.link, '_blank', 'noopener,noreferrer')
    return
  }

  await router.push(item.link)
}

const handleArticleClick = async (item: FeaturedArticleItem) => {
  if (!item.link) return

  if (/^https?:\/\//.test(item.link)) {
    window.open(item.link, '_blank', 'noopener,noreferrer')
    return
  }

  await router.push(item.link)
}

</script>

<template>
  <section class="home-page">
    <FvFlipView
      :model-value="carouselSlidesForComponent"
      class="hero-flip-view"
      :auto-play="true"
      :auto-play-duration="5200"
      :duration="760"
      animation="moveFade"
      @update:model-value="handleCarouselSlidesUpdate"
    >
      <template #item="{ data }">
        <div class="hero-slide">
          <component :is="data.component" />
        </div>
      </template>
    </FvFlipView>

    <section class="quick-nav">
      <div class="quick-nav-list">
        <FvButton
          v-for="item in quickLinks"
          :key="item.key"
          class="quick-nav-button"
          :icon="item.icon"
          :is-box-shadow="false"
          :disabled="!item.link"
          @click="handleQuickLinkClick(item)"
        >
          {{ item.label }}
        </FvButton>
      </div>
    </section>

    <section class="featured-articles">
      <div class="featured-list">
        <FvButton
          v-for="item in featuredArticles"
          :key="item.key"
          class="featured-card-button"
          :class="{ clickable: !!item.link }"
          :is-box-shadow="false"
          :disabled="!item.link"
          @click="handleArticleClick(item)"
        >
          <div class="featured-card-cover">
            <img
              v-if="item.coverImage"
              class="featured-card-cover-image"
              :src="item.coverImage"
              :alt="`${item.title} 封面`"
              loading="lazy"
            />
            <div v-else class="featured-card-cover-placeholder" />
          </div>
          <div class="featured-card-content">
            <h4 class="featured-card-title">{{ item.title }}</h4>
            <p v-if="item.summary?.trim()" class="featured-card-summary">{{ item.summary }}</p>
            <div v-if="item.updatedAt || item.tags?.length" class="featured-card-footer">
              <time
                v-if="item.updatedAt"
                class="featured-card-updated"
                :datetime="item.updatedAt"
                :title="`更新时间：${formatArticleTime(item.updatedAt)}（北京时间）`"
              >
                <span>更新于</span>
                <span>{{ formatArticleTime(item.updatedAt) }}</span>
              </time>
              <div v-if="item.tags?.length" class="featured-card-tags" aria-label="文章标签">
                <span v-for="tag in item.tags" :key="tag" class="featured-card-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </FvButton>
      </div>
    </section>
  </section>
</template>

<style scoped>
.home-page {
  --home-image-background: color-mix(in srgb, var(--color-background) 72%, var(--color-border) 28%);
  --home-image-gradient: linear-gradient(135deg, rgba(148, 163, 184, 0.36), rgba(148, 163, 184, 0.24));
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero-flip-view {
  width: 100%;
  height: 420px;
  box-sizing: border-box;
  border-radius: 14px;
  overflow: hidden;
}

.hero-slide {
  width: 100%;
  height: 420px;
  padding: 0;
  display: block;
  background: transparent;
}

.quick-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-nav-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.quick-nav-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.65rem;
}

.featured-articles {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.featured-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.featured-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.7rem;
}

.featured-card-cover {
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.featured-card-cover-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center;
}

.featured-card-cover-placeholder {
  width: 100%;
  height: 100%;
  background: var(--home-image-gradient), var(--home-image-background);
}

.featured-card-content {
  padding: 0.88rem 0.95rem 0.96rem;
  display: flex;
  flex-direction: column;
  gap: 0.52rem;
  min-height: 122px;
  min-width: 0;
  flex: 1;
}

.featured-card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.4;
}

.featured-card-summary {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  max-height: 4.65em;
  overflow: hidden;
  white-space: normal;
  overflow-wrap: anywhere;
  font-size: 0.86rem;
  color: var(--color-text);
  line-height: 1.55;
  opacity: 0.92;
  margin: 0;
  flex-shrink: 0;
}

.featured-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 0.6rem;
  margin-top: auto;
  padding-top: 0.35rem;
  min-width: 0;
  white-space: normal;
  font-size: 0.72rem;
  color: var(--color-text);
  line-height: 1.5;
}

.featured-card-updated {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  white-space: nowrap;
  opacity: 0.7;
}

.featured-card-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.3rem;
  margin-left: auto;
  min-width: 0;
}

.featured-card-tag {
  min-width: 0;
  padding: 0.08rem 0.38rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  overflow-wrap: anywhere;
}

:deep(.featured-card-button.fv-Button) {
  width: 100%;
  min-height: 266px;
  height: auto;
}

:deep(.featured-card-button.fv-Button .fv-button-main-container) {
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

:deep(.featured-card-button.clickable.fv-Button:hover .fv-button-main-container) {
  border-color: color-mix(in srgb, #005a9e 48%, var(--color-border) 52%);
  transform: translateY(-1px);
}

:deep(.featured-card-button.fv-Button .fv-button-container) {
  width: 100%;
  height: 100%;
  padding: 0 !important;
  box-sizing: border-box;
  text-align: left;
  background: color-mix(in srgb, var(--color-background) 88%, #ffffff 12%) !important;
  background-origin: border-box !important;
  -webkit-background-clip: border-box !important;
  background-clip: border-box !important;
}

:deep(.featured-card-button.fv-Button div.fv-button-main-container .fv-button-container span.fv-btn-content-block) {
  width: 100%;
  height: 100%;
  display: flex !important;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}

:deep(.featured-card-button.fv-Button .fv-btn-content-block > i.ms-Icon) {
  display: none;
}

:deep(.quick-nav-button.fv-Button) {
  width: 100%;
  height: 44px;
}

:deep(.quick-nav-button.fv-Button .fv-button-container) {
  background: rgba(118, 185, 237, 0.2);
}

@media (max-width: 900px) {
  .hero-flip-view,
  .hero-slide {
    height: 260px;
  }

  .quick-nav-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .featured-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .featured-list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
