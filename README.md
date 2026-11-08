# Vacantes Aragón Formatter

[Español](README.es.md) | **English**

A web application for customizing and organizing Excel lists of teaching vacancies in Aragón, Spain. Choose which columns to display, adjust their appearance, highlight information with color rules, and download a newly sorted Excel file.

Designed to make vacancy lists easier to review and compare by subject area, province, working hours, and whether a vacancy is mandatory or voluntary.

## Features

- **Excel import**: upload `.xlsx` and `.xls` files using the file picker or drag and drop.
- **Column configuration**: show or hide columns, rename their headings, and reorder them by dragging.
- **Visual customization**: color controls for headers, cells, and text. Some settings currently differ between the preview and the exported file.
- **Color rules**: highlight an entire row or a single cell when a column matches a specified value.
- **Multi-level sorting**: set sorting priorities and choose ascending or descending order for each field.
- **Preview**: review the first 20 rows before downloading the result.
- **Excel export**: generates `vacantes_formateadas.xlsx`, containing a worksheet named `Resultado`, borders, and column widths adjusted to the content.
- **Travel distances and times**: optional Google Maps integration to add the distance and estimated driving time from a starting address to each school.

## Usage

1. Open the application and upload the vacancy list in Excel format.
2. Optionally, enable distance calculations, enter your starting address and a compatible API key, and run the calculation.
3. Review or update the color rules.
4. Configure the sorting criteria in order of priority.
5. Reorder columns, rename their headings, and hide any columns you do not need.
6. Check the preview and download the formatted Excel file.

### Input file format

The application reads **the first worksheet in the workbook**, with column headings in the first row and data underneath. Columns are detected from the first data row converted to JSON; make sure that row contains data in every column you want to import.

The initial configuration recognizes specific column names used in the vacancy lists. If your headings differ, you can configure the columns and rules manually.

Column names below remain in Spanish because they must match the source file.

| Column | Use in the initial configuration |
| --- | --- |
| `ESPECIALIDAD` | First sorting criterion |
| `PROVINCIA CENTRO` | Province-based colors and second sorting criterion |
| `JORNADA` | Working-hours colors and third sorting criterion |
| `OBLIGATORIEDAD` | Mandatory/voluntary colors and fourth sorting criterion |
| `LOCALIDAD` | Fifth sorting criterion |
| `ITINERANTE` | Colors based on its value |
| `NOMBRE CENTRO` | Destination identification for Google Maps |
| `IdVacante`, `Hash` | Initially hidden |

Initial rules and sorting criteria are only loaded when the corresponding column exists.

### Default color rules

Match values remain in Spanish to reflect the values expected in the source file.

| Field | Value | Applies to | Color |
| --- | --- | --- | --- |
| Province | Zaragoza | Row | `#FFC8C8` |
| Province | Huesca | Row | `#C8FFC8` |
| Province | Teruel | Row | `#C8C8FF` |
| Working hours | Parcial | Cell | `#E3B2B2` |
| Working hours | Completa | Cell | `#4BC4E1` |
| Mandatory/voluntary status | Voluntaria | Cell | `#00FF00` |
| Mandatory/voluntary status | Obligatoria | Cell | `#FF7028` |
| Travel between schools | Si | Cell | `#FFFF00` |
| Travel between schools | No | Cell | `#FF4028` |

Matching is exact after trimming leading and trailing whitespace and converting to lowercase. Accents matter: `Si` and `Sí` are different values. You can add, edit, or remove rules in the interface.

## Local installation

### Requirements

- Node.js 20.9 or later, compatible with Next.js 16. The Dockerfile uses Node.js 20.
- npm.
- Git, if you want to clone the repository.

```bash
git clone https://github.com/DavidBuenacasa/vacantes-aragon-formatter.git
cd vacantes-aragon-formatter
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The core functionality does not require API keys or environment variables.

### Running in production

```bash
npm run build
npm run start
```

### Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Starts the production server after building |
| `npm run lint` | Runs ESLint; its installation and configuration still need to be completed |

## Docker

The repository includes a multi-stage Dockerfile using Next.js standalone output and a non-root runtime user.

From the project directory:

```bash
docker build -t vacantes-aragon-formatter .
docker run -d --name vacantes-aragon-formatter --restart unless-stopped -p 3000:3000 vacantes-aragon-formatter
```

Open [http://localhost:3000](http://localhost:3000), or `http://SERVER_IP:3000` if the application is running on another machine.

## Optional Google Maps integration

Travel calculations use the Google Maps **Distance Matrix** endpoint through the application's `/api/maps` route.

To use it:

1. Enter a Google Maps API key with access to the service used by this project.
2. Provide a starting address.
3. Run the calculation to add the `DISTANCIA KM` and `TIEMPO EN COCHE` columns.

The destination is constructed from `NOMBRE CENTRO`, `PROVINCIA CENTRO`, and Spain. Accuracy depends on Google identifying the school correctly. Rows without a school name receive `-`; requests that do not return a valid route receive `Error`.

The implementation makes one request per row containing a school name, even when multiple records refer to the same school. Usage depends on service access, quotas, and billing for the Google Maps account. See the [service documentation](https://developers.google.com/maps/documentation/distance-matrix/overview).

## Data handling

Excel parsing, configuration, preview, and file generation take place in the browser. This workflow does not send the Excel workbook to a project API.

If you use Google Maps, the application sends the starting address, the destination for each request, and the API key to the application server, which makes the request to Google. These parameters currently travel in the request URL and may appear in access logs.

The application also includes the Vercel Analytics component. Configuration and uploaded data are held in the page state: saving and restoring sessions or formatting profiles is not currently implemented.

## Technologies

| Technology | Purpose |
| --- | --- |
| Next.js 16 / App Router | Web application and server route for Google Maps |
| React 19 and TypeScript | User interface and application logic |
| Tailwind CSS 4 | Styling |
| shadcn/ui and Radix UI components | Interface elements |
| Lucide React | Icons |
| xlsx-js-style | Reading and exporting Excel files with styles |
| Docker | Container deployment |

## Project structure

| Path | Contents |
| --- | --- |
| `app/page.tsx` | Main page and workflow state |
| `app/api/maps/route.ts` | Requests to Google Maps |
| `components/vacantes/` | Upload, rules, sorting, maps, preview, and export |
| `components/column-config.tsx` | Column appearance and visibility settings |
| `components/data-preview.tsx` | Preview table |
| `components/ui/` | Reusable interface components |
| `lib/defaults.ts` | Default colors, columns, and rules |
| `lib/excel-utils.ts` | Sorting and Excel generation |
| `locales/es.json` | Spanish interface text |
| `types/index.ts` | Conditional-rule and sorting types |

## Author

[David Buenacasa](https://github.com/DavidBuenacasa).

## License

The repository does not currently include a `LICENSE` file. Terms for use, modification, and redistribution have yet to be specified by the author.
