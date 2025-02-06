import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// 导入变换控制器
import { TransformControls } from 'three/addons/controls/TransformControls.js'
//创建场景
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'
const scene = new THREE.Scene()

//创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.z = 8
camera.position.y = 2.4
camera.position.x = 3
camera.lookAt(0, 0, 0)
//创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(15)
scene.add(axesHelper)
//添加网格辅助器
const gridHelper = new THREE.GridHelper(50, 50, 0x888888, 0x444444)
gridHelper.material.opacity = 0.1
gridHelper.material.transparent = true
scene.add(gridHelper)

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

//更新渲染器
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

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader()
rgbeLoader.load('./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  // 设置球形贴图
  // envMap.mapping = THREE.EquirectangularReflectionMapping;
  envMap.mapping = THREE.EquirectangularRefractionMapping
  // 设置环境贴图
  // scene.background = envMap;
  scene.background = new THREE.Color(0xcccccc)
  // 设置环境贴图
  scene.environment = envMap
})

// 实例化加载器gltf
const gltfLoader = new GLTFLoader()
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('./draco/')
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
  // 模型路径
  './model/house/house-scene-min.glb',
  // 加载完成回调
  gltf => {
    basicScene = gltf.scene
  }
)
// 创建变换控制器
const tControls = new TransformControls(camera, renderer.domElement)
tControls.addEventListener('change', animate)
tControls.addEventListener('dragging-changed', function (event) {
  controls.enabled = !event.value
})
const gui = new GUI()
// 添加物体目录
let meshList = [
  {
    name: '盆栽',
    path: './model/house/plants-min.glb',
  },
  {
    name: '单人沙发',
    path: './model/house/sofa_chair_min.glb',
  },
]
let folderAddMehs = gui.addFolder('添加物体')
let sceneMeshes = []
let meshesNum = {}
meshList.forEach(item => {
  item.addMesh = function () {
    gltfLoader.load(item.path, gltf => {
      scene.add(gltf.scene)
      sceneMeshes.push({ ...item, object3D: gltf.scene })
    })
  }
  folderAddMehs.add(item, 'addMesh').name(item.name)
})

let basicScene

let eventObj = {
  FullScreen: function () {
    document.body.requestFullscreen()
  },
  exitScreen: function () {
    document.exitFullscreen()
  },
  addScreen: function () {
    console.log('addscreen')
    scene.add(basicScene)
  },
}

gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(eventObj, 'exitScreen').name('退出全屏')
gui.add(eventObj, 'addScreen').name('添加户型基础模型场景')

const folderMesh = gui.addFolder('添加物体')
