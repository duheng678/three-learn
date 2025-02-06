import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'
console.log(CANNON)
//创建场景
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x293f4a)

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 0, 15)
scene.add(camera)

//创建渲染器  渲染器透明
const renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
//开启渲染器的阴影
renderer.shadowMap.enabled = true
//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

//创建坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//创建球和平面
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true
sphere.receiveShadow = true
scene.add(sphere)

const floor = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshStandardMaterial({ color: 0xcccccc }))
floor.position.set(0, -5, 0)
floor.rotateX(-Math.PI / 2)
floor.receiveShadow = true
scene.add(floor)
//创建物理世界
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
})
const damping = 0.01

//创建物理平面
const planeShape = new CANNON.Plane()
const floorMaterial = new CANNON.Material('ground')
const planeBody = new CANNON.Body({
  mass: 0, //质量为0，表示不动
  position: new CANNON.Vec3(0, -5, 0),
  material: floorMaterial,
})
planeBody.addShape(planeShape)
// planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
world.addBody(planeBody)
//创建物理小球
const sphereShape = new CANNON.Sphere(1)
const sphereWorldMaterial = new CANNON.Material()
const sphereBody = new CANNON.Body({
  mass: 12, //小球质量
  position: new CANNON.Vec3(0, 0, 0),
  material: sphereWorldMaterial,
})
sphereBody.addShape(sphereShape)
sphereBody.linearDamping = damping

world.addBody(sphereBody)
// 设置2种材质碰撞的参数
const defaultContactMaterial = new CANNON.ContactMaterial(floorMaterial, sphereWorldMaterial, {
  //   摩擦力
  friction: 0.0,
  // 弹性
  restitution: 0.7,
})

// 讲材料的关联设置添加的物理世界
world.addContactMaterial(defaultContactMaterial)

//创建击打声
const hitSound = new Audio('/assets/metalHit.mp3')
//监听碰撞事件
function hitEvent(e) {
  console.log('碰撞了', e)
  //获取碰撞的强度
  const impactStrength = e.contact.getImpactVelocityAlongNormal()
  console.log('碰撞强度', impactStrength)
  if (impactStrength > 5) {
    hitSound.play()
  }
}
sphereBody.addEventListener('collide', hitEvent)

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
//添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.castShadow = true
directionalLight.position.set(0, 0.8, 0)
scene.add(directionalLight)

const clock = new THREE.Clock()
function start() {}

function animate() {
  let deltaTime = clock.getDelta()

  world.step(1 / 120, deltaTime)
  sphere.position.copy(sphereBody.position)

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  world.fixedStep()

  // sphere.quaternion.copy(sphereBody.quaternion)
}
animate()

window.addEventListener('resize', () => {
  //更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像头的投影矩阵
  camera.updateProjectionMatrix()
  //更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
})
