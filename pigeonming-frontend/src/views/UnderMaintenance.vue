<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
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

const goToHome = () => {
  router.push('/')
}
</script>

<template>
<div>
   <div>
      <h1>该网页维护中……</h1>
      <p>暂时无法访问此页面</p>
      <FvButton
         icon="Back"
         :theme="buttonTheme"
         :background="buttonBackground"
         :foreground="buttonForeground"
         :border-color="buttonBorderColor"
         :is-box-shadow="false"
         :border-radius="8"
         style="height: 32px; width: 100px; margin-top: 8px;"
         @click="goToHome"
      >
         返回主页 
      </FvButton>
   </div>
</div>
</template>

<style scoped lang="scss">

</style>
