// ── Respuesta raíz de QPay ────────────────────────────────────────────────────
export interface QpayResponse {
  qpay_response: string;      // "true" | "false"
  qpay_code: string;          // "000" = aprobada
  qpay_description: string;
  qpay_object: QpayObject[];
}

// ── Objeto dentro de qpay_object (todas las secciones son opcionales) ─────────
export interface QpayObject {
  transaction?:  Transaction;
  cancellation?: Cancellation;
  tae?:          Tae;
  pds?:          Pds;
}

// ── Venta ─────────────────────────────────────────────────────────────────────
export interface Transaction {
  reference:            string;
  amount:               number;
  folio:                string;
  auth:                 string;
  approved:             boolean;
  cancel:               boolean;
  reversal:             boolean;
  arqc:                 string;
  appId:                string;
  appidLabel:           string;
  companyName:          string;
  address:              string;
  ccType:               string;
  ccName:               string;
  ccNumber:             string;
  ccBin:                string;
  ccExpMonth:           string;
  ccExpYear:            string;
  date:                 string;
  time:                 string;
  merchantName:         string;
  operationType:        string;
  responseCode:         string;
  iccCsn:               string;
  iccAtc:               string;
  iccArpc:              string;
  iccIssuerScript:      string;
  businessId:           number;
  customBusinessId:     number;
  pinOfflineValidation: boolean;
  user:                 string;
  paymentType:          string;
  st_qps:               string;
  cdResponse:           string;
  commision:            number;
  dispersionAmount:     number;
  cdcvm:                number;
  surTax:               number;
  surTaxAmount:         number;
}

// ── Cancelación ───────────────────────────────────────────────────────────────
export interface Cancellation {
  reference:            string;
  amount:               number;
  folio:                string;
  auth:                 string;
  approved:             boolean;
  cancel:               boolean;
  reversal:             boolean;
  arqc:                 string;
  appId:                string;
  appidLabel:           string;
  companyName:          string;
  address:              string;
  ccType:               string;
  ccName:               string;
  ccNumber:             string;
  ccExpMonth:           string;
  ccExpYear:            string;
  date:                 string;
  time:                 string;
  merchantName:         string;
  operationType:        string;
  responseCode:         string;
  clientVoucher:        string;
  businessVoucher:      string;
  businessId:           number;
  customBusinessId:     number;
  pinOfflineValidation: boolean;
  st_qps:               string;
  cdResponse:           string;
  cdcvm:                number;
  surTax:               number;
  surTaxAmount:         number;
}

// ── TAE — Recarga telefónica (sin los campos comentados del análisis) ──────────
export interface Tae {
  dateTime:         string;
  country:          string;
  amount:           string;
  product:          string;
  vendorReference:  string;
  mobileNumber:     string;
  trxId:            string;
  platformFee:      number | null;
  transactionId:    string;
  reference:        string;
  transactionLabel: string;
  requestId:        number;
  currency:         string;
  flatFee:          string;
}

// ── PDS — Pago de servicios (sin los campos comentados del análisis) ───────────
export interface Pds {
  dateTime:      string;
  country:       string;
  amount:        number;
  vendorReference: string;
  fee:           number;
  accountNumber: string;
  trxId:         number;
  platformFee:   number;
  transactionId: number;
  ticketText1:   string;
  ticketText2:   string;
  requestId:     number;
  currency:      string;
  commission:    number;
  flatFee:       number;
}
