<template>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <!-- Generación dinámica de columnas -->
        <el-table-column v-for="(column, index) in columns" :key="index" :label="column.label" :prop="column.prop">
            <!-- Personalización del contenido -->
            <template v-if="column.custom" #default="{ row }">
                <span v-html="column.custom.render ? column.custom.render(row) : ''"></span>
            </template>
        </el-table-column>

        <!-- Columna de Acciones -->
        <el-table-column label="Acciones" width="200">

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
    // emit('changePage', page);
};


</script>

<style scoped>
/* Personalización de estilos */
</style>
