export interface TransactionData {
  reference: string;
  amount: number;
  folio: string;
  auth: string;
  approved: boolean;
  cancel: boolean;
  reversal: boolean;
  arqc: string;
  appId: string;
  appidLabel: string;
  companyName: string;
  address: string;
  ccType: string;
  ccName: string;
  ccNumber: string;
  ccBin: string;
  ccExpMonth: string;
  ccExpYear: string;
  date: string;
  time: string;
  merchantName: string;
  operationType: string;
  responseCode: string;
  iccCsn: string;
  iccAtc: string;
  iccArpc: string;
  iccIssuerScript: string;
  businessId: number;
  customBusinessId: number;
  pinOfflineValidation: boolean;
  user: string;
  paymentType: string;
  st_qps: string;
  cdResponse: string;
  commision: number; // typo original del API
  dispersionAmount: number;
  cdcvm: number;
  surTax: number;
  surTaxAmount: number;
}

export interface CancellationData {
  reference: string;
  amount: number;
  folio: string;
  auth: string;
  approved: boolean;
  cancel: boolean;
  reversal: boolean;
  arqc: string;
  appId: string;
  appidLabel: string;
  companyName: string;
  address: string;
  ccType: string;
  ccName: string;
  ccNumber: string;
  ccExpMonth: string;
  ccExpYear: string;
  date: string;
  time: string;
  merchantName: string;
  operationType: string;
  responseCode: string;
  clientVoucher: string;
  businessVoucher: string;
  businessId: number;
  customBusinessId: number;
  pinOfflineValidation: boolean;
  st_qps: string;
  cdResponse: string;
  cdcvm: number;
  surTax: number;
  surTaxAmount: number;
}

export interface TaeData {
  dateTime: string;
  country: string;
  amount: string;          // string en la API
  product: string;
  vendorReference: string;
  mobileNumber: string;
  trxId: string;           // string en la API
  platformFee: number | null;
  transactionId: string;   // string en la API
  reference: string;
  transactionLabel: string;
  requestId: number;
  currency: string;
  flatFee: string;         // string en la API
}

export interface PdsData {
  dateTime: string;
  country: string;
  amount: number;          // number en la API
  vendorReference: string;
  fee: number;
  accountNumber: string;
  trxId: number;           // number en la API
  platformFee: number;
  transactionId: number;   // number en la API
  ticketText1: string;     // contiene "Pago realizado exitosamente Auth: [uuid]"
  ticketText2: string;     // contiene mensaje del operador
  requestId: number;
  currency: string;
  commission: number;
  flatFee: number;
}

export interface QpayObject {
  transaction: TransactionData;
  cancellation: CancellationData | null;
  tae: TaeData | null;
  pds: PdsData | null;
}

export interface QpayResponse {
  qpay_response: string;   // "true" | "false" como string
  qpay_code: string;       // "000" = aprobado
  qpay_description: string;
  qpay_object: QpayObject[];
}
