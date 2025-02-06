import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'

// console.log(THREE);

// 目标：掌握gsap设置各种动画效果

// 1、创建场景
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

// 2、创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 设置相机位置
camera.position.set(0, 0, 10)
scene.add(camera)

// 添加物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// 创建几何体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

scene.add(cube)

// 根据几何体和材质创建物体

// 修改物体的位置
// cube.position.set(5, 0, 0);
// cube.position.x = 3;
// 缩放
// cube.scale.set(3, 2, 1);
// cube.scale.x = 5;
// 旋转

// 将几何体添加到场景中

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()

// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

// // 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)

// controls.enableDamping = true
// scene.add(controls)
// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 设置时钟

// 设置动画

const animate1 = gsap.to(cube.position, {
  x: 5,
  duration: 2,
  ease: 'power1.inOut',
  repeat: -1,
  yoyo: true,
  onStart: () => {
    console.log('开始')
  },
  onComplete: () => {
    console.log('结束')
  },
  onRepeat: () => {
    console.log('重复')
  },
})
gsap.to(cube.rotation, { duration: 2, y: Math.PI * 2, repeat: -1, yoyo: true })
window.addEventListener('dblclick', () => {
  console.log('???', animate1.isActive())
  if (animate1.isActive()) {
    animate1.pause()
  } else {
    animate1.resume()
  }
})
function render() {
  renderer.render(scene, camera)
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render)
}

render()
