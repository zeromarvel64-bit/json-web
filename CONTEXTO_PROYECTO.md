# Contexto del Proyecto: json-viewer

## Objetivo General
Aplicación Angular que consume un JSON desde una API (enviado por el equipo)
y muestra la información en pantalla de forma dinámica según el tipo y estado del payload.

Casos contemplados: venta, cancelación, recarga TAE, pago de servicios (PDS).

---

## Stack Tecnológico
- **Framework:** Angular 19 (módulos, no standalone)
- **Lenguaje:** TypeScript
- **Estilos:** CSS puro (sin framework UI por ahora)
- **HTTP:** HttpClientModule
- **Reactivo:** RxJS — Observables, subscribe(), of()

---

## Estructura del Proyecto

```
json-web/
├── CONTEXTO_PROYECTO.md          ← este archivo
├── semana_5_contexto.txt         ← briefing original
└── json-viewer/                  ← proyecto Angular
    └── src/app/
        ├── interfaces/
        │   └── json-payload.ts           ← todas las interfaces tipadas
        ├── services/
        │   └── json-data.service.ts      ← lógica de consumo HTTP
        ├── pages/
        │   └── json-view/                ← página principal
        │       ├── json-view.component.ts
        │       ├── json-view.component.html
        │       └── json-view.component.css
        ├── app-routing.module.ts         ← rutas
        ├── app.module.ts                 ← módulo raíz
        └── app.component.html            ← solo <router-outlet>
```

---

## Rutas configuradas
| Ruta           | Componente        | Descripción                          |
|----------------|-------------------|--------------------------------------|
| `/view/:id`    | JsonViewComponent | Página principal — recibe ID por URL |
| `/`            | → redirect        | Redirige a `/view/demo`              |
| `/**`          | → redirect        | Cualquier ruta inválida a `/view/demo` |

---

## Interfaces definidas (`json-payload.ts`)

### `QpayResponse` — Raíz del JSON
```typescript
{
  qpay_response: string;       // "true" | "false"
  qpay_code: string;           // "000" = aprobada
  qpay_description: string;
  qpay_object: QpayObject[];
}
```

### `QpayObject` — Elemento de qpay_object (todas opcionales)
```typescript
{
  transaction?:  Transaction;
  cancellation?: Cancellation;
  tae?:          Tae;
  pds?:          Pds;
}
```

### `Transaction` — Venta con tarjeta
Campos: reference, amount, folio, auth, approved, cancel, reversal, arqc, appId, appidLabel,
companyName, address, ccType, ccName, ccNumber, ccBin, ccExpMonth, ccExpYear, date, time,
merchantName, operationType, responseCode, iccCsn, iccAtc, iccArpc, iccIssuerScript,
businessId, customBusinessId, pinOfflineValidation, user, paymentType, st_qps, cdResponse,
commision, dispersionAmount, cdcvm, surTax, surTaxAmount.

### `Cancellation` — Cancelación de venta
Mismos campos que Transaction más: clientVoucher, businessVoucher.
Sin: commision, dispersionAmount, paymentType, user, st_qps.

### `Tae` — Recarga telefónica (campos aprobados por el equipo)
Campos: dateTime, country, amount, product, vendorReference, mobileNumber, trxId,
platformFee, transactionId, reference, transactionLabel, requestId, currency, flatFee.

Campos **excluidos** (análisis equipo 2026-08-31):
authorizationNumber, customerId, channelId, extra, terminalId, providerAuth,
timestamp, commission, accountNumber, bimboAward, bimboAwardMessage.

### `Pds` — Pago de servicios (campos aprobados por el equipo)
Campos: dateTime, country, amount, vendorReference, fee, accountNumber, trxId,
platformFee, transactionId, ticketText1, ticketText2, requestId, currency, commission, flatFee.

Campos **excluidos** (análisis equipo 2026-08-31):
surcharge, product, verificationDigit, billReference, accountNumber3, accountNumber2,
accountNumber1, reference, mobileNumber, transactionLabel.

---

## Flujo de la aplicación
1. Usuario entra a `/view/:id`
2. `JsonViewComponent.ngOnInit()` lee el `:id` desde `ActivatedRoute`
3. Llama a `JsonDataService.getData(id)` (simulado con `of()`)
4. Mientras espera → muestra **spinner de carga**
5. Si responde OK → muestra encabezado QPay + secciones presentes (transaction / cancellation / tae / pds)
6. Si falla → muestra **estado de error** con botón de reintento

---

## Servicio `JsonDataService`
- `getData(id)` — **simulado con `of()`** + delay 1.5s — datos reales de QA
- `getDataFromApi(id)` — **llamada HTTP real** a `apiUrl/{id}`
- Para activar la API real: en `json-view.component.ts` cambiar `getData` → `getDataFromApi`

---

## Pantalla: secciones mostradas
Cada sección se muestra condicionalmente según los campos presentes en `qpay_object[0]`:

| Sección       | Badge color  | Se muestra cuando                    |
|---------------|--------------|--------------------------------------|
| Transaction   | Indigo       | `qpay_object[0].transaction` existe  |
| Cancellation  | Rojo         | `qpay_object[0].cancellation` existe |
| TAE           | Amarillo     | `qpay_object[0].tae` existe          |
| PDS           | Verde        | `qpay_object[0].pds` existe          |

---

## Comandos útiles
```bash
# Correr en local
cd json-viewer
ng serve

# Build producción
ng build --configuration production

# Crear nuevo componente
ng generate component pages/nombre-componente --module=app

# Crear nuevo servicio
ng generate service services/nombre-servicio
```

---

## Pendientes / Próximos pasos
- [ ] Recibir el endpoint real de la API del equipo y configurarlo en `json-data.service.ts`
- [ ] Confirmar si siempre llegan las 4 secciones o solo algunas según el tipo de transacción
- [ ] Evaluar si se necesita manejo de Query Params además de Route Params
- [ ] Ajustar diseño visual al estilo que el equipo espere (colores, logo, etc.)

---

## Historial de cambios
| Fecha       | Descripción                                                              |
|-------------|--------------------------------------------------------------------------|
| 2026-08-25  | Proyecto Angular base creado, estructura inicial lista                    |
| 2026-08-31  | Interfaces reescritas con estructura real de QPay (QpayResponse, Transaction, Cancellation, Tae, Pds). Se aplicaron cambios del análisis del equipo: campos TAE y PDS excluidos. Mock data actualizado con datos reales de QA. Template y CSS actualizados para mostrar secciones por tipo. |
