# Skill: Contexto del Proyecto json-viewer (T-CONECTA / Autovend)

## ¿Cuándo usar esta skill?
Invócala SIEMPRE al inicio de cualquier sesión en el proyecto `D:\json-web\`.
Contiene todo el contexto acumulado: objetivo, arquitectura, decisiones tomadas, campos, escenarios, cómo correrlo y pendientes.

---

## Objetivo del proyecto

App Angular que muestra un **ticket digital** (comprobante de pago) al escanear un código QR desde una terminal de punto de venta (Autovend / T-CONECTA).

### Flujo real (producción)
```
Cliente escanea QR en la terminal
         ↓
Celular abre URL: https://qa-portal-tickets-autovend-azure.app/init/{token}
         ↓
Angular lee el token del path /init/:token
         ↓
GET al servicio de Autovend con ese token (URL pendiente de confirmación)
         ↓
Responde con QpayResponse JSON
         ↓
mapQpayToTicket() → TicketData
         ↓
Muestra el ticket en pantalla
```

### Flujo local (desarrollo / pruebas)
```
http://localhost:4200/escenario_tae_exitosa   (o cualquier escenario)
         ↓
TicketService.getData('tae_exitosa')  ← datos hardcodeados
         ↓
Muestra el ticket de prueba
```

---

## Cómo instalar y correr el proyecto

### Requisitos previos
- Node.js instalado
- Angular CLI instalado (`npm install -g @angular/cli`)

### Instalación (primera vez)
```bash
cd D:\json-web\json-viewer
npm install
```

### Ejecutar en desarrollo
```bash
cd D:\json-web\json-viewer
ng serve
# Abre: http://localhost:4200
```

### Build producción
```bash
cd D:\json-web\json-viewer
ng build --configuration production
# Salida en: dist/json-viewer/
```

### Comandos útiles Angular CLI
```bash
ng generate component pages/nombre --module=app
ng generate service services/nombre
```

### Despliegue Azure
Ver `D:\json-web\AZURE_DEVOPS_DEPLOY.md` para instrucciones completas de pipeline CI/CD.

---

## Stack tecnológico

| Tecnología | Detalle |
|---|---|
| Angular | 19 — módulos tradicionales (NO standalone) |
| TypeScript | Tipado estricto |
| CSS | Puro, sin framework UI |
| HttpClientModule | Para llamadas HTTP |
| RxJS | Observable, of(), subscribe(), delay() |
| Logo | `src/assets/Pack.png` (T-CONECTA) |

---

## Estructura de carpetas

```
D:\json-web\
├── .devin/skills/contexto-proyecto/SKILL.md   ← ESTA SKILL (leer siempre)
├── AZURE_DEVOPS_DEPLOY.md                      ← guía despliegue Azure DevOps
├── campos_usados.txt                           ← notas y decisiones del equipo
├── semana_5_contexto.txt                       ← briefing original del equipo
├── cancellation_status_response.json           ← JSON referencia del equipo (Bau)
├── transaction_status_response_tae_example.json ← JSON TAE del API real (nuevo)
├── transaction_status_response_pds_example.json ← JSON PDS del API real (nuevo)
│
├── scenario1_tae_exitosa.json                  ← mock escenario 1
├── scenario2_tae_no_exitosa.json               ← mock escenario 2
├── scenario3_pds_exitoso.json                  ← mock escenario 3
├── scenario4_pds_no_exitoso.json               ← mock escenario 4
├── scenario5_tae_en_proceso.json               ← mock escenario 5
├── scenario6_pds_en_proceso.json               ← mock escenario 6
│
└── json-viewer/                                ← proyecto Angular
    └── src/app/
        ├── interfaces/
        │   ├── json-payload.ts    ← QpayResponse, TransactionData, CancellationData, TaeData, PdsData
        │   └── ticket.ts         ← TicketData (modelo de vista para el UI)
        ├── services/
        │   ├── json-data.service.ts  ← HTTP real + getDataByToken() para /init/:token
        │   └── ticket.service.ts     ← datos hardcodeados + mapQpayToTicket()
        ├── pages/
        │   ├── ticket/           ← COMPONENTE PRINCIPAL (el que se usa en producción)
        │   │   ├── ticket.component.ts
        │   │   ├── ticket.component.html
        │   │   └── ticket.component.css
        │   └── json-view/        ← componente auxiliar (NO está en rutas activas)
        ├── app-routing.module.ts
        ├── app.module.ts
        └── app.component.html
