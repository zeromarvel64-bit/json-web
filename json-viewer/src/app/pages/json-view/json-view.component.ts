import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonDataService } from '../../services/json-data.service';
import { QpayResponse, QpayObject, TransactionData, CancellationData, TaeData, PdsData } from '../../interfaces/json-payload';

@Component({
  selector: 'app-json-view',
  standalone: false,
  templateUrl: './json-view.component.html',
  styleUrl: './json-view.component.css'
})
export class JsonViewComponent implements OnInit {

  payload: QpayResponse | null = null;
  loading = false;
  error: string | null = null;
  currentRi: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private jsonDataService: JsonDataService
  ) {}

  ngOnInit(): void {
    // Lee el query param ?ri= de la URL (ej: /ticket?ri=699901310070)
    this.route.queryParamMap.subscribe(params => {
      const ri = params.get('ri') ?? 'demo';
      this.currentRi = ri;
      this.loadData(ri);
    });
  }

  loadData(ri: string): void {
    this.loading = true;
    this.error = null;
    this.payload = null;

    // Cambiar a getDataFromApi(ri) cuando el equipo provea el endpoint real
    this.jsonDataService.getData(ri).subscribe({
      next: (data) => {
        this.payload = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo obtener la información. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  // --- Accesores del objeto principal ---

  get qpayObject(): QpayObject | null {
    return this.payload?.qpay_object?.[0] ?? null;
  }

  get transaction(): TransactionData | null {
    return this.qpayObject?.transaction ?? null;
  }

  get cancellation(): CancellationData | null {
    return this.qpayObject?.cancellation ?? null;
  }

  get tae(): TaeData | null {
    return this.qpayObject?.tae ?? null;
  }

  get pds(): PdsData | null {
    return this.qpayObject?.pds ?? null;
  }

  // --- Helpers de lógica ---

  get hasCancellation(): boolean {
    return this.cancellation !== null;
  }

  get hasTae(): boolean {
    return this.tae !== null;
  }

  get hasPds(): boolean {
    return this.pds !== null;
  }

  /** Escenario detectado según qué objetos están presentes */
  get scenarioType(): 'tae_exitosa' | 'tae_no_exitosa' | 'pds_exitosa' | 'pds_no_exitosa' | 'unknown' {
    if (this.hasTae && !this.hasCancellation) return 'tae_exitosa';
    if (this.hasTae && this.hasCancellation)  return 'tae_no_exitosa';
    if (this.hasPds && !this.hasCancellation) return 'pds_exitosa';
    if (this.hasPds && this.hasCancellation)  return 'pds_no_exitosa';
    return 'unknown';
  }

  /** Monto total a mostrar — cancellation si existe, si no transaction */
  get totalAmount(): number {
    return this.cancellation?.amount ?? this.transaction?.amount ?? 0;
  }

  /** Moneda — viene de tae o pds, fallback MXN */
  get currency(): string {
    return this.tae?.currency ?? this.pds?.currency ?? 'MXN';
  }

  /** Etiqueta del tipo de operación */
  get operationLabel(): string {
    if (!this.transaction) return '';
    if (this.cancellation) {
      return `${this.cancellation.operationType} ${this.transaction.operationType}`;
    }
    return this.transaction.operationType;
  }

  /** Traduce paymentType a etiqueta legible */
  get paymentTypeLabel(): string {
    const map: Record<string, string> = { 'C': 'ICC', 'B': 'BANDA', 'NFC': 'CONTACTLESS' };
    return map[this.transaction?.paymentType ?? ''] ?? this.transaction?.paymentType ?? '';
  }

  /** Indica si la operación fue exitosa */
  get isSuccess(): boolean {
    if (this.hasTae)  return !this.hasCancellation && (this.tae?.trxId !== '');
    if (this.hasPds)  return !this.hasCancellation && (this.pds?.transactionId !== 0);
    return false;
  }
}
