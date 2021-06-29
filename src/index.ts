import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer, PlaneGeometry, DoubleSide, DirectionalLight, AmbientLight } from 'three';

const container: HTMLElement | any = document.getElementById("three");

const scene = new Scene();
const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

const renderer = new WebGLRenderer();
renderer.setSize( 1000, 1000 );
container.appendChild( renderer.domElement );

const cube = generateCube();
scene.add(cube);

const plane = generatePlane();
scene.add(plane);

const animate = function () {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
};

animate();

function generateCube(): Mesh {
  const geometry = new BoxGeometry();
  const material = new MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new Mesh( geometry, material );
  return cube;
}

function generatePlane(): Mesh {
  const planeGeometry = new PlaneGeometry( 30, 30 );
  const planeMaterial = new MeshBasicMaterial( {color: 0xffff00, side: DoubleSide} );
  const plane = new Mesh( planeGeometry, planeMaterial );
  plane.position.set(0, -5, 0);
  plane.rotateX( - Math.PI / 2);
  return plane;
}