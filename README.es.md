**Español** | [English](README.en.md)

# Vacantes Aragón Formatter
Aplicación web para personalizar y organizar los listados Excel de vacantes educativas de Aragón. Permite elegir qué columnas mostrar, cambiar su presentación, destacar información con reglas de color y descargar un nuevo archivo Excel ordenado.

Pensada para facilitar la consulta de vacantes y comparar aspectos como la especialidad, la provincia, la jornada o la obligatoriedad de cada plaza.

## Funcionalidades

- **Importación de Excel**: carga de archivos `.xlsx` y `.xls`, mediante selección o arrastrándolos a la aplicación.
- **Configuración de columnas**: mostrar u ocultar columnas, cambiar sus títulos y reorganizarlas mediante arrastre.
- **Personalización visual**: controles de color para cabeceras, celdas y texto, con las limitaciones de aplicación indicadas más abajo.
- **Reglas de color**: destacar una fila completa o una celda cuando una columna coincida con un valor.
- **Ordenación por varios criterios**: definir prioridades y elegir orden ascendente o descendente para cada campo.
- **Vista previa**: consultar las primeras 20 filas antes de descargar el resultado.
- **Exportación a Excel**: genera `vacantes_formateadas.xlsx`, con una hoja llamada `Resultado`, bordes y anchos de columna ajustados al contenido.
- **Distancias y tiempos de viaje**: integración opcional con Google Maps para añadir la distancia y el tiempo estimado en coche desde una dirección de origen hasta los centros.

## Uso

1. Abre la aplicación y carga el listado de vacantes en formato Excel.
2. Opcionalmente, activa el cálculo de distancias, introduce tu dirección de origen y una clave de API compatible, y ejecuta el cálculo.
3. Revisa o modifica las reglas de color.
4. Configura los criterios de ordenación por prioridad.
5. Reorganiza las columnas, cambia sus títulos y oculta las que no necesites.
6. Comprueba la vista previa y descarga el Excel formateado.

### Formato del archivo de entrada

La aplicación utiliza **la primera hoja del libro**, con los encabezados en la primera fila y los datos debajo. Las columnas se detectan a partir de la primera fila de datos convertida a JSON; procura que esa fila tenga información en todas las columnas que quieras importar.

La configuración inicial reconoce nombres concretos de los listados de vacantes. Si los encabezados son diferentes, puedes configurar las columnas y reglas manualmente.

| Columna | Uso en la configuración inicial |
| --- | --- |
| `ESPECIALIDAD` | Primer criterio de ordenación |
| `PROVINCIA CENTRO` | Colores por provincia y segundo criterio de ordenación |
| `JORNADA` | Colores por jornada y tercer criterio de ordenación |
| `OBLIGATORIEDAD` | Colores por obligatoriedad y cuarto criterio de ordenación |
| `LOCALIDAD` | Quinto criterio de ordenación |
| `ITINERANTE` | Colores según su valor |
| `NOMBRE CENTRO` | Identificación del destino para Google Maps |
| `IdVacante`, `Hash` | Ocultas inicialmente |

Las reglas y los criterios de ordenación iniciales solo se cargan cuando existe la columna correspondiente.

### Reglas de color iniciales

| Campo | Valor | Aplicación | Color |
| --- | --- | --- | --- |
| Provincia | Zaragoza | Fila | `#FFC8C8` |
| Provincia | Huesca | Fila | `#C8FFC8` |
| Provincia | Teruel | Fila | `#C8C8FF` |
| Jornada | Parcial | Celda | `#E3B2B2` |
| Jornada | Completa | Celda | `#4BC4E1` |
| Obligatoriedad | Voluntaria | Celda | `#00FF00` |
| Obligatoriedad | Obligatoria | Celda | `#FF7028` |
| Itinerante | Si | Celda | `#FFFF00` |
| Itinerante | No | Celda | `#FF4028` |

La coincidencia es exacta tras eliminar espacios al principio y al final y convertir a minúsculas. Los acentos sí cuentan: `Si` y `Sí` son valores diferentes. Puedes añadir, modificar o eliminar reglas desde la interfaz.

## Instalación local

### Requisitos