```

---

## Rutas configuradas (`app-routing.module.ts`)

| URL | Uso | Escenario |
|---|---|---|
| `/init/:token` | **PRODUCCIÓN** — token del QR → API real | dinámico |
| `/escenario_tae_exitosa` | Prueba | TAE exitosa ✅ verde |
| `/escenario_tae_no_exitosa` | Prueba | TAE cancelada ❌ rojo |
| `/escenario_pds_exitoso` | Prueba | PDS exitoso ✅ verde |
| `/escenario_pds_no_exitoso` | Prueba | PDS cancelado ❌ rojo |
| `/escenario_tae_en_proceso` | Prueba | TAE en proceso ◷ amarillo |
| `/escenario_pds_en_proceso` | Prueba | PDS en proceso ◷ amarillo |
| `/` | redirect a tae_exitosa | — |

---

## Los 6 escenarios — estructura del JSON

| # | Nombre | transaction | cancellation | tae | pds | Indicador extra |
|---|---|---|---|---|---|---|
| 1 | TAE exitosa | lleno | null | lleno | null | — |
| 2 | TAE no exitosa | lleno | lleno | lleno | null | cancellation.reversal=true |
| 3 | PDS exitoso | lleno | null | null | lleno | — |
| 4 | PDS no exitoso | lleno | lleno | null | lleno | cancellation.reversal=true |
| 5 | TAE en proceso | lleno | lleno | lleno | null | transaction.reference empieza con `"tae-"` |
| 6 | PDS en proceso | lleno | lleno | null | lleno | transaction.reference empieza con `"PS-"` |

### Lógica de detección de escenario (en `mapQpayToTicket`)
```typescript
ref.startsWith('tae-')            → TAE en proceso   (pending)
ref.startsWith('PS-')             → PDS en proceso   (pending)
tae !== null && cancellation === null  → TAE exitosa  (success)
tae !== null && cancellation !== null  → TAE cancelada (cancelled)
pds !== null && cancellation === null  → PDS exitoso  (success)
pds !== null && cancellation !== null  → PDS cancelado (cancelled)
```

---

## Interface `TicketData` — modelo de vista del ticket

```typescript
// Encabezado
companyName:     string   // transaction.companyName ("BLM QA")
merchantAddress: string   // transaction.address parte 1 (antes de ", ")
merchantCity:    string   // transaction.address parte 2 (después de ", ")

// Badge
operationType:   string   // texto del badge
operationClass:  'success' | 'pending' | 'cancelled'

// Filas del recibo
merchantName:    string   // transaction.merchantName ("0232321 1736940219")
autorizacion:    string   // transaction.auth o cancellation.auth
fechaHora:       string   // "DD-MM-YYYY · HH:MM:SS"
lote:            string   // "0" o "–" (no existe en JSON → placeholder)
folio:           string   // transaction.folio o cancellation.folio
aplicacion:      string   // `${iccAtc} · ICC`

// Total
total:           number   // negativo si cancelación
currency:        string   // "MXN"

// Pie (TAE)
footerLine1:     string   // "Firma no requerida." (estático)
footerLine2:     string   // tae.transactionLabel (mensaje del operador)

