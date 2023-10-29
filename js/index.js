const axis = new THREE.AxesHelper(8);
const scene = new THREE.Scene();
const renderer = new THREE.WebGL1Renderer();
const directionalLight = new THREE.DirectionalLight(0xfffff);
directionalLight.castShadow = true;
directionalLight.position.set(0,10,3)
const lighthelper = new THREE.DirectionalLightHelper(directionalLight,2,0x00ffff)
const ambientLighting= new THREE.AmbientLight(0xffffff);
scene.add(ambientLighting,directionalLight,lighthelper)
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.setSize(innerWidth, innerHeight);
document.body.append(renderer.domElement)
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

//model loader in gltf//
let ModelLoader = (function () {
    let loader = new THREE.GLTFLoader();
    return function (url,callback) {
        return loader.load(url,callback)
    }
})();

//example of loaded asset//
// ModelLoader('./res/shaders/scene.gltf',(GLscene)=>{
//     console.log(GLscene);
//     scene.add(GLscene.scene)
// })

//texture loader//
let loadImgFromURL = (function () {
    let loader = new THREE.TextureLoader();
    return (url) => {
        return loader.load(url)
    }
})();

//font loader//;
let fontLoader = (function () {
    let loader = new THREE.FontLoader();
    return (url,text,callback) => {
        loader.load(url,font=>{
            return callback(font)
        })
    }
})();
//font loader template//
// let font = fontLoader('./res/fonts/gentilis_bold.typeface.json','hello world',font=>{
//     scene.add(new THREE.Mesh(new THREE.TextGeometry('hello world',{
//         height:2,
//         size:1,
//         font
//     }),new THREE.MeshNormalMaterial()))
// })

let terrainHeightMap = loadImgFromURL('./res/img/images.jpeg')

//raycaster
let mouse3D = (function () {
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    addEventListener('mousemove', e => {
        pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        let intersects = raycaster.intersectObjects(scene.children)
        for (const child of intersects) {
            //do something to the objects
        }
    })
})()

var orbiter = new THREE.OrbitControls(camera, renderer.domElement);
let terrainWidth = 20, terrainHeight = 20;

scene.add(axis)
camera.position.set(1, 1, 20)
addEventListener('resize', function (e) {
    renderer.setSize(innerWidth, innerHeight);
})
function loop(dt) {
    renderer.render(scene, camera);
    requestAnimationFrame(loop)
}
loop()