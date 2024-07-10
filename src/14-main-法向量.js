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

camera.position.set(2, 2, 5)
//创建渲染器

// cube.position.set(3, 0, 0)

// cube.rotation.x = Math.PI / 4

// camera.position.z = 5
// camera.position.y = 2
// camera.position.x = 2
// camera.lookAt(1, 0, 0)

//添加世界坐标辅助线
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

function animate() {
  requestAnimationFrame(animate)
  controls.update()

  renderer.render(scene, camera)
  // TWEEN.update()
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
const textureLoader = new THREE.TextureLoader()

let texture = textureLoader.load('./tem/texture/uv_grid_opengl.jpg')
// 创建平面
const plainGeometry = new THREE.PlaneGeometry(1, 1)
const plainMaterial = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  // side: THREE.DoubleSide,
  // wireframe: true,
  map: texture,
})
const plain = new THREE.Mesh(plainGeometry, plainMaterial)
plain.position.set(2, 0, 0)
scene.add(plain)
console.log(plainGeometry)
// 创建几何体
const geometry = new THREE.BufferGeometry()
// 创建顶点数据,顶点是有序的,每三个为一个顶点，逆时针为正面
// const vertices = new Float32Array([
//   -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,

//   1.0, 1.0, 0, -1.0, 1.0, 0, -1.0, -1.0, 0,
// ]);
// // 创建顶点属性
// geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

// 使用索引绘制
const vertices = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0])
// 创建顶点属性
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
// 创建索引属性
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

// 设置uv
const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]) // 前面
geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
//计算法向向量
// geometry.computeVertexNormals()
// 或者设置法向量
const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1])
geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
console.log(geometry)
// 创建材
const plane = new THREE.Mesh(geometry, plainMaterial)
//创建法向量辅助线
const helper = new VertexNormalsHelper(plane, 0.2, 0xff0000)
scene.add(helper)

scene.add(plane)
// 加载hdr
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/hdr/003.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  //设置环境贴图
  scene.background = envMap
  // scene.environment = envMap
  //设置plane的环境贴图
  plainMaterial.envMap = envMap
})
