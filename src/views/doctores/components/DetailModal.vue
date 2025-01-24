<template>
  <el-dialog v-model="localVisible" :title="title" width="800px">
    <el-descriptions title="Detalle del Doctor" border :column="2">
      <el-descriptions-item label="Nombre">
        {{ `${doctor?.nombre} ${doctor?.apellido}` || '' }}
      </el-descriptions-item>
      <el-descriptions-item label="Especialidad">
        {{ doctor?.especialidad || '' }}
      </el-descriptions-item>
      <el-descriptions-item label="Teléfono">
        {{ doctor?.telefono || '' }}
      </el-descriptions-item>
      <el-descriptions-item label="Correo">
        {{ doctor?.email || '' }}
      </el-descriptions-item>
      <el-descriptions-item label="Estado">
        <el-tag :type="doctor?.activo ? 'success' : 'danger'">
          {{ doctor?.activo ? 'Activo' : 'Inactivo' }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="closeDialog">Cerrar</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  email: string
  activo: boolean;
}

const props = defineProps({
  title: {
    type: String,
    default: 'Detalle',
  },
  visible: {
    type: Boolean,
    default: false,
  },
doctor: {
    type: Object as () => Doctor | null, // Permitir que sea null
    default: null,
  },
});

const emit = defineEmits(['update:visible']);

const localVisible = ref(props.visible);

watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal;
  },
);

const closeDialog = () => {
  localVisible.value = false;
  emit('update:visible', false);
};
</script>
