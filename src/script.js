import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'



/**
 * Base
 */
// Debug
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')
const loadingBar = document.querySelector('.loadingBar')
const load = document.querySelector('.load')
// Scene
const scene = new THREE.Scene()

//Points

const points = [
    {
        point: document.querySelector('.point-0'),
        position: new THREE.Vector3(1.7, .5, -1)
    }
]

let loaded = false
/**
 * Loaders
 */
// Texture loader
const loadingManager = new THREE.LoadingManager(
    () => {
        window.setTimeout( () => {

        
            loadingBar.classList.add('ended')
            loadingBar.style.transform = ''
            load.classList.add('end')
            loaded = true
            window.setTimeout(()=>{
                points[0].point.classList.add('visible')
            },1500)

        }, 500)
    },

    (url, loaded, total) => {
        let progress = loaded / total;
        loadingBar.style.transform = `scaleX(${progress})`;
    }
    )


const textureLoader = new THREE.TextureLoader(loadingManager)
const snowflake = textureLoader.load('snowflake.png');



// Draco loader
const dracoLoader = new DRACOLoader(loadingManager)
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
gltfLoader.setDRACOLoader(dracoLoader)


/**
 * Model
 */
gltfLoader.load(
    './winter/scene.gltf',
    (gltf) =>
    {
        scene.add(gltf.scene)
    }
)

/**
 * Fireflies
 */
// Geometry
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 100
const positionArray = new Float32Array(firefliesCount * 3)

for(let i = 0; i < firefliesCount; i++)
{
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 16
    positionArray[i * 3 + 1] = 10
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 16

}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))


const firefliesMaterial = new THREE.PointsMaterial({
    color:'white',
    sizeAttenuation: true,
    size: 0.2,
    map: snowflake,
    transparent: true
})



// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)
console.log(fireflies.geometry)

let velocity = 0.05


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

   
})

const light = new THREE.AmbientLight('white',1);
scene.add(light)


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.maxPolarAngle = Math.PI / 2
controls.maxDistance = 25
controls.minDistance = 4

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

debugObject.clearColor = '#201919'

scene.fog = new THREE.Fog(debugObject.clearColor,25,30)

renderer.setClearColor(debugObject.clearColor)


/**
 * Animate
 */
const clock = new THREE.Clock()

const verticesLength = fireflies.geometry.attributes.position.array.length;
const verticesArr = fireflies.geometry.attributes.position.array;

const tick = () =>
{

    
    const elapsedTime = clock.getElapsedTime()

   
    for(let i = 0; i <= verticesLength; i++ ){

        verticesArr[i * 3 + 1] -= velocity * Math.random()
        

        if(verticesArr[i * 3 + 1] <= 0){
            velocity = 0.05
            verticesArr[i * 3 + 1] = 10
        }
        fireflies.geometry.attributes.position.needsUpdate = true;

    }
    
    velocity += 0.05

    if(loaded){
    for(let point of points){

        const newPosition = point.position.clone();
        newPosition.project(camera);

        const translateX = newPosition.x * sizes.width * 0.5;
        const translateY = - newPosition.y * sizes.height * 0.5;

        point.point.style.transform = `translate(${translateX}px, ${translateY}px)`;
     
    }
}
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()