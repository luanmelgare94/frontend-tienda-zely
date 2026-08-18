# Tienda Zely — Frontend

Interfaz web de administración para **Tienda Zely**. Aplicación estática con HTML, JavaScript y el template **AdminLTE 3**.

## Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| HTML5 / CSS3 | Vistas |
| JavaScript (ES5+) | Lógica de pantalla |
| jQuery 3.5 | DOM y AJAX |
| Axios | Peticiones HTTP (módulos principales) |
| SweetAlert2 | Alertas y loaders |
| AdminLTE 3 | Layout, sidebar y componentes |
| Bootstrap 4 | Estilos y modales |

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox)
- [Node.js](https://nodejs.org/) (solo para servir archivos estáticos)
- Backend en ejecución (ver [backend-tienda-zely](../backend-tienda-zely))

## Configuración

La URL del API se define en `js/config.js`:

```javascript
const AppConfig = {
    API_BASE_URL: 'http://localhost:8546',
    APP_NAME: 'Tienda Zely'
};
```

Ajusta `API_BASE_URL` si el backend corre en otro host o puerto.

## Ejecución

> **Importante:** No abras los archivos HTML directamente con `file://`. El layout carga `partials/` vía `fetch`, lo cual requiere un servidor HTTP.

Desde la raíz del proyecto:

```bash
npx serve .
```

Abre en el navegador la URL que indique el servidor (por ejemplo `http://localhost:3000`) y entra a `dashboard.html`.

## Estructura del proyecto

```
frontend-tienda-zely/
├── css/                 # Estilos (AdminLTE, Bootstrap, alertas)
├── js/
│   ├── config.js        # URL del API
│   ├── api.js           # Utilidades HTTP (loader, errores, fechas)
│   ├── layout.js        # Carga navbar/sidebar y menú activo
│   ├── dashboard.js
│   ├── productos.js
│   ├── clientes.js
│   ├── reg_ventas.js
│   ├── ventas.js
│   ├── cuenta_cliente.js
│   └── numero_serie.js
├── partials/
│   ├── navbar.html
│   └── sidebar.html
├── images/
├── dashboard.html
├── productos.html
├── clientes.html
├── reg_ventas.html
├── ventas.html
├── cuenta_cliente.html
└── numero_serie.html
```

## Pantallas

| Página | Descripción |
|--------|-------------|
| `dashboard.html` | Panel con estadísticas |
| `productos.html` | CRUD de productos, CSV masivo, números de serie por producto |
| `clientes.html` | CRUD de clientes |
| `reg_ventas.html` | Registro de ventas |
| `ventas.html` | Consulta y anulación de ventas |
| `cuenta_cliente.html` | Cuentas por cobrar de clientes |
| `numero_serie.html` | Consulta de producto por lector de código de barras |

## Layout compartido

Cada página incluye `data-page` en el `<body>` y carga `layout.js`, que:

1. Inserta `partials/navbar.html` y `partials/sidebar.html`.
2. Marca el ítem activo del menú según `data-page`.
3. Reinicializa plugins de AdminLTE (Treeview, PushMenu).
4. Llama a `window.inicio()` si la página lo define.

## Utilidades (`js/api.js`)

| Función | Descripción |
|---------|-------------|
| `Api.url(path)` | Construye la URL completa del endpoint |
| `Api.showLoader(msg)` | Muestra loader con SweetAlert2 |
| `Api.flashSuccess(msg)` | Mensaje de éxito breve |
| `Api.flashInfo(msg)` | Mensaje informativo |
| `Api.handleError(error)` | Muestra errores del API (Axios o jQuery) |
| `Api.formatDateTime(date)` | Formato `dd/mm/yyyy hh:mm:ss` |

## Productos — CSV masivo

- **Registrar:** formato `nombre|codigoTipoProducto|precio` (3 columnas).
- **Actualizar:** formato `codigoProducto|nombre|codigoTipoProducto|precio` (igual al CSV descargado).
- Separador: `|` (pipe).
- Los errores de validación del backend se muestran en pantalla con detalle por fila.

## Número de serie — lector de barras

En `numero_serie.html` el lector escribe en un input oculto (`#input-serial-capture`). Al recibir **Enter**, consulta el producto y muestra nombre y precio.

**Uso:**

1. Haz clic en el área de la tarjeta para dar foco a la página.
2. Escanea el código de barras.
3. El resultado aparece debajo con anuncio por voz (si el navegador lo permite).

En `productos.html`, el modal de información del producto también permite registrar series con el lector.

## Desarrollo

- Cada módulo tiene su propio `.html` + `.js`.
- Las peticiones usan Axios (`.then/.catch`) o jQuery `$.ajax` según el módulo.
- Los errores del API con `message` y `fieldErrors` se manejan con `Api.handleError`.

## Proyecto relacionado

Backend: [backend-tienda-zely](../backend-tienda-zely)
