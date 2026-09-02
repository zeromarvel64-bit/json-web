import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { QpayResponse } from '../interfaces/json-payload';

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  // URL base de la API real — activar cuando el equipo confirme el endpoint
  private apiUrl = 'https://azappqa.t-conecta.app/service/api/v1/v/ticket/1';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene datos desde la API real usando el parámetro ?ri= de la URL.
   * Activar en json-view.component.ts cambiando getData → getDataFromApi
   */
  getDataFromApi(ri: string): Observable<QpayResponse> {
    const params = new HttpParams().set('ri', ri);
    return this.http.get<QpayResponse>(this.apiUrl, { params }).pipe(
      catchError(() => throwError(() => new Error('Error al conectar con la API')))
    );
  }

  /**
   * Simula la respuesta de la API con datos reales del escenario 1 (TAE exitosa).
   * Usar mientras no se tenga el endpoint real.
   */
  getData(ri: string): Observable<QpayResponse> {
    const mockData: QpayResponse = {
      qpay_response: 'true',
      qpay_code: '000',
      qpay_description: 'Aprobada',
      qpay_object: [
        {
          transaction: {
            reference: '27082026101530',
            amount: 150.0,
            folio: '699901312001',
            auth: '654100',
            approved: true,
            cancel: false,
            reversal: false,
            arqc: '0461F3B4B2EFA788',
            appId: 'A0000000041010',
            appidLabel: 'DEBITO/SANTANDER/MasterCard',
            companyName: 'BLM QA',
            address: 'CORREGIDORA 92 COL. MIGUEL HIDALGO 1A SECCION, CIUDAD DE MEX',
            ccType: 'DEBITO/SANTANDER/MasterCard',
            ccName: '',
            ccNumber: '8160',
            ccBin: '557907',
            ccExpMonth: '12',
            ccExpYear: '25',
            date: '27/08/2026',
            time: '10:15:30',
            merchantName: '0232321 1736940219',
            operationType: 'VENTA',
            responseCode: '0C',
            iccCsn: '',
            iccAtc: '0045',
            iccArpc: '',
            iccIssuerScript: '',
            businessId: 25163,
            customBusinessId: 1736940219,
            pinOfflineValidation: false,
            user: 'T-CONECTA',
            paymentType: 'C',
            st_qps: '0',
            cdResponse: '0C',
            commision: 5.0,
            dispersionAmount: 145.0,
            cdcvm: 0,
            surTax: 0.0,
            surTaxAmount: 0.0
          },
          cancellation: null,
          tae: {
            dateTime: '2026-08-27 10:15:30',
            country: 'MEX',
            amount: '150.00',
            product: '',
            vendorReference: '604600001',
            mobileNumber: '5512345678',
            trxId: '85702001',
            platformFee: null,
            transactionId: '85702001',
            reference: '1616001',
            transactionLabel: 'Atención a clientes: Llama al 800 123 2020 desde mi Telcel.',
            requestId: 10001,
            currency: 'MXN',
            flatFee: '00.0'
          },
          pds: null
        }
      ]
    };

    return of(mockData).pipe(delay(1500)); // delay simula latencia de red
  }
}
