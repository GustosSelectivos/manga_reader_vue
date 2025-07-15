import { createRouter, createWebHistory } from 'vue-router';
import Index from '../components/Index.vue';
import Serie from '../components/Serie.vue';
import Leer from '../components/Leer.vue';

const routes = [
  { path: '/', component: Index },
  { path: '/serie/:id', component: Serie },
  { path: '/leer/:id/:cap?', component: Leer },
];

<<<<<<< Updated upstream
const router = createRouter({
  history: createWebHistory("/manga_reader_vue"),
  routes,
});

=======
import { createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory('/manga_reader_vue/'),
  routes,
});


>>>>>>> Stashed changes
export default router;
