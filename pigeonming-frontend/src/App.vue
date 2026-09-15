<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import Footer from '@/components/Footer.vue'
import avatarUrl from '@/assets/avatar-rounded.png'
import pmpIconUrl from '@/assets/PMP.svg'
import universalSendIconUrl from '@/assets/UniversalSend.svg'

type NavItemType = 'item' | 'header' | 'divider'

interface NavMenuItem {
  key: string
  label: string
  icon?: string
  iconImage?: string
  type?: NavItemType
  route?: string
  href?: string
  disabled?: boolean
  children?: NavMenuItem[]
}

interface FlyoutOption {
  key: string
  text: string
  icon?: string
  type?: 'default' | 'header' | 'divider'
  route?: string
  href?: string
  disabled?: boolean
  children?: FlyoutOption[]
}

interface FooterLinkItem {
  key: string
  title: string
  href: string
}

const router = useRouter()
const route = useRoute()
const themeStorageKey = 'pigeonming-article-theme'
const isDarkMode = ref(false)

const currentTheme = computed<'light' | 'dark'>(() => (isDarkMode.value ? 'dark' : 'light'))
const themeClass = computed(() => (isDarkMode.value ? 'theme-dark' : 'theme-light'))

const applyThemeMode = (darkMode: boolean) => {
  const mode = darkMode ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', mode)
}

