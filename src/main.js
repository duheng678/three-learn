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
  //清除场景中物体
}
animate()

const rgbeLoader = new RGBELoader()
rgbeLoader.load('./tem/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularRefractionMapping

  scene.background = envMap
  scene.environment = envMap

  const gltfLoader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  gltfLoader.setDRACOLoader(dracoLoader)

  gltfLoader.load('./model/damon/diamond-self.glb', gltf => {
    scene.add(gltf.scene)
    const diamond = gltf.scene.getObjectByName('diamond')
  })
})
