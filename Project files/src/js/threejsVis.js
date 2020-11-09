import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
$(function() {
	
const scene = new THREE.Scene();
let box = document.querySelector('#scene');
let width = box.clientWidth;
const camera = new THREE.PerspectiveCamera( 45, width / 800, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();

renderer.setSize( width, 800 );
document.getElementById("scene").appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
const light = new THREE.DirectionalLight( 0xffffff, 1.5);
const axesHelper = new THREE.AxesHelper( 10 );
var axesColors = axesHelper.geometry.attributes.color;

axesColors.setXYZ( 0, 1, 1, 1 ); // index, R, G, B
axesColors.setXYZ( 1, 1, 1, 1 ); // red
axesColors.setXYZ( 2, 1, 1, 1 );
axesColors.setXYZ( 3, 1, 1, 1 ); // green
axesColors.setXYZ( 4, 1, 1, 1 );
axesColors.setXYZ( 5, 1, 1, 1 ); // blue
const controls = new OrbitControls( camera, renderer.domElement );

light.position.set(0,2,20);
light.lookAt(0,0,0);
camera.add(light);
scene.add( camera );
scene.add( cube );
camera.position.x = -5;
controls.update();
camera.position.y = 5;
controls.update();
camera.lookAt(5,5,5)
controls.update();

scene.add( axesHelper );
const animate = function () {
				requestAnimationFrame( animate );
				controls.update();

				renderer.render( scene, camera );
			};

animate();
		
});