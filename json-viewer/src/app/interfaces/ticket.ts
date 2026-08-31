export interface TicketData {
  // Encabezado
  merchantName:    string;
  merchantAddress: string;
  merchantCity:    string;

  // Tipo de operación y clase visual
  operationType:  string;
  operationClass: 'cancellation' | 'sale' | 'recharge' | 'payment';

  // Campos del recibo
  comercio:   string;
  transaccion: string;
  fechaHora:  string;
  lote:       string;
  rrn:        string;
  aplicacion: string;

  // Totales
  total:    number;
  currency: string;

  // Pie
  footerLine1: string;
  footerLine2: string;
}
