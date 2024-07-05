import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Wireframe } from 'three/examples/jsm/Addons.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
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

const gui = new GUI()

//创建三个球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  })
)

sphere1.position.set(-2, 0, 0)
scene.add(sphere1)

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  })
)

scene.add(sphere2)

const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  })
)

sphere3.position.set(2, 0, 0)
scene.add(sphere3)

//创建射线
const raycaster = new THREE.Raycaster()

// 创建鼠标向量
const mouse = new THREE.Vector2()

window.addEventListener('click', e => {
  console.log(e.clientX, e.clientY)
})
