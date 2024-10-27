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
// controls.target.set(0, 1.2, 0)
//设置带阻尼的惯性
controls.enableDamping = true
// controls.enablePan = false
// controls.maxDistance = 1
// controls.minDistance = 1
// controls.minPolarAngle = Math.PI / 2 - Math.PI / 12
// controls.maxPolarAngle = Math.PI / 2
// controls.maxAzimuthAngle = Math.PI / 2 + Math.PI / 12
// controls.minAzimuthAngle = Math.PI / 2 - Math.PI / 12
// controls.autoRotate = true
camera.position.set(0, 0, 3)
// camera.lookAt(0, 1.2, 0)
// 创建世界坐标
// const axesHelper = new THREE.AxesHelper(9999)
// scene.add(axesHelper)

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
  //清除场景中物体
}
animate()
//实例加载器
// const rgbeLoader = new RGBELoader()
// rgbeLoader.load('./tem/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr', envMap => {
//   envMap.mapping = THREE.EquirectangularRefractionMapping

//   scene.background = envMap
//   scene.environment = envMap

//   const gltfLoader = new GLTFLoader()
//   const dracoLoader = new DRACOLoader()
//   //设置gltf加载器draco解码器
//   gltfLoader.setDRACOLoader(dracoLoader)

//   gltfLoader.load('./scene/liveroom.glb', gltf => {
//     scene.add(gltf.scene)
//   })
// })
const loader = new THREE.TextureLoader()
const plainMap = loader.load('./tem/texture/uv_grid_opengl.jpg')
const rainTexture = loader.load('./textures/rain.png')
const minTexture = loader.load('./textures/filter/minecraft.png')
const magTexture = loader.load('./textures/brick/brick_diffuse.jpg')
const plainMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  map: magTexture,
  transparent: true,
})
const geometry = new THREE.PlaneGeometry(1, 1)

const plain = new THREE.Mesh(geometry, plainMaterial)

// plain.position.set(1, 0, 1)
scene.add(plain)
// plainMap.flipY = true
// plainMap.premultiplyAlpha = true
// scene.background = new THREE.Color('rgb(255, 255, 255)')

// minTexture.magFilter = THREE.LinearFilter
magTexture.colorSpace = THREE.SRGBColorSpace
// magTexture.minFilter = THREE.LinearFilter
magTexture.minFilter = THREE.LinearMipmapLinearFilter
const maxRenderAnisotropy = renderer.capabilities.getMaxAnisotropy()
magTexture.anisotropy = maxRenderAnisotropy
