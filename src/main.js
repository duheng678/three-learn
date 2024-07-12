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
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
//创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
//轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
//设置带阻尼的惯性
controls.enableDamping = true
// controls.autoRotate = true
camera.position.set(20, 10, 200)
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
gltfLoader.load('./gltf/Horse.glb', gltf => {
  console.log(gltf)
  // scene.add(gltf.scene)
  const building = gltf.scene.children[0]
  const geometry = building.geometry
  //获取边缘几何体geometry
  const edges = new THREE.EdgesGeometry(geometry)
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x237790 }))
  //更新建筑物世界转换矩阵
  building.updateWorldMatrix(true, true)
  line.matrix.copy(building.matrixWorld)
  line.matrix.decompose(line.position, line.quaternion, line.scale)
  scene.add(line)
})
gltfLoader.load('./gltf/Flamingo.glb', gltf => {
  scene.add(gltf.scene)

  const building = gltf.scene.children[0]
  const geometry = building.geometry
  //获取边缘几何体geometry
  const edges = new THREE.EdgesGeometry(geometry)
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x237790 }))
  //更新建筑物世界转换矩阵
  // building.updateWorldMatrix(true, true)
  // line.matrix.copy(building.matrixWorld)
  // line.matrix.decompose(line.position, line.quaternion, line.scale)
  scene.add(line)
})
const rgbeLoader = new RGBELoader()
rgbeLoader.load('/textures/hdr/003.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = envMap
  scene.environment = envMap
})
