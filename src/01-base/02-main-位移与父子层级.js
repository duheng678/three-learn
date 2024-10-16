import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
//创建场景
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
//轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
//设置带阻尼的惯性
controls.enableDamping = true
// controls.autoRotate = true

camera.position.set(0, 20, 100)
//创建渲染器

//创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)

//创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
//创建网格
let parentCube = new THREE.Mesh(geometry, parentMaterial)

const cube = new THREE.Mesh(geometry, material)
parentCube.add(cube)
parentCube.position.set(-3, 0, 0)
cube.position.set(3, 0, 0)
// cube.position.z = 2

scene.add(parentCube)

camera.position.z = 5
camera.position.y = 2
camera.position.x = 2
camera.lookAt(1, 0, 0)

//添加世界坐标辅助线
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

function animate() {
  console.log('???')

  requestAnimationFrame(animate)
  controls.update()

  renderer.render(scene, camera)
}
animate()
