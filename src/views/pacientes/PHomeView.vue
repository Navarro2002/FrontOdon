<template>
  <h1>Gestión de pacientes</h1>
  <div class="header-actions">
    <el-button type="primary" class="mb-3" @click="openDialog">Agregar Doctor</el-button>
  </div>
  <div style="margin: 40px;">

    <el-container style="margin-bottom: 25px;">
      <el-input v-model="search" placeholder="Buscar por nombre o apellido" style="width: 600px;"
        @input="buscarPaciente" />
      <el-button type="default" style="margin-left: 8px;" @click="limpiarBusqueda">
        Limpiar
        <el-icon style="margin-left: 8px;">
          <Brush />
        </el-icon>
      </el-button>
    </el-container>

    <DataTable :table-data="tableData" :columns="columns" :loading="loading" :total="total" :current-page="currentPage"
      :page-size="pageSize" @changePage="handlePageChange" @detallePaciente="detallePaciente"
      @confirmarCambioEstado="confirmarCambioEstado" @editarPaciente="openModalEdit" />

  </div>
  <Modal :visible="visible" :title="isEdit ? 'Editar Paciente' : 'Agregar Paciente'" :formRef="formRef"
    @update:visible="handleVisibilityChange" @confirm="guardarPaciente">
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item prop="nombre" label="Nombre">
        <el-input v-model="form.nombre" placeholder="Ingrese el nombre del paciente" />
      </el-form-item>
      <el-form-item prop="apellido" label="Apellido">
        <el-input v-model="form.apellido" placeholder="Ingrese el apellido del paciente" />
      </el-form-item>
      <el-form-item prop="telefono" label="Teléfono">
        <el-input v-model="form.telefono" v-mask="'####-####'" placeholder="Ingrese el teléfono del paciente" />
      </el-form-item>
      <el-form-item prop="email" label="Correo">
        <el-input v-model="form.email" placeholder="Ingrese el correo del paciente" />
      </el-form-item>
      <el-form-item prop="edad" label="Edad">
        <el-input v-model.number="form.edad" placeholder="Ingrese la edad del paciente" />
      </el-form-item>
      <el-form-item label="Fecha de Nacimiento" prop="fecha_nacimiento">
        <el-date-picker v-model="form.fecha_nacimiento" type="date" placeholder="Seleccione su fecha de nacimiento"
          format="DD/MM/YYYY" />
      </el-form-item>
    </el-form>
  </Modal>

  <ConfirmModal title="Confirmar" v-model:visible="isConfirmVisible" :message="confirmMessage" @confirm="cambioEstado"
    :data="selectedPaciente" />

  <DetailModal title="Información de paciente" v-model:visible="openModalDetail" :paciente="selectedPaciente" />

</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import DataTable from '../pacientes/components/DataTableView.vue';
import { getPacientes, createPaciente, getPacienteDetail, cambiarEstadoPaciente, updatePaciente  } from '../../api/pacientesApi';
import { ElForm, ElMessage } from 'element-plus';
import Modal from '../../components/Modal.vue';
import DetailModal from './components/DetailModal.vue';
import ConfirmModal from '../../components/ConfirmModal.vue';
import { Brush } from '@element-plus/icons-vue';

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  edad: number;
  fecha_nacimiento: Date;
  activo: boolean;
}

const search = ref('');
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const tableData = ref([]);
const pageSize = ref(10);
const visible = ref(false);
const isEdit = ref(false);
const formRef = ref<InstanceType<typeof ElForm>>();
const form = ref({ nombre: '', apellido: '', telefono: '', email: '', edad: '', fecha_nacimiento : ''});
const selectedPaciente = ref<Paciente | null>(null);
const openModalDetail = ref(false);
const isConfirmVisible = ref(false);
const confirmMessage = ref('');

