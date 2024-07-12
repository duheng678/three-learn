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
camera.position.set(0, 10, 10)
// 创建世界坐标
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

function animate() {
  requestAnimationFrame(animate)
  controls.update()

  renderer.render(scene, camera)
  // TWEEN.update()
}
animate()
// 创建三个小球

const BoxGeometry = new THREE.SphereGeometry(1, 32, 32)

const BoxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const BoxMaterial2 = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const BoxMaterial3 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const box1 = new THREE.Mesh(BoxGeometry, BoxMaterial)
const box2 = new THREE.Mesh(BoxGeometry, BoxMaterial2)
const box3 = new THREE.Mesh(BoxGeometry, BoxMaterial3)
scene.add(box1)
scene.add(box2)
scene.add(box3)
box1.position.x = -2
// box1.position.x = -2
box3.position.x = 2
console.log(scene)

let box = new THREE.Box3()
scene.children.forEach(item => {
  if (item.type === 'Mesh') {
    // item.geometry.computeBoundingBox()
    // const boxWrap = item.geometry.boundingBox
    // item.updateMatrixWorld(true, true)
    // boxWrap.applyMatrix4(item.matrixWorld)
    let box3 = new THREE.Box3().setFromObject(item)
    box.union(box3)
  }
})
// 计算包围盒
// scene.add(box)

let boxHelper = new THREE.Box3Helper(box, 0xffff00)
scene.add(boxHelper)
