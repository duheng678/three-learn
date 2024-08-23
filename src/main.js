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
let params = {
  aoMap: true,
}

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
  // plainMaterial.envMap = envMap
  // 创建立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    transmission: 1,
    roughness: 0.05,
    thickness: 2,
    attenuationColor: new THREE.Color(0.6, 0, 0),
    attenuationDistance: 10,
  })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)
  gui.add(cube.material, 'attenuationDistance').min(0).max(100).step(1).name('衰减距离')
  gui.add(cube.material, 'thickness').min(0).max(100).step(1).name('厚度')
})
//创建环境光
