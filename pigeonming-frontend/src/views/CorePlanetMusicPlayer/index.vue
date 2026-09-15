<script setup lang="ts">
import { FvButton as FluentButton } from '@creatorsn/vfluent3'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const isDarkMode = ref(false)
const syncTheme = () => {
  isDarkMode.value = document.documentElement.getAttribute('data-theme') === 'dark'
}

let observer: MutationObserver | null = null

onMounted(() => {
  syncTheme()
  observer = new MutationObserver(syncTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

const buttonTheme = computed<'light' | 'dark'>(() => (isDarkMode.value ? 'dark' : 'light'))
const buttonBackground = computed(() =>
  isDarkMode.value ? 'rgba(118, 185, 237, 0.2)' : 'rgba(255, 255, 255, 0.92)',
)
const buttonForeground = computed(() => (isDarkMode.value ? '#eaf4ff' : '#0a3a6a'))
const buttonBorderColor = computed(() =>
  isDarkMode.value ? 'rgba(187, 217, 244, 0.42)' : 'rgba(19, 88, 150, 0.28)',
)

const openRepository = () => {
  window.location.assign('https://github.com/Pigeon-Ming/CorePlanetMusicPlayer')
}
</script>

<template>
  <section class="product-page">
    <header class="product-hero" :class="isDarkMode ? 'theme-dark' : 'theme-light'">
      <div class="hero-content">
        <h1 class="hero-title">CorePlanetMusicPlayer</h1>
        <p class="hero-description">UWP平台的音乐播放器核心</p>
        <div class="hero-actions">
          <FluentButton
            class="repository-button"
            :theme="buttonTheme"
            :background="buttonBackground"
            :foreground="buttonForeground"
            :border-color="buttonBorderColor"
            :is-box-shadow="false"
            :border-radius="8"
            role="button"
            tabindex="0"
            @click="openRepository"
            @keydown.enter.prevent="openRepository"
            @keydown.space.prevent="openRepository"
          >
            <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.467-2.381 1.235-3.221-.135-.303-.54-1.524.105-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.647 1.652.242 2.873.119 3.176.765.84 1.23 1.911 1.23 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Github仓库
          </FluentButton>
        </div>
      </div>
    </header>
  </section>
</template>

<style scoped>
.product-page {
  width: 100%;
}

.product-hero {
  position: relative;
  width: 100%;
  min-height: clamp(440px, 70vh, 760px);
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(260px, 0.92fr);
  align-items: center;
  gap: clamp(1.4rem, 3vw, 2.8rem);
  padding: clamp(1.6rem, 3.4vw, 2.4rem) clamp(1.1rem, 2.6vw, 2rem);
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 620px;
}

.hero-title {
  margin-top: 0.45rem;
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
}

.hero-actions {
  margin-top: 1rem;
}

.hero-description {
  margin-top: 0.85rem;
  max-width: 34ch;
  font-size: clamp(1rem, 1.8vw, 1.18rem);
  line-height: 1.58;
  color: var(--text-description);
}

:deep(.repository-button.fv-Button) {
  width: 122px;
  height: 32px;
}

.github-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  flex-shrink: 0;
  vertical-align: middle;
}

.theme-light {
  --text-description: rgba(30, 41, 59, 0.9);
}

.theme-dark {
  --text-description: rgba(231, 241, 255, 0.94);
}

@media (max-width: 960px) {
  .product-hero {
    grid-template-columns: 1fr;
    min-height: 0;
    gap: 1rem;
  }

  .hero-content {
    max-width: 100%;
  }
}
</style>
