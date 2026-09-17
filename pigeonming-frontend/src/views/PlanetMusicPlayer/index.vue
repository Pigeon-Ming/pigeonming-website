<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import bannerUrl from '@/assets/planetmusicplayer-banner.png'
import qrCodeUrl from '@/assets/qq-pindao-qrcode.jpg'
import { getCachedImageBlob } from '@/utils/cachedImage'

const isDarkMode = ref(false)
const displayedBannerUrl = ref(import.meta.env.DEV ? bannerUrl : '')
const heroImageUrl =
  'https://store-images.s-microsoft.com/image/apps.43560.14425043237308195.80084d59-ef80-4929-b61a-fcdb3de27502.e1d7772f-2cd1-4699-98be-2d453b39b44a'

const syncTheme = () => {
  isDarkMode.value = document.documentElement.getAttribute('data-theme') === 'dark'
}

let observer: MutationObserver | null = null
let isUnmounted = false

const ensureStoreBadgeScript = () => {
  const scriptSrc = 'https://get.microsoft.com/badge/ms-store-badge.bundled.js'
  const existed = document.querySelector<HTMLScriptElement>(`script[src="${scriptSrc}"]`)
  if (existed) return

  const script = document.createElement('script')
  script.type = 'module'
  script.src = scriptSrc
  document.head.appendChild(script)
}

onMounted(() => {
  ensureStoreBadgeScript()
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
</script>

<template>
  <section class="product-page">
    <header
      class="product-hero"
      :class="isDarkMode ? 'theme-dark' : 'theme-light'"
      :style="{
        '--banner-image': displayedBannerUrl ? `url(${displayedBannerUrl})` : 'none',
        '--thumb-image': `url(${heroImageUrl})`,
      }"
    >
      <div class="hero-content">
        <h1 class="hero-title">PlanetMusicPlayer</h1>
        <p class="hero-description">
          UWP平台的音乐播放器
        </p>
        <div class="hero-actions">
          <ms-store-badge
            productid="9nt5122pwqb8"
            productname="PlanetMusic"
            window-mode="full"
            theme="auto"
            size="medium"
            language="zh-cn"
            animation="on"
          />
        </div>
      </div>

      <div class="hero-media">
        <img class="hero-thumbnail" :src="heroImageUrl" alt="PlanetMusicPlayer 产品截图" loading="eager" />
      </div>
    </header>

    <section class="channel-section" :class="isDarkMode ? 'theme-dark' : 'theme-light'" aria-labelledby="channel-title">
      <div class="channel-content">
        <h2 id="channel-title">添加QQ频道，获取更多信息</h2>
        <p>使用 QQ 扫描二维码，加入 PlanetMusicPlayer 频道</p>
      </div>
      <img class="channel-qrcode" :src="qrCodeUrl" alt="PlanetMusicPlayer QQ频道二维码" loading="lazy" />
    </section>
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

.product-hero::before {
  content: '';
  position: absolute;
  inset: -24% -10% -24% 28%;
  background-image: var(--banner-image);
  background-size: cover;
  background-position: right center;
  filter: blur(72px) saturate(126%) contrast(102%);
  transform: scale(1.1);
  opacity: var(--bg-bloom-opacity);
  -webkit-mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 48%,
    rgba(0, 0, 0, 0.2) 62%,
    rgba(0, 0, 0, 0.7) 82%,
    rgba(0, 0, 0, 1) 100%
  );
  mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 48%,
    rgba(0, 0, 0, 0.2) 62%,
    rgba(0, 0, 0, 0.7) 82%,
    rgba(0, 0, 0, 1) 100%
  );
}

.product-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(15, 23, 42, 0) 0%,
      rgba(15, 23, 42, 0) 52%,
      var(--overlay-soft) 76%,
      var(--overlay-strong) 100%
    ),
    radial-gradient(circle at 83% 40%, var(--overlay-glow-warm), transparent 46%),
    radial-gradient(circle at 78% 70%, var(--overlay-glow-cool), transparent 48%);
  opacity: var(--bg-tint-opacity);
  pointer-events: none;
}

.hero-content,
.hero-media {
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 620px;
}

.hero-badge {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  color: var(--text-badge);
}

