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

      // ── Escenario 1: TAE Exitosa  (src: scenario1_tae_exitosa.json) ────────
      tae_exitosa: {
        companyName:     'BLM QA',                                           // transaction.companyName
        merchantAddress: 'CORREGIDORA 92 COL. MIGUEL HIDALGO 1A SECCION',   // transaction.address (antes de la coma)
        merchantCity:    'CIUDAD DE MEX',                                     // transaction.address (después de la coma)
        operationType:   'RECARGA TAE EXITOSA',                              // derivado del escenario
        operationClass:  'success',                                           // derivado del escenario
        merchantName:    '0232321 1736940219',                               // transaction.merchantName
        transaccion:     '10001',                                             // tae.requestId
        fechaHora:       '27-08-2026 · 10:15:30',                           // transaction.date + transaction.time
        lote:            '0',                                                 // no existe en JSON → placeholder
        rrn:             '699901312001',                                      // transaction.folio
        aplicacion:      '0045 · ICC',                                       // transaction.iccAtc + paymentType "C"→"ICC"
        total:           150.00,                                              // transaction.amount
        currency:        'MXN',                                               // tae.currency
        footerLine1:     'Firma no requerida.',                              // (estático digital)
        footerLine2:     'Atención a clientes: Llama al 800 123 2020 desde mi Telcel.' // tae.transactionLabel
      },

      // ── Escenario 2: TAE No Exitosa  (src: scenario2_tae_no_exitosa.json) ─
      tae_no_exitosa: {
        companyName:     'BLM QA',                                           // cancellation.companyName
        merchantAddress: 'CORREGIDORA 92 COL. MIGUEL HIDALGO 1A SECCION',   // cancellation.address (antes de la coma)
        merchantCity:    'CIUDAD DE MEX',                                     // cancellation.address (después de la coma)
        operationType:   'CANCELACIÓN TAE',                                  // derivado del escenario
        operationClass:  'cancelled',                                         // derivado del escenario
        merchantName:    '0232321 1736940219',                               // cancellation.merchantName
        transaccion:     '10002',                                             // tae.requestId
        fechaHora:       '27-08-2026 · 11:31:20',                           // cancellation.date + cancellation.time
        lote:            '–',                                                 // no existe en JSON → placeholder
        rrn:             '699901312003',                                      // cancellation.folio
        aplicacion:      '0062 · ICC',                                       // transaction.iccAtc + paymentType "C"→"ICC"
        total:           -150.00,                                             // cancellation.amount
        currency:        'MXN',                                               // tae.currency
        footerLine1:     'Firma no requerida.',                              // (estático digital)
        footerLine2:     ''                                                   // tae.transactionLabel = "" (vacío en fallo)
      },

      // ── Escenario 3: PDS Exitoso  (src: scenario3_pds_exitoso.json) ────────
      pds_exitoso: {
        companyName:     'BLM QA',                                           // transaction.companyName
        merchantAddress: 'CORREGIDORA 92 COL. MIGUEL HIDALGO 1A SECCION',   // transaction.address (antes de la coma)
        merchantCity:    'CIUDAD DE MEX',                                     // transaction.address (después de la coma)
        operationType:   'PAGO DE SERVICIO EXITOSO',                         // derivado del escenario
        operationClass:  'success',                                           // derivado del escenario
        merchantName:    '0232321 1736940219',                               // transaction.merchantName
        transaccion:     '246001',                                            // pds.requestId
        fechaHora:       '27-08-2026 · 14:22:00',                           // transaction.date + transaction.time
        lote:            '0',                                                 // no existe en JSON → placeholder
        rrn:             '699901312004',                                      // transaction.folio
        aplicacion:      '0091 · ICC',                                       // transaction.iccAtc + paymentType "C"→"ICC"
        total:           520.00,                                              // pds.amount
        currency:        'MXN',                                               // pds.currency
        footerLine1:     '',
        footerLine2:     '',
        // ── Sección PDS ────────────────────────────────────────────────────
        hasPds:          true,
        pdsServiceName:  'Izzi',                                             // sin campo en JSON → hardcodeado
        pdsMonto:        520.0,                                              // pds.amount
        pdsComision:     12.0,                                               // pds.flatFee
        pdsTotal:        532.0,                                              // pds.amount + pds.flatFee = 520 + 12
        pdsCurrency:     'MXN',                                              // pds.currency
        pdsTicketText1:  'Pago realizado exitosamente Auth: 23940fd5-c835-49ed-b221-f4e594acd003', // pds.ticketText1
        pdsTicketText2:  'SERVICIO OPERADO POR MONATO. FAVOR DE GUARDAR ESTE COMPROBANTE DE PAGO PARA POSIBLES ACLARACIONES. PARA CUALQUIER DUDA LLAME AL 55 9315 8885.', // pds.ticketText2
        tienda:          'BLM QA'                                            // transaction.companyName
      },

      // ── Escenario 4: PDS No Exitoso  (src: scenario4_pds_no_exitoso.json) ──
      pds_no_exitoso: {
        companyName:     'BLM QA',                                           // cancellation.companyName
        merchantAddress: 'CORREGIDORA 92 COL. MIGUEL HIDALGO 1A SECCION',   // cancellation.address (antes de la coma)
        merchantCity:    'CIUDAD DE MEX',                                     // cancellation.address (después de la coma)
        operationType:   'CANCELACIÓN PDS',                                  // derivado del escenario
        operationClass:  'cancelled',                                         // derivado del escenario
        merchantName:    '0232321 1736940219',                               // cancellation.merchantName
        transaccion:     '246002',                                            // pds.requestId
        fechaHora:       '27-08-2026 · 16:05:48',                           // cancellation.date + cancellation.time
        lote:            '–',                                                 // no existe en JSON → placeholder
        rrn:             '699901312006',                                      // cancellation.folio
        aplicacion:      '0114 · ICC',                                       // transaction.iccAtc + paymentType "C"→"ICC"
        total:           -380.00,                                             // cancellation.amount
        currency:        'MXN',                                               // pds.currency
        footerLine1:     'Pago no realizado. Error en transacción.',         // pds.ticketText1
        footerLine2:     'SERVICIO OPERADO POR MONATO. FAVOR DE GUARDAR ESTE COMPROBANTE DE PAGO PARA POSIBLES ACLARACIONES. PARA CUALQUIER DUDA LLAME AL 55 9315 8885.' // pds.ticketText2
      },

      // ── Escenario 5: TAE En Proceso  (src: scenario5_tae_en_proceso.json) ────
      // Identificado por transaction.reference con prefijo "tae-"
      tae_en_proceso: {
        companyName:     'BLM QA',                                           // transaction.companyName
        merchantAddress: 'CORREGIDORA 92 COL. MIGUEL HIDALGO 1A SECCION',   // transaction.address (antes de la coma)
        merchantCity:    'CIUDAD DE MEX',                                     // transaction.address (después de la coma)
        operationType:   'TAE EN PROCESO',                                   // derivado del escenario
        operationClass:  'pending',                                           // derivado del escenario
        merchantName:    '0232321 1736940219',                               // transaction.merchantName
        transaccion:     '10003',                                             // tae.requestId
        fechaHora:       '27-08-2026 · 09:22:11',                           // transaction.date + transaction.time
        lote:            '0',                                                 // no existe en JSON → placeholder
        rrn:             '699901312008',                                      // cancellation.folio
        aplicacion:      '0078 · ICC',                                       // transaction.iccAtc + paymentType "C"→"ICC"
        total:           150.00,                                              // transaction.amount
        currency:        'MXN',                                               // tae.currency
        footerLine1:     'Firma no requerida.',
        footerLine2:     'Atención a clientes: Llama al 800 123 2020 desde mi Telcel.' // tae.transactionLabel
      },

      // ── Escenario 6: PDS En Proceso  (src: scenario6_pds_en_proceso.json) ───
      // Identificado por transaction.reference con prefijo "PS-"
      pds_en_proceso: {
        companyName:     'BLM QA',                                           // transaction.companyName
        merchantAddress: 'CORREGIDORA 92 COL. MIGUEL HIDALGO 1A SECCION',   // transaction.address (antes de la coma)
        merchantCity:    'CIUDAD DE MEX',                                     // transaction.address (después de la coma)
        operationType:   'PAGO DE SERVICIO EN PROCESO',                      // derivado del escenario
        operationClass:  'pending',                                           // derivado del escenario
        merchantName:    '0232321 1736940219',                               // transaction.merchantName
        transaccion:     '246003',                                            // pds.requestId
        fechaHora:       '27-08-2026 · 14:23:10',                           // transaction.date + transaction.time
        lote:            '0',                                                 // no existe en JSON → placeholder
        rrn:             '699901312010',                                      // cancellation.folio
        aplicacion:      '0092 · ICC',                                       // transaction.iccAtc + paymentType "C"→"ICC"
        total:           520.00,                                              // pds.amount
        currency:        'MXN',                                               // pds.currency
        footerLine1:     '',
        footerLine2:     '',
        // ── Sección PDS ────────────────────────────────────────────────────
        hasPds:          true,
        pdsServiceName:  'Izzi',                                             // sin campo en JSON → hardcodeado
        pdsMonto:        520.0,                                              // pds.amount
        pdsComision:     12.0,                                               // pds.flatFee
        pdsTotal:        532.0,                                              // pds.amount + pds.flatFee = 520 + 12
        pdsCurrency:     'MXN',                                              // pds.currency
        pdsTicketText1:  'Pago en proceso. En espera de confirmación.',      // pds.ticketText1
        pdsTicketText2:  'SERVICIO OPERADO POR MONATO. FAVOR DE GUARDAR ESTE COMPROBANTE DE PAGO PARA POSIBLES ACLARACIONES. PARA CUALQUIER DUDA LLAME AL 55 9315 8885.', // pds.ticketText2
        tienda:          'BLM QA'                                            // transaction.companyName
      }
    };

    const data = scenarios[scenario] ?? scenarios['tae_exitosa'];
    return of(data).pipe(delay(600));
  }
}
