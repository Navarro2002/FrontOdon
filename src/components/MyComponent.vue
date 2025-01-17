<!-- src/components/MyComponent.vue -->
<template>
  <div>
    <h1>Datos desde la API</h1>
    <ul>
      <!-- <li v-for="item in items" :key="item.id">{{ item.name }}</li> -->
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import apiClient from '../api/api';

const items = ref([]);

const fetchData = async () => {
  try {
    const response = await apiClient.get('/doctores');
    items.value = response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>
