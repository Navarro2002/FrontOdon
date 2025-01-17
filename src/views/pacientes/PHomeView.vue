<template>
  <h1>Gestión de pacientes</h1>

  <div style="margin: 40px;">
    <DataTable :table-data="tableData" :columns="columns" :loading="loading" :total="total" :current-page="currentPage"
      :page-size="pageSize" @changePage="handlePageChange" />
  </div>


</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import DataTable from '../pacientes/components/DataTableView.vue';
import { getPacientes } from '../../api/pacientesApi';

const search = ref('');
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const tableData = ref([]);
const pageSize = ref(10);

const columns = ref([
  { label: 'Nombres', prop: 'nombre' },
  { label: 'Apellidos', prop: 'apellido' },
  { label: 'Teléfono', prop: 'telefono' },
  { label: 'Correo', prop: 'email' },
  { label: 'edad', prop: 'edad' },
  { label: 'Fecha nacimiento', prop: 'fecha_nacimiento' },
  {
    label: 'Estado',
    prop: 'activo',
    custom: {
      render: (row: any) => (row.activo ? 'Activo' : 'Inactivo'),
    },
  },
]);

const cargarPacientes = async () => {
  loading.value = true;
  try {
    console.log('Página solicitada:', currentPage.value); // Página solicitada
    const response = await getPacientes({
      params: {
        page: currentPage.value, search: search.value, // Agrega search como parámetro
      }
    });
    console.log('Datos recibidos:', response.data); // Respuesta de la API
    tableData.value = response.data.data;
    total.value = response.data.total;
    currentPage.value = response.data.current_page;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page; // Actualiza la página actual
  cargarPacientes(); // Recarga los datos para la página seleccionada
};

onMounted(cargarPacientes);
</script>

<style scoped>
.header-actions {
  margin-bottom: 1rem;
}
</style>

