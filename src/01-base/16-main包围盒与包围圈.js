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
const axesHelper = new THREE.AxesHelper(6)
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

// 创建几何体

// self.translate(3)
//创建法向量辅助线

scene.add(self)
// 加载hdr
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/hdr/003.hdr', envMap => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  //设置环境贴图
  scene.background = envMap
  scene.environment = envMap
  //设置plane的环境贴图
})

const gltfLoader = new GLTFLoader()

gltfLoader.load('./tem/model/Duck.glb', gltf => {
  console.log(gltf)
  scene.add(gltf.scene)
  const duckMesh = gltf.scene.getObjectByName('LOD3spShape')
  const duckGeometry = duckMesh.geometry
  //计算包围盒
  duckGeometry.computeBoundingBox()
  // 设置几何体居中
  duckGeometry.center()
  //获取包围盒
  const duckBox = duckGeometry.boundingBox
  // 获取包围盒中心点
  const center = duckBox.getCenter(new THREE.Vector3())
  console.log(center)
  //更新世界矩阵
  duckMesh.updateWorldMatrix(true, true)
  //更新包围盒
  duckBox.applyMatrix4(duckMesh.matrixWorld)

  //创建包围盒辅助器
  const boxHelper = new THREE.Box3Helper(duckBox, 0xffff00)
  scene.add(boxHelper)

  //获取包围球
  const duckSphere = duckGeometry.boundingSphere
  duckSphere.applyMatrix4(duckMesh.matrixWorld)
  console.log(duckSphere)
  //创建包围球辅助器
  const sphereGeometry = new THREE.SphereGeometry(duckSphere.radius, 16, 16)
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true,
  })
  let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphereMesh.position.copy(duckSphere.center)
  scene.add(sphereMesh)
})
console.log(scene)
