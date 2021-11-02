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
  CubeTextureLoader,
  CylinderGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  DoubleSide,
  Font,
  Group,
  HemisphereLight,
  HemisphereLightHelper,
  LoadingManager,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  NearestFilter,
  OctahedronGeometry,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  PointLightHelper,
  RectAreaLight,
  RingGeometry,
  Scene,
  SphereGeometry,
  SpotLight,
  SpotLightHelper,
  TextGeometry,
  Texture,
  TextureLoader,
  TorusBufferGeometry,
  TorusGeometry,
  TorusKnotGeometry,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import { Point } from '~models/point';
import { Cursor } from '~models/cursor';
import { clouds_down, clouds_east, clouds_north, clouds_south, clouds_up, clouds_west, crate, door, doorAmbientOcclusion, doorHeight, doorMetallic, doorNormal, doorOpacity, doorRoughness, gradient, ice, matcap, matcapBlue, fiveTone } from '~img';
import * as droid from './fonts/droid_sans_bold.typeface.json';
import * as droidSerif from './fonts/droid_serif_bold.typeface.json';
import * as helvetiker from './fonts/helvetiker_regular.typeface.json';

const debugGui = generateDebugGui();

const clock = new Clock();
const cursor: Cursor = { x: 1, y: 1 };
const scene = generateScene();
const camera = generatePerspectivCamera();
const renderer = generateRenderer();

const loadingManager = configureLoadingManager();
const textureLoader = new TextureLoader(loadingManager);
const cubeTextureLoader = new CubeTextureLoader();

const doorColorTexture = textureLoader.load(door);
const doorAmbientOcclusionTexture = textureLoader.load(doorAmbientOcclusion);
const doorHeightTexture = textureLoader.load(doorHeight);
const doorMetalicTexture = textureLoader.load(doorMetallic);
const doorNormalTexture = textureLoader.load(doorNormal);
const doorOpacityTexture = textureLoader.load(doorOpacity);
const doorRoughnessTexture = textureLoader.load(doorRoughness);
const gradientTexture = textureLoader.load(gradient);
const matcapTexture = textureLoader.load(matcap);
const matcapBlueTexture = textureLoader.load(matcapBlue);
const fiveToneTexture = loadFiveToneTexture();
const environmentMapTexture = cubeTextureLoader.load([
    clouds_east,    // positive x
    clouds_west,    // negative x
    clouds_up,      // positive y
    clouds_down,    // negative y
    clouds_north,   // positive z
    clouds_south    // negative z
]);

const sharedMaterial = generateEnvironmentMaterial();
const matcapMaterial = new MeshMatcapMaterial({matcap: matcapBlueTexture});

