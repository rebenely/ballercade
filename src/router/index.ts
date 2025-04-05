import HomeView from '../views/HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { doesNotRequireBt: true },
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../views/MenuView.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue'),
    },
    {
      path: '/classic',
      name: 'classic',
      component: () => import('../views/ClassicView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
  ],
});

router.beforeEach(async (to) => {
  const ballercade: BallercadeStore = useBallercade();
  if (!to.meta.doesNotRequireBt && !ballercade.characteristic) {
    // redirect the user to pairing page
    return { name: 'home' };
  }
});

export default router;
