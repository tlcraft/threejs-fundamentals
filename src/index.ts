import { 
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Clock,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  FontLoader,
  Group,
  LoadingManager,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  NearestFilter,
  OctahedronGeometry,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  RingGeometry,
  Scene,
  SphereGeometry,
  TextGeometry,
  TextureLoader,
  TorusGeometry,
  TorusKnotGeometry,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import { Point } from '~models/point';
import { Cursor } from '~models/cursor';
import { crate, door, doorAmbientOcclusion, doorHeight, doorMetallic, doorNormal, doorOpacity, doorRoughness, gradient, ice } from '~img';

const debugGui = generateDebugGui();

const cursor: Cursor = { x: 1, y: 1 };
const scene = generateScene();
const camera = generatePerspectivCamera();
const renderer = generateRenderer();
const controls = generateControls();
const loadingManager = configureLoadingManager();
const textureLoader = new TextureLoader(loadingManager);
const axesHelper = new AxesHelper();
scene.add(axesHelper);

const doorColorTexture = textureLoader.load(door);
const doorAmbientOcclusionTexture = textureLoader.load(doorAmbientOcclusion);
const doorHeightTexture = textureLoader.load(doorHeight);
const doorMetalicTexture = textureLoader.load(doorMetallic);
const doorNormalTexture = textureLoader.load(doorNormal);
const doorOpacityTexture = textureLoader.load(doorOpacity);
const doorRoughnessTexture = textureLoader.load(doorRoughness);
const gradientTexture = textureLoader.load(gradient);

const container: HTMLElement | any = document.getElementById("three");
container.appendChild( renderer.domElement );

const sharedMaterial = generateNormalMaterial();

const materialSphere = generateMaterialSphere();
scene.add(materialSphere);

const materialPlane = generateMaterialPlane();
scene.add(materialPlane);

const materialTorus = generateMaterialTorus();
scene.add(materialTorus);

const cube = generateCube();
scene.add(cube);

const texturedCube = generateCubeWithTexture();
scene.add(texturedCube);

const texturedIceCube = generateCubeWithIceTexture();
scene.add(texturedIceCube);

const mesh = generateBufferGeometry();
scene.add(mesh);

const plane = generatePlane();
scene.add(plane);

const sphere = generateSphere();
scene.add(sphere);

const circle = generateCircle();
scene.add(circle);

const knot = generateTorusKnot();
scene.add(knot);

const ring = generateRing();
scene.add(ring);

const octahedron = generateOctahedron();
scene.add(octahedron);

addText(scene, 'Hello three.js!', { x: -40, z: -60});
addText(scene, 'Test', { x: -40, y: 30, z: -60});

const light = generatePointLight();
scene.add( light )

const rocket = generateRocketGroup();
scene.add(rocket);

const ambientLight = new AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );

// Tween camera and object
gsap.to(knot.position, { duration: 3, delay: 1,  x: -60});
//gsap.to(camera.position, { duration: 5, delay: 1, x: 20, y: 20, z: 30});

const clock = new Clock();
const animate = function () {
    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    cube.rotation.x += delta;
    cube.rotation.y += delta;

    sphere.rotation.y += delta;

    materialSphere.rotation.x += 0.12 * delta;
    materialSphere.rotation.y += 0.2 * delta;

    materialTorus.rotation.x +=  0.12 * delta;
    materialTorus.rotation.y +=  0.2 * delta;

    // Alternative control schemes
    // camera.position.x = cursor.x * 100;
    // camera.position.y = cursor.y * 100;
    
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    // camera.position.y = cursor.y * 5;
    // camera.lookAt(axesHelper.position);

    moveRing(ring);

    controls.update();
    renderer.render( scene, camera );
};

configurDebugGui();

function generateDebugGui(): dat.GUI {
    const debugGui = new dat.GUI({ 
        closed: true, 
        width: 350,
    });
    debugGui.hide();
    return debugGui;
}

function configurDebugGui(): void {
    configureMeshDebug(cube, 'cube');
    configureMeshDebug(texturedCube, 'textured cube');
    configureMeshDebug(mesh, 'buffer mesh');
    configureMeshDebug(plane, 'plane');
    configureMeshDebug(sphere, 'sphere');
    configureMeshDebug(circle, 'circle');
    configureMeshDebug(knot, 'know');
    configureMeshDebug(ring, 'ring');
    configureMeshDebug(octahedron, 'octahedron');
}

