<template>
  <el-menu ellipsis class="el-menu-popper-demo" mode="horizontal" :popper-offset="16" style="max-width: 800px">
    <el-menu-item index="1" @click="$router.push({ name: 'Home' })">Home</el-menu-item>
    <el-menu-item index="2" @click="$router.push({ name: 'About' })">About</el-menu-item>
    <el-sub-menu index="3">
      <template #title>Doctores</template>
      <el-menu-item index="3-1" @click="$router.push({ name: 'Doctores' })">Home Doctores</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>Pacientes</template>
      <el-menu-item index="4-1" @click="$router.push({ name: 'Pacientes' })">Home Pacientes</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>Citas</template>
      <el-menu-item index="5-1" @click="$router.push({ name: 'Citas' })">Gestión de citas</el-menu-item>
    </el-sub-menu>
    <el-menu-item>
      <el-switch v-model="darkMode" active-text="Oscuro" inactive-text="Claro" />
    </el-menu-item>
  </el-menu>

  <router-view />
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue';
import { isDarkMode } from './composables/darkMode';

export default defineComponent({
  name: 'App',
  setup() {
    const darkMode = ref(isDarkMode.value); // Vinculamos a una ref reactiva local

    // Sincronizamos el modo oscuro con el localStorage al montar el componente
    onMounted(() => {
      if (localStorage.getItem('darkMode') === 'true') {
        darkMode.value = true;
        document.documentElement.classList.add('dark');
      } else {
        darkMode.value = false;
        document.documentElement.classList.remove('dark');
      }
    });

    // Observamos los cambios en darkMode y actualizamos localStorage y el modo en la página
    watch(darkMode, (newValue) => {
      localStorage.setItem('darkMode', newValue ? 'true' : 'false');
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    return {
      darkMode // Esto se vincula a la propiedad v-model del switch
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.el-menu-popper-demo {
  margin-bottom: 10px;
}
</style>
