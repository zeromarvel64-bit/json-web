export interface JsonPayload {
  type: string;        // Tipo de mensaje: 'payment', 'error', 'notification', etc.
  status: string;      // Estado: 'success', 'error', 'pending', 'warning'
  id?: string;
  message?: string;
  data?: Record<string, any>;  // Datos adicionales según el tipo
  timestamp?: string;
}
