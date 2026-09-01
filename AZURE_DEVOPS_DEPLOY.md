# Guía de despliegue — Azure DevOps
### Proyecto: `json-viewer` (Angular 19)

---

## ¿Qué es Azure DevOps?

Es la plataforma de Microsoft para alojar código y automatizar despliegues.  
Tiene 3 partes que vamos a usar:

| Parte | Para qué sirve |
|---|---|
| **Azure Repos** | Guardar el código (como GitHub) |
| **Azure Pipelines** | Compilar y desplegar automáticamente |
| **Azure Static Web Apps** | Donde vive la app Angular en internet |

---

## Qué necesitas antes de empezar

### Cuentas (gratuitas)
- [ ] Cuenta Microsoft (Outlook, Hotmail, etc.) — si no tienes, créala en [account.microsoft.com](https://account.microsoft.com)
- [ ] Cuenta Azure — [portal.azure.com](https://portal.azure.com) → "Start free" (incluye $200 USD de crédito)
- [ ] Organización Azure DevOps — [dev.azure.com](https://dev.azure.com) → "Start free"

### Instalado en tu PC
- [ ] **Git** — [git-scm.com/downloads](https://git-scm.com/downloads)
- [ ] **Node.js 20** — [nodejs.org](https://nodejs.org) (versión LTS)
- [ ] **Angular CLI** — en terminal: `npm install -g @angular/cli`
- [ ] **Azure CLI** (opcional pero útil) — [learn.microsoft.com/cli/azure/install](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows)

---

## PASO 1 — Crear la organización en Azure DevOps

1. Ve a [dev.azure.com](https://dev.azure.com)
2. Inicia sesión con tu cuenta Microsoft
3. Clic en **"New organization"**
4. Nombre de organización: `mi-empresa` (el que quieras)
5. Clic en **"Continue"**

---

## PASO 2 — Crear el proyecto

1. Dentro de tu organización, clic en **"New project"**
2. Llena:
   - **Project name:** `json-viewer`
   - **Visibility:** Private
   - **Version control:** Git
3. Clic en **"Create"**

---

## PASO 3 — Subir el código a Azure Repos

Abre una terminal en la carpeta `D:\json-web` y ejecuta estos comandos **uno por uno**:

```bash
# 1. Inicializar git en la carpeta del proyecto
cd D:\json-web
git init

# 2. Agregar todos los archivos (excepto node_modules)
git add .

# 3. Primer commit
git commit -m "Initial commit - Angular json-viewer"

# 4. Conectar con Azure Repos
#    (La URL la obtienes en Azure DevOps → tu proyecto → Repos → Clone)
git remote add origin https://mi-empresa@dev.azure.com/mi-empresa/json-viewer/_git/json-viewer

# 5. Subir el código
git push -u origin main
```

> **Dónde encontrar la URL exacta:**  
> Azure DevOps → tu proyecto → **Repos** (menú izquierdo) → botón **"Clone"** → copias la URL HTTPS

---

## PASO 4 — Crear el archivo `.gitignore`

Antes del `git add .`, asegúrate de tener este archivo en `D:\json-web` para no subir archivos innecesarios:

**Archivo: `D:\json-web\.gitignore`**
```
# Node
node_modules/
npm-debug.log*

# Angular build
/json-viewer/dist/
/json-viewer/.angular/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

---

## PASO 5 — Crear el recurso en Azure (Static Web App)

1. Ve a [portal.azure.com](https://portal.azure.com)
2. Busca **"Static Web Apps"** en la barra de búsqueda
3. Clic en **"+ Create"**
4. Llena el formulario:
   - **Subscription:** el que tienes (Free o Pay-as-you-go)
   - **Resource group:** Crear nuevo → `rg-json-viewer`
   - **Name:** `json-viewer-app`
   - **Plan type:** Free
   - **Region:** East US 2 (o el más cercano a México)
   - **Source:** `Other` (porque usaremos Azure DevOps Pipelines manualmente)
5. Clic en **"Review + create"** → **"Create"**
6. Cuando termine, ve al recurso y copia el **Deployment Token**:
   - Dentro del recurso → **"Manage deployment token"**
   - Copia ese token, lo necesitas en el siguiente paso

---

## PASO 6 — Agregar el token como secreto en Azure DevOps

1. Ve a Azure DevOps → tu proyecto → **Pipelines** → **Library**
2. Clic en **"+ Variable group"**
3. Nombre del grupo: `json-viewer-secrets`
4. Agrega variable:
   - **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value:** pega el token que copiaste en el paso anterior
   - Activa el candado 🔒 (para que sea secreto)
5. Clic en **"Save"**

---

## PASO 7 — Crear el Pipeline (CI/CD)

Crea este archivo en la raíz del proyecto:

**Archivo: `D:\json-web\azure-pipelines.yml`**
```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  - group: json-viewer-secrets

stages:

  # ── ETAPA 1: Compilar la app Angular ───────────────────────────────────
  - stage: Build
    displayName: 'Build Angular App'
    jobs:
      - job: BuildJob
        displayName: 'Install & Build'
        steps:

          - task: NodeTool@0
            displayName: 'Instalar Node.js 20'
            inputs:
              versionSpec: '20.x'

          - script: npm install
            displayName: 'npm install'
            workingDirectory: '$(System.DefaultWorkingDirectory)/json-viewer'

          - script: npm run build -- --configuration production
            displayName: 'ng build --prod'
            workingDirectory: '$(System.DefaultWorkingDirectory)/json-viewer'

          - task: PublishBuildArtifacts@1
            displayName: 'Publicar artefactos'
            inputs:
              pathToPublish: '$(System.DefaultWorkingDirectory)/json-viewer/dist/json-viewer/browser'
              artifactName: 'drop'

  # ── ETAPA 2: Desplegar en Azure Static Web Apps ────────────────────────
  - stage: Deploy
    displayName: 'Deploy to Azure'
    dependsOn: Build
    jobs:
      - job: DeployJob
        displayName: 'Deploy'
        steps:

          - download: current
            artifact: drop

          - task: AzureStaticWebApp@0
            displayName: 'Deploy to Azure Static Web Apps'
            inputs:
              app_location: '$(Pipeline.Workspace)/drop'
              skip_app_build: true
              azure_static_web_apps_api_token: $(AZURE_STATIC_WEB_APPS_API_TOKEN)
```

Luego sube este archivo al repositorio:
```bash
git add azure-pipelines.yml
git commit -m "Add Azure DevOps pipeline"
git push
```

---

## PASO 8 — Activar el Pipeline en Azure DevOps

1. Ve a Azure DevOps → **Pipelines** → **"New pipeline"**
2. Selecciona **"Azure Repos Git"**
3. Selecciona tu repositorio `json-viewer`
4. Selecciona **"Existing Azure Pipelines YAML file"**
5. En "Path" selecciona: `/azure-pipelines.yml`
6. Clic en **"Continue"** → **"Run"**

El pipeline empezará a correr. Verás las etapas en tiempo real:
```
✅ Build Angular App  →  ✅ Deploy to Azure
```

---

## PASO 9 — Ver la app desplegada

1. Ve al portal de Azure → **Static Web Apps** → `json-viewer-app`
2. En la página del recurso verás la **URL pública**, algo como:
   ```
   https://jolly-river-0a1b2c.azurestaticapps.net
   ```
3. Abre esa URL y verás tu ticket en:
   ```
   https://jolly-river-0a1b2c.azurestaticapps.net/escenario_tae_exitosa
   https://jolly-river-0a1b2c.azurestaticapps.net/escenario_tae_no_exitosa
   https://jolly-river-0a1b2c.azurestaticapps.net/escenario_pds_exitoso
   https://jolly-river-0a1b2c.azurestaticapps.net/escenario_pds_no_exitoso
   ```

---

## PASO 10 — Configurar rutas de Angular (importante)

Angular usa rutas del lado del cliente. Azure Static Web Apps necesita saber que todas las rutas deben redirigir al `index.html`.

Crea este archivo en `D:\json-web\json-viewer\src`:

**Archivo: `D:\json-web\json-viewer\src\staticwebapp.config.json`**
```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.css", "/*.js", "/*.ico"]
  }
}
```

Y agrégalo al `git`:
```bash
git add .
git commit -m "Add Azure Static Web Apps routing config"
git push
```

> Sin este archivo, al refrescar la página directamente en una URL como `/escenario_tae_exitosa` dará error 404.

---

## Flujo completo de trabajo (después de configurarlo)

Una vez configurado, cada vez que hagas cambios:

```bash
# 1. Haces tus cambios en el código
# 2. Subes a Azure Repos
git add .
git commit -m "descripción del cambio"
git push

# 3. El pipeline se activa automáticamente
# 4. En ~3-5 minutos la app ya está actualizada en producción ✅
```

---

## Resumen de costos

| Recurso | Costo |
|---|---|
| Azure DevOps (hasta 5 usuarios) | **Gratis** |
| Azure Static Web Apps (Free plan) | **Gratis** |
| Azure Repos | **Gratis** |
| Pipeline minutes (2,000 min/mes) | **Gratis** |

**Costo total estimado: $0 USD/mes** para este proyecto.

---

## Problemas comunes

| Error | Solución |
|---|---|
| `403 Forbidden` al hacer push | Ve a Azure DevOps → User settings → Personal Access Tokens → genera uno nuevo |
| Pipeline falla en `npm install` | Verifica que `workingDirectory` apunte a la carpeta `json-viewer` |
| Error 404 al refrescar rutas | Asegúrate de haber creado el `staticwebapp.config.json` |
| Token inválido | Regénera el Deployment Token en Azure Portal y actualiza la variable |
