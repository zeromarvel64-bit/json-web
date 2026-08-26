/**
 * Estructura del JSON del ticket que enviará el equipo.
 * Basada en los datos de ejemplo del ticket actual (terminal IM30).
 * Ajustar nombres/campos cuando se confirme el contrato real de la API.
 */
export interface TicketMerchant {
  name: string;        // "CR AUTOVEND IM30 1"
  address: string;     // "Reforma 222"
  zipCode?: string;    // "13020"
  city?: string;       // "CIUDAD DE MEXICO"
  country?: string;    // "Mexico"
}

export interface TicketPayload {
  merchant: TicketMerchant;
  commerceId: string;        // "1014327/1736946315"
  transactionId: string;     // "186546"
  dateTime: string;          // "25-08-2026 17:46:06"
  batch?: string;            // Lote (puede venir vacío)
  rrn: string;               // "699901310070"
  appCode?: string;          // "0024"
  entryMode?: string;        // "ICC" (chip), "MSR" (banda), "CTLS" (contactless)
  operationType: string;     // "CANCELACION VENTA", "VENTA", etc.
  total: number;             // -62.00
  currency: string;          // "MXN"
  signature?: string;        // "Signature not found" | firma en base64
}