function configureMeshDebug(mesh: Mesh<BufferGeometry, MeshLambertMaterial | MeshBasicMaterial>, name: string): void {
    const folder = debugGui.addFolder(`${name} section`);
    folder.add(mesh.position, 'x').min(mesh.position.x-10).max(mesh.position.x+10).step(0.01).name('x-axis');
    folder.add(mesh.position, 'y').min(mesh.position.y-10).max(mesh.position.y+10).step(0.01).name('y-axis');
    folder.add(mesh.position, 'z').min(mesh.position.z-10).max(mesh.position.z+10).step(0.01).name('z-axis');

    folder.add(mesh, 'visible');
    folder.add(mesh.material, 'wireframe');

    const parameters = {
        color: mesh.material.color.getHex()
    };

    folder.addColor(parameters, 'color').onChange(() => {
        mesh.material.color.set(parameters.color);
    });
}

function moveRing(ring: Mesh): void {
    ring.position.z = (Math.sin(clock.elapsedTime) * 2) + 15;
}

function configureLoadingManager(): LoadingManager {
    const loadingManager = new LoadingManager();
    // Configure logging as needed
    // loadingManager.onStart = () => {
    //     console.log('onStart');
    // };
    // loadingManager.onLoad = () => {
    //     console.log('onLoad');
    // };
    // loadingManager.onProgress = () => {
    //     console.log('onProgress');
    // };
    // loadingManager.onError = () => {
    //     console.log('onError');
    // };
    return loadingManager;
}

function generateScene(): Scene {
    const scene = new Scene();
    scene.background = new Color( 0xcccccc );
    return scene;
}

function generatePerspectivCamera(): PerspectiveCamera { // Vision like a cone
    // A field of view between 45 and 75 is generally sufficent depending on your needs
    const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.setZ(25);
    return camera;
}

function generateOrthographicCamera(): OrthographicCamera { // Vision like a box
    const aspectRatio = window.innerWidth / window.innerHeight;
    const camera = new OrthographicCamera( -30 * aspectRatio,  30 * aspectRatio, 30, -30, 0.1, 1000 );
    camera.position.setZ(25);
    return camera;
}

function generateRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return renderer;
}

function generateControls(): OrbitControls {
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    return controls;
}

function generateBasicMaterial(): Material {
    const sharedMaterial = new MeshBasicMaterial({ side: DoubleSide });
    sharedMaterial.map = doorColorTexture;
    sharedMaterial.alphaMap = doorOpacityTexture;
    sharedMaterial.transparent = true;
    return sharedMaterial;
}

function generateNormalMaterial(): Material {
    const sharedMaterial = new MeshNormalMaterial({ side: DoubleSide });
    sharedMaterial.normalMap = doorNormalTexture;
    sharedMaterial.flatShading = true;
    return sharedMaterial;
}

function generateCube(): Mesh<BufferGeometry, MeshLambertMaterial> {
    const geometry = new BoxGeometry();
    const material = new MeshLambertMaterial( { color: 0x00ff00, wireframe: true } );
    const cube = new Mesh( geometry, material );
    cube.position.x = 10;
    return cube;
}

function generateCubeWithTexture(): Mesh<BufferGeometry, MeshBasicMaterial> {
    const geometry = new BoxGeometry();
    const texture = textureLoader.load(crate);
    const material = new MeshBasicMaterial( { map: texture } );
    const cube = new Mesh( geometry, material );
    cube.position.x = 15;
    return cube;
}

function generateCubeWithIceTexture(): Mesh<BufferGeometry, MeshBasicMaterial> {
    const geometry = new BoxGeometry();
    const texture = textureLoader.load(ice);
    texture.rotation = Math.PI / 4;
    texture.center.x = 0.5;
    texture.center.y = 0.5;
    texture.minFilter = NearestFilter;

    const material = new MeshBasicMaterial( { map: texture } );
    const cube = new Mesh( geometry, material );
    cube.position.x = 10;
    cube.position.z = -5;
    return cube;
}

function generateBufferGeometry(): Mesh<BufferGeometry, MeshLambertMaterial> {
    const numberOfTriangles = 2;
    const totalLength = numberOfTriangles * 9; // 3 points with 3 values (x, y, z) each
    const positions = new Float32Array(totalLength); // x, y, z vertices
    for(let i = 0; i < totalLength; i++) {
        positions[i] = Math.random() - 1;
    }

    const positionsAttribute = new BufferAttribute(positions, 3);

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', positionsAttribute);
    const material = new MeshLambertMaterial( { color: 0x00ff00, wireframe: true } );
    const mesh = new Mesh( geometry, material );

    return mesh;
}

function generatePlane(): Mesh<BufferGeometry, MeshLambertMaterial> {
    const planeGeometry = new PlaneGeometry( 60, 60 );
    const planeMaterial = new MeshLambertMaterial( {color: 0xff5733, side: DoubleSide} );
    const plane = new Mesh( planeGeometry, planeMaterial );
    plane.position.set(0, -10, 0);
    plane.rotateX( - Math.PI / 2);
    return plane;
}

function generateMaterialPlane(): Mesh<BufferGeometry, MeshBasicMaterial> {
    const plane = new Mesh( 
        new PlaneGeometry( 2, 2 ),
        sharedMaterial 
    );
    plane.position.set(10, -5, 0);
    return plane;
}

