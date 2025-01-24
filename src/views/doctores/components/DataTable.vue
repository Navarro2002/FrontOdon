<template>
  <el-table :data="tableData" border style="width: 100%" v-loading="loading">
    <!-- Generación dinámica de columnas -->
    <el-table-column v-for="(column, index) in columns" :key="index" :label="column.label" :prop="column.prop">

      <!-- Personalización del contenido -->
      <template v-if="column.custom" #default="{ row }">
        <span v-html="column.custom.render ? column.custom.render(row) : ''"></span>
      </template>
    </el-table-column>

    <!-- Columna personalizada para Estado -->
    <el-table-column label="Estado">
      <template #default="{ row }">
        <el-tag :type="row.activo ? 'success' : 'danger'">
          {{ row.activo ? 'Activo' : 'Inactivo' }}
        </el-tag>
      </template>
    </el-table-column>
    
    <!-- Columna de Acciones -->
    <el-table-column label="Acciones" width="200">
      <template #default="{ row }">
        <!-- Botón para Detalles -->
        <el-button size="small" @click="detalleDoctor(row)">
          <el-icon size="20px">
            <View />
          </el-icon>
        </el-button>

        <!-- Botón para Editar -->
        <el-button size="small" @click="editarDoctor(row)">
          <el-icon size="20px">
            <Edit />
          </el-icon>
        </el-button>

        <!-- Botón para Cambiar Estado -->
        <el-button size="small" @click="cambiarEstado(row)">
          <el-icon :size="20" :color="row.activo ? '#c82121' : '#21c830'">
            <template v-if="row.activo">
              <RemoveFilled />
            </template>
            <template v-else>
              <SuccessFilled />
            </template>
          </el-icon>
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- Paginación -->
  <div style="display: flex; justify-content: center; margin-top: 20px;">
    <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
      :page-size="pageSize" @current-change="handlePageChange" />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { RemoveFilled, SuccessFilled, Edit, View } from '@element-plus/icons-vue';

// Eventos emitidos por el componente
const emit = defineEmits(['changePage', 'cambiarEstado', 'editarDoctor', 'detalleDoctor']);

// Propiedades esperadas del componente
defineProps({
  tableData: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
});

// Manejar cambio de página
const handlePageChange = (page: number) => {
  emit('changePage', page);
};

// Ver detalles del doctor
const detalleDoctor = (row: any) => {
  if (!row || !row.id) {
    console.error('Error: No se puede ver detalles porque el ID no está definido:', row);
    return;
  }
  emit('detalleDoctor', row);
};

// Editar doctor
const editarDoctor = (row: any) => {
  if (!row || !row.id) {
    console.error('Error: No se puede editar porque el ID no está definido:', row);
    return;
  }
  emit('editarDoctor', row);
};

// Cambiar estado del doctor
const cambiarEstado = (row: any) => {
  if (!row || !row.id) {
    console.error('Error: No se puede cambiar el estado porque el ID no está definido:', row);
    return;
  }
  emit('cambiarEstado', row);
};
</script>

<style scoped>
/* Personalización de estilos */
</style>