function startup(): void {
    const controls = generateControls();
    const axesHelper = new AxesHelper();
    scene.add(axesHelper);

    addTorusesToScene(scene);

    const container: HTMLElement | any = document.getElementById("three");
    container.appendChild( renderer.domElement );

    const materialSphere = generateMaterialSphere();
    scene.add(materialSphere);

    const materialPlane = generateMaterialPlane();
    scene.add(materialPlane);

    const materialTorus = generateMaterialTorus();
    scene.add(materialTorus);

    const gradientSphere = generateGradientSphere();
    scene.add(gradientSphere);

    const toonMesh = generateToonMesh();
    scene.add(toonMesh);

    const basicMesh = generateBasicMesh();
    scene.add(basicMesh);

    const normalMesh = generateNormalMesh();
    scene.add(normalMesh);

    const matcapMesh = generateMatcapMesh();
    scene.add(matcapMesh);

    const standardMesh = generateStandardMesh();
    scene.add(standardMesh);

    const physicalCube = generateCubePhysicalMaterial()
    scene.add(physicalCube);

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

    const helloText = generateTextMesh('Hello three.js!', { x: -20, z: -60}, droid);
    scene.add(helloText);

    const testText = generateTextMesh('Test', { x: -20, y: 30, z: -60}, helvetiker);
    scene.add(testText);

    const droidSerifText = generateTextMesh('Droid Serif', { x: -20, y: 60, z: -60}, droidSerif);
    scene.add(droidSerifText);

    const rocket = generateRocketGroup();
    scene.add(rocket);

    const ambientLight = new AmbientLight( 0x404040, 0.5 );
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0x00ffcc, 0.3);
    directionalLight.position.set(2, 1, 0); // Light goes toward center of scene
    scene.add(directionalLight);

    const directionalLightHelper = new DirectionalLightHelper(directionalLight, 0.2);
    scene.add(directionalLightHelper);

    const hemisphereLight = new HemisphereLight(0x00ff00, 0x0000ff, 0.1);
    scene.add(hemisphereLight);

    const hemisphereLightHelper = new HemisphereLightHelper(hemisphereLight, 0.3);
    scene.add(hemisphereLightHelper);

    const light = generatePointLight();
    scene.add(light);

    const pointLightHelper = new PointLightHelper(light, 0.3);
    scene.add(pointLightHelper);

    const rectAreaLight = new RectAreaLight(0x4e00ff, 10, 10, 10);
    scene.add(rectAreaLight);

    // Color, Intensity, Fade Distance, Angle of Light Ray, Edge Dimness, Decay
    const spotLight = new SpotLight(0x78ff00, 0.75, 150, Math.PI * 0.25, 0.25, 1);
    spotLight.position.set(-25, 2, 10);
    scene.add(spotLight);

    const spotLightHelper = new SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    // Tween camera and object
    gsap.to(knot.position, { duration: 3, delay: 1,  x: -60});
    //gsap.to(camera.position, { duration: 5, delay: 1, x: 20, y: 20, z: 30});

    const animate = function () {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        cube.rotation.x += delta;
        cube.rotation.y += delta;

        sphere.rotation.y += delta;

        materialSphere.rotation.x += 0.12 * delta;
        materialSphere.rotation.y += 0.2 * delta;

        materialTorus.rotation.x +=  0.12 * delta;
        materialTorus.rotation.y +=  0.2 * delta;

        materialPlane.rotation.x +=  0.12 * delta;
        materialPlane.rotation.y +=  0.2 * delta;

        // Alternative control schemes
        // camera.position.x = cursor.x * 100;
        // camera.position.y = cursor.y * 100;
        
        // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
        // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
        // camera.position.y = cursor.y * 5;
        // camera.lookAt(axesHelper.position);

        moveRing(ring);

        controls.update();
        renderer.render(scene, camera);
    };

    configureMeshDebug(cube, 'cube');
    configureMeshDebug(texturedCube, 'textured cube');
    configureMeshDebug(mesh, 'buffer mesh');
    configureMeshDebug(plane, 'plane');
    configureMeshDebug(sphere, 'sphere');
    configureMeshDebug(circle, 'circle');
    configureMeshDebug(knot, 'know');
    configureMeshDebug(ring, 'ring');
    configureMeshDebug(octahedron, 'octahedron');
    configureMeshDebug(materialSphere, 'material sphere');
    configureMeshDebug(materialTorus, 'material torus');
    configureMeshDebug(materialPlane, 'material plane');
    debugGui.add(ambientLight, 'intensity').min(0).max(1).step(0.01);

    animate();
}

function moveRing(ring: Mesh): void {
    ring.position.z = (Math.sin(clock.elapsedTime) * 2) + 15;
}

function generateDebugGui(): dat.GUI {
    const debugGui = new dat.GUI({ 
        closed: true, 
        width: 350,
    });
    debugGui.hide();
    return debugGui;
}

