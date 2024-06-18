import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Wireframe } from 'three/examples/jsm/Addons.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
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

//创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const geometry = new THREE.BufferGeometry()
//三个坐标为一个顶点，每三个为一个顶点，逆时针为正面
const vertices = new Float32Array([-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
//创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

geometry.addGroup(0, 3, 0)
geometry.addGroup(3, 3, 1)

console.log(cubeGeometry)
console.log(geometry)
//创建材质
const material = new THREE.MeshBasicMaterial({
  color: 'chocolate',
  // side: THREE.DoubleSide,
  // wireframe: true,
})

// parentMaterial.wireframe = true
//创建网格

const cube = new THREE.Mesh(geometry, [material, material1])
scene.add(cube)
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

const eventObj = {
  Fullscreen: function () {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.body.requestFullscreen()
    }
  },
}

const gui = new GUI()
gui.add(eventObj, 'Fullscreen').name(document.fullscreenElement ? '退出全屏' : '全屏')
gui
  .add(cube.position, 'x', -5, 5)
  .name('cube立方体x轴')
  .step(0.1)
  .onChange(val => {
    console.log(val)
  })
  .onFinishChange(() => {})
gui.add(cube.position, 'y', -5, 5).name('cube立方体y轴').step(0.1)
gui.add(cube.position, 'z', -5, 5).name('cube立方体z轴').step(0.1)

let colorParams = {
  cubeColor: '#ff0000',
}
gui
  .addColor(colorParams, 'cubeColor')
  .name('立方体颜色')
  .onChange(val => {
    cube.material.color.set(val)
  })
