import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { TicketPayload } from '../interfaces/ticket-payload';

@Injectable({
  providedIn: 'root'
})
export class TicketDataService {

  // URL base de la API — se configurará cuando el equipo provea el endpoint real
  private apiUrl = 'https://api.example.com/tickets';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el ticket desde la API real usando el ID de la URL.
   * Usar este método cuando el equipo provea el endpoint.
   */
  getTicketFromApi(id: string): Observable<TicketPayload> {
    return this.http.get<TicketPayload>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => throwError(() => new Error('Error al conectar con la API')))
    );
  }

  /**
   * Simula la respuesta de la API usando of().
   * Datos de ejemplo enviados por el equipo (ticket de cancelación).
   */
  getTicket(id: string): Observable<TicketPayload> {
    const mockTicket: TicketPayload = {
      merchant: {
        name: 'CR AUTOVEND IM30 1',
        address: 'Reforma 222',
        zipCode: '13020',
        city: 'CIUDAD DE MEXICO',
        country: 'Mexico'
      },
      commerceId: '1014327/1736946315',
      transactionId: id || '186546',
      dateTime: '25-08-2026 17:46:06',
      batch: '',
      rrn: '699901310070',
      appCode: '0024',
      entryMode: 'ICC',
      operationType: 'CANCELACION VENTA',
      total: -62.0,
      currency: 'MXN',
      signature: 'Signature not found'
    };

    return of(mockTicket).pipe(delay(1500)); // delay simula latencia de red
  }
}
