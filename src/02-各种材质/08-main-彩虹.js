import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { VertexNormalsHelper, Wireframe } from 'three/examples/jsm/Addons.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// import { transmission } from 'three/src/nodes/core/PropertyNode.js'
// import
//创建场景
const scene = new THREE.Scene()
//创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, //抗锯齿
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
//创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
//轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
//设置带阻尼的惯性
controls.enableDamping = true
// controls.autoRotate = true
camera.position.set(5, 5, 5)
// 创建世界坐标
const axesHelper = new THREE.AxesHelper(9999)
scene.add(axesHelper)

function animate() {
  requestAnimationFrame(animate)
  controls.update()

  renderer.render(scene, camera)
  // TWEEN.update()
}
animate()
// 创建三个小球
// const gltfLoader = new GLTFLoader()

// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/draco/')

// gltfLoader.setDRACOLoader(dracoLoader)
const gui = new GUI()

const textureLoader = new THREE.TextureLoader()
const colorTexture = textureLoader.load('./tem/texture/watercover/CityNewYork002_COL_VAR1_1K.png')
colorTexture.colorSpace = THREE.SRGBColorSpace
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
//实例化加载器

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const rgbeLoader = new RGBELoader()
rgbeLoader.load('/tem/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // envMap.mapping = THREE.EquirectangularReflectionMapping
  envMap.mapping = THREE.EquirectangularRefractionMapping
  scene.background = envMap

  scene.environment = envMap

  const thickness = new THREE.TextureLoader().load('./textures/diamond/diamond_emissive.png')
  const clearcoatNormalMap = new THREE.TextureLoader().load('./textures/diamond/diamond_normal.png')
  const carbonMap = new THREE.TextureLoader().load('./textures/carbon/Carbon_Normal.png')

  const sheenColorMap = new THREE.TextureLoader().load('./textures/brick/brick_roughness.jpg')
  // plainMaterial.envMap = envMap
  // 创建球体
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.05,
      transmission: 1,
      thickness: 0.1,
      iridescence: 1,
      reflectivity: 1,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [100, 400],
      iridescenceMap: sheenColorMap,
    })
  )
  console.log(sphere.material)

  scene.add(sphere)
  gui.add(sphere.material, 'iridescence').min(0).max(1).step(0.01).name('彩虹色')
  gui.add(sphere.material, 'reflectivity').min(0).max(1).step(0.01).name('反射率')
  gui.add(sphere.material, 'iridescenceIOR').min(0).max(2).step(0.01).name('彩虹折射率')
})
//创建环境光
