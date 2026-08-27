import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketDataService } from '../../services/ticket-data.service';
import { TicketPayload } from '../../interfaces/ticket-payload';

type TicketDesign = 'a' | 'b';

@Component({
  selector: 'app-ticket-view',
  standalone: false,
  templateUrl: './ticket-view.component.html',
  styleUrl: './ticket-view.component.css'
})
export class TicketViewComponent implements OnInit {

  ticket: TicketPayload | null = null;
  loading = false;
  error: string | null = null;
  currentId: string | null = null;
  design: TicketDesign = 'a';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketDataService: TicketDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.currentId = id;
      if (id) {
        this.loadTicket(id);
      }
    });

    // Query param ?design=a|b permite comparar las dos propuestas
    this.route.queryParamMap.subscribe(params => {
      const design = params.get('design');
      this.design = design === 'b' ? 'b' : 'a';
    });
  }

  loadTicket(id: string): void {
    this.loading = true;
    this.error = null;
    this.ticket = null;

    // Cambiar a getTicketFromApi(id) cuando el equipo provea el endpoint real
    this.ticketDataService.getTicket(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo obtener el ticket. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  setDesign(design: TicketDesign): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { design },
      queryParamsHandling: 'merge'
    });
  }

  get isCancellation(): boolean {
    return (this.ticket?.operationType ?? '').toUpperCase().includes('CANCELACION');
  }

  get isNegative(): boolean {
    return (this.ticket?.total ?? 0) < 0;
  }

  get operationLabel(): string {
    const type = this.ticket?.operationType ?? '';
    const map: Record<string, string> = {
      'CANCELACION VENTA': 'Cancelación de venta',
      'VENTA': 'Venta'
    };
    return map[type.toUpperCase()] ?? type;
  }

  get entryModeLabel(): string {
    const map: Record<string, string> = {
      ICC: 'Tarjeta (chip)',
      MSR: 'Tarjeta (banda)',
      CTLS: 'Tarjeta (contactless)'
    };
    return map[this.ticket?.entryMode ?? ''] ?? (this.ticket?.entryMode || '—');
  }

  get signatureLabel(): string {
    const sig = this.ticket?.signature ?? '';
    return !sig || sig === 'Signature not found' ? 'Firma no requerida' : 'Firmado';
  }
}
