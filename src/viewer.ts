import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

export function createViewer(host: HTMLElement) {
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25
  host.appendChild(renderer.domElement)
  const environment = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  scene.environment = environment.fromScene(room, 0.04).texture
  room.dispose()
  environment.dispose()

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 300)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.07
  controls.minDistance = 32
  controls.maxDistance = 115
  controls.maxPolarAngle = Math.PI / 2.03
  controls.minPolarAngle = 0.08
  controls.autoRotateSpeed = 0.65
  controls.target.set(0, 7, 0)
  controls.enablePan = false
  const defaultPosition = new THREE.Vector3(49, 33, 60)
  camera.position.copy(defaultPosition)

  const ambient = new THREE.HemisphereLight(0xe5f0f3, 0x9a967c, 2.5)
  scene.add(ambient)
  const sun = new THREE.DirectionalLight(0xfff5df, 4)
  sun.position.set(-25, 45, 28)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  Object.assign(sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 130 })
  sun.shadow.bias = -0.0004
  sun.shadow.normalBias = 0.05
  sun.shadow.radius = 4
  scene.add(sun)

  const frame = new THREE.MeshStandardMaterial({ color: 0xf3f1e7, roughness: 0.5, metalness: 0.18 })
  const glass = new THREE.MeshStandardMaterial({ color: 0x476669, roughness: 0.18, metalness: 0.72, envMapIntensity: 1.3 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x354241, roughness: 0.5, metalness: 0.45 })
  const concrete = new THREE.MeshStandardMaterial({ color: 0xcacbc1, roughness: 0.9 })
  const paving = new THREE.MeshStandardMaterial({ color: 0xe2e1d7, roughness: 0.95 })
  const green = new THREE.MeshStandardMaterial({ color: 0x657252, roughness: 1 })
  const wood = new THREE.MeshStandardMaterial({ color: 0x8c785a, roughness: 0.9 })
  const model = new THREE.Group()
  model.scale.set(1.2, 0.85, 1)
  scene.add(model)
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, material: THREE.Material, parent: THREE.Object3D = model) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  const beam = (a: THREE.Vector3, b: THREE.Vector3, width: number, depth: number, parent: THREE.Object3D) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, a.distanceTo(b), depth), frame)
    mesh.position.copy(a).add(b).multiplyScalar(0.5)
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
  }

  // Clip diagonal beams to each facade to form the exterior structural lattice.
  const facade = (width: number, depth: number, rotation: number) => {
    const group = new THREE.Group()
    group.rotation.y = rotation
    model.add(group)
    const height = 18
    box(width, height, 0.2, 0, 11, depth - 0.55, glass, group)
    for (let floor = 0; floor <= 6; floor++) {
      box(width, 0.13, 0.3, 0, 2 + floor * 3, depth - 0.35, dark, group)
      if (floor < 6) box(width - 0.4, 0.1, 1.3, 0, 2.15 + floor * 3, depth - 1.1, concrete, group)
    }
    for (let x = -width / 2; x <= width / 2; x += 1.25) {
      box(0.045, height, 0.2, x, 11, depth - 0.35, dark, group)
    }
    for (const slope of [-1, 1]) {
      for (let offset = -width - height; offset <= width + height; offset += 6.4) {
        const points: THREE.Vector3[] = []
        for (const x of [-width / 2, width / 2]) {
          const y = slope * x + offset
          if (y >= 0 && y <= height) points.push(new THREE.Vector3(x, y + 2, depth))
        }
        for (const y of [0, height]) {
          const x = (y - offset) / slope
          if (x > -width / 2 && x < width / 2) points.push(new THREE.Vector3(x, y + 2, depth))
        }
        if (points.length === 2) beam(points[0]!, points[1]!, 0.3, 0.38, group)
      }
    }
    box(width + 0.25, 0.32, 0.4, 0, 20, depth, frame, group)
    box(0.3, height, 0.4, -width / 2, 11, depth, frame, group)
    box(0.3, height, 0.4, width / 2, 11, depth, frame, group)
  }
  box(43, 0.65, 33, 0, 0, 0, concrete)
  box(42.8, 0.14, 32.8, 0, 0.4, 0, paving)
  box(31.3, 0.4, 19.3, 0, 1.3, 0, concrete)
  box(30.8, 0.35, 18.8, 0, 20, 0, frame)
  facade(32, 10, 0)
  facade(32, 10, Math.PI)
  facade(20, 16, Math.PI / 2)
  facade(20, 16, -Math.PI / 2)
  box(30.5, 0.2, 18.5, 0, 20.25, 0, concrete)
  box(24, 0.12, 12, 0, 20.4, 0, green)
  box(12, 1.1, 5, -4, 20.9, -3, dark)
  box(12.4, 0.15, 5.4, -4, 21.5, -3, frame)
  for (let x = 1; x < 12; x += 0.65) box(0.18, 0.18, 6, x, 22.1, 3.3, frame)
  for (const x of [1, 11.5]) for (const z of [0.4, 6.2]) box(0.13, 1.7, 0.13, x, 21.2, z, frame)
  for (let x = -12; x < -5; x += 2.2) box(1.7, 0.35, 2.8, x, 20.65, 5.4, dark)
  box(4, 3, 0.35, 0, 3, 10.1, dark)
  for (const x of [-1, 1]) box(0.04, 2.8, 0.45, x, 3, 10.3, frame)
  box(7, 0.18, 2.5, 0, 4.65, 10.8, frame)
  for (let i = 0; i < 4; i++) box(8 + i * 0.7, 0.12, 0.7, 0, 1.13 - i * 0.15, 12 + i * 0.55, concrete)

  const foliage = new THREE.MeshStandardMaterial({ color: 0x6a7953, roughness: 1, flatShading: true })
  const tree = (x: number, z: number, scale = 1) => {
    box(2.2, 0.45, 2.2, x, 0.7, z, concrete)
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 2.8, 7), wood)
    trunk.position.set(x, 2.2, z)
    model.add(trunk)
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5 * scale, 2), foliage)
    crown.scale.y = 1.25
    crown.position.set(x, 4 * scale, z)
    crown.castShadow = true
    model.add(crown)
  }
  for (const x of [-17.8, 17.8]) for (const z of [-11.5, -4, 4, 11.5]) tree(x, z, 0.9 + (z + 12) / 100)
  for (const x of [-11, -6, 6, 11]) {
    box(3.2, 0.35, 1.1, x, 0.72, 13.8, concrete)
    box(2.9, 0.3, 0.8, x, 1, 13.8, green)
    box(2.5, 0.13, 0.65, x, 0.95, -13.6, wood)
  }
  for (let x = -20; x <= 20; x += 2) box(0.018, 0.006, 32, x, 0.48, 0, concrete)
  for (let z = -15; z <= 15; z += 2) box(42, 0.006, 0.018, 0, 0.48, z, concrete)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), new THREE.ShadowMaterial({ opacity: 0.12 }))
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.4
  ground.receiveShadow = true
  scene.add(ground)

  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect()
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(Math.PI / 10) * Math.max(1, 1.35 / camera.aspect)))
    camera.updateProjectionMatrix()
  })
  resize.observe(host)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let destination: THREE.Vector3 | null = null
  controls.addEventListener('start', () => { destination = null })
  const compass = document.querySelector<HTMLElement>('#compass-needle')!
  const timer = new THREE.Timer()
  timer.connect(document)
  renderer.setAnimationLoop((timestamp) => {
    timer.update(timestamp)
    const delta = Math.min(timer.getDelta(), 0.1)
    if (destination) {
      camera.position.lerp(destination, reducedMotion ? 1 : 1 - Math.exp(-delta * 6))
      if (camera.position.distanceTo(destination) < 0.03) destination = null
    }
    const autoRotate = controls.autoRotate
    controls.autoRotate = autoRotate && destination === null
    controls.update(delta)
    controls.autoRotate = autoRotate
    compass.style.transform = `rotate(${-THREE.MathUtils.radToDeg(controls.getAzimuthalAngle()) + 25}deg)`
    renderer.render(scene, camera)
  })

  let white = false
  const originals = new Map<THREE.MeshStandardMaterial, THREE.Color>()
  for (const material of [glass, dark, concrete, paving, green, wood, foliage]) originals.set(material, material.color.clone())
  const setView = (view: string) => {
    const positions: Record<string, THREE.Vector3> = {
      perspective: defaultPosition,
      front: new THREE.Vector3(0, 12, 72),
      side: new THREE.Vector3(68, 13, 0),
      aerial: new THREE.Vector3(28, 72, 30),
    }
    destination = (positions[view] || defaultPosition).clone()
  }
  const zoom = (factor: number) => {
    destination = null
    const offset = camera.position.clone().sub(controls.target)
    offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance))
    camera.position.copy(controls.target).add(offset)
  }
  host.addEventListener('keydown', event => {
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(0.9) }
    if (event.key === '-') { event.preventDefault(); zoom(1.1) }
    if (event.key.startsWith('Arrow')) {
      event.preventDefault()
      destination = null
      const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target))
      if (event.key === 'ArrowLeft') spherical.theta -= 0.12
      if (event.key === 'ArrowRight') spherical.theta += 0.12
      if (event.key === 'ArrowUp') spherical.phi = Math.max(controls.minPolarAngle, spherical.phi - 0.12)
      if (event.key === 'ArrowDown') spherical.phi = Math.min(controls.maxPolarAngle, spherical.phi + 0.12)
      camera.position.setFromSpherical(spherical).add(controls.target)
    }
  })
  return {
    setView,
    zoom,
    reset() { controls.autoRotate = false; setView('perspective') },
    toggleRotate() { controls.autoRotate = !controls.autoRotate; destination = null; return controls.autoRotate },
    toggleMaterials() {
      white = !white
      originals.forEach((color, material) => material.color.copy(white ? new THREE.Color(0xe7e5df) : color))
      glass.metalness = white ? 0 : 0.72
      glass.roughness = white ? 0.9 : 0.18
      return white
    },
    setLight(mode: string) {
      const night = mode === 'night'
      const sunset = mode === 'sunset'
      sun.color.set(sunset ? 0xffb073 : night ? 0x9aafff : 0xfff5df)
      sun.intensity = night ? 0.65 : sunset ? 3.6 : 4
      sun.position.set(sunset ? -40 : -25, sunset ? 12 : 45, 28)
      ambient.intensity = night ? 0.55 : sunset ? 1.8 : 2.5
      renderer.toneMappingExposure = night ? 0.85 : 1.25
      glass.emissive.set(night ? 0xb69b58 : 0x000000)
      glass.emissiveIntensity = night ? 0.4 : 0
      scene.environmentIntensity = night ? 0.3 : 1
    },
    capture() {
      renderer.render(scene, camera)
      const link = document.createElement('a')
      link.download = 'oxxeo-perspectiva.png'
      link.href = renderer.domElement.toDataURL('image/png')
      link.click()
    },
  }
}