function configureMeshDebug(mesh: Mesh<BufferGeometry, MeshLambertMaterial | MeshBasicMaterial | Material>, name: string): void {
    const folder = debugGui.addFolder(`${name} section`);
    folder.add(mesh.position, 'x').min(mesh.position.x-10).max(mesh.position.x+10).step(0.01).name('x-axis');
    folder.add(mesh.position, 'y').min(mesh.position.y-10).max(mesh.position.y+10).step(0.01).name('y-axis');
    folder.add(mesh.position, 'z').min(mesh.position.z-10).max(mesh.position.z+10).step(0.01).name('z-axis');

    folder.add(mesh, 'visible');
    folder.add(mesh.material, 'wireframe');

    if(mesh.material.hasOwnProperty('color')) {
        const parameters = {
            color: mesh.material.color.getHex()
        };
    
        folder.addColor(parameters, 'color').onChange(() => {
            mesh.material.color.set(parameters.color);
        });
    }

    if(mesh.material.hasOwnProperty('metalness')) {
        folder.add(mesh.material, 'metalness').min(0).max(1).step(0.001);
    }

    if(mesh.material.hasOwnProperty('roughness')) {
        folder.add(mesh.material, 'roughness').min(0).max(1).step(0.001);
    }

    if(mesh.material.hasOwnProperty('aoMapIntensity')) {
        folder.add(mesh.material, 'aoMapIntensity').min(0).max(10).step(0.001);
    }
        
    if(mesh.material.hasOwnProperty('displacementScale')) {
        folder.add(mesh.material, 'displacementScale').min(0).max(1).step(0.001);
    }
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

function loadFiveToneTexture(): Texture {
    const fiveToneTexture = textureLoader.load(fiveTone);
    fiveToneTexture.minFilter = NearestFilter;
    fiveToneTexture.magFilter = NearestFilter;
    fiveToneTexture.generateMipmaps = false;
    return fiveToneTexture;
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

function generateBasicMesh(): Mesh {
    const geometry = new PlaneGeometry( 5, 5 );
    const material = generateBasicMaterial();
    const sphere = new Mesh(geometry, material);
    sphere.position.set(20, 0, 5);
    return sphere;
}

function generateBasicMaterial(): Material {
    const material = new MeshBasicMaterial({ side: DoubleSide });
    material.map = doorColorTexture;
    material.alphaMap = doorOpacityTexture;
    material.transparent = true;
    return material;
}

function generateNormalMesh(): Mesh {
    const geometry = new PlaneGeometry( 3, 3 );
    const material = generateNormalMaterial();
    const sphere = new Mesh(geometry, material);
    sphere.position.set(20, 5, 5);
    return sphere;
}

function generateNormalMaterial(): Material {
    const material = new MeshNormalMaterial({ side: DoubleSide });
    material.normalMap = doorNormalTexture;
    material.flatShading = true;
    return material;
}

function generateMatcapMesh(): Mesh {
    const geometry = new SphereGeometry(2, 64, 64);
    const material = generateMatcapMaterial();
    const sphere = new Mesh(geometry, material);
    sphere.position.set(10, 0, 5);
    return sphere;
}

function generateMatcapMaterial(): Material {
    const material = new MeshMatcapMaterial({ side: DoubleSide });
    material.matcap = matcapTexture;
    return material;
}

function generateToonMesh(): Mesh {
    const geometry = new SphereGeometry(2, 64, 64);
    const material = generateToonMaterial();
    const sphere = new Mesh(geometry, material);
    sphere.position.set(0, 0, 5);
    return sphere;
}

function generateToonMaterial(): Material {
    const material = new MeshToonMaterial({ side: DoubleSide });
    material.gradientMap = fiveToneTexture;
    return material;
}

function generateStandardMesh(): Mesh {
    const geometry = new PlaneGeometry( 3, 3 );
    const material = generateStandardMaterial();
    const sphere = new Mesh(geometry, material);
    sphere.position.set(20, 10, 5);
    return sphere;
}

function generateStandardMaterial(): Material {
    const material = new MeshStandardMaterial({ side: DoubleSide });
    material.metalness = 0;
    material.roughness = 1;
    material.map = doorColorTexture;
    material.aoMap = doorAmbientOcclusionTexture;
    material.aoMapIntensity = 1;
    material.displacementMap = doorHeightTexture;
    material.displacementScale = 0.05;
    material.metalnessMap = doorMetalicTexture;
    material.roughnessMap = doorRoughnessTexture;
    material.normalMap = doorNormalTexture;
    material.normalScale.set(0.5, 0.5);
    material.transparent = true;
    material.alphaMap = doorOpacityTexture;
    return material;
}

function generateEnvironmentMaterial(): Material {
    const material = new MeshStandardMaterial({ side: DoubleSide });
    material.metalness = 0.92;
    material.roughness = 0.05;
    material.envMap = environmentMapTexture;
    return material;
}

function addTorusesToScene(scene: Scene): void {
    const torusGeometry = new TorusBufferGeometry(0.4, 0.3, 20, 45);

    for(let i = 0; i < 100; i++) {
        const torus = new Mesh(torusGeometry, matcapMaterial);

        torus.position.x = (Math.random() - 0.5) * 20;
        torus.position.y = (Math.random() - 0.5) * 20;
        torus.position.z = (Math.random() - 2) * 20;

        torus.rotation.x = Math.random() * Math.PI;
        torus.rotation.y = Math.random() * Math.PI;

        const scale = Math.random();
        torus.scale.set(scale, scale, scale);

        scene.add(torus);
    }
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

function generateCubePhysicalMaterial(): Mesh<BufferGeometry, MeshPhysicalMaterial> {
    const geometry = new BoxGeometry();
    const material = new MeshPhysicalMaterial( { color: 0xeeff00 } );
    const cube = new Mesh( geometry, material );
    cube.position.set(3, -5, -2);
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

function generateMaterialPlane(): Mesh<BufferGeometry, Material> {
    const plane = new Mesh( 
        new PlaneGeometry( 2, 2, 100, 100 ),
        sharedMaterial 
    );
    plane.position.set(10, -5, 0);

    plane.geometry.setAttribute(
        'uv2', new BufferAttribute(plane.geometry.attributes.uv.array, 2)
    );
    return plane;
}

function generateSphere(): Mesh<BufferGeometry, MeshPhongMaterial> {
    const geometry = new SphereGeometry( 5, 64, 64 );
    const material = new MeshPhongMaterial( {color: 0x338dff} );
    material.shininess = 50;
    material.specular = new Color(0x0088ff);
    const sphere = new Mesh( geometry, material );
    sphere.position.set(-10, 0, 0);
    return sphere;
}

function generateMaterialSphere(): Mesh<BufferGeometry, Material> {
    const sphere = new Mesh(
        new SphereGeometry(0.5, 10, 16),
        sharedMaterial
    );
    sphere.position.x = 5;
    sphere.position.y = -5;
    sphere.geometry.setAttribute(
        'uv2', new BufferAttribute(sphere.geometry.attributes.uv.array, 2)
    );
    return sphere;
}

function generateGradientSphere(): Mesh {
    const sphere = new Mesh(
        new SphereGeometry(0.5, 10, 16),
        new MeshLambertMaterial({ map: gradientTexture })
    );
    sphere.position.set(15, -2, 5);

    return sphere;
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

function generateMaterialTorus(): Mesh<BufferGeometry, Material> {
    const torus = new Mesh(
        new TorusGeometry(0.5, 0.2, 64, 128),
        sharedMaterial
    );
    torus.position.x = 1;
    torus.position.y = -5;
    torus.geometry.setAttribute(
        'uv2', new BufferAttribute(torus.geometry.attributes.uv.array, 2)
    );
    return torus;
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

function generateTextMesh(text: string, position: Point, fontJson: any): Mesh {
    const font = new Font(fontJson);
    const geometry = new TextGeometry( 
        text, 
        {
            font,
            size: 10,
            height: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        }
    );

    geometry.center();

    const mesh = new Mesh( geometry, matcapMaterial );
    mesh.position.z = position.z ? position.z : 0;
    mesh.position.y = position.y ? position.y : 0;
    mesh.position.x = position.x ? position.x : 0;
    return mesh;
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
    const light = new PointLight(0xffffff, 3, 100, 2);
    light.position.set(15, 20, 5);
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

startup();
