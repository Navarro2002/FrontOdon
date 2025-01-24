<template>
  <div style="margin: 40px;">
    <h1>Gestión de Doctores</h1>
    <div class="header-actions">
      <el-button type="primary" class="mb-3" @click="openDialog">Agregar Doctor</el-button>
    </div>
    
    <el-container style="margin-bottom: 25px;">
      <el-input v-model="search" placeholder="Buscar por nombre o apellido" style="width: 600px;"
        @input="buscarDoctor" />
      <el-button type="default" style="margin-left: 8px;" @click="limpiarBusqueda">
        Limpiar
        <el-icon style="margin-left: 8px;">
          <Brush />
        </el-icon>
      </el-button>
    </el-container>


    <Modal :visible="visible" :title="isEdit ? 'Editar Doctor' : 'Agregar Doctor'" :formRef="formRef"
      @update:visible="handleVisibilityChange" @confirm="handleConfirm">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="nombre" label="Nombre">
          <el-input v-model="form.nombre" placeholder="Ingrese el nombre del doctor" />
        </el-form-item>
        <el-form-item prop="apellido" label="Apellido">
          <el-input v-model="form.apellido" placeholder="Ingrese el apellido del doctor" />
        </el-form-item>
        <el-form-item prop="especialidad" label="Especialidad">
          <el-input v-model="form.especialidad" placeholder="Ingrese la especialidad del doctor" />
        </el-form-item>
        <el-form-item prop="telefono" label="Teléfono">
          <el-input v-model="form.telefono" v-mask="'####-####'" placeholder="Ingrese el teléfono del doctor" />
        </el-form-item>
        <el-form-item prop="email" label="Correo">
          <el-input v-model="form.email" placeholder="Ingrese el correo del doctor" />
        </el-form-item>
      </el-form>
    </Modal>

    <el-alert v-if="error" type="error" title="Error al cargar la lista de doctores"
      description="No se pudo cargar los datos" show-icon />

    <DataTable :table-data="tableData" :columns="columns" :loading="loading" :total="total" :current-page="currentPage"
      :page-size="pageSize" @changePage="handlePageChange" @cambiarEstado="cambiarEstado" @editarDoctor="openModalEdit"
      @detalleDoctor="detalleDoctor" />

    <ConfirmModal title="Confirmar" v-model:visible="isConfirmVisible" :message="confirmMessage"
      @confirm="handleStateChange" :data="selectedDoctor" />

    <DetailModal title="Información de Doctor" v-model:visible="openModalDetail" :doctor="selectedDoctor" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import Modal from '../../components/Modal.vue';
import DataTable from './components/DataTable.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';
import DetailModal from './components/DetailModal.vue';
import { getDoctores, getDoctorDetail, createDoctor, updateDoctor, changeDoctorState } from '../../api/doctoresApi';
import { Brush } from '@element-plus/icons-vue';

interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  email: string;
  activo: boolean;
}

const search = ref('');
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const visible = ref(false);
const isEdit = ref(false);
const formRef = ref<InstanceType<typeof ElForm>>();
const form = ref({ nombre: '', apellido: '', especialidad: '', telefono: '', email: '' });
const error = ref<string | null>(null);
const tableData = ref([]);
const isConfirmVisible = ref(false);
const confirmMessage = ref('');
const selectedDoctor = ref<Doctor | null>(null);
const openModalDetail = ref(false);

const rules = {
  nombre: [{ required: true, message: 'El nombre es obligatorio', trigger: 'blur' }],
  apellido: [{ required: true, message: 'El apellido es obligatorio', trigger: 'blur' }],
  especialidad: [{ required: true, message: 'La especialidad es obligatoria', trigger: 'blur' }],
  telefono: [{ required: true, message: 'El teléfono es obligatorio', trigger: 'blur' }],
  email: [
    { required: true, message: 'El correo es obligatorio', trigger: 'blur' },
    { type: 'email', message: 'Correo inválido', trigger: ['blur', 'change'] },
  ],
};

const columns = ref([
  { label: 'Nombres', prop: 'nombre' },
  { label: 'Apellidos', prop: 'apellido' },
  { label: 'Especialidad', prop: 'especialidad' },
  { label: 'Teléfono', prop: 'telefono' },
  { label: 'Correo', prop: 'email' },
]);

const buscarDoctor = () => {
  currentPage.value = 1;
  cargarDoctores();
}
const limpiarBusqueda = () => {
  search.value = ''; 
  currentPage.value = 1; 
  cargarDoctores();
};


const cargarDoctores = async () => {
  loading.value = true;
  try {
    const response = await getDoctores({ params: { page: currentPage.value, search: search.value, // Agrega search como parámetro
 } });
    tableData.value = response.data.data;
    total.value = response.data.total;
    currentPage.value = response.data.current_page;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  } finally {
    loading.value = false;
  }
};



const detalleDoctor = async (doctor: Doctor) => {
  try {
    selectedDoctor.value = null;
    openModalDetail.value = false;
    const response = await getDoctorDetail(doctor.id);
    selectedDoctor.value = response.data;
    openModalDetail.value = true;
  } catch (error) {
    ElMessage.error('No se pudo obtener el detalle del doctor.');
  }
};

const handlePageChange = (page: number) => {
  currentPage.value = page; // Actualiza la página actual
  cargarDoctores(); // Recarga los datos para la página seleccionada
};

const cambiarEstado = (doctor: Doctor) => {
  selectedDoctor.value = doctor;
  confirmMessage.value = `¿Estás seguro de ${doctor.activo ? 'desactivar' : 'activar'} al doctor ${doctor.nombre}?`;
  isConfirmVisible.value = true;
};

const handleStateChange = async () => {
  if (!selectedDoctor.value) return;
  try {
    const newState = !selectedDoctor.value.activo;
    await changeDoctorState(selectedDoctor.value.id, newState);
    selectedDoctor.value.activo = newState;
    ElMessage.success(`Doctor ${newState ? 'activado' : 'desactivado'} correctamente.`);
    cargarDoctores();
  } catch (error) {
    ElMessage.error('Hubo un error al cambiar el estado.');
  } finally {
    isConfirmVisible.value = false;
  }
};

const openModalEdit = (doctor: Doctor) => {
  formRef.value?.resetFields(); // Reinicia el formulario y sus validaciones
  form.value = {
    nombre: doctor.nombre,
    apellido: doctor.apellido,
    especialidad: doctor.especialidad,
    telefono: doctor.telefono,
    email: doctor.email,
  }; // Llena los datos del doctor a editar
  selectedDoctor.value = doctor; // Guarda el doctor seleccionado
  isEdit.value = true; // Establece que el modal está en modo "Editar"
  visible.value = true; // Abre el modal
};

const handleConfirm = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  try {
    if (isEdit.value && selectedDoctor.value) {
      await updateDoctor(selectedDoctor.value.id, form.value);
      ElMessage.success('Doctor actualizado correctamente.');
    } else {
      await createDoctor(form.value);
      ElMessage.success('Doctor creado correctamente.');
    }
    cargarDoctores();
    visible.value = false;
    formRef.value?.resetFields();
  } catch (error) {
    ElMessage.error('Hubo un error al guardar el doctor.');
  }
};

const openDialog = () => {
  formRef.value?.resetFields();
  form.value = { nombre: '', apellido: '', especialidad: '', telefono: '', email: '' };
  isEdit.value = false;
  visible.value = true;
};

const handleVisibilityChange = (value: boolean) => {
  visible.value = value;
};

onMounted(cargarDoctores);
</script>

<style scoped>
.header-actions {
  margin-bottom: 1rem;
}
</style>
