import apiClient from './api.ts'; // Ruta relativa al archivo de configuración de Axios

export const getPacientes = (params: Record<string, any>) => 
  apiClient.get('/pacientes', params );