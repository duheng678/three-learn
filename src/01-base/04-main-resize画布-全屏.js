import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
//创建场景
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.setClearColor(0xffffff, 1.0)
//创建相机
const camera = new THREE.PerspectiveCamera(450, window.innerWidth / window.innerHeight, 0.1, 1000)
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
const material = new THREE.MeshBasicMaterial({ color: 0xcccccc })
const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee })
//创建网格
let parentCube = new THREE.Mesh(geometry, parentMaterial)

const cube = new THREE.Mesh(geometry, material)
parentCube.add(cube)
parentCube.position.set(-9, 0, 0)
cube.position.set(3, 0, 0)
parentCube.rotation.x = Math.PI / 4
cube.rotation.x = Math.PI / 4

// cube.scale.set(2, 2, 2)
parentCube.scale.set(2, 2, 2)
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

//监听窗口变化

window.addEventListener('resize', () => {
  //渲染器宽高
  renderer.setSize(window.innerWidth, window.innerHeight)
  //相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})
//监听按钮

const btn = document.createElement('button')
btn.innerHTML = '全屏'
btn.style.position = 'fixed'
btn.style.top = '10px'
btn.style.left = '10px'
btn.style.zIndex = 999
btn.onclick = () => {
  document.body.requestFullscreen()
}
document.body.appendChild(btn)

const exitBtn = document.createElement('button')
exitBtn.innerHTML = '退出全屏'
exitBtn.style.position = 'fixed'
exitBtn.style.top = '10px'
exitBtn.style.left = '100px'
exitBtn.style.zIndex = 999
exitBtn.onclick = () => {
  document.exitFullscreen()
}
document.body.appendChild(exitBtn)
