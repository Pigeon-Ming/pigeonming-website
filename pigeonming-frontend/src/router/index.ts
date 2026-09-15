import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PlanetMusicPlayer from '../views/PlanetMusicPlayer/index.vue'
import CorePlanetMusicPlayer from '../views/CorePlanetMusicPlayer/index.vue'
import UniversalSend from '../views/UniversalSend/index.vue'
import JigsawOS from '@/views/JigsawOS/index.vue'
import ArticleIndex from '@/views/Article/index.vue'
import ArticleDetail from '@/views/Article/Article.vue'
import UnderMaintenance from '@/views/UnderMaintenance.vue'

import PlanetMusicPlayerIcon from '../assets/PMP.svg'
import CorePlanetMusicPlayerIcon from '../assets/CorePMP.svg'
import UniversalSendIcon from '../assets/UniversalSend.svg'

import defaultIcon from '../assets/icon.ico'

import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/PlanetMusicPlayer',
      name: 'planetmusicplayer',
      component: PlanetMusicPlayer,
      meta: {
        title: 'PlanetMusicPlayer - UWP平台的音乐播放器',
        icon: PlanetMusicPlayerIcon
      },
    },
    {
      path: '/CorePlanetMusicPlayer',
      name: 'coreplanetmusicplayer',
      component: CorePlanetMusicPlayer,
      meta: {
        title: 'CorePlanetMusicPlayer - UWP平台的音乐播放器核心',
        icon: CorePlanetMusicPlayerIcon
      },
    },
    {
      path: '/UniversalSend',
      name: 'universalsend',
      component: UniversalSend,
      meta: {
        title: 'UniversalSend - UWP平台的第三方LocalSend客户端',
        icon: UniversalSendIcon
      },
    },
    {
      path: '/JigsawOS',
      name: 'jigsawos',
      component: JigsawOS,
      meta: {
        title: 'JigsawOS - 基于Haribote OS开发的操作系统'
      },
    },
    {
      path: '/JigsawOS/developer',
      name: 'jigsawos-developer',
      component: UnderMaintenance,
    },
    {
      path: '/article',
      name: 'article',
      component: ArticleIndex,
      meta: {
        title: "文章列表 - Pigeon_Ming's Blog"
      },
    },
    {
      path: '/article/:slug',
      name: 'article-detail',
      component: ArticleDetail,
      meta: {
        title: "文章 - Pigeon_Ming's Blog"
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
    },
  ],
})

router.afterEach((to) => {
  const title = to.meta.title

  document.title =
    typeof title === 'string'
      ? `${title}`
    : "Pigeon_Ming's Blog"
  
  const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')

  if (favicon) {
    favicon.href = typeof to.meta.icon === 'string' ? to.meta.icon : defaultIcon
  }
})

export default router
