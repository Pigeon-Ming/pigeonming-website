<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

// 点击跳转
const goToHome = () => {
  router.push('/') // 这里写路由地址
}
</script>

<template>
<div>
   <div>
      <h1>访问的网页不存在</h1>
      <FvButton icon="Back" style="height: 32px; width: 100px; margin-top: 8px;" @click="goToHome">
         返回主页 
      </FvButton>
   </div>
</div>
</template>

<style scoped lang="scss">

</style>
