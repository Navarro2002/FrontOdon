// src/api/doctoresApi.ts
import apiClient from './api.ts'; // Ruta relativa al archivo de configuración de Axios

export const getDoctores = (params: Record<string, any>) => 
  apiClient.get('/doctores', params );

export const createDoctor = (data: Record<string, any>) => 
  apiClient.post('/doctores/crear', data);

export const updateDoctor = (id: number, data: Record<string, any>) => 
  apiClient.put(`/doctores/editar/${id}`, data);

export const changeDoctorState = (id: number, state: boolean) => 
  apiClient.put(`/doctores/cambio-estado/${id}`, { activo: state });

export const getDoctorDetail = (id: number) => 
  apiClient.get(`/doctores/detalle/${id}`);
