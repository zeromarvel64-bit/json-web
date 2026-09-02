# Skill: Contexto del Proyecto json-viewer (T-CONECTA)

## ¿Cuándo usar esta skill?
Invócala siempre que trabajes en el proyecto ubicado en `D:\json-web\`.
Contiene todo el contexto acumulado: estructura, decisiones tomadas, campos del JSON, escenarios, pendientes.

---

## Objetivo del proyecto
App Angular que recibe un JSON desde una API y muestra un **ticket digital** (comprobante de pago) según el tipo y estado de la transacción.

El ticket es escaneado vía **código QR** por el cliente. La URL del QR tiene el formato:
```
https://azappqa.t-conecta.app/service/api/v1/v/ticket/1?ri=699901310070
```
El parámetro `?ri=` identifica la transacción.

---

## Stack tecnológico
| Tecnología | Versión / detalle |
|---|---|
| Angular | 19 (módulos, NO standalone) |
| TypeScript | - |
| CSS | Puro, sin framework UI |
| HTTP | HttpClientModule |
| Reactivo | RxJS — Observable, subscribe(), of() |
| Logo | `src/assets/Pack.png` (T-CONECTA) |

---

## Estructura de carpetas

```
D:\json-web\
├── .devin/skills/contexto-proyecto/SKILL.md   ← esta skill
├── CONTEXTO_PROYECTO.md                        ← doc de contexto (desactualizada)
├── AZURE_DEVOPS_DEPLOY.md                      ← guía de despliegue Azure
├── campos_usados.txt                           ← mapeo visual ticket → JSON
├── semana_5_contexto.txt                       ← briefing original del equipo
├── cancellation_status_response.json           ← JSON de referencia del equipo (Bau)
│
├── scenario1_tae_exitosa.json                  ← mock escenario 1
├── scenario2_tae_no_exitosa.json               ← mock escenario 2
├── scenario3_pds_exitoso.json                  ← mock escenario 3
├── scenario4_pds_no_exitoso.json               ← mock escenario 4
│
├── ticket_1.png                                ← foto ticket real TAE/cancelación
├── ticket_2.png                                ← foto ticket real PDS
├── propuesta a_web.png / a_mobile.png          ← propuesta de diseño A
├── propuesta b_web.png / b_mobile.png          ← propuesta de diseño B
├── propuesta c_web.png / c_mobile.png          ← propuesta de diseño C
│
└── json-viewer/                                ← proyecto Angular
    └── src/
        ├── assets/Pack.png                     ← logo T-CONECTA
        └── app/
            ├── interfaces/
            │   ├── json-payload.ts             ← interfaces QpayResponse, TransactionData, etc.
            │   └── ticket.ts                   ← interface TicketData (para el componente UI)
            ├── services/
            │   ├── json-data.service.ts        ← servicio HTTP real + mock con QpayResponse
            │   └── ticket.service.ts           ← convierte escenario → TicketData para el UI
            ├── pages/
            │   ├── ticket/                     ← COMPONENTE PRINCIPAL DEL TICKET (UI bonita)
            │   │   ├── ticket.component.ts
            │   │   ├── ticket.component.html
            │   │   └── ticket.component.css
            │   └── json-view/                  ← componente auxiliar (usa QpayResponse directo)
            │       ├── json-view.component.ts
            │       ├── json-view.component.html
            │       └── json-view.component.css
            ├── app-routing.module.ts
            ├── app.module.ts
            └── app.component.html
