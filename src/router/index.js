import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // ✅ OK
  routes: [
    // tus rutas
  ]
});

export default router;
