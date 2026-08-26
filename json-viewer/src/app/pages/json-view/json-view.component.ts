import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JsonDataService } from '../../services/json-data.service';
import { JsonPayload } from '../../interfaces/json-payload';

@Component({
  selector: 'app-json-view',
  standalone: false,
  templateUrl: './json-view.component.html',
  styleUrl: './json-view.component.css'
})
export class JsonViewComponent implements OnInit {

  payload: JsonPayload | null = null;
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
    this.payload = null;

    // Cambiar a getDataFromApi(id) cuando el equipo provea el endpoint real
    this.jsonDataService.getData(id).subscribe({
      next: (data) => {
        this.payload = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo obtener la información. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  get statusClass(): string {
    if (!this.payload) return '';
    const map: Record<string, string> = {
      success: 'status-success',
      error: 'status-error',
      pending: 'status-pending',
      warning: 'status-warning'
    };
    return map[this.payload.status] ?? 'status-default';
  }

  get dataEntries(): { key: string; value: any }[] {
    if (!this.payload?.data) return [];
    return Object.entries(this.payload.data).map(([key, value]) => ({ key, value }));
  }
}
