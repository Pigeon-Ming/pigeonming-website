<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import bannerUrl from '@/assets/planetmusicplayer-banner.png'
import { getCachedImageBlob } from '@/utils/cachedImage'

const router = useRouter()
const displayedBannerUrl = ref(import.meta.env.DEV ? bannerUrl : '')

// 点击跳转
const goToPage = () => {
  router.push('/PlanetMusicPlayer') // 这里写路由地址
}

const isDarkMode = ref(false)

const syncTheme = () => {
  isDarkMode.value = document.documentElement.getAttribute('data-theme') === 'dark'
}

let observer: MutationObserver | null = null
let isUnmounted = false

onMounted(() => {
  syncTheme()
  observer = new MutationObserver(syncTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  if (!import.meta.env.DEV) {
    void getCachedImageBlob(bannerUrl)
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob)
        if (isUnmounted) {
          URL.revokeObjectURL(objectUrl)
        } else {
          displayedBannerUrl.value = objectUrl
        }
      })
      .catch(() => {
        if (!isUnmounted) displayedBannerUrl.value = bannerUrl
      })
  }
})

onBeforeUnmount(() => {
  isUnmounted = true
  observer?.disconnect()
  observer = null
  if (displayedBannerUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(displayedBannerUrl.value)
  }
})

const buttonTheme = computed<'light' | 'dark'>(() => (isDarkMode.value ? 'dark' : 'light'))
const buttonBackground = computed(() =>
  isDarkMode.value ? 'rgba(118, 185, 237, 0.2)' : 'rgba(255, 255, 255, 0.92)',
)
const buttonForeground = computed(() => (isDarkMode.value ? '#eaf4ff' : '#0a3a6a'))
const buttonBorderColor = computed(() =>
  isDarkMode.value ? 'rgba(187, 217, 244, 0.42)' : 'rgba(19, 88, 150, 0.28)',
)


</script>

<template>
  <div
    class="carousel-slide"
    :class="isDarkMode ? 'theme-dark' : 'theme-light'"
    :style="{ '--banner-image': displayedBannerUrl ? `url(${displayedBannerUrl})` : 'none' }"
  >
    <div class="carousel-content">
      <p class="hero-badge">软件</p>
      <h2 class="hero-title">PlanetMusicPlayer</h2>
      <p class="hero-description">UWP平台的音乐播放器</p>
      <FvButton
        class="detail-button"
        icon="ChevronRight"
        :theme="buttonTheme"
        :background="buttonBackground"
        :foreground="buttonForeground"
        :border-color="buttonBorderColor"
        :is-box-shadow="false"
        :border-radius="8"
        @click="goToPage"
      >
        查看详情
      </FvButton>
    </div>
  </div>
</template>

<style scoped>
.carousel-slide {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.25rem 1.25rem 1.25rem clamp(2.75rem, 5vw, 4.75rem);
  overflow: hidden;
  background-color: var(--home-image-background);
  background-image: var(--banner-image), var(--home-image-gradient);
  background-repeat: no-repeat;
  background-position: right center;
  background-size: cover;
}

.carousel-content {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  max-width: min(700px, 60%);
  color: var(--text-main);
}

.hero-badge {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--adaptive-text-muted);
}

.hero-title {
  margin-top: 0.4rem;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
}

.hero-description {
  margin-top: 0.75rem;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--adaptive-text-muted);
  text-wrap: pretty;
}

.hero-badge,
.hero-title,
.hero-description {
  mix-blend-mode: difference;
  text-shadow: none;
}

:deep(.detail-button.fv-Button) {
  width: 122px;
  height: 32px;
  margin-top: 1rem;
}

.theme-light {
  --text-main: #ffffff;
  --adaptive-text-muted: rgba(255, 255, 255, 0.86);
}

.theme-dark {
  --text-main: #ffffff;
  --adaptive-text-muted: rgba(255, 255, 255, 0.86);
}

@media (max-width: 900px) {
  .carousel-slide {
    gap: 1rem;
    padding-left: clamp(2rem, 6vw, 3rem);
  }

  .carousel-content {
    max-width: min(700px, 64%);
  }

  .hero-title {
    font-size: 1.55rem;
  }
}

@media (width < 768px) {
  .carousel-slide {
    --text-main: var(--color-heading);
    --adaptive-text-muted: var(--color-text);
    justify-content: center;
    padding: 1.25rem 1.5rem;
    background-image: var(--home-image-gradient);
  }

  .carousel-content {
    min-width: 0;
    max-width: 100%;
  }

  .hero-title {
    font-size: clamp(1.25rem, 4.5vw, 1.55rem);
    overflow-wrap: anywhere;
  }

  .hero-badge,
  .hero-title,
  .hero-description {
    mix-blend-mode: normal;
  }
}
</style>
