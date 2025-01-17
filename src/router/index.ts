import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import HomeDoctores from '../views/doctores/DHomeView.vue';
import HomePacientes from '../views/pacientes/PHomeView.vue';

// Define tus rutas
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
    {
    path: '/doctores',
    name: 'Doctores',
    component: HomeDoctores,
    },
    {
    path: '/pacientes',
    name: 'Pacientes',
    component: HomePacientes,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
