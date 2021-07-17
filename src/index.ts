import { BoxGeometry, Mesh, PerspectiveCamera, Scene, WebGLRenderer, PlaneGeometry, DoubleSide, SphereGeometry, MeshLambertMaterial, PointLight, AmbientLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new Scene();
const camera = generateCamera();
const renderer = generateRenderer();
const controls = new OrbitControls( camera, renderer.domElement );

const container: HTMLElement | any = document.getElementById("three");
container.appendChild( renderer.domElement );

const cube = generateCube();
scene.add(cube);

const plane = generatePlane();
scene.add(plane);

const sphere = generateSphere();
scene.add(sphere);

const light = generatePointLight();
scene.add( light )

const ambientLight = new AmbientLight( 0x404040 ); // soft white light
scene.add( ambientLight );

const animate = function () {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  controls.update();
  renderer.render( scene, camera );
};

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
  return cube;
}

function generatePlane(): Mesh {
  const planeGeometry = new PlaneGeometry( 30, 30 );
  const planeMaterial = new MeshLambertMaterial( {color: 0xffff00, side: DoubleSide} );
  const plane = new Mesh( planeGeometry, planeMaterial );
  plane.position.set(0, -5, 0);
  plane.rotateX( - Math.PI / 2);
  return plane;
}

function generateSphere(): Mesh {
  const geometry = new SphereGeometry( 5, 5, 5 );
  const material = new MeshLambertMaterial( {color: 0xffffff} );
  const sphere = new Mesh( geometry, material );
  sphere.position.set(-10, 0, 0);
  return sphere;
}

function generatePointLight(): PointLight {
  const light = new PointLight( 0xffffff, 3, 100 );
  light.position.set( 5, 10, 5 );
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