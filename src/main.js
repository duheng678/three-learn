import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'
console.log(CANNON)
//创建场景
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x293f4a)

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, -8, 10)
scene.add(camera)

//创建渲染器  渲染器透明
const renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
//开启渲染器的阴影
renderer.shadowMap.enabled = true
//创建轨道控制器
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true

//创建坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//创建球和平面

const floor = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshStandardMaterial({ color: 0xcccccc }))
floor.position.set(0, -12, 0)
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
  position: new CANNON.Vec3(0, -12, 0),
  material: floorMaterial,
})
planeBody.addShape(planeShape)
// planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
world.addBody(planeBody)
const cubeWorldMaterial = new CANNON.Material()

// 设置2种材质碰撞的参数
const defaultContactMaterial = new CANNON.ContactMaterial(floorMaterial, cubeWorldMaterial, {
  //   摩擦力
  friction: 0.1,
  // 弹性
  restitution: 0.7,
})

// 讲材料的关联设置添加的物理世界
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

//创建击打声
const hitSound = new Audio('/assets/metalHit.mp3')

const cubeArr = []
function createCube() {
  const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 'red' }))
  cube.castShadow = true
  scene.add(cube)

  //创建物理小球
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  const cubeBody = new CANNON.Body({
    mass: 12, //小球质量
    position: new CANNON.Vec3(0, 0, 0),
    material: cubeWorldMaterial,
  })
  cubeBody.addShape(cubeShape)
  cubeBody.applyLocalForce(
    new CANNON.Vec3(300, 0, 0), //添加力的大小和方向
    new CANNON.Vec3(0, 0, 0) //施加的力所在位置
  )
  cubeBody.linearDamping = damping

  world.addBody(cubeBody)

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
  cubeBody.addEventListener('collide', hitEvent)
  cubeArr.push({ cube, cubeBody })
}

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
//添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.castShadow = true
directionalLight.position.set(0, 0.8, 0)
scene.add(directionalLight)

const clock = new THREE.Clock()

function animate() {
  let deltaTime = clock.getDelta()

  world.step(1 / 120, deltaTime)
  // cube.position.copy(cubeBody.position)
  cubeArr.forEach(item => {
    item.cube.position.copy(item.cubeBody.position)
    item.cube.quaternion.copy(item.cubeBody.quaternion)
  })

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

window.addEventListener('click', createCube)