// Sección PDS — solo cuando hasPds = true
hasPds?:         boolean
pdsServiceName?: string   // nombre del servicio (ej: "Izzi") — SIN campo en JSON, hardcodeado
pdsMonto?:       number   // pds.amount
pdsComision?:    number   // pds.flatFee
pdsTotal?:       number   // pds.amount + pds.flatFee
pdsCurrency?:    string   // pds.currency
pdsTicketText1?: string   // pds.ticketText1
pdsTicketText2?: string   // pds.ticketText2
tienda?:         string   // transaction.companyName (mostrado al pie del ticket PDS)
```

---

## Mapeo visual ticket → campos JSON

| Elemento en pantalla | Campo JSON fuente |
|---|---|
| Logo | `src/assets/Pack.png` (estático) |
| Nombre empresa | `transaction.companyName` |
| Dirección línea 1 | `transaction.address.split(', ')[0]` |
| Ciudad | `transaction.address.split(', ')[1]` |
| Badge operación | derivado del escenario |
| Comercio | `transaction.merchantName` |
| **Autorización** | `transaction.auth` (exitosa) / `cancellation.auth` (cancelada) |
| Fecha y hora | `transaction.date + time` (exitosa) / `cancellation.date + time` (cancelada) |
| Lote | no existe → placeholder `"0"` o `"–"` |
| **Folio** | `transaction.folio` (exitosa) / `cancellation.folio` (cancelada) |
| Aplicación | `transaction.iccAtc + " · ICC"` |
| TOTAL | `cancellation.amount` si hay / `transaction.amount` si no |
| PDS: nombre servicio | hardcodeado (ej: "Izzi") |
| PDS: Monto | `pds.amount` |
| PDS: Comisión | `pds.flatFee` |
| PDS: TOTAL | `pds.amount + pds.flatFee` |
| PDS: texto auth | `pds.ticketText1` |
| PDS: texto operador | `pds.ticketText2` |
| PDS: Tienda | `transaction.companyName` |
| TAE: mensaje operador | `tae.transactionLabel` (bajo el TOTAL) |

### Textos de los badges por escenario
| Escenario | Texto badge |
|---|---|
| TAE exitosa | `RECARGA TAE EXITOSA` |
| TAE no exitosa | `SU RECARGA NO PUDO SER COMPLETADA, SE CANCELÓ SU TRANSACCIÓN` |
| PDS exitoso | `PAGO DE SERVICIO EXITOSO` |
| PDS no exitoso | `SU PAGO DE SERVICIO NO PUDO SER COMPLETADO, SE CANCELÓ SU TRANSACCIÓN` |
| TAE en proceso | `TAE EN PROCESO` |
| PDS en proceso | `PAGO DE SERVICIO EN PROCESO` |

---

## Interfaces TypeScript (`json-payload.ts`)

### Campos clave de `TransactionData`
```typescript
reference, amount, folio, auth, approved, cancel, reversal
companyName, address, merchantName
iccAtc, paymentType  // "C" → mostrar como "ICC"
date, time, operationType
```

### Campos clave de `CancellationData`
```typescript
reference, amount, folio, auth, reversal
companyName, address, merchantName, date, time
clientVoucher, businessVoucher  // strings con tags @cnb, @cnn
```

### `TaeData` — solo campos aprobados por el equipo
```typescript
dateTime, country, currency
amount: string        // ← ES STRING
requestId: number     // ← number (en el API real puede venir como string)
transactionLabel: string | null  // mensaje del operador, puede ser null
trxId: string, transactionId: string, flatFee: string  // todos strings
vendorReference, mobileNumber, product, platformFee, reference
```
**Campos excluidos de TAE:** `authorizationNumber, customerId, channelId, extra, terminalId, providerAuth, timestamp, commission, accountNumber, bimboAward, bimboAwardMessage`

### `PdsData` — solo campos aprobados por el equipo
```typescript
dateTime, country, currency
amount: number        // ← ES NUMBER (en el API real puede venir como string)
requestId: number, transactionId: number, trxId: number  // en API real pueden ser strings
flatFee: number, fee, platformFee, commission
ticketText1: string, ticketText2: string | null
vendorReference, accountNumber
```
**Campos excluidos de PDS:** `surcharge, product, verificationDigit, billReference, accountNumber1/2/3, reference, mobileNumber, transactionLabel`

---

## Servicios

### `TicketService` (`ticket.service.ts`)
- `getData(scenario)` → retorna `Observable<TicketData>` con datos **hardcodeados** para pruebas
- `mapQpayToTicket(response: QpayResponse): TicketData` → **función de mapeo real**. Convierte la respuesta del API a `TicketData`. Detecta el tipo de escenario automáticamente por los campos presentes y el prefijo del `reference`.

### `JsonDataService` (`json-data.service.ts`)
- `autovendApiUrl` → URL del servicio de Autovend (**pendiente de confirmar**)
- `getDataByToken(token)` → GET al servicio de Autovend con el token del QR. Usado por `/init/:token`
- `getDataFromApi(ri)` → GET a la URL de QA con `?ri=` (referencia interna de QA)
- `getData(ri)` → mock con datos de escenario 1 (TAE exitosa), útil para pruebas aisladas

### `TicketComponent` (`ticket.component.ts`)
- Si viene desde `/init/:token` → usa `JsonDataService.getDataByToken(token)` + `mapQpayToTicket()`
- Si viene desde `/escenario_*` → usa `TicketService.getData(scenario)` (hardcodeado)
- Getters de formato: `totalFormatted`, `pdsMontoFormatted`, `pdsComisionFormatted`, `pdsTotalFormatted`
- `opIcon` → `✓` (success), `×` (cancelled), `◷` (pending)

---

## Diseño visual

- **Fuente:** Inter / system sans-serif (NO monospace)
- **Fondo página:** `#dde2ef`
- **Tarjeta ticket:** blanca, `border-radius: 18px`, sombra suave
- **Logo:** `src/assets/Pack.png` referenciado como `src="Pack.png"` en el template
- **Badge:** verde (`success`), rojo (`cancelled`), amarillo (`pending`)
- **TOTAL:** `$` grande + número + `MXN` pequeño; rojo si es negativo
- **Responsive:** breakpoint 520px
- **Sección PDS:** aparece cuando `hasPds = true`. Incluye: nombre servicio, Monto, Comisión, TOTAL PDS, textos del ticket, separador dashed, Tienda, IMPORTANTE, "ESTE NO ES UN COMPROBANTE FISCAL."

