import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { JsonPayload } from '../interfaces/json-payload';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  // URL base de la API — se configurará cuando el equipo provea el endpoint real
  private apiUrl = 'https://api.example.com/data';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene datos desde la API real usando el ID de la URL.
   * Usar este método cuando el equipo provea el endpoint.
   */
  getDataFromApi(id: string): Observable<JsonPayload> {
    return this.http.get<JsonPayload>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => throwError(() => new Error('Error al conectar con la API')))
    );
  }

  /**
   * Simula la respuesta de la API usando of().
   * Usar este método mientras no se tenga el endpoint real.
   */
  getData(id: string): Observable<JsonPayload> {
    const mockData: JsonPayload = {
      type: 'payment',
      status: 'success',
      id,
      message: 'Pago procesado correctamente',
      data: {
        amount: 1500.00,
        currency: 'MXN',
        reference: `REF-${id}`,
        cardLast4: '4242'
      },
      timestamp: new Date().toISOString()
    };

    return of(mockData).pipe(delay(1500)); // delay simula latencia de red
  }
}
