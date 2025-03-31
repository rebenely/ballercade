import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
      path: '/menu',
      name: 'menu',
      component: () => import('../views/MenuView.vue'),
      meta: { requireBtConnected: true },
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue'),
      meta: { requireBtConnected: true },
    },
    {
      path: '/classic',
      name: 'classic',
      component: () => import('../views/ClassicView.vue'),
      meta: { requireBtConnected: true },
    },
  ],
});

router.beforeEach(async (to) => {
  const ballercade: BallercadeStore = useBallercade();
  if (to.meta.requireBtConnected && !ballercade.characteristic) {
    // redirect the user to pairing page
    return { name: 'home' };
  }
});

export default router;
