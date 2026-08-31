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

  /** Icono dinámico según el tipo de operación */
  get opIcon(): string {
    if (!this.ticket) return '';
    return this.ticket.operationClass === 'cancellation' ? '×' : '✓';
  }

  /** Número absoluto formateado para el total */
  get totalFormatted(): string {
    if (!this.ticket) return '';
    const abs = Math.abs(this.ticket.total).toFixed(2);
    return this.ticket.total < 0 ? `-${abs}` : abs;
  }

  downloadPdf(): void {
    window.print();
  }
}
