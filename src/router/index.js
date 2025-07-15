import { createRouter, createWebHistory } from 'vue-router';
import Index from '../components/Index.vue';
import Serie from '../components/Serie.vue';
import Leer from '../components/Leer.vue';

const routes = [
  { path: '/', component: Index },
  { path: '/serie/:id', component: Serie },
  { path: '/leer/:id/:cap?', component: Leer },
];

const router = createRouter({
  history: createWebHistory("/manga_reader_vue"),
  routes,
});

export default router;
