import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../services/ticket.service';
import { TicketData } from '../../interfaces/ticket';

@Component({
  selector: 'app-ticket',
  standalone: false,
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit {

  ticket: TicketData | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    // Lee el escenario desde los datos de la ruta (definidos en app-routing)
    const scenario: string = this.route.snapshot.data['scenario'] ?? 'tae_exitosa';

    this.ticketService.getData(scenario).subscribe({
      next: (data) => {
        this.ticket = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el ticket.';
        this.loading = false;
      }
    });
  }

  /** Icono dinámico según el estado de la operación */
  get opIcon(): string {
    if (!this.ticket) return '';
    if (this.ticket.operationClass === 'cancelled') return '×';
    if (this.ticket.operationClass === 'pending')   return '◷';
    return '✓';
  }

  /** Número absoluto formateado para el total */
  get totalFormatted(): string {
    if (!this.ticket) return '';
    const abs = Math.abs(this.ticket.total).toFixed(2);
    return this.ticket.total < 0 ? `-${abs}` : abs;
  }

  /** Monto PDS formateado (pds.amount) */
  get pdsMontoFormatted(): string {
    return (this.ticket?.pdsMonto ?? 0).toFixed(2);
  }

  /** Comisión PDS formateada (pds.flatFee) */
  get pdsComisionFormatted(): string {
    return (this.ticket?.pdsComision ?? 0).toFixed(2);
  }

  /** Total PDS formateado (pds.amount + pds.flatFee) */
  get pdsTotalFormatted(): string {
    return (this.ticket?.pdsTotal ?? 0).toFixed(2);
  }

  downloadPdf(): void {
    window.print();
  }
}