const rules = {
  nombre: [{ required: true, message: 'El nombre es obligatorio', trigger: 'blur' }],
  apellido: [{ required: true, message: 'El apellido es obligatorio', trigger: 'blur' }],
  especialidad: [{ required: true, message: 'La especialidad es obligatoria', trigger: 'blur' }],
  telefono: [{ required: true, message: 'El teléfono es obligatorio', trigger: 'blur' }],
  email: [
    { required: true, message: 'El correo es obligatorio', trigger: 'blur' },
    { type: 'email', message: 'Correo inválido', trigger: ['blur', 'change'] },
  ],
  edad: [
    { required: true, message: 'La edad es obligatoria', trigger: 'blur' },
    { type: 'number', message: 'La edad debe ser un número', trigger: ['blur', 'change'] },
    { type: 'number', min: 0, message: 'La edad debe ser mayor o igual a 0', trigger: ['blur', 'change'] },
    { type: 'number', max: 120, message: 'La edad debe ser menor o igual a 120', trigger: ['blur', 'change'] },
  ],
  fecha_nacimiento: [
      { required: true, message: 'La fecha de nacimiento es obligatoria', trigger: 'blur' },
      { type: 'date', message: 'La fecha de nacimiento debe ser válida', trigger: ['blur', 'change'] },
      {
        validator: (rule, value, callback) => {
          if (!value) {
            return callback(new Error('La fecha de nacimiento es obligatoria'));
          }
          const today = new Date();
          const birthDate = new Date(value);
          if (birthDate > today) {
            return callback(new Error('La fecha de nacimiento no puede ser en el futuro'));
          }
          callback();
        },
        trigger: ['blur', 'change'],
      },
    ]
};


const columns = ref([
  { label: 'Nombres', prop: 'nombre' },
  { label: 'Apellidos', prop: 'apellido' },
  { label: 'Teléfono', prop: 'telefono' },
  { label: 'Correo', prop: 'email' },
  {
    label: 'Edad',
    prop: 'edad',
    custom: {
      render: (row: any) => `${row.edad} años` // Combina la edad con el texto "años"
    }
  },
  { label: 'Fecha nacimiento', prop: 'fecha_nacimiento' },
]);


const buscarPaciente = () => {
  currentPage.value = 1;
  cargarPacientes();
}
const limpiarBusqueda = () => {
  search.value = '';
  currentPage.value = 1;
  cargarPacientes();
};

const cargarPacientes = async () => {
  loading.value = true;
  try {
    const response = await getPacientes({
      params: {
        page: currentPage.value, search: search.value, // Agrega search como parámetro
      }
    });
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

const handleVisibilityChange = (value: boolean) => {
  visible.value = value;
};

const guardarPaciente = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  try {
    if (isEdit.value && selectedPaciente.value) {
       await updatePaciente(selectedPaciente.value.id, form.value);
      ElMessage.success('Paciente actualizado correctamente.');
    } else {
      await createPaciente(form.value);
      ElMessage.success('Paciente creado correctamente.');
    }
    cargarPacientes();
    visible.value = false;
    formRef.value?.resetFields();
  } catch (error) {
    ElMessage.error('Hubo un error al guardar el paciente.');
  }
};

const openDialog = () => {
  formRef.value?.resetFields();
  form.value = { nombre: '', apellido: '', edad: '', telefono: '', email: '', fecha_nacimiento: '' };
  isEdit.value = false;
  visible.value = true;
};

const detallePaciente = async (paciente: Paciente) => {
  try {
    selectedPaciente.value = null;
    openModalDetail.value = false;
    const response = await getPacienteDetail(paciente.id);
    selectedPaciente.value = response.data;
    openModalDetail.value = true;
  } catch (error) {
    ElMessage.error('No se pudo obtener el detalle del paciente.');    
  }
}

const confirmarCambioEstado = (paciente: Paciente) => {
  selectedPaciente.value = paciente;
  confirmMessage.value = `¿Estás seguro de ${paciente.activo ? 'desactivar' : 'activar'} al paciente ${paciente.nombre}?`;
  isConfirmVisible.value = true;
};

const cambioEstado = async () => {
  if (!selectedPaciente.value) return;
  try {
    const newState = !selectedPaciente.value.activo;
    await cambiarEstadoPaciente(selectedPaciente.value.id, newState);
    selectedPaciente.value.activo = newState;
    ElMessage.success(`Paciente ${newState ? 'activado' : 'desactivado'} correctamente.`);
    cargarPacientes();
  } catch (error) {
    ElMessage.error('Hubo un error al cambiar el estado.');
  } finally {
    isConfirmVisible.value = false;
  }
};

const openModalEdit = (paciente: Paciente) => {
  formRef.value?.resetFields(); // Reinicia el formulario y sus validaciones
  form.value = {
    nombre: paciente.nombre,
    apellido: paciente.apellido,
    telefono: paciente.telefono,
    email: paciente.email,
    edad: paciente.edad,
    fecha_nacimiento: paciente.fecha_nacimiento
  };

  selectedPaciente.value = paciente; 
  isEdit.value = true; 
  visible.value = true;
};

onMounted(cargarPacientes);
</script>

<style scoped>
.header-actions {
  margin-bottom: 1rem;
}
</style>

