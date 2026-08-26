# Contexto del Proyecto: json-viewer

## Objetivo General
Aplicación Angular que consume un JSON desde una API (enviado por el equipo)
y muestra la información en pantalla de forma dinámica según el tipo y estado del payload.

Ejemplos de casos: pago exitoso, error de pago, notificación, etc.

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
        │   └── json-payload.ts           ← tipado del JSON recibido
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

## Interfaz `JsonPayload`
```typescript
{
  type: string;                    // 'payment', 'error', 'notification', etc.
  status: string;                  // 'success', 'error', 'pending', 'warning'
  id?: string;
  message?: string;
  data?: Record<string, any>;      // Datos dinámicos según el tipo
  timestamp?: string;
}
```

---

## Flujo de la aplicación
1. El usuario entra a `/view/:id` (el ID puede venir de un link externo o query)
2. `JsonViewComponent.ngOnInit()` lee el `:id` desde `ActivatedRoute`
3. Llama a `JsonDataService.getData(id)`
4. Mientras espera → muestra **estado de carga** (spinner)
5. Si responde OK → muestra **payload** con tipo, status, mensaje y datos
6. Si falla → muestra **estado de error** con botón de reintento

---

## Servicio `JsonDataService`
- `getData(id)` — **simulado con `of()`** + delay de 1.5s (modo desarrollo)
- `getDataFromApi(id)` — **llamada HTTP real** a `apiUrl/{id}` (activar cuando el equipo dé el endpoint)
- Para cambiar de simulado a real: en `json-view.component.ts` línea del subscribe, cambiar `getData` → `getDataFromApi`

---

## Estados de pantalla implementados
| Estado    | Clase CSS         | Color de borde |
|-----------|-------------------|----------------|
| success   | `status-success`  | Verde          |
| error     | `status-error`    | Rojo           |
| pending   | `status-pending`  | Amarillo       |
| warning   | `status-warning`  | Naranja        |
| (default) | `status-default`  | Gris           |

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
- [ ] Definir los tipos exactos del JSON que mandará el equipo (ajustar interfaz `JsonPayload`)
- [ ] Crear vistas específicas por `type` (ej: vista de pago, vista de error, etc.)
- [ ] Agregar estilos o un diseño más cercano al que el equipo espera
- [ ] Evaluar si se necesita manejo de Query Params además de Route Params

---

## Historial de cambios
| Fecha       | Descripción                                           |
|-------------|-------------------------------------------------------|
| 2026-08-25  | Proyecto Angular base creado, estructura inicial lista |