onMounted(() => {
  const savedMode = localStorage.getItem(themeStorageKey)
  if (savedMode === 'dark' || savedMode === 'light') {
    isDarkMode.value = savedMode === 'dark'
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyThemeMode(isDarkMode.value)
})

watch(isDarkMode, (darkMode) => {
  localStorage.setItem(themeStorageKey, darkMode ? 'dark' : 'light')
  applyThemeMode(darkMode)
})

const navigationMenus = ref<NavMenuItem[]>([
  { key: 'home', label: '首页', icon: 'Home', route: '/' },
  {
    key: 'planetmusicplayer-menu', label: 'PlanetMusicPlayer', iconImage: pmpIconUrl,
    children: [
      { key: 'planetmusicplayer', label: 'PlanetMusicPlayer', route:'/PlanetMusicPlayer' },
      { key: 'coreplanetmusicplayer', label: 'CorePlanetMusicPlayer', route:'/CorePlanetMusicPlayer' }
    ]
  },
  { key: 'universalsend', label: 'UniversalSend', route:'/UniversalSend', iconImage: universalSendIconUrl },
  {
    key: 'jigsawos-menu', label: 'JigsawOS', icon: 'CommandPrompt',
    children: [
      { key: 'jigsawos', label: 'JigsawOS', route:'/JigsawOS' },
      { key: 'jigsawos-developer', label: '开发者中心', route:'/JigsawOS/developer' }
    ]
  },
  { key: 'article', label: '文章', icon: 'Articles', route: '/article' }
])

const addNavigationMenu = (menu: NavMenuItem) => {
  navigationMenus.value.push(menu)
}

// addNavigationMenu({
//   key: 'resource',
//   label: '资源',
//   icon: 'Library',
//   children: [{ key: 'resource-github', label: 'GitHub', icon: 'OpenSource', href: 'https://github.com/Creator-SN/VFluent3' }],
// })

const toFlyoutOptions = (items: NavMenuItem[]): FlyoutOption[] =>
  items.map((item) => ({
    key: item.key,
    text: item.label,
    icon: item.icon,
    type: item.type === 'header' ? 'header' : item.type === 'divider' ? 'divider' : 'default',
    route: item.route,
    href: item.href,
    disabled: item.disabled,
    children: item.children?.length ? toFlyoutOptions(item.children) : undefined,
  }))

const toFlyoutOptionsForComponent = (items: NavMenuItem[]) => toFlyoutOptions(items) as never[]

const topLevelMenus = computed(() => navigationMenus.value.filter((menu) => menu.type !== 'divider'))

const isRouteActive = (targetRoute?: string) => {
  if (!targetRoute) return false
  if (targetRoute === '/') return route.path === '/'
  return route.path === targetRoute || route.path.startsWith(`${targetRoute}/`)
}

const isMenuActive = (menu: NavMenuItem): boolean => {
  if (isRouteActive(menu.route)) return true
  if (!menu.children?.length) return false
  return menu.children.some((child) => isMenuActive(child))
}

const buttonBackground = (menu: NavMenuItem) => (isMenuActive(menu) ? 'var(--menu-active-bg)' : 'var(--menu-idle-bg)')
const buttonForeground = (menu: NavMenuItem) => (isMenuActive(menu) ? 'var(--menu-active-fg)' : 'var(--menu-text)')

const flyoutBackground = computed(() => (isDarkMode.value ? 'rgba(34, 40, 47, 0.98)' : 'rgba(255, 255, 255, 0.98)'))
const flyoutChoosenBackground = computed(() => (isDarkMode.value ? 'rgba(126, 195, 255, 0.18)' : 'rgba(0, 90, 158, 0.12)'))
const flyoutTitleForeground = computed(() => (isDarkMode.value ? 'rgba(206, 223, 240, 0.82)' : 'rgba(36, 50, 66, 0.62)'))
const toggleBorderColor = computed(() => (isDarkMode.value ? 'rgba(187, 206, 228, 0.45)' : 'rgba(71, 85, 105, 0.35)'))
const toggleRingBackground = computed(() => (isDarkMode.value ? '#101722' : '#ffffff'))
const toggleOnBackground = computed(() => (isDarkMode.value ? '#5ea9e8' : '#005a9e'))

const footerLeftLinks = ref<FooterLinkItem[]>([])
const footerPersonalLinks = ref<FooterLinkItem[]>([])

const addFooterLeftLink = (link: FooterLinkItem) => {
  footerLeftLinks.value.push(link)
}

const addFooterPersonalLink = (link: FooterLinkItem) => {
  footerPersonalLinks.value.push(link)
}

addFooterLeftLink({ key: 'footer-home', title: '首页', href: '/' })
addFooterLeftLink({ key: 'footer-article', title: '文章', href: '/article' })
addFooterLeftLink({ key: 'footer-about', title: '关于', href: '/about' })

addFooterPersonalLink({ key: 'footer-bilibili', title: 'Bilibili', href: 'https://space.bilibili.com/29955831' })
addFooterPersonalLink({ key: 'footer-github', title: 'GitHub', href: 'https://github.com/Pigeon-Ming' })
addFooterPersonalLink({ key: 'footer-email', title: 'Email', href: 'mailto:pigeon_ming@hotmail.com' })

const navigateTo = async (target: { route?: string; href?: string }) => {
  if (target.href) {
    window.open(target.href, '_blank', 'noopener,noreferrer')
    return
  }

  if (target.route && target.route !== route.path) {
    await router.push(target.route)
  }
}

const handleTopMenuClick = async (menu: NavMenuItem) => {
  await navigateTo(menu)
}

const handleFlyoutChoose = async (path: FlyoutOption[]) => {
  const target = path[path.length - 1]
  if (!target || target.type === 'header' || target.type === 'divider') return
  await navigateTo(target)
}
</script>

<template>
  <div class="app-shell" :class="themeClass">
    <header class="top-nav">
      <div class="nav-left">
        <div class="brand">
          <img class="brand-icon" :src="avatarUrl" alt="" />
          <h1 class="brand-title">Pigeon_Ming's Blog</h1>
        </div>
        <nav class="menu-list">
          <template v-for="menu in topLevelMenus" :key="menu.key">
            <FvMenuFlyout
              v-if="menu.children?.length"
              class="top-menu-item"
              :theme="currentTheme"
              :options="toFlyoutOptionsForComponent(menu.children)"
              :menu-width="240"
              :menu-max-height="420"
              :background="flyoutBackground"
              :choosen-background="flyoutChoosenBackground"
              :title-foreground="flyoutTitleForeground"
              root-trigger-mode="click"
              trigger-mode="enter"
              @choose-item-path="handleFlyoutChoose"
            >
              <template #input="{ switch: toggleFlyout }">
                <FvButton
                  class="menu-button"
                  :theme="currentTheme"
                  :is-box-shadow="false"
                  :border-radius="8"
                  :background="buttonBackground(menu)"
                  :foreground="buttonForeground(menu)"
                  @click="toggleFlyout"
                >
                  <span class="menu-content">
                    <img v-if="menu.iconImage" class="menu-image-icon" :src="menu.iconImage" alt="" />
                    <i v-else-if="menu.icon" class="ms-Icon menu-icon" :class="`ms-Icon--${menu.icon}`" />
                    <span class="menu-label">{{ menu.label }}</span>
                    <i class="ms-Icon ms-Icon--ChevronDown menu-chevron" />
                  </span>
                </FvButton>
              </template>
            </FvMenuFlyout>

            <FvButton
              v-else
              class="menu-button"
              :theme="currentTheme"
              :is-box-shadow="false"
              :border-radius="8"
              :background="buttonBackground(menu)"
              :foreground="buttonForeground(menu)"
              @click="handleTopMenuClick(menu)"
            >
              <span class="menu-content">
                <img v-if="menu.iconImage" class="menu-image-icon" :src="menu.iconImage" alt="" />
                <i v-else-if="menu.icon" class="ms-Icon menu-icon" :class="`ms-Icon--${menu.icon}`" />
                <span class="menu-label">{{ menu.label }}</span>
              </span>
            </FvButton>
          </template>
        </nav>
      </div>
      <div class="nav-right">
        <div class="theme-toggle" :title="isDarkMode ? '深色模式' : '浅色模式'">
          <FvToggleSwitch
            v-model="isDarkMode"
            class="theme-switch"
            :theme="currentTheme"
            on=""
            off=""
            :inside-content="true"
            :width="56"
            :height="28"
            :border-color="toggleBorderColor"
            :ring-background="toggleRingBackground"
            :switch-on-background="toggleOnBackground"
          />
          <i
            class="ms-Icon theme-toggle-icon"
            :class="[
              isDarkMode ? 'ms-Icon--QuietHours' : 'ms-Icon--Brightness',
              isDarkMode ? 'icon-left' : 'icon-right',
            ]"
          />
        </div>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
    <Footer
      :left-links="footerLeftLinks"
      :personal-links="footerPersonalLinks"
      copyright-text="© 2026 Pigeon_Ming. Built with Vue + VFluent3."
    />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--shell-background);
  color: var(--app-text);
}