- Node.js 20.9 o superior compatible con Next.js 16. El Dockerfile utiliza Node.js 20.
- npm.
- Git, si vas a clonar el repositorio.

```bash
git clone https://github.com/DavidBuenacasa/vacantes-aragon-formatter.git
cd vacantes-aragon-formatter
npm ci
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

La funcionalidad básica no necesita claves de API ni variables de entorno.

### Ejecución en producción

```bash
npm run build
npm run start
```

### Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la compilación de producción |
| `npm run start` | Inicia el servidor de producción después de compilar |
| `npm run lint` | Invoca ESLint; requiere completar su instalación y configuración |

## Docker

El repositorio incluye un Dockerfile de varias etapas, con salida standalone de Next.js y ejecución mediante un usuario sin privilegios de root.

Desde la carpeta del proyecto:

```bash
docker build -t vacantes-aragon-formatter .
docker run -d --name vacantes-aragon-formatter --restart unless-stopped -p 3000:3000 vacantes-aragon-formatter
```

Accede a [http://localhost:3000](http://localhost:3000) o a `http://IP_DEL_SERVIDOR:3000` si lo ejecutas en otro equipo.

## Google Maps opcional

El cálculo de trayectos utiliza el endpoint **Distance Matrix** de Google Maps a través de la ruta `/api/maps` de la aplicación.

Para utilizarlo:

1. Introduce una clave de Google Maps con acceso al servicio utilizado por el proyecto.
2. Indica una dirección de origen.
3. Ejecuta el cálculo para añadir las columnas `DISTANCIA KM` y `TIEMPO EN COCHE`.

El destino se construye con `NOMBRE CENTRO`, `PROVINCIA CENTRO` y España. La precisión depende de que Google identifique correctamente el centro. Las filas sin nombre de centro reciben `-`; las consultas que no devuelven un trayecto válido reciben `Error`.

La implementación realiza una consulta por fila con nombre de centro, incluso si varios registros corresponden al mismo centro. El uso depende del acceso, las cuotas y la facturación de la cuenta de Google Maps. Consulta la [documentación del servicio](https://developers.google.com/maps/documentation/distance-matrix/overview).

## Tratamiento de los datos

La lectura del Excel, la configuración, la vista previa y la generación del archivo se realizan en el navegador. Este flujo no envía el libro Excel a una API del proyecto.

Si utilizas Google Maps, la aplicación envía la dirección de origen, el destino de cada consulta y la clave de API al servidor de la aplicación, que realiza la petición a Google. Actualmente esos parámetros viajan en la URL de la petición y pueden aparecer en registros de acceso.

La aplicación también incluye el componente de Vercel Analytics. La configuración y los datos cargados se mantienen en el estado de la página: no hay una función implementada para guardar y recuperar sesiones o perfiles de formato.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| Next.js 16 / App Router | Aplicación web y ruta de servidor para Google Maps |
| React 19 y TypeScript | Interfaz y lógica de la aplicación |
| Tailwind CSS 4 | Estilos |
| Componentes shadcn/ui y Radix UI | Elementos de interfaz |
| Lucide React | Iconos |
| xlsx-js-style | Lectura y exportación de Excel con estilos |
| Docker | Despliegue en contenedor |

## Estructura del proyecto

| Ruta | Contenido |
| --- | --- |
| `app/page.tsx` | Página principal y estado del flujo de trabajo |
| `app/api/maps/route.ts` | Peticiones a Google Maps |
| `components/vacantes/` | Carga, reglas, ordenación, mapas, vista previa y exportación |
| `components/column-config.tsx` | Configuración visual y visibilidad de columnas |
| `components/data-preview.tsx` | Tabla de vista previa |
| `components/ui/` | Componentes de interfaz reutilizables |
| `lib/defaults.ts` | Colores, columnas y reglas iniciales |
| `lib/excel-utils.ts` | Ordenación y generación del Excel |
| `locales/es.json` | Textos de la interfaz en español |
| `types/index.ts` | Tipos de reglas condicionales y ordenación |

## Autor

[David Buenacasa](https://github.com/DavidBuenacasa).

## Licencia

El repositorio no incluye actualmente un archivo `LICENSE`. Las condiciones de uso, modificación y redistribución quedan pendientes de especificar por el autor.
