export interface TicketData {
  // Encabezado
  companyName:     string;   // transaction.companyName  ("BLM QA")
  merchantAddress: string;   // transaction.address parte 1
  merchantCity:    string;   // transaction.address parte 2

  // Tipo de operación y estado visual
  operationType:  string;
  operationClass: 'success' | 'pending' | 'cancelled';

  // Campos del recibo
  merchantName:  string;   // transaction.merchantName  ("0232321 1736940219")
  autorizacion:  string;   // transaction.auth / cancellation.auth
  fechaHora:     string;
  lote:          string;
  folio:         string;   // transaction.folio / cancellation.folio
  aplicacion:    string;

  // Totales
  total:    number;
  currency: string;

  // Pie
  footerLine1: string;
  footerLine2: string;

  // PDS — solo para escenarios pds_exitoso / pds_no_exitoso
  hasPds?:         boolean;
  pdsServiceName?: string;    // nombre del servicio (sin campo en JSON → hardcodeado)
  pdsMonto?:       number;    // pds.amount
  pdsComision?:    number;    // pds.flatFee
  pdsTotal?:       number;    // pds.amount + pds.flatFee
  pdsCurrency?:    string;    // pds.currency
  pdsTicketText1?: string;    // pds.ticketText1
  pdsTicketText2?: string;    // pds.ticketText2
  tienda?:         string;    // transaction.companyName (pie del ticket PDS)
}
