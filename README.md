# OXXEO — Explorador arquitectónico

Visor 3D interactivo de OXXEO, el edificio de Rafael de La-Hoz en Las Tablas, Madrid. Recreación interpretativa con geometría procedural, no un modelo BIM ni un levantamiento de dimensiones certificadas.

## Desarrollo

Requiere Node.js 22.12 o posterior.

```sh
npm ci
npm run dev
```

`npm run build` comprueba TypeScript y genera `dist/`. `npm run preview` sirve la compilación localmente.

## Despliegue en GitHub Pages

En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions** como origen.
El workflow `.github/workflows/deploy-pages.yml` compila y publica el sitio con cada push a `main`;
también puede ejecutarse manualmente desde **Actions → Deploy to GitHub Pages → Run workflow**.
La primera publicación requiere que el workflow esté en `main`.

El sitio estará disponible en https://jofaval.github.io/oxxeo-building/.
La compilación usa la ruta base proporcionada por GitHub Pages para que JavaScript, CSS y el
favicon funcionen tanto bajo `/oxxeo-building/` como con un dominio personalizado.

Para comprobar localmente la compilación con la ruta del repositorio:

```sh
npm run build -- --base /oxxeo-building/
npm run preview
```

Abre la URL del servidor de preview con la ruta `/oxxeo-building/`.

## Explorar

- Arrastrar o deslizar para orbitar; rueda o pellizco para acercar.
- Con el visor enfocado: flechas para orbitar y `+` / `-` para zoom.
- Vistas perspectiva, frontal, lateral y aérea; luz diurna, atardecer y noche.
- Rotación automática, maqueta blanca, pantalla completa y captura PNG.
- Interfaz adaptable y aviso si WebGL no está disponible.

El modelo no descarga texturas ni modelos externos. Las tipografías de Google Fonts son opcionales y tienen alternativas locales.

## Referencias

Datos arquitectónicos y fotografías consultados en la [ficha oficial de GMP](https://grupogmp.com/oficina/oxxeo/). La búsqueda solicitada en Google Imágenes quedó bloqueada por su protección contra consultas automatizadas; las perspectivas se consultaron en la fuente oficial:

- [Fachada frontal, 1104 × 564](https://grupogmp.com/wp-content/uploads/2022/07/oxxeo-3.jpg)
- [Perspectiva exterior, 905 × 564](https://grupogmp.com/wp-content/uploads/2022/07/oxxeo-2.jpg)
- [Otra perspectiva, 932 × 564](https://grupogmp.com/wp-content/uploads/2022/07/oxxeo-5.jpg)
- [Azotea, 2560 × 1707](https://grupogmp.com/wp-content/uploads/2022/07/20230201-Paneles-solares_Terraza_-Oxxeo_1020-scaled.jpg)

Las fotografías no se redistribuyen: los enlaces abren las imágenes de sus propietarios. El modelo está generado con Three.js y no utiliza esas fotografías como texturas.