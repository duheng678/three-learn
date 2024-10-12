// 导入threejs
import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入lil.gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 导入hdr加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
// 导入顶点法向量辅助器
import { VertexNormalsHelper } from "three/examples/jsm/helpers/VertexNormalsHelper.js";
// 导入gltf加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 导入draco解码器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 开启抗锯齿
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 设置相机位置
camera.position.z = 5;
camera.position.y = 4;
camera.position.x = 2;
camera.lookAt(0, 0, 0);

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置带阻尼的惯性
controls.enableDamping = true;
// 设置阻尼系数
controls.dampingFactor = 0.05;
// 设置旋转速度
// controls.autoRotate = true;

// 渲染函数
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  // 渲染
  renderer.render(scene, camera);
}
animate();

// 监听窗口变化
window.addEventListener("resize", () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
});

let eventObj = {
  Fullscreen: function () {
    // 全屏
    document.body.requestFullscreen();
    console.log("全屏");
  },
  ExitFullscreen: function () {
    document.exitFullscreen();
    console.log("退出全屏");
  },
};

// 创建GUI
const gui = new GUI();
// 添加按钮
gui.add(eventObj, "Fullscreen").name("全屏");
gui.add(eventObj, "ExitFullscreen").name("退出全屏");
// 控制立方体的位置
// gui.add(cube.position, "x", -5, 5).name("立方体x轴位置");

