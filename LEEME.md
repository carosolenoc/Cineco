# Encuesta UX · Compra de entradas de cine

Tres archivos para publicar y un script para Google Sheets:

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La encuesta (mobile-first, una pregunta por pantalla, ~4 min). |
| `resultados.html` | El tablero de resultados: gráficos, filtros por segmento, hallazgos automáticos y respuestas abiertas. |
| `apps-script.gs` | El receptor que guarda cada respuesta en tu Google Sheet. |

Mientras no conectes Google Sheets, la encuesta funciona en **modo vista previa** (muestra un aviso y, al final, los datos que enviaría). El tablero trae **datos de ejemplo ficticios** para que lo explores antes de lanzar.

---

## 1. Conectar Google Sheets (10 min)

1. Crea un Google Sheet nuevo (por ejemplo, «Encuesta cine – respuestas»).
2. Menú **Extensiones → Apps Script**. Borra lo que haya en `Code.gs` y pega todo `apps-script.gs`. Guarda.
3. **Implementar → Nueva implementación**. En el engranaje elige **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autoriza los permisos (Google mostrará una advertencia porque el script es tuyo y no está verificado: «Configuración avanzada → Ir a…»).
5. Copia la URL que termina en `/exec`. Si la abres en el navegador debe decir «El receptor de la encuesta está activo».
6. Abre `index.html` con un editor de texto y pégala en:
   ```js
   const CONFIG = {
     ENDPOINT: "https://script.google.com/macros/s/…/exec",
   ```

El script crea la hoja **Respuestas** con la primera respuesta: una fila por persona. La encuesta no pide nombre ni correo, así que las respuestas son anónimas.

> Si más adelante editas el script: Implementar → Gestionar implementaciones → editar → Versión: «Nueva versión». La URL no cambia.

## 2. Publicar la encuesta

Cualquier hosting estático gratuito sirve. Dos opciones sencillas:
- **Netlify**: crea una cuenta, entra a app.netlify.com/drop y arrastra la carpeta con `index.html` y `resultados.html`.
- **GitHub Pages**: sube los archivos a un repositorio y activa Pages en Settings.

Comparte un enlace distinto por canal para saber de dónde viene cada respuesta (aparece como filtro «Fuente» en el tablero):
```
https://tu-sitio.netlify.app/?src=instagram
https://tu-sitio.netlify.app/?src=whatsapp
https://tu-sitio.netlify.app/?src=linkedin
```

## 3. Ver los resultados

**Opción A, en vivo:** en el Google Sheet, **Archivo → Compartir → Publicar en la web** → elige la hoja **Respuestas** y el formato **CSV** → Publicar. Pega ese enlace en `resultados.html`:
```js
const CONFIG = {
  DATA_URL: "https://docs.google.com/spreadsheets/d/e/…/pub?gid=…&single=true&output=csv",
```
Google tarda unos minutos en refrescar el CSV publicado; usa el botón «Actualizar».
Ojo: quien tenga ese enlace puede ver las respuestas (son anónimas). No lo publiques en redes.

**Opción B, manual:** en el Sheet, Archivo → Descargar → CSV (hoja Respuestas) y súbelo en el tablero con «Fuente de datos → Subir un archivo CSV». También sirve si el enlace publicado no carga.

Para ver los datos de ejemplo directamente: `resultados.html?ejemplo`.

---

## Cómo se condensaron tus 22 preguntas en 15 pantallas

La mayoría se volvieron de opción múltiple para poder contarlas y cruzarlas entre segmentos; las abiertas quedan al final. Las listas largas se muestran en orden aleatorio para cada persona (evita que la primera opción gane solo por estar arriba).

| # | Pregunta en la encuesta | Tus preguntas que cubre | Decisión de UX que respalda |
|---|---|---|---|
| 1 | ¿Con qué frecuencia vas a cine? | (nueva, para segmentar) | Optimizar para recompra rápida vs. orientación |
| 2 | ¿A qué cines sueles ir? + ciudad | A qué cine sueles ir | Referentes de la competencia; representatividad |
| 3 | ¿Dónde compras? (web, taquilla, autoservicio u otro) + ¿Tienes Tarjeta Cineco? | Dónde compras tus entradas | Peso de la web frente a lo presencial; activa la pregunta de saldo |
| 4 | Escenario: viernes, 7 p. m., ¿por dónde empiezas? | Qué haces para ver qué hay hoy · Cómo esperas la cartelera · Película para hoy a las 7 p. m. | Arquitectura de la cartelera: película, cine u hora primero |
| 5 | Lo primero que buscas en una película | Qué información buscas primero | Jerarquía de la ficha de película |
| 6 | ¿Qué entiendes por «Preventa»? | Diferencia entre ver ahora y aún no disponible | Si renombrar o explicar estados |
| 7 | ¿Te ha pasado que parecía disponible y no? + qué pasó | Película que parecía disponible · Cómo sabes si tiene funciones | Qué estados distinguir visualmente |
| 8 | Filtros que usarías (hasta 3) | Qué te gustaría filtrar | Filtros visibles por defecto vs. «Más filtros» |
| 9 | 5 datos de una función | Información antes de comprar · Factores para elegir función · Cinco datos · Importancia de los puestos | Contenido de la tarjeta de función |
| 10 | ¿Con qué medios de pago te gustaría pagar? (varios, con «Otro ¿cuál?») + ¿Has tenido algún problema con tus medios de pago? + qué pasó | Reemplaza «cuándo conocer cuánto tienes» y «cómo compruebas el saldo»: el saldo ya es visible; el problema es el medio de pago | Qué medios de pago ofrecer; si el pago es un punto de falla |
| 11 | Si te ha tocado recargar la Tarjeta Cineco para terminar una compra + qué hiciste *(solo con tarjeta)* | (nueva) | Costo de obligar a pagar con el saldo: compras perdidas o desviadas |
| 12 | ¿Saliste de la compra para resolver algo? + para qué (incluye «recargar mi Tarjeta Cineco») | Salir del proceso y volver | Qué traer dentro del flujo |
| 13 | Comida durante la compra + por qué | Opinión sobre ofrecer comida · ¿Saltarla? ¿Por qué? | Ubicación de la confitería |
| 14 | Lo más frustrante (hasta 3) | Lo más frustrante de comprar online | Backlog priorizado de fricciones |
| 15 | Una cosa que cambiarías | Cambiar una sola cosa · Qué debería permitirte hacer | Ideas y temas emergentes |

**Se quedaron fuera a propósito** (funcionan mejor en entrevista): «¿Por qué esas cosas serían importantes para ti?» y la versión abierta de «¿qué debería permitirte hacer?».

## Antes de lanzar

- **Piloto:** pídele a 5 personas que la respondan mientras las observas. Si alguna tarda más de 6 minutos o duda en una pregunta, ajústala.
- **Muestra:** apunta a 100+ respuestas. Para comparar segmentos (p. ej., web vs. taquilla, o celular vs. computador) necesitas idealmente 30+ por grupo; el tablero no muestra diferencias de grupos con menos de 12.
- **Calidad:** el tablero excluye por defecto las respuestas de menos de 60 s (respuestas al azar).
- **Después:** toma las «diferencias entre segmentos» como hipótesis y valídalas en 5–8 entrevistas.

## Si cambias preguntas

Las preguntas están definidas en el bloque `SURVEY`, que aparece idéntico en `index.html` y en `resultados.html`. Si editas una pregunta u opción, haz el mismo cambio en ambos archivos para que el tablero la reconozca. Las respuestas con opciones que no estén en la lista igual aparecen en los gráficos.
