import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonDataService } from '../../services/json-data.service';
import { QpayResponse, QpayObject } from '../../interfaces/json-payload';

@Component({
  selector: 'app-json-view',
  standalone: false,
  templateUrl: './json-view.component.html',
  styleUrl: './json-view.component.css'
})
export class JsonViewComponent implements OnInit {

  qpayData: QpayResponse | null = null;
  loading = false;
  error: string | null = null;
  currentId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private jsonDataService: JsonDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.currentId = id;
      if (id) {
        this.loadData(id);
      }
    });
  }

  loadData(id: string): void {
    this.loading = true;
    this.error = null;
    this.qpayData = null;

    // Cambiar a getDataFromApi(id) cuando el equipo provea el endpoint real
    this.jsonDataService.getData(id).subscribe({
      next: (data) => {
        this.qpayData = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo obtener la información. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  /** Primer (y normalmente único) elemento de qpay_object */
  get qpayObject(): QpayObject | null {
    return this.qpayData?.qpay_object?.[0] ?? null;
  }

  /** Respuesta aprobada si qpay_response es "true" y qpay_code es "000" */
  get isApproved(): boolean {
    return this.qpayData?.qpay_response === 'true' && this.qpayData?.qpay_code === '000';
  }
}
