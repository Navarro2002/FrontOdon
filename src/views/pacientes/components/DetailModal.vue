<template>
    <el-dialog v-model="localVisible" :title="title" width="800px">
        <el-descriptions title="Detalle del paciente" border :column="2">
            <el-descriptions-item label="Nombre">
                {{ `${paciente?.nombre} ${paciente?.apellido}` || '' }}
            </el-descriptions-item>
            <el-descriptions-item label="edad">
                {{ paciente?.edad || '' }}
            </el-descriptions-item>
            <el-descriptions-item label="Fecha de nacimiento">
                {{ paciente?.fecha_nacimiento || '' }}
            </el-descriptions-item>
            <el-descriptions-item label="Teléfono">
                {{ paciente?.telefono || '' }}
            </el-descriptions-item>
            <el-descriptions-item label="Correo">
                {{ paciente?.email || '' }}
            </el-descriptions-item>
            <el-descriptions-item label="Estado">
                <el-tag :type="paciente?.activo ? 'success' : 'danger'">
                    {{ paciente?.activo ? 'Activo' : 'Inactivo' }}
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

interface Paciente {
    id: number;
    nombre: string;
    apellido: string;
    edad: number;
    fecha_nacimiento: Date;
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
    paciente: {
        type: Object as () => Paciente | null, // Permitir que sea null
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
