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

const BoxGeometry = new THREE.BoxGeometry(1, 1, 100)
const boxMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
})
const box = new THREE.Mesh(BoxGeometry, boxMaterial)
scene.add(box)
const gui = new GUI()

//创建fog场景
// scene.fog = new THREE.Fog(0x999999, 0.1, 50)//线性
scene.fog = new THREE.FogExp2(0x999999, 0.1) //指数
scene.background = new THREE.Color(0x999999)