.hero-title {
  margin-top: 0.45rem;
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: -0.02em;
}

.hero-description {
  margin-top: 0.85rem;
  max-width: 34ch;
  font-size: clamp(1rem, 1.8vw, 1.18rem);
  line-height: 1.58;
  color: var(--text-description);
}

.hero-actions {
  margin-top: 1.2rem;
}

.hero-media {
  position: relative;
  justify-self: end;
  width: clamp(240px, 36vw, 520px);
  min-width: 240px;
}

.hero-media::before {
  content: '';
  position: absolute;
  inset: 8% -6% 8% -24%;
  z-index: -1;
  background-image: var(--thumb-image);
  background-size: cover;
  background-position: right center;
  filter: blur(24px) saturate(118%);
  opacity: var(--thumb-bleed-opacity);
  -webkit-mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 34%,
    rgba(0, 0, 0, 0.85) 72%,
    rgba(0, 0, 0, 1) 100%
  );
  mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.3) 34%,
    rgba(0, 0, 0, 0.85) 72%,
    rgba(0, 0, 0, 1) 100%
  );
}

.hero-thumbnail {
  width: 100%;
  aspect-ratio: 16 / 10;
  display: block;
  object-fit: cover;
  object-position: center;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  -webkit-mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.42) 0%,
    rgba(0, 0, 0, 0.86) 14%,
    rgba(0, 0, 0, 1) 30%,
    rgba(0, 0, 0, 1) 100%
  );
  mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.42) 0%,
    rgba(0, 0, 0, 0.86) 14%,
    rgba(0, 0, 0, 1) 30%,
    rgba(0, 0, 0, 1) 100%
  );
  box-shadow:
    0 14px 32px rgba(8, 18, 30, 0.42),
    0 2px 8px rgba(8, 18, 30, 0.2);
}

.theme-light {
  --bg-bloom-opacity: 0.4;
  --bg-tint-opacity: 0.46;
  --thumb-bleed-opacity: 0.44;
  --overlay-soft: rgba(26, 84, 132, 0.08);
  --overlay-strong: rgba(22, 71, 112, 0.16);
  --overlay-glow-warm: rgba(237, 190, 96, 0.12);
  --overlay-glow-cool: rgba(82, 162, 238, 0.14);
  --text-main: #0f172a;
  --text-badge: rgba(15, 23, 42, 0.72);
  --text-description: rgba(30, 41, 59, 0.9);
}

.theme-dark {
  --bg-bloom-opacity: 0.34;
  --bg-tint-opacity: 0.4;
  --thumb-bleed-opacity: 0.36;
  --overlay-soft: rgba(80, 155, 220, 0.08);
  --overlay-strong: rgba(74, 147, 211, 0.16);
  --overlay-glow-warm: rgba(214, 165, 78, 0.1);
  --overlay-glow-cool: rgba(95, 171, 246, 0.14);
  --text-main: #f7fbff;
  --text-badge: rgba(233, 243, 255, 0.86);
  --text-description: rgba(231, 241, 255, 0.94);
}

.channel-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1.5rem, 6vw, 5rem);
  padding: clamp(2rem, 5vw, 4rem);
  border: 1px solid var(--channel-border);
  border-radius: 16px;
  background: var(--channel-background);
  color: var(--text-main);
}

.channel-content {
  max-width: 26rem;
}

.channel-content h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.25;
}

.channel-content p {
  margin-top: 0.75rem;
  line-height: 1.6;
  color: var(--text-description);
}

.channel-qrcode {
  display: block;
  width: clamp(260px, 32vw, 380px);
  max-width: 100%;
  height: auto;
  flex: 0 1 auto;
  border-radius: 12px;
}

.channel-section.theme-light {
  --channel-background: #eef5fc;
  --channel-border: rgba(15, 23, 42, 0.1);
}

.channel-section.theme-dark {
  --channel-background: #142337;
  --channel-border: rgba(148, 163, 184, 0.2);
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

  .hero-media {
    justify-self: stretch;
    width: 100%;
  }

  .hero-thumbnail {
    aspect-ratio: 16 / 9;
    border-radius: 8px;
  }

  .channel-section {
    flex-direction: column;
    text-align: center;
  }
}
</style>
