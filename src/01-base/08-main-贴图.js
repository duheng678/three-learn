import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Wireframe } from 'three/examples/jsm/Addons.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// import
//创建场景
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// renderer.setClearColor(0xffffff, 1.0)
//创建相机
const camera = new THREE.PerspectiveCamera(450, window.innerWidth / window.innerHeight, 0.1, 1000)
//轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
//设置带阻尼的惯性
controls.enableDamping = true
// controls.autoRotate = true

camera.position.set(0, 20, 100)
//创建渲染器

// cube.position.set(3, 0, 0)

// cube.rotation.x = Math.PI / 4

camera.position.z = 5
camera.position.y = 2
camera.position.x = 2
camera.lookAt(1, 0, 0)

//添加世界坐标辅助线
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

function animate() {
  requestAnimationFrame(animate)
  controls.update()

  renderer.render(scene, camera)
}
animate()

//监听窗口变化

window.addEventListener('resize', () => {
  //渲染器宽高
  renderer.setSize(window.innerWidth, window.innerHeight)
  //相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})
//监听按钮

//创建纹理加载器
const textureLoader = new THREE.TextureLoader()
let texture = textureLoader.load('./textures/door/color.jpg')
texture.colorSpace = THREE.SRGBColorSpace

let aoMap = textureLoader.load('./textures/door/normal.jpg')
let alpMap = textureLoader.load('./textures/door/height.jpg')

// 加载hdr
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/hdr/003.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  //设置环境贴图
  scene.background = envMap
  //设置plane的环境贴图
  planeMaterial.envMap = envMap
})
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  map: texture,
  aoMap: aoMap,
  // aoMap: aoMap,
  // alphaMap: alpMap,
  transparent: true,
})

let plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.x = 1
plane.position.y = 1
// plane.position.y = 1
plane.rotation.x = -Math.PI / 4
scene.add(plane)

const gui = new GUI()
gui
  .add(texture, 'colorSpace', {
    sRGB: THREE.SRGBColorSpace,
    linear: THREE.LinearSRGBColorSpace,
  })
  .name('colorSpace')
  .onChange(() => {
    texture.needsUpdate = true
  })