// rgbeLoader 加载hdr贴图
let rgbeLoader = new RGBELoader();
rgbeLoader.load("./texture/Alex_Hart-Nature_Lab_Bones_2k.hdr", (envMap) => {
  // 设置球形贴图
  // envMap.mapping = THREE.EquirectangularReflectionMapping;
  envMap.mapping = THREE.EquirectangularRefractionMapping;
  // 设置环境贴图
  scene.background = envMap;
  // 设置环境贴图
  scene.environment = envMap;

  let params = {
    aoMap: true,
  };
  // 实例化加载器gltf
  const gltfLoader = new GLTFLoader();
  // 实例化加载器draco
  const dracoLoader = new DRACOLoader();
  // 设置draco路径
  dracoLoader.setDecoderPath("./draco/");
  // 设置gltf加载器draco解码器
  gltfLoader.setDRACOLoader(dracoLoader);
  // 加载模型
  gltfLoader.load(
    // 模型路径
    "./model/cup.glb",
    // 加载完成回调
    (gltf) => {
      let cup = gltf.scene.getObjectByName("copo_low_01_vidro_0");
      let water = gltf.scene.getObjectByName("copo_low_02_agua_0");
      let ice = gltf.scene.getObjectByName("copo_low_04_vidro_0");

      ice.scale.set(0.86, 0.86, 0.86);
      water.position.z = -1;
      ice.renderOrder = 1;
      water.renderOrder = 2;
      cup.renderOrder = 3;

      // cup.visible = false;
      // water.visible = false;

      console.log("ice", ice);
      console.log("water", water);
      let iceMaterial = ice.material;
      ice.material = new THREE.MeshPhysicalMaterial({
        normalMap: iceMaterial.normalMap,
        metalnessMap: iceMaterial.metalnessMap,
        roughness: 0,
        color: 0xffffff,
        transmission: 0.95,
        transparent: true,
        thickness: 10,
        ior: 2,
        // opacity: 0.5,
      });

      // console.log("iceMaterial", iceMaterial);

      let waterMaterial = water.material;
      water.material = new THREE.MeshPhysicalMaterial({
        map: waterMaterial.map,
        normalMap: waterMaterial.normalMap,
        metalnessMap: waterMaterial.metalnessMap,
        roughnessMap: waterMaterial.roughnessMap,
        transparent: true,
        transmission: 0.95,
        roughness: 0.1,
        thickness: 10,
        ior: 2,
        // opacity: 0.6,
      });

      // water.visible = false;

      cup.material = new THREE.MeshPhysicalMaterial({
        map: cup.material.map,
        normalMap: cup.material.normalMap,
        metalnessMap: cup.material.metalnessMap,
        roughnessMap: cup.material.roughnessMap,
        transparent: true,
        transmission: 0.95,
        roughness: 0.3,
        thickness: 10,
        ior: 2,
        opacity: 0.6,
      });
      // cup.material = material;

      let material = water.material;
      material.blending = THREE.CustomBlending;
      material.blendEquation = THREE.AddEquation;
      material.blendSrc = THREE.SrcAlphaFactor;
      material.blendDst = THREE.SrcColorFactor;

      cup.material.blending = THREE.CustomBlending;
      cup.material.blendEquation = THREE.AddEquation;
      cup.material.blendSrc = THREE.SrcAlphaFactor;
      cup.material.blendDst = THREE.SrcColorFactor;

      gui
        .add(material, "blendEquation", {
          AddEquation: THREE.AddEquation,
          SubtractEquation: THREE.SubtractEquation,
          ReverseSubtractEquation: THREE.ReverseSubtractEquation,
          MinEquation: THREE.MinEquation,
          MaxEquation: THREE.MaxEquation,
        })
        .name("blendEquation");

      gui
        .add(material, "blendSrc", {
          ZeroFactor: THREE.ZeroFactor,
          OneFactor: THREE.OneFactor,
          SrcColorFactor: THREE.SrcColorFactor,
          OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
          SrcAlphaFactor: THREE.SrcAlphaFactor,
          OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
          DstAlphaFactor: THREE.DstAlphaFactor,
          OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
          DstColorFactor: THREE.DstColorFactor,
          OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
          SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
        })
        .name("blendSrc");
      gui
        .add(cup.material, "blendDst", {
          ZeroFactor: THREE.ZeroFactor,
          OneFactor: THREE.OneFactor,
          SrcColorFactor: THREE.SrcColorFactor,
          OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
          SrcAlphaFactor: THREE.SrcAlphaFactor,
          OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
          DstAlphaFactor: THREE.DstAlphaFactor,
          OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
          DstColorFactor: THREE.DstColorFactor,
          OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
          // SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
        })
        .name("blendDst");

      gui
        .add(material, "blendEquationAlpha", {
          AddEquation: THREE.AddEquation,
          SubtractEquation: THREE.SubtractEquation,
          ReverseSubtractEquation: THREE.ReverseSubtractEquation,
          MinEquation: THREE.MinEquation,
          MaxEquation: THREE.MaxEquation,
        })
        .name("blendEquationAlpha");

      gui
        .add(material, "blendSrcAlpha", {
          ZeroFactor: THREE.ZeroFactor,
          OneFactor: THREE.OneFactor,
          SrcColorFactor: THREE.SrcColorFactor,
          OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
          SrcAlphaFactor: THREE.SrcAlphaFactor,
          OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
          DstAlphaFactor: THREE.DstAlphaFactor,
          OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
          DstColorFactor: THREE.DstColorFactor,
          OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
          SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
        })
        .name("blendSrcAlpha");
      gui.add(material, "blendDstAlpha", {
        ZeroFactor: THREE.ZeroFactor,
        OneFactor: THREE.OneFactor,
        SrcColorFactor: THREE.SrcColorFactor,
        OneMinusSrcColorFactor: THREE.OneMinusSrcColorFactor,
        SrcAlphaFactor: THREE.SrcAlphaFactor,
        OneMinusSrcAlphaFactor: THREE.OneMinusSrcAlphaFactor,
        DstAlphaFactor: THREE.DstAlphaFactor,
        OneMinusDstAlphaFactor: THREE.OneMinusDstAlphaFactor,
        DstColorFactor: THREE.DstColorFactor,
        OneMinusDstColorFactor: THREE.OneMinusDstColorFactor,
        // SrcAlphaSaturateFactor: THREE.SrcAlphaSaturateFactor,
      });
      scene.add(gltf.scene);
    }
  );
});