function generateSphere(): Mesh<BufferGeometry, MeshLambertMaterial> {
    const geometry = new SphereGeometry( 5, 15, 15 );
    const material = new MeshLambertMaterial( {color: 0x338dff} );
    const sphere = new Mesh( geometry, material );
    sphere.position.set(-10, 0, 0);
    return sphere;
}

function generateMaterialSphere(): Mesh<BufferGeometry, MeshBasicMaterial> {
    const materialSphere = new Mesh(
        new SphereGeometry(0.5, 10, 16),
        sharedMaterial
    );
    materialSphere.position.x = 5;
    materialSphere.position.y = -5;
    return materialSphere;
}

function generateCircle(): Mesh<BufferGeometry, MeshLambertMaterial> {
    const geometry = new CircleGeometry( 5, 48 );
    const material = new MeshLambertMaterial( { color: 0xB0B000, side: DoubleSide } );
    const circle = new Mesh( geometry, material );
    circle.position.set(0, 0, -15);
    return circle;
}

function generateTorusKnot(): Mesh<BufferGeometry, MeshLambertMaterial> {
    const geometry = new TorusKnotGeometry( 10, 3, 100, 16 );
    const material = new MeshLambertMaterial( { color: 0x22ff88 } );
    const torusKnot = new Mesh( geometry, material );
    torusKnot.position.set(-40, 10, -15);
    torusKnot.scale.set(0.5, 0.5, 0.5);
    return torusKnot;
}

function generateMaterialTorus(): Mesh<BufferGeometry, MeshBasicMaterial> {
    const materialTorus = new Mesh(
        new TorusGeometry(0.5, 0.2, 16, 32),
        sharedMaterial
    );
    materialTorus.position.x = 1;
    materialTorus.position.y = -5;
    return materialTorus;
}

function generateRing(): Mesh<BufferGeometry, MeshLambertMaterial> {
    const geometry = new RingGeometry( 4.6, 5, 64 );
    const material = new MeshLambertMaterial( { color: 0x00ffff, side: DoubleSide } );
    const ring = new Mesh( geometry, material );
    ring.position.set(0, 5, 15);
    return ring;
}

function generateOctahedron(): Mesh<BufferGeometry, MeshLambertMaterial> {
    const geometry = new OctahedronGeometry( 3 );
    const material = new MeshLambertMaterial( { color: 0x00ffff } );
    const octahedron = new Mesh( geometry, material );
    octahedron.position.set(0, 5, 15);
    return octahedron;
}

function addText(scene: Scene, text: string, position: Point): void {
    const loader = new FontLoader();
    loader.load( 'https://threejs.org/examples/fonts/droid/droid_serif_bold.typeface.json', function ( font ) {
        const geometry = new TextGeometry( text, {
            font: font,
            size: 10,
            height: 5,
            bevelEnabled: false
        });

        const material = new MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );
        const mesh = new Mesh( geometry, material );
        mesh.position.z = position.z ? position.z : 0;
        mesh.position.y = position.y ? position.y : 0;
        mesh.position.x = position.x ? position.x : 0;
        scene.add(mesh);
    });
}

function generateRocketGroup(): Group {
    const group = new Group();

    const cone = new Mesh(
        new ConeGeometry(3, 10, 64),
        new MeshLambertMaterial({ color: 0x0f0f0f })
    );

    const cylinder = new Mesh(
        new CylinderGeometry(3, 3, 10, 64),
        new MeshLambertMaterial({ color: 0x0f0f0f })
    );
    cylinder.position.y = -10;

    group.add(cone);
    group.add(cylinder);

    group.scale.set(0.75, 0.75, 0.75);
    group.position.y = 15;

    return group;
}

function generatePointLight(): PointLight {
    const light = new PointLight( 0xffffff, 3, 100 );
    light.position.set( 15, 20, 5 );
    return light;
}

function onKeyDown(event: any): void{
    switch(event.keyCode) {
        case 83: // forward W
            camera.position.z += 0.25;
            break;
        case 87: // backward S
            camera.position.z -= 0.25;
            break;
        case 65: // left A
            camera.position.x -= 0.25;
            break;
        case 68: // right D
            camera.position.x += 0.25;
            break;
        case 38: // up arrow
            camera.position.y += 0.25;
            break;
        case 40: // down arrow
            camera.position.y -= 0.25;
            break;
        default:
            break;
    }
}

document.body.addEventListener( 'keydown', onKeyDown, false );

window.addEventListener('mousemove', (event: any) => {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = (event.clientY / window.innerHeight - 0.5);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if(!fullscreenElement) {
        if(container.requestFullscreen){
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
    } else {
        if(document.exitFullscreen){
            document.exitFullscreen();
        } else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen();
        }
    }
});

animate();
