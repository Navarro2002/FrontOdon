<template>
  <el-dialog
    v-model="localVisible" 
    :title="title"
    @close="handleClose"
    :close-on-click-modal="false"
    :close-on-confirm="false"
  >
    <!-- Contenido personalizado del cuerpo -->
    <slot name="default">
      <span>{{ message }}</span>
    </slot>

    <!-- Footer personalizado -->
    <template #footer>
      <div class="dialog-footer center">
        <el-button aria-label="Cancelar" @click="closeDialog">Cerrar</el-button>
        <el-button aria-label="Aceptar" type="primary" @click="confirmDialog">
          Aceptar
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import type { ElForm } from 'element-plus';

// Props
const props = defineProps({
  title: {
    default: 'Aviso',
  },
  message: {
    type: String,
    default: '¿Estás seguro de continuar?',
  },
  visible: {
    type: Boolean,
    default: false,
  },
  formRef: {
    type: Object as () => InstanceType<typeof ElForm> | null,
    required: false,
  },
})

// Emits
const emit = defineEmits(['update:visible', 'confirm'])

// Estado local para manejar la visibilidad del modal
const localVisible = ref(props.visible)

// Sincronizar estado local con el prop `visible`
watch(
  () => props.visible,
  (newVal) => {
    localVisible.value = newVal
  },
  { immediate: true }
)

// Cerrar el modal
const closeDialog = () => {
  localVisible.value = false
  emit('update:visible', false)
}

const confirmDialog = () => {
  if (props.formRef) {
    props.formRef.validate((valid: boolean) => {
      if (valid) {
        console.log('Formulario válido');
        emit('confirm') // Emitir evento de confirmación
        closeDialog() // Cierra el modal solo si es válido
      }
    })
  } else {
    emit('confirm') // Emitir confirmación directa si no hay formulario
    closeDialog()
  }
}

// Manejar cierre del modal
const handleClose = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
