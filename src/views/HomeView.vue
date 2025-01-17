<!-- src/components/MyComponent.vue -->
<template>
  <div>
    <h1>Datos desde la API</h1>
    <ul>
      <!-- <li v-for="item in items" :key="item.id">{{ item.nombre }} {{ item.apellido }}</li> -->

    </ul>
  </div>
</template>

<script lang="ts" setup>
// import { ref, onMounted } from 'vue';
// import apiClient from '../api';

// interface Doctor {
//   id: number;
//   nombre: string;
//   apellido: string;
// }

// const items = ref<Doctor[]>([]); 

// const listadoDoctores = async () => {
//   try {
//     const response = await apiClient.get('/doctores');
//     items.value = response.data.data;
    
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };

// onMounted(() => {
//   listadoDoctores();
// });
</script>