.top-nav {
  position: sticky;
  top: 0;
  z-index: 30;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--nav-border);
  background: var(--nav-background);
  backdrop-filter: blur(12px);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  flex: 0 0 auto;
}

.brand-icon {
  width: 1.7rem;
  height: 1.7rem;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}

.brand-title {
  font-size: 1.02rem;
  font-weight: 650;
  letter-spacing: 0.02em;
  color: var(--brand-text);
  white-space: nowrap;
}

.menu-list {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-left: 0.15rem;
}

.top-menu-item {
  display: inline-flex;
  width: fit-content;
  height: auto;
  flex: 0 0 auto;
}

.menu-button {
  width: fit-content;
  min-width: 0;
  min-height: 36px;
  height: 36px;
  flex: 0 0 auto;
}

:deep(.top-menu-item.fv-MenuFlyout) {
  width: fit-content;
  height: auto;
}

:deep(.top-menu-item.fv-MenuFlyout > .menu-flyout-list-container) {
  left: 0 !important;
  right: auto !important;
  top: calc(100% + 6px) !important;
}

:deep(.menu-button.fv-Button) {
  width: fit-content;
  min-width: 0;
  height: 36px;
}

:deep(.menu-button.fv-Button .fv-button-main-container) {
  padding: 0;
}

:deep(.menu-button.fv-Button .fv-button-container) {
  padding: 0 0.72rem;
  box-sizing: border-box;
  background-origin: border-box !important;
  -webkit-background-clip: border-box !important;
  background-clip: border-box !important;
}

.menu-content {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.25rem;
}

.menu-icon {
  font-size: 0.88rem;
}

.menu-image-icon {
  width: 0.95rem;
  height: 0.95rem;
  display: block;
  flex: 0 0 auto;
  object-fit: contain;
}

.menu-label {
  font-size: 0.9rem;
  line-height: 1;
}

.menu-chevron {
  font-size: 0.68rem;
  opacity: 0.72;
  transform: translateY(1px);
}

.theme-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.theme-switch {
  position: relative;
}

.theme-toggle-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.84rem;
  color: var(--theme-icon);
  pointer-events: none;
  transition: color 0.2s ease;
}

.theme-toggle-icon.icon-left {
  left: 14px;
}

.theme-toggle-icon.icon-right {
  left: calc(100% - 14px);
}

.app-main {
  flex: 1;
  width: min(1320px, 100%);
  margin: 0 auto;
  padding: 1.5rem;
}

@media (max-width: 900px) {
  .top-nav {
    flex-direction: column;
    align-items: stretch;
  }

  .nav-left {
    width: 100%;
    flex-wrap: wrap;
  }

  .nav-right {
    align-self: flex-end;
  }

  .menu-list {
    width: 100%;
    justify-content: flex-start;
    margin-left: 0;
  }
}

.theme-light {
  --shell-background: #f8fafc;
  --nav-background: rgba(255, 255, 255, 0.78);
  --nav-border: rgba(15, 23, 42, 0.11);
  --brand-text: #0f172a;
  --brand-icon: #005a9e;
  --menu-text: #1f2937;
  --menu-idle-bg: rgba(255, 255, 255, 0.15);
  --menu-active-bg: rgba(0, 90, 158, 0.14);
  --menu-active-fg: #005a9e;
  --theme-label: #475569;
  --theme-icon: #334155;
  --app-text: #0f172a;
}

.theme-dark {
  --shell-background: #0b1220;
  --nav-background: rgba(13, 20, 33, 0.82);
  --nav-border: rgba(148, 163, 184, 0.22);
  --brand-text: #e5edf7;
  --brand-icon: #7dc3ff;
  --menu-text: #c9d8ea;
  --menu-idle-bg: rgba(255, 255, 255, 0.02);
  --menu-active-bg: rgba(125, 195, 255, 0.2);
  --menu-active-fg: #d8ebff;
  --theme-label: #9db1c8;
  --theme-icon: #d8ebff;
  --app-text: #d9e4f0;
}
</style>

<style>
:root[data-theme='light'] {
  color-scheme: light;
  --color-background: #f8fafc;
  --color-heading: #0f172a;
  --color-text: #1e293b;
  --color-border: rgba(15, 23, 42, 0.12);
}

:root[data-theme='dark'] {
  color-scheme: dark;
  --color-background: #0b1220;
  --color-heading: #e5edf7;
  --color-text: #d9e4f0;
  --color-border: rgba(148, 163, 184, 0.24);
}
</style>
