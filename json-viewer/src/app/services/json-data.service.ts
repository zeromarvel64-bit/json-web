import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { QpayResponse } from '../interfaces/json-payload';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  // URL base de la API — configurar cuando el equipo provea el endpoint real
  private apiUrl = 'https://api.example.com/data';

  constructor(private http: HttpClient) {}

  /**
   * Llamada HTTP real. Activar cuando el equipo provea el endpoint.
   */
  getDataFromApi(id: string): Observable<QpayResponse> {
    return this.http.get<QpayResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => throwError(() => new Error('Error al conectar con la API')))
    );
  }

  /**
   * Simulación con of() usando datos reales de QA.
   * Cambiar a getDataFromApi(id) cuando esté disponible el endpoint.
   */
  getData(id: string): Observable<QpayResponse> {
    const mockData: QpayResponse = {
      qpay_response: 'true',
      qpay_code: '000',
      qpay_description: 'Aprobada',
      qpay_object: [
        {
          transaction: {
            reference:            '28082026021728',
            amount:               100.0,
            folio:                '699901312890',
            auth:                 '626106',
            approved:             true,
            cancel:               false,
            reversal:             false,
            arqc:                 'C733811DB9EBFA01',
            appId:                'A0000000041010',
            appidLabel:           'CREDITO/BANORTE/MasterCard',
            companyName:          'BLM QA',
            address:              'CORREGIDORA 92 COL. MIGUEL HIDALGO 1A SECCION, CIUDAD DE MEX',
            ccType:               'CREDITO/BANORTE/MasterCard',
            ccName:               '',
            ccNumber:             '6660',
            ccBin:                '544549',
            ccExpMonth:           '11',
            ccExpYear:            '16',
            date:                 '28/08/2026',
            time:                 '14:17:29',
            merchantName:         '0232321 1736946595',
            operationType:        'VENTA',
            responseCode:         '0C',
            iccCsn:               '',
            iccAtc:               '',
            iccArpc:              '',
            iccIssuerScript:      '',
            businessId:           69494,
            customBusinessId:     1736946595,
            pinOfflineValidation: false,
            user:                 'QIUBOPLUS',
            paymentType:          'C',
            st_qps:               '1',
            cdResponse:           '0C',
            commision:            3.5,
            dispersionAmount:     96.5,
            cdcvm:                0,
            surTax:               0.0,
            surTaxAmount:         0.0
          },
          cancellation: {
            reference:            '28082026110011',
            amount:               -80.0,
            folio:                '699901312397',
            auth:                 'FK5RIB',
            approved:             true,
            cancel:               true,
            reversal:             false,
            arqc:                 '',
            appId:                '',
            appidLabel:           '',
            companyName:          'BLM QA',
            address:              'CORREGIDORA 92 INT. null COL. MIGUEL HIDALGO 1A SECCION, CIUDAD DE MEX',
            ccType:               'DEBITO/BBVA/Visa',
            ccName:               '',
            ccNumber:             '2055',
            ccExpMonth:           '06',
            ccExpYear:            '30',
            date:                 '28/08/2026',
            time:                 '11:04:14',
            merchantName:         '0232321 1736948727',
            operationType:        'CANCELACION',
            responseCode:         '0C',
            clientVoucher:        '',
            businessVoucher:      '',
            businessId:           103953,
            customBusinessId:     1736948727,
            pinOfflineValidation: false,
            st_qps:               '',
            cdResponse:           '0C',
            cdcvm:                0,
            surTax:               0.0,
            surTaxAmount:         0.0
          },
          tae: {
            dateTime:         '2026-08-04 16:08:37',
            country:          'MEX',
            amount:           '95.00',
            product:          '',
            vendorReference:  '604600007',
            mobileNumber:     '5543222222',
            trxId:            '85702687',
            platformFee:      null,
            transactionId:    '85702687',
            reference:        '1616432',
            transactionLabel: 'Atención a clientes: Llama al 800800 ó al *4262 desde mi Valor.',
            requestId:        10023,
            currency:         'MXN',
            flatFee:          '00.0'
          },
          pds: {
            dateTime:       '2026-08-11 15:31:24',
            country:        'MEX',
            amount:         663.0,
            vendorReference:'23940fd5-b835-49ed-b221-f4e594acd386',
            fee:            0.6,
            accountNumber:  '821970704543',
            trxId:          1616620,
            platformFee:    14.17,
            transactionId:  173849,
            ticketText1:    'Pago realizado exitosamente Auth: 23940fd5-b835-49ed-b221-f4e594acd386',
            ticketText2:    'SERVICIO OPERADO POR MONATO. FAVOR DE GUARDAR ESTE COMPROBANTE DE PAGO PARA POSIBLES ACLARACIONES.',
            requestId:      246637,
            currency:       'MXN',
            commission:     5.4,
            flatFee:        12.0
          }
        }
      ]
    };

    return of(mockData).pipe(delay(1500));
  }
}
