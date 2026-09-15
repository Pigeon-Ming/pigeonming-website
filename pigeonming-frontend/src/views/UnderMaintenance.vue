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
      <h1>该网页维护中……</h1>
      <p>暂时无法访问此页面</p>
      <FvButton icon="Back" style="height: 32px; width: 100px; margin-top: 8px;" @click="goToHome">
         返回主页 
      </FvButton>
   </div>
</div>
</template>

<style scoped lang="scss">

</style>
