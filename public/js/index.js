const axis = new THREE.AxesHelper(8);
const scene = new THREE.Scene();
const renderer = new THREE.WebGL1Renderer();
const directionalLight = new THREE.DirectionalLight(0xfffff);
directionalLight.castShadow = true;
directionalLight.position.set(0,-2,10)
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

class Terrain {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.material = new THREE.MeshStandardMaterial({
            color: 0Xfff,
            wireframe: false,
            displacementMap:terrainHeightMap,
            displacementScale:10
        });
        this.geometry = new THREE.PlaneGeometry(terrainWidth, terrainHeight, 50, 50);
        this.self = new THREE.Mesh(this.geometry, this.material);
        this.self.position.set(this.x + terrainWidth / 2, this.y + terrainHeight / 2)
        Terrain.prototype.init = (scene) => {
            scene.add(this.self);
        }
        this.self.castShadow= true;
        this.self.receiveShadow = true;
    }
}
class TerrainGenerator {
    constructor(options) {
        this.options = options || {};
        this.terrain = [];
        TerrainGenerator.prototype.generate = (x, y) => {
            if (y === undefined) {
                for (let i = 0; i < x; i++) {
                    for (let j = 0; j < x; j++) {
                        this.terrain.push(new Terrain(terrainWidth * i, terrainWidth * j))
                    }
                }
                return
            }
            for (let i = 0; i < x; i++) {
                for (let j = 0; j < y; j++) {
                    this.terrain.push(new Terrain(terrainWidth * i, terrainWidth * j))
                }
            }
        }
        TerrainGenerator.prototype.addToscene = (scene) => {
            for (let i = 0; i < this.terrain.length; i++) {
                scene.add(this.terrain[i].self)
            }
        }
    }
}
// let terra = new TerrainGenerator();
// terra.generate(2);
// terra.addToscene(scene)
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