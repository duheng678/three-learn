// 导入threejs
import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// 导入lil.gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js'

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 开启抗锯齿
})
// 设置渲染器允许投射阴影
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
document.body.appendChild(renderer.domElement)

// 设置相机位置
camera.position.z = 15
camera.position.y = 2.4
camera.position.x = 0.4
camera.lookAt(0, 0, 0)

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true
// 设置阻尼系数
controls.dampingFactor = 0.05
// 设置旋转速度
// controls.autoRotate = true;
controls.addEventListener('change', () => {
  renderer.render(scene, camera)
})

// 渲染函数
function animate() {
  controls.update()
  requestAnimationFrame(animate)
  // 渲染
  renderer.render(scene, camera)
}
animate()

// 监听窗口变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机投影矩阵
  camera.updateProjectionMatrix()
})

// 创建GUI
const gui = new GUI()

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader()
rgbeLoader.load('./texture/Video_Copilot-Back Light_0007_4k.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // envMap.mapping = THREE.EquirectangularRefractionMapping;
  // 设置环境贴图
  scene.background = envMap
  // 设置环境贴图
  // scene.environment = envMap
})

const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
const material = new THREE.MeshPhysicalMaterial({ color: 0xffff00 })
const torusKnot = new THREE.Mesh(torusKnotGeometry, material)
scene.add(torusKnot)
// 设置物体投射阴影
torusKnot.castShadow = true
torusKnot.receiveShadow = true

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const material2 = new THREE.MeshPhysicalMaterial({ color: 0xffff00 })
const sphere = new THREE.Mesh(sphereGeometry, material2)

scene.add(sphere)
sphere.position.set(-10, 0, 0)
sphere.castShadow = true
sphere.receiveShadow = true

const boxGeometry = new THREE.BoxGeometry(4, 4, 4)
const material3 = new THREE.MeshPhysicalMaterial({ color: 0xffff00 })
const box = new THREE.Mesh(boxGeometry, material3)
scene.add(box)
box.position.set(10, 0, 0)
box.castShadow = true
box.receiveShadow = true

const plainGeometry = new THREE.PlaneGeometry(200, 200)
const plainMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x999999,
  roughness: 0.5,
  metalness: 0.5,
})
const plain = new THREE.Mesh(plainGeometry, plainMaterial)
scene.add(plain)
plain.position.set(0, -2, 0)
plain.rotateX(-Math.PI / 2)
//设置接收阴影
plain.receiveShadow = true
plain.castShadow = true

// // 添加环境光
// let ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
// scene.add(ambientLight)

//添加聚光灯
const spotLight = new THREE.SpotLight(0xffffff, 218)
spotLight.position.set(0, 10, 0)
spotLight.target.position.set(0, 0, 0)
spotLight.angle = Math.PI / 8
spotLight.distance = 130
spotLight.penumbra = 0.2
spotLight.decay = 2
scene.add(spotLight)
spotLight.castShadow = true
spotLight.shadow.mapSize.set(2048, 2048)

//聚光灯的辅助器
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
