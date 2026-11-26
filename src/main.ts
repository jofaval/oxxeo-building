import './style.css'
import { createViewer } from './viewer'

const icons: Record<string, string> = {
  cube: '<path d="m12 3 9 5v8l-9 5-9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  rotate: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 7a7 7 0 0 1 12-1l2 6M4 12l2 6a7 7 0 0 0 12-1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10Z"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  camera: '<path d="M3 7h4l2-3h6l2 3h4v13H3Z"/><circle cx="12" cy="13" r="4"/>',
  reset: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  mouse: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 2v7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
  leaf: '<path d="M20 3C10 2 3 6 5 14s16 7 15-11Z"/><path d="M3 21 15 9"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
}
const icon = (name: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.cube}</svg>`

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header class="header">
    <a class="wordmark" href="./" aria-label="OXXEO inicio">oxxeo<span class="brand-dot"></span></a>
    <span class="header-caption">ARQUITECTURA EN OTRA DIMENSIÓN</span>
    <nav aria-label="Navegación principal">
      <button class="nav-link active" data-tab="explore">Explorar edificio</button>
      <button class="nav-link" data-tab="project">El proyecto ${icon('arrow')}</button>
    </nav>
    <span class="edition">MADRID, ES <span>40°30′ N 3°40′ W</span></span>
  </header>
  <main>
    <aside class="sidebar">
      <div class="eyebrow"><span class="status-dot"></span> EXPLORADOR ARQUITECTÓNICO</div>
      <h1>Una nueva<br>perspectiva<span>.</span></h1>
      <p class="intro">Arquitectura que va más allá.<br>Descubre cada ángulo de OXXEO.</p>
      <div class="project-label"><span>01</span> EL EDIFICIO <span class="line"></span></div>
      <div class="building-heading"><h2>OXXEO</h2><span class="tag">OFICINAS</span></div>
      <p class="location">${icon('pin')} Las Tablas, Madrid</p>
      <p class="description">Una envolvente singular. Un nuevo diálogo entre estructura, luz y espacio.</p>
      <dl class="facts">
        <div><dt>Arquitectura</dt><dd>Rafael de La-Hoz ${icon('arrow')}</dd></div>
        <div><dt>Año de construcción</dt><dd>2018</dd></div>
        <div><dt>Superficie construida</dt><dd>14.328 <span>m²</span></dd></div>
      </dl>
      <div class="sustainability">${icon('leaf')}<div><strong>Diseñado para el futuro</strong><span>Certificación LEED Platino</span></div><span class="cert">LEED<br>PLATINUM</span></div>
      <button class="reference-link" id="references">Conoce el proyecto ${icon('arrow')}</button>
      <div class="sidebar-bottom"><span class="mini-mark">oˣ</span><p>Un icono de Madrid.<br>Ahora, desde tu perspectiva.</p><span>↗</span></div>
    </aside>
    <section class="viewer" aria-label="Visor 3D del edificio OXXEO">
      <div id="canvas-host" role="img" aria-label="Modelo 3D interactivo de OXXEO. Arrastra para girar; rueda o teclas más y menos para zoom; flechas para orbitar." tabindex="0"></div>
      <div class="viewer-top"><div class="live-pill"><span class="status-dot"></span> EXPLORACIÓN 3D <span class="pill-divider"></span><span>EN TIEMPO REAL</span></div><button class="square-button" id="info" aria-label="Información del modelo">${icon('info')}</button></div>
      <div class="model-caption"><span>OXXEO / MADRID</span><span>ESTUDIO VOLUMÉTRICO · 01</span></div>
      <div class="scene-tools">
        <button id="rotate" class="square-button" aria-label="Activar rotación automática" aria-pressed="false" title="Rotación automática">${icon('rotate')}</button>
        <div class="tool-divider"></div>
        <button id="zoom-in" class="square-button" aria-label="Acercar" title="Acercar"><span class="zoom-symbol">+</span></button>
        <button id="zoom-out" class="square-button" aria-label="Alejar" title="Alejar"><span class="zoom-symbol">−</span></button>
        <div class="tool-divider"></div>
        <button id="reset" class="square-button" aria-label="Restablecer vista" title="Restablecer vista">${icon('reset')}</button>
        <button id="fullscreen" class="square-button" aria-label="Pantalla completa" title="Pantalla completa">${icon('expand')}</button>
      </div>
      <div class="compass" aria-hidden="true"><span>N</span><div id="compass-needle">↑</div><small>S</small></div>
      <div class="viewer-bottom">
        <div class="interaction-hint">${icon('mouse')}<span>Arrastra para girar <b>·</b> Scroll para acercar</span></div>
        <button id="capture" class="capture-button">${icon('camera')}<span>Capturar vista</span></button>
      </div>
      <div class="loading" id="loading"><span class="loading-mark">oˣ</span>Construyendo perspectivas…</div>
    </section>
    <section class="control-bar" aria-label="Controles de visualización">
      <div class="view-controls"><span class="control-label">PUNTO DE VISTA</span><div class="segmented" id="views">
        <button data-view="perspective" class="selected" aria-pressed="true">${icon('cube')} Perspectiva</button>
        <button data-view="front" aria-pressed="false">Frontal</button>
        <button data-view="side" aria-pressed="false">Lateral</button>
        <button data-view="aerial" aria-pressed="false">Aérea</button>
      </div></div>
      <div class="light-controls"><span class="control-label">ILUMINACIÓN</span><div class="segmented" id="lights">
        <button data-light="day" class="selected" aria-label="Luz de día" aria-pressed="true">${icon('sun')}<span>Día</span></button>
        <button data-light="sunset" aria-label="Luz de atardecer" aria-pressed="false">${icon('sun')}<span>Atardecer</span></button>
        <button data-light="night" aria-label="Luz de noche" aria-pressed="false">${icon('moon')}<span>Noche</span></button>
      </div></div>
      <button class="material-button" id="materials" aria-pressed="false">${icon('layers')} Maqueta blanca</button>
    </section>
  </main>
  <footer><span>OXXEO <b>EXPERIENCE</b></span><span>El espacio se entiende mejor cuando lo exploras.</span><span><span class="status-dot"></span> HECHO PARA EXPLORAR</span></footer>
  <dialog id="project-dialog">
    <button class="square-button dialog-close" aria-label="Cerrar">${icon('close')}</button>
    <div class="eyebrow">ARQUITECTURA · MADRID · 2018</div>
    <h2>La estructura<br>como identidad.</h2>
    <p>Concebido por Rafael de La-Hoz, OXXEO lleva su estructura al exterior: una gran celosía que libera el espacio interior y protege la fachada del sol.</p>
    <p>Situado en Puerto de Somport, 9, Las Tablas, el edificio cuenta con certificaciones LEED y WELL Platino.</p>
    <h3>Referencias originales</h3>
    <p class="dialog-note">Fotografías de gran formato desde distintas perspectivas. Las imágenes pertenecen a sus respectivos autores y se consultan en la web de GMP.</p>
    <div class="reference-grid">
      <a href="https://grupogmp.com/wp-content/uploads/2022/07/oxxeo-3.jpg" target="_blank" rel="noopener noreferrer">01 · Fachada frontal ↗</a>
      <a href="https://grupogmp.com/wp-content/uploads/2022/07/oxxeo-2.jpg" target="_blank" rel="noopener noreferrer">02 · Perspectiva exterior ↗</a>
      <a href="https://grupogmp.com/wp-content/uploads/2022/07/oxxeo-5.jpg" target="_blank" rel="noopener noreferrer">03 · Otra perspectiva ↗</a>
      <a href="https://grupogmp.com/oficina/oxxeo/" target="_blank" rel="noopener noreferrer">Ficha oficial · GMP ↗</a>
    </div>
    <p class="model-note">Recreación 3D interpretativa realizada a partir de referencias públicas. No es un modelo BIM ni reproduce dimensiones certificadas.</p>
  </dialog>
  <div id="toast" role="status" aria-live="polite"></div>
`

