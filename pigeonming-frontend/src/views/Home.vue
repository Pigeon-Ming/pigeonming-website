<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'
import PlanetMusicPlayer from '@/components/HomeCarouselSlide/PlanetMusicPlayer.vue'

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
  summary: string
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
  summary: '详情信息',
  link: '/article/PMPUpdateLog',
  coverImage: ''
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
            <p class="featured-card-summary">{{ item.summary }}</p>
          </div>
        </FvButton>
      </div>
    </section>
  </section>
</template>

<style scoped>
.home-page {
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
  background:
    linear-gradient(135deg, rgba(148, 163, 184, 0.36), rgba(148, 163, 184, 0.24)),
    color-mix(in srgb, var(--color-background) 72%, var(--color-border) 28%);
}

.featured-card-content {
  padding: 0.88rem 0.95rem 0.96rem;
  display: flex;
  flex-direction: column;
  gap: 0.52rem;
  min-height: 122px;
}

.featured-card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-heading);
  line-height: 1.4;
}

.featured-card-summary {
  font-size: 0.86rem;
  color: var(--color-text);
  line-height: 1.55;
  opacity: 0.92;
  min-height: 56px;
  flex: 1 0 auto;
}

.featured-card-hint {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.62;
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