```

---

## Rutas configuradas

| URL | Escenario | Clase CSS badge |
|---|---|---|
| `/escenario_tae_exitosa` | TAE exitosa ✅ | `success` (verde) |
| `/escenario_tae_no_exitosa` | TAE no exitosa ❌ | `cancelled` (rojo) |
| `/escenario_pds_exitoso` | PDS exitoso ✅ | `success` (verde) |
| `/escenario_pds_no_exitoso` | PDS no exitoso ❌ | `cancelled` (rojo) |
| `/` | → redirect a tae_exitosa | - |

**IMPORTANTE:** El componente de UI activo es `TicketComponent` (NO `JsonViewComponent`).
Las rutas usan `data: { scenario: 'nombre_clave' }` y el servicio lee esa clave.

---

## Los 4 escenarios — estructura de cada JSON

### Escenario 1 — TAE exitosa
```
transaction: lleno
cancellation: null
tae: lleno (trxId y vendorReference tienen valor)
pds: null
```

### Escenario 2 — TAE no exitosa (cancelación)
```
transaction: lleno
cancellation: lleno (reversal=true)
tae: lleno (trxId="", vendorReference="" — vacíos indican fallo)
pds: null
```

### Escenario 3 — PDS exitoso
```
transaction: lleno
cancellation: null
tae: null
pds: lleno (vendorReference tiene UUID, ticketText1="Pago realizado exitosamente Auth: [uuid]")
```

### Escenario 4 — PDS no exitoso (cancelación)
```
transaction: lleno
cancellation: lleno (reversal=true)
tae: null
pds: lleno (vendorReference="", trxId=0, ticketText1="Pago no realizado...")
```

---

## Interfaces TypeScript (`json-payload.ts`)

### `QpayResponse` — Raíz
```typescript
qpay_response: string   // "true" | "false" (string, no boolean)
qpay_code: string       // "000" = aprobada
qpay_description: string
qpay_object: QpayObject[]
```

### `QpayObject`
```typescript
transaction:  TransactionData
cancellation: CancellationData | null
tae:          TaeData | null
pds:          PdsData | null
```

### `TransactionData` — campos clave
```typescript
companyName, address, merchantName (= "businessId customBusinessId")
folio, date, time, reference
iccAtc, paymentType  // "C" → se muestra como "ICC"
operationType        // "VENTA" | "CANCELACION"
businessId, customBusinessId, amount, auth
commision (sic — typo del API, una sola 'm')
```

### `CancellationData` — campos clave
```typescript
// Mismos que TransactionData más:
clientVoucher, businessVoucher  // strings con tags @cnb @cnn etc.
operationType  // "CANCELACION"
amount         // negativo (ej: -150.00)
```

### `TaeData` — SOLO campos aprobados por el equipo
```typescript
dateTime: string         // "2026-08-27 10:15:30"
country: string          // "MEX"
amount: string           // "150.00" ← ES STRING
product: string          // puede venir vacío ""
vendorReference: string  // si vacío = recarga no procesada
mobileNumber: string
trxId: string            // ← ES STRING; si vacío = fallo
platformFee: number | null
transactionId: string    // ← ES STRING
reference: string
transactionLabel: string // mensaje del operador (ej: "Llame al 800...")
requestId: number
currency: string         // "MXN"
flatFee: string          // "00.0" ← ES STRING
```

**Campos excluidos de TAE** (no van en el JSON):
`authorizationNumber, customerId, channelId, extra, terminalId, providerAuth, timestamp, commission, accountNumber, bimboAward, bimboAwardMessage`

### `PdsData` — SOLO campos aprobados por el equipo
```typescript
dateTime: string
country: string          // "MEX"
amount: number           // ← ES NUMBER (no string)
vendorReference: string  // UUID si exitoso, "" si no
fee: number              // "C.T." en el ticket
accountNumber: string
trxId: number            // ← ES NUMBER; 0 si fallo
platformFee: number
transactionId: number    // ← ES NUMBER; 0 si fallo
ticketText1: string      // "Pago realizado exitosamente Auth: [uuid]" o error
ticketText2: string      // "SERVICIO OPERADO POR MONATO. FAVOR DE GUARDAR..."
requestId: number
currency: string         // "MXN"
commission: number
flatFee: number
```

**Campos excluidos de PDS** (no van en el JSON):
`surcharge, product, verificationDigit, billReference, accountNumber1/2/3, reference, mobileNumber, transactionLabel`

---

## Interface `TicketData` — para el componente UI

```typescript
merchantName:    string   // transaction.companyName
merchantAddress: string   // dirección línea 1+2
merchantCity:    string   // ciudad
operationType:   string   // texto del badge (ej: "RECARGA TAE EXITOSA")
operationClass:  'success' | 'pending' | 'cancelled'
comercio:        string   // `${businessId} / ${customBusinessId}`
transaccion:     string   // requestId de tae o pds
fechaHora:       string   // "DD-MM-YYYY · HH:MM:SS"
lote:            string   // "0" o "–" si no hay
rrn:             string   // cancellation.folio o transaction.folio
aplicacion:      string   // `${iccAtc} · ICC`
total:           number   // negativo si cancelación
currency:        string   // "MXN"
footerLine1:     string
footerLine2:     string
```

---

## Mapeo ticket visual → campos JSON

| Elemento en pantalla | Campo JSON |
|---|---|
| Nombre comercio | `transaction.companyName` |
| Dirección | `transaction.address` (parsear en 2-3 líneas) |
| Comercio: X/Y | `transaction.businessId / transaction.customBusinessId` |
| Transacción | `tae.requestId` o `pds.requestId` |
| Fecha y hora | `transaction.date` + `transaction.time` (cancelación: cancellation.date) |
| Lote | no existe en JSON → mostrar "0" o "–" |
| RRN | `cancellation.folio` si hay, si no `transaction.folio` |
| Aplicación | `transaction.iccAtc` + `"ICC"` (paymentType "C"→"ICC") |
| Badge tipo | derivado del escenario (éxito/cancelación + TAE/PDS) |
| TOTAL | `cancellation.amount` si hay, si no `transaction.amount` |
| PDS Monto | `pds.amount` (monto del servicio sin comisión) |
| PDS Comisión | `pds.commission` |
| PDS C.T. | `pds.fee` (Cobro por Transacción) |
| PDS Plataforma | `pds.platformFee` |
| PDS Auth msg | `pds.ticketText1` |
| PDS Operador msg | `pds.ticketText2` |
| TAE Número | `tae.mobileNumber` |
| TAE Monto | `tae.amount` |
| TAE Mensaje operador | `tae.transactionLabel` |

---

## Servicios

### `TicketService` (`ticket.service.ts`)
- Recibe el nombre del escenario (`'tae_exitosa'`, `'tae_no_exitosa'`, `'pds_exitoso'`, `'pds_no_exitoso'`)
- Devuelve `Observable<TicketData>` con datos hardcodeados (simulación)
- Es el servicio que usa `TicketComponent`

### `JsonDataService` (`json-data.service.ts`)
- `getData(ri)` → mock con datos de escenario 1 (TAE exitosa)
- `getDataFromApi(ri)` → HTTP real a `https://azappqa.t-conecta.app/service/api/v1/v/ticket/1?ri={ri}`
- Para activar el API real: en `json-view.component.ts` cambiar `getData` → `getDataFromApi`
- Es el servicio que usa `JsonViewComponent` (actualmente no está en la ruta principal)

