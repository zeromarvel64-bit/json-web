import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TicketData } from '../interfaces/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  /**
   * Devuelve el TicketData hardcodeado para el escenario indicado.
   * Mapeo desde los JSON de QA (scenario1–4).
   * Sustituir por llamada HTTP cuando el equipo provea el endpoint.
   */
  getData(scenario: string): Observable<TicketData> {
    const scenarios: Record<string, TicketData> = {

      // ── Escenario 1: TAE Exitosa ─────────────────────────────────────────
      // src: scenario1_tae_exitosa.json
      // transaction: folio=699901312001, date=27/08/2026, time=10:15:30,
      //              businessId=25163, customBusinessId=1736940219, iccAtc=0045, st_qps=0
      // tae:         requestId=200000001, mobileNumber=5512345678, label=Recarga móvil TELCEL
      tae_exitosa: {
        merchantName:    'CR AUTOVEND IM30 1',
        merchantAddress: 'Reforma 222 · México 13020',
        merchantCity:    'Ciudad de México',
        operationType:   'RECARGA TAE EXITOSA',
        operationClass:  'success',
        comercio:        '25163 / 1736940219',
        transaccion:     '200000001',
        fechaHora:       '27-08-2026 · 10:15:30',
        lote:            '0',
        rrn:             '699901312001',
        aplicacion:      '0045 · ICC',
        total:           150.00,
        currency:        'MXN',
        footerLine1:     'Firma no requerida.',
        footerLine2:     'Recarga móvil TELCEL · Cel: 5512345678'
      },

      // ── Escenario 2: TAE No Exitosa ──────────────────────────────────────
      // src: scenario2_tae_no_exitosa.json
      // cancellation: folio=699901312003, date=27/08/2026, time=11:31:20, st_qps=""
      // transaction:  iccAtc=0062
      // tae:          requestId=200000002, mobileNumber=5598765432, label=Recarga móvil MOVISTAR
      tae_no_exitosa: {
        merchantName:    'CR AUTOVEND IM30 1',
        merchantAddress: 'Reforma 222 · México 13020',
        merchantCity:    'Ciudad de México',
        operationType:   'CANCELACIÓN TAE',
        operationClass:  'cancelled',
        comercio:        '25163 / 1736940219',
        transaccion:     '200000002',
        fechaHora:       '27-08-2026 · 11:31:20',
        lote:            '–',
        rrn:             '699901312003',
        aplicacion:      '0062 · ICC',
        total:           -150.00,
        currency:        'MXN',
        footerLine1:     'Firma no requerida.',
        footerLine2:     'Recarga móvil MOVISTAR · Cel: 5598765432'
      },

      // ── Escenario 3: PDS Exitoso ─────────────────────────────────────────
      // src: scenario3_pds_exitoso.json
      // transaction: folio=699901312004, date=27/08/2026, time=14:22:00,
      //              businessId=25163, customBusinessId=1736940219, iccAtc=0091, st_qps=0
      // pds:         requestId=300000001, accountNumber=1234567890, ticketText=PAGO EXITOSO
      pds_exitoso: {
        merchantName:    'CR AUTOVEND IM30 1',
        merchantAddress: 'Reforma 222 · México 13020',
        merchantCity:    'Ciudad de México',
        operationType:   'PAGO DE SERVICIO EXITOSO',
        operationClass:  'success',
        comercio:        '25163 / 1736940219',
        transaccion:     '300000001',
        fechaHora:       '27-08-2026 · 14:22:00',
        lote:            '0',
        rrn:             '699901312004',
        aplicacion:      '0091 · ICC',
        total:           520.00,
        currency:        'MXN',
        footerLine1:     'Firma no requerida.',
        footerLine2:     'Conserve este comprobante de pago.'
      },

      // ── Escenario 4: PDS No Exitoso ──────────────────────────────────────
      // src: scenario4_pds_no_exitoso.json
      // cancellation: folio=699901312006, date=27/08/2026, time=16:05:48, st_qps=""
      // transaction:  iccAtc=0114
      // pds:          requestId=300000002, accountNumber=5551234567, ticketText=PAGO NO EXITOSO
      pds_no_exitoso: {
        merchantName:    'CR AUTOVEND IM30 1',
        merchantAddress: 'Reforma 222 · México 13020',
        merchantCity:    'Ciudad de México',
        operationType:   'CANCELACIÓN PDS',
        operationClass:  'cancelled',
        comercio:        '25163 / 1736940219',
        transaccion:     '300000002',
        fechaHora:       '27-08-2026 · 16:05:48',
        lote:            '–',
        rrn:             '699901312006',
        aplicacion:      '0114 · ICC',
        total:           -380.00,
        currency:        'MXN',
        footerLine1:     'Contacte a su proveedor de servicios.',
        footerLine2:     'Conserve este comprobante para cualquier aclaración.'
      }
    };

    const data = scenarios[scenario] ?? scenarios['tae_exitosa'];
    return of(data).pipe(delay(600));
  }
}