---

## Conexión con API real — lo único que falta

En `json-data.service.ts` cambiar:
```typescript
// Actual (placeholder):
private autovendApiUrl = 'https://PENDIENTE.t-conecta.app/init';

// Por la URL real que provea el equipo:
private autovendApiUrl = 'https://url-real-del-servicio.app/endpoint';
```

Si el token no va como path param sino como query param, ajustar:
```typescript
// Opción path param (actual):
const url = `${this.autovendApiUrl}/${token}`;

// Opción query param:
const params = new HttpParams().set('token', token);
return this.http.get<QpayResponse>(this.autovendApiUrl, { params });
```

---

## Pendientes

- [ ] **Confirmar URL real del servicio de Autovend** con el equipo → reemplazar `autovendApiUrl`
- [ ] **Confirmar si el token va como path param o query param** en la llamada al servicio
- [ ] **Confirmar si requiere headers** (API key, Authorization) en la petición HTTP
- [ ] **Nombre del servicio PDS** ("Izzi") está hardcodeado — confirmar si vendrá en el JSON o siempre es fijo
- [ ] Despliegue en Azure Static Web Apps (ver `AZURE_DEVOPS_DEPLOY.md`)
- [ ] Manejar CORS si el servicio de Autovend no lo tiene habilitado para el browser

---

## Historial de cambios

| Cambio | Descripción |
|---|---|
| Base del proyecto | Angular 19, estructura de carpetas, interfaces QpayResponse |
| Escenarios 1–4 | JSONs de mock + TicketService hardcodeado |
| Interfaz TicketData | Modelo de vista separado del modelo de API |
| TicketComponent | Componente visual del ticket (CSS, HTML, responsive) |
| Sección PDS | Bloque específico: nombre servicio, Monto, Comisión, TOTAL, textos, Tienda, IMPORTANTE |
| Escenarios 5–6 | TAE en proceso y PDS en proceso (badge amarillo ◷) |
| Campos renombrados | `transaccion` → `autorizacion` (valor = `transaction.auth`) / `rrn` → `folio` (valor = `transaction.folio`) |
| Textos de cancelación | "SU RECARGA NO PUDO SER COMPLETADA..." y "SU PAGO DE SERVICIO NO PUDO SER COMPLETADO..." |
| Ruta `/init/:token` | Ruta de producción — lee token del path y llama al servicio |
| `mapQpayToTicket()` | Función de mapeo `QpayResponse → TicketData` implementada en `TicketService` |
| `getDataByToken()` | Método HTTP en `JsonDataService` para el servicio de Autovend |
| `autovendApiUrl` | Variable con URL pendiente — reemplazar cuando el equipo la confirme |