---

## Cómo correr el proyecto

```bash
cd D:\json-web\json-viewer
ng serve
# Abre: http://localhost:4200
```

```bash
# Build producción
ng build --configuration production
```

```bash
# Crear componente
ng generate component pages/nombre --module=app

# Crear servicio
ng generate service services/nombre
```

---

## Diseño visual

El ticket usa `TicketComponent` con:
- **Fuente:** Inter / system sans-serif (NO monospace)
- **Fondo página:** `#dde2ef`
- **Tarjeta:** blanca, `border-radius: 18px`, sombra suave
- **Logo:** `src/assets/Pack.png` referenciado como `src="Pack.png"` en el template
- **Badge operación:** texto en color según clase (`success`=verde, `cancelled`=rojo)
- **Total:** `$` + número grande + `MXN` pequeño; rojo si es negativo
- **Responsive:** breakpoint 520px

Existen 3 propuestas de diseño en `D:\json-web\`:
- `propuesta a_web.png` / `propuesta a_mobile.png`
- `propuesta b_web.png` / `propuesta b_mobile.png`
- `propuesta c_web.png` / `propuesta c_mobile.png`

**El equipo aún no ha elegido cuál propuesta implementar.**

---

## Pendientes

- [ ] El equipo debe elegir una propuesta de diseño (A, B o C)
- [ ] Confirmar qué campo usar para "RRN" (¿`transaction.folio` o parámetro `ri` del URL?)
- [ ] Confirmar qué campo usar para "Lote"
- [ ] Confirmar mapeo de `transaccion` → ¿`tae.requestId`, `pds.requestId` o `transaction.folio`?
- [ ] Recibir endpoint real de la API del equipo
- [ ] Conectar el `TicketComponent` con la API real (actualmente usa datos hardcodeados)
- [ ] Configurar lectura del `?ri=` query param en producción
- [ ] Despliegue en Azure Static Web Apps (ver `AZURE_DEVOPS_DEPLOY.md`)

---

## Historial de cambios relevantes

| Fecha | Cambio |
|---|---|
| 2026-08-25 | Proyecto Angular base creado |
| 2026-08-31 | Interfaces reescritas con estructura real de QPay. Campos TAE/PDS aprobados por equipo (Bau). |
| 2026-09-01 | 4 JSONs de escenario actualizados con campos reales y tipos de datos correctos. `TicketComponent` identificado como componente principal. Routing restaurado a `/escenario_*`. |
