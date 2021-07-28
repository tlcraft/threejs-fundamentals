import { AxesHelper, BoxGeometry, CylinderGeometry, Group, Mesh, PerspectiveCamera, Scene, WebGLRenderer, PlaneGeometry, DoubleSide, SphereGeometry, MeshLambertMaterial, PointLight, AmbientLight, Color, CircleGeometry, TorusKnotGeometry, RingGeometry, OctahedronGeometry, FontLoader, TextGeometry, MeshPhongMaterial, ConeGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = generateScene();
const camera = generateCamera();
const renderer = generateRenderer();
const controls = new OrbitControls( camera, renderer.domElement );
const axesHelper = new AxesHelper();
scene.add(axesHelper);

const container: HTMLElement | any = document.getElementById("three");
container.appendChild( renderer.domElement );

const cube = generateCube();
scene.add(cube);

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

const text = generateText();
scene.add(text);

const light = generatePointLight();
scene.add( light )

const rocket = generateRocketGroup();
scene.add(rocket);

const ambientLight = new AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );

const animate = function () {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  moveRing(ring);

  controls.update();
  renderer.render( scene, camera );
};

let vector = 0.5;
function moveRing(ring: Mesh): void {
  if(vector < 0 && ring.position.z < 12) {
    vector *= -1;
  } else if (vector > 0 && ring.position.z > 18) {
    vector *= -1;
  }
  ring.position.z += vector;
}

function generateScene(): Scene {
  const scene = new Scene();
  scene.background = new Color( 0xcccccc );
  return scene;
}

function generateCamera(): PerspectiveCamera {
  const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.setZ(25);
  return camera;
}

function generateRenderer(): WebGLRenderer {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  return renderer;
}

function generateCube(): Mesh {
  const geometry = new BoxGeometry();
  const material = new MeshLambertMaterial( { color: 0x00ff00 } );
  const cube = new Mesh( geometry, material );
  cube.position.x = 10;
  return cube;
}

function generatePlane(): Mesh {
  const planeGeometry = new PlaneGeometry( 60, 60 );
  const planeMaterial = new MeshLambertMaterial( {color: 0xff5733, side: DoubleSide} );
  const plane = new Mesh( planeGeometry, planeMaterial );
  plane.position.set(0, -10, 0);
  plane.rotateX( - Math.PI / 2);
  return plane;
}

function generateSphere(): Mesh {
  const geometry = new SphereGeometry( 5, 15, 15 );
  const material = new MeshLambertMaterial( {color: 0x338dff} );
  const sphere = new Mesh( geometry, material );
  sphere.position.set(-10, 0, 0);
  return sphere;
}

function generateCircle(): Mesh {
  const geometry = new CircleGeometry( 5, 48 );
  const material = new MeshLambertMaterial( { color: 0xB0B000, side: DoubleSide } );
  const circle = new Mesh( geometry, material );
  circle.position.set(0, 0, -15);
  return circle;
}

function generateTorusKnot(): Mesh {
  const geometry = new TorusKnotGeometry( 10, 3, 100, 16 );
  const material = new MeshLambertMaterial( { color: 0x22ff88 } );
  const torusKnot = new Mesh( geometry, material );
  torusKnot.position.set(-40, 10, -15);
  torusKnot.scale.set(0.5, 0.5, 0.5);
  return torusKnot;
}

function generateRing(): Mesh {
  const geometry = new RingGeometry( 4.6, 5, 64 );
  const material = new MeshLambertMaterial( { color: 0x00ffff, side: DoubleSide } );
  const ring = new Mesh( geometry, material );
  ring.position.set(0, 5, 15);
  return ring;
}

function generateOctahedron(): Mesh {
  const geometry = new OctahedronGeometry( 3 );
  const material = new MeshLambertMaterial( { color: 0x00ffff } );
  const octahedron = new Mesh( geometry, material );
  octahedron.position.set(0, 5, 15);
  return octahedron;
}

function generateText(): Mesh {
  const loader = new FontLoader();
  let geometry;
  loader.load( 'https://threejs.org/examples/fonts/droid/droid_serif_bold.typeface.json', function ( font ) {
      geometry = new TextGeometry( 'Hello three.js!', {
        font: font,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      });
  });

  var material = new MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );
  var mesh = new Mesh( geometry, material );
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
      case 38: // up
        camera.position.y += 0.25;
        break;
      case 40: // down
        camera.position.y -= 0.25;
        break;
      default:
        break;
    }
}

animate();
document.body.addEventListener( 'keydown', onKeyDown, false );
