import apiClient from './api.ts'; // Ruta relativa al archivo de configuración de Axios

export const getPacientes = (params: Record<string, any>) => 
  apiClient.get('/pacientes', params);

export const createPaciente = (data: Record<string, any>) => 
  apiClient.post('/pacientes/crear', data);

export const getPacienteDetail = (id: number) => 
  apiClient.get(`/pacientes/detalle/${id}`);

export const cambiarEstadoPaciente = (id: number, state: boolean) => 
  apiClient.put(`/pacientes/cambio-estado/${id}`, { activo: state });

export const updatePaciente = (id: number, data: Record<string, any>) => 
  apiClient.put(`/pacientes/editar/${id}`, data);