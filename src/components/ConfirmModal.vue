<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="30%"
    @close="cancel"
  >
    <span>{{ message }}</span>
    <template #footer>
      <el-button @click="cancel">Cancelar</el-button>
      <el-button type="primary" @click="confirm">Confirmar</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, withDefaults } from 'vue';

// Define las propiedades con tipado
withDefaults(
  defineProps<{
    visible: boolean;
    message?: string;
    title: string,// Opcional para permitir un valor por defecto
  }>(),
  {
    message: '¿Estás seguro de realizar esta acción?', // Valor predeterminado
  }
);

// Eventos emitidos por el componente
const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'confirm'): void;
  (event: 'cancel'): void;
}>();

// Métodos para manejar la lógica del modal
const confirm = () => {
  emit('confirm');
  emit('update:visible', false);
};

const cancel = () => {
  emit('cancel');
  emit('update:visible', false);
};
</script>

<style scoped>
/* Estilos opcionales */
</style>
