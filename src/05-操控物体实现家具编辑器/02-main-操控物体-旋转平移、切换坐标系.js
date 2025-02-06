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

renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1
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
// tControls.addEventListener('change', animate)
tControls.addEventListener('dragging-changed', function (event) {
  controls.enabled = !event.value
})
scene.add(tControls)

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
  setTranslate() {
    tControls.setMode('translate')
  },
  setRotate() {
    tControls.setMode('rotate')
  },
  setScale() {
    tControls.setMode('scale')
  },
  toggleSpace() {
    tControls.setSpace(tControls.space === 'local' ? 'world' : 'local')
  },
  cancelMesh() {
    tControls.detach()
  },
  translateSnapNum: null,
  rotateSnapNum: 0,
  scaleSnapNum: 0,
  isClampGroup: false,
  isLight: true,
}
tControls.addEventListener('change', () => {
  console.log(eventObj.isClampGroup)
  if (eventObj.isClampGroup) tControls.object.position.y = 0
})

const gui = new GUI()
gui.add(eventObj, 'FullScreen').name('全屏')
gui.add(eventObj, 'exitScreen').name('退出全屏')
gui.add(eventObj, 'addScreen').name('添加户型基础模型场景')
gui.add(eventObj, 'setTranslate').name('平移')
gui.add(eventObj, 'setRotate').name('旋转')
gui.add(eventObj, 'setScale').name('缩放')
gui.add(eventObj, 'toggleSpace').name('切换坐标系')
gui.add(eventObj, 'cancelMesh').name('取消选中')
gui
  .add(eventObj, 'isLight')
  .name('光源开关')
  .onChange(v => {
    if (v) {
      renderer.toneMappingExposure = 1
    } else {
      renderer.toneMappingExposure = 0.1
    }
  })
let folderAddMehs = gui.addFolder('添加物体')
let meshesFolder = gui.addFolder('家居列表')
const snapFolder = gui.addFolder('固定设置')
snapFolder
  .add(eventObj, 'translateSnapNum', {
    不固定: null,
    1: 1,
    0.1: 0.1,
    10: 10,
  })
  .name('平移步长')
  .onChange(() => {
    tControls.setTranslationSnap(eventObj.translateSnapNum)
  })

snapFolder
  .add(eventObj, 'rotateSnapNum', 0, 1, 1)
  .step(0.1)
  .name('旋转步长')
  .onChange(() => {
    tControls.setRotationSnap(eventObj.rotateSnapNum * Math.PI)
  })

snapFolder
  .add(eventObj, 'scaleSnapNum', 0.1, 10, 0.1)
  .name('缩放步长')
  .onChange(() => {
    tControls.setScaleSnap(eventObj.scaleSnapNum)
  })

snapFolder
  .add(eventObj, 'isClampGroup')
  .name('吸附地面')
  .onChange(() => {})

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
let sceneMeshes = []
let meshesNum = {}
meshList.forEach(item => {
  item.addMesh = function () {
    gltfLoader.load(item.path, gltf => {
      scene.add(gltf.scene)
      sceneMeshes.push({ ...item, object3D: gltf.scene })
      tControls.attach(gltf.scene)

      meshesNum[item.name] = meshesNum[item.name] ? meshesNum[item.name] + 1 : 1
      let meshOpt = {
        toggleMesh() {
          tControls.attach(gltf.scene)
        },
      }
      meshesFolder.add(meshOpt, 'toggleMesh').name(item.name + meshesNum[item.name])
    })
  }
  folderAddMehs.add(item, 'addMesh').name(item.name)
})

window.addEventListener('keydown', e => {
  switch (e.key) {
    case 't':
      eventObj.setTranslate()
      break
    case 'r':
      eventObj.setRotate()
      break
    case 's':
      eventObj.setScale()
      break

    default:
      break
  }
})
