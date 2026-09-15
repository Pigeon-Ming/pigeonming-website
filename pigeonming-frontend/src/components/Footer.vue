<script setup lang="ts">
export interface FooterLinkItem {
  key: string
  title: string
  href: string
}

const props = withDefaults(
  defineProps<{
    leftLinks?: FooterLinkItem[]
    personalLinks?: FooterLinkItem[]
    copyrightText?: string
  }>(),
  {
    leftLinks: () => [],
    personalLinks: () => [],
    copyrightText: '© 2026 Pigeon_Ming. All rights reserved.',
  },
)

const openLink = (link: FooterLinkItem) => {
  if (!link.href) return

  if (/^https?:\/\//.test(link.href)) {
    window.open(link.href, '_blank', 'noopener,noreferrer')
    return
  }

  if (link.href.startsWith('mailto:')) {
    window.location.href = link.href
    return
  }

  window.location.href = link.href
}
</script>

<template>
  <footer class="global-footer">
    <div class="footer-inner">
      <div class="footer-left">
        <slot name="left-links" :links="props.leftLinks">
          <button
            v-for="item in props.leftLinks"
            :key="item.key"
            type="button"
            class="footer-link"
            @click="openLink(item)"
          >
            {{ item.title }}
          </button>
        </slot>
      </div>

      <div class="footer-right">
        <slot name="personal-links" :links="props.personalLinks">
          <button
            v-for="item in props.personalLinks"
            :key="item.key"
            type="button"
            class="footer-link personal"
            @click="openLink(item)"
          >
            {{ item.title }}
          </button>
        </slot>
      </div>
    </div>
    <p class="footer-copyright">{{ props.copyrightText }}</p>
  </footer>
</template>

<style scoped>
.global-footer {
  margin-top: 1.25rem;
  border-top: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 90%, #ffffff 10%);
}

.footer-inner {
  width: min(1320px, 100%);
  margin: 0 auto;
  padding: 0.9rem 1.5rem 0.55rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.9rem;
}

.footer-left,
.footer-right {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.footer-link {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--color-text);
  opacity: 0.88;
  font-size: 0.84rem;
  cursor: pointer;
}

.footer-link:hover {
  opacity: 1;
}

.footer-link.personal {
  color: var(--color-heading);
}

.footer-copyright {
  width: min(1320px, 100%);
  margin: 0 auto;
  padding: 0 1.5rem 1rem;
  font-size: 0.76rem;
  color: var(--color-text);
  opacity: 0.6;
}

@media (max-width: 900px) {
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
