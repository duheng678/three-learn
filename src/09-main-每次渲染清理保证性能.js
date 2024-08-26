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

function createImage() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256

  const context = canvas.getContext('2d')
  context.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
  context.fillRect(0, 0, 256, 256)
  return canvas
}
function animate() {
  const texture = new THREE.CanvasTexture(createImage())
  const geometry = new THREE.SphereGeometry(2, Math.random() * 64, Math.random() * 32)
  const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xff0000, map: texture })
  const sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
  //清除场景中物体
  scene.remove(sphere)
  geometry.dispose()
  material.dispose()
  texture.dispose()
}
animate()
