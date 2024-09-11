import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { VertexNormalsHelper, Wireframe } from 'three/examples/jsm/Addons.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
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
camera.position.set(20, 10, 10)
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

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
//实例化加载器

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const rgbeLoader = new RGBELoader()
rgbeLoader.load('/tem/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap

  scene.environment = envMap
  // plainMaterial.envMap = envMap
})
//创建环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
//创建点光源
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(0, 3, 0)
scene.add(pointLight)

//添加纹理
const textureLoader = new THREE.TextureLoader()
const colorTexture = textureLoader.load('./tem/texture/watercover/CityNewYork002_COL_VAR1_1K.png')
colorTexture.colorSpace = THREE.SRGBColorSpace
// 高光贴图
const specularTexture = textureLoader.load('./tem/texture/watercover/CityNewYork002_GLOSS_1K.jpg')
//法线贴图
const normalTexture = textureLoader.load('./tem/texture/watercover/CityNewYork002_NRM_1K.jpg')
//置换贴图
const displacementTexture = textureLoader.load('./tem/texture/watercover/CityNewYork002_DISP_1K.jpg')

//环境光遮蔽贴图
const aoTexture = textureLoader.load('./tem/texture/watercover/CityNewYork002_AO_1K.jpg')

//创建平面

const plainGeometry = new THREE.PlaneGeometry(10, 10, 200, 200)
const plainMaterial = new THREE.MeshPhongMaterial({
  // color: 0xffffff,
  map: colorTexture,
  specularMap: specularTexture,
  transparent: true,
  // normalMap: normalTexture,
  bumpMap: displacementTexture,
  displacementMap: displacementTexture,
  aoMap: aoTexture,
  displacementScale: 0.22,
})

const plain = new THREE.Mesh(plainGeometry, plainMaterial)
plain.rotation.x = -Math.PI / 2
// plain.position.y = -1
scene.add(plain)
