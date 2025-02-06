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

import { CSM } from 'three/addons/csm/CSM.js'

const params = {
  orthographic: false,
  fade: false,
  far: 1000,
  mode: 'practical',
  lightX: -1,
  lightY: -1,
  lightZ: -1,
  margin: 100,
  lightFar: 1000,
  lightNear: 1,
  autoUpdateHelper: true,
  updateHelper: function () {
    csmHelper.update()
  },
}
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
renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
let csm = new CSM({
  maxFar: params.far,
  cascades: 4,
  // mode: params.mode,
  parent: scene,
  shadowMapSize: 1024,
  lightDirection: new THREE.Vector3(params.lightX, params.lightY, params.lightZ).normalize(),
  camera: camera,
})
csm.fade = true
csm.updateFrustums()
// 渲染函数
function animate() {
  controls.update()
  camera.updateMatrixWorld()
  csm.update()
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

// csm.fade = true
// csm.updateFrustums()

// 创建GUI
const gui = new GUI()

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader()
rgbeLoader.load('./texture/Video_Copilot-Back Light_0007_4k.hdr', envMap => {
  // 设置球形贴图
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // envMap.mapping = THREE.EquirectangularRefractionMapping;
  // 设置环境贴图
  // scene.background = envMap
  // 设置环境贴图
  // scene.environment = envMap
})

const torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
const material = new THREE.MeshPhysicalMaterial({ color: 0xffff00 })
const torusKnot = new THREE.Mesh(torusKnotGeometry, material)
scene.add(torusKnot)
// 设置物体投射阴影
csm.setupMaterial(material)

// torusKnot.castShadow = true
// torusKnot.receiveShadow = true

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const material2 = new THREE.MeshPhysicalMaterial({ color: 0xffff00 })
const sphere = new THREE.Mesh(sphereGeometry, material2)
csm.setupMaterial(material2)

scene.add(sphere)
sphere.position.set(-10, 0, 0)
// sphere.castShadow = true
// sphere.receiveShadow = true

const boxGeometry = new THREE.BoxGeometry(4, 4, 4)
const material3 = new THREE.MeshPhysicalMaterial({ color: 0xffff00 })
const box = new THREE.Mesh(boxGeometry, material3)
scene.add(box)
csm.setupMaterial(material3)

box.position.set(10, 0, 0)
// box.castShadow = true
// box.receiveShadow = true

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
// csm.setupMaterial(plainMaterial)

//设置接收阴影
plain.receiveShadow = true
plain.castShadow = true

//添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
// ambientLight.castShadow = true
//环境光辅助线

//添加平行光
let directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.position.set(params.lightX, params.lightY, params.lightZ).normalize().multiplyScalar(-200)
// 默认平行光的目标是原点
directionalLight.target.position.set(0, 0, 0)
//设置光投射阴影

// directionalLight.shadow.mapSize.set(4096, 4096)
scene.add(directionalLight)
//添加平行光辅助线
const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1, '#ff0000')
scene.add(dirLightHelper)

gui.add(sphere.position, 'x', -20, 20).name('球x轴')
// gui.add(sphere.position, 'y', -20, 20).name('球y轴')
gui.add(sphere.position, 'z', -20, 20).name('球z轴')
console.log(directionalLight)

//相机辅助器
const camHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(camHelper)