let toastTimeout = 0
const toast = (message: string) => {
  const element = document.querySelector<HTMLDivElement>('#toast')!
  element.textContent = message
  element.classList.add('visible')
  window.clearTimeout(toastTimeout)
  toastTimeout = window.setTimeout(() => element.classList.remove('visible'), 3200)
}
const dialog = document.querySelector<HTMLDialogElement>('#project-dialog')!
document.querySelectorAll('#references, #info, [data-tab="project"]').forEach(button => button.addEventListener('click', () => dialog.showModal()))
document.querySelector('.dialog-close')!.addEventListener('click', () => dialog.close())
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close() })
document.querySelector('[data-tab="explore"]')!.addEventListener('click', () => document.querySelector<HTMLElement>('#canvas-host')!.focus())

try {
  const viewer = createViewer(document.querySelector<HTMLDivElement>('#canvas-host')!)
  document.querySelector('#loading')!.remove()
  const select = (container: string, button: HTMLButtonElement) => {
    document.querySelectorAll<HTMLButtonElement>(`${container} button`).forEach(item => {
      item.classList.toggle('selected', item === button)
      item.setAttribute('aria-pressed', String(item === button))
    })
  }
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => button.addEventListener('click', () => {
    viewer.setView(button.dataset.view!)
    select('#views', button)
  }))
  document.querySelectorAll<HTMLButtonElement>('[data-light]').forEach(button => button.addEventListener('click', () => {
    viewer.setLight(button.dataset.light!)
    document.querySelector('.viewer')!.setAttribute('data-light', button.dataset.light!)
    select('#lights', button)
  }))
  const rotate = document.querySelector<HTMLButtonElement>('#rotate')!
  rotate.addEventListener('click', () => {
    const enabled = viewer.toggleRotate()
    rotate.setAttribute('aria-pressed', String(enabled))
    rotate.classList.toggle('selected', enabled)
  })
  document.querySelector('#zoom-in')!.addEventListener('click', () => viewer.zoom(0.85))
  document.querySelector('#zoom-out')!.addEventListener('click', () => viewer.zoom(1.18))
  document.querySelector('#reset')!.addEventListener('click', () => {
    viewer.reset()
    rotate.setAttribute('aria-pressed', 'false')
    rotate.classList.remove('selected')
    select('#views', document.querySelector<HTMLButtonElement>('[data-view="perspective"]')!)
    toast('Vista original restablecida')
  })
  document.querySelector<HTMLButtonElement>('#materials')!.addEventListener('click', event => {
    const enabled = viewer.toggleMaterials()
    const button = event.currentTarget as HTMLButtonElement
    button.setAttribute('aria-pressed', String(enabled))
    button.classList.toggle('selected', enabled)
  })
  document.querySelector('#capture')!.addEventListener('click', () => {
    viewer.capture()
    toast('Captura guardada')
  })
  document.querySelector('#fullscreen')!.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.querySelector('.viewer')!.requestFullscreen()
    } catch { toast('Tu navegador no permite la pantalla completa') }
  })
} catch (error) {
  console.error('No se pudo iniciar el visor 3D:', error)
  const loading = document.querySelector<HTMLDivElement>('#loading')!
  loading.textContent = 'El visor necesita WebGL. Activa la aceleración gráfica o prueba con un navegador actualizado.'
  document.querySelectorAll<HTMLButtonElement>('.scene-tools button, .control-bar button, #capture').forEach(button => { button.disabled = true })
}
