import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

d3.csv("/../../PESscores.csv").then(function(data) {


$(function() 
{

var getZ = d3.scaleLinear()
    .domain([1986, 2016])
	.range([0, 10])
	
var getX = d3.scaleLinear()
    .domain([0, 370314])
	.range([0, 10]);

var getY = d3.scaleLinear()
    .domain([0, 8])
    .range([0, 10]);
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
var iteration=1,filters=0;
let box = document.querySelector('#scene');
let width = box.clientWidth;
const camera = new THREE.OrthographicCamera( -1, 12, 12, -1,1,1000 );
const renderer = new THREE.WebGLRenderer();

renderer.setSize( width, 700 );
document.getElementById("scene").appendChild( renderer.domElement );

//const geometry = new THREE.BoxGeometry();
//const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//const cube = new THREE.Mesh( geometry, material );
const light = new THREE.DirectionalLight( 0xdddddd, 1.5);
const axesHelper = new THREE.AxesHelper( 10 );
var axesColors = axesHelper.geometry.attributes.color;

axesColors.setXYZ( 0, 0, 0, 0 ); // index, R, G, B
axesColors.setXYZ( 1, 0, 0, 0 ); // red
axesColors.setXYZ( 2, 0, 0, 0 );
axesColors.setXYZ( 3, 0, 0, 0 ); // green
axesColors.setXYZ( 4, 0, 0, 0 );
axesColors.setXYZ( 5, 0, 0, 0 ); // blue
const controls = new OrbitControls( camera, renderer.domElement );

light.position.set(0,2,20);
light.lookAt(0,0,0);
camera.add(light);
scene.add( camera );
//scene.add( cube );
camera.position.x = -12;
controls.update();
camera.position.z = 0;

controls.update();
camera.position.y = 0;
controls.update();
camera.lookAt(5,5,5)
controls.update();

scene.add( axesHelper );
drawView();
document.getElementById("selRace").addEventListener("change", drawView);
document.getElementById("selGend").addEventListener("change", drawView);
document.getElementById("selEdu").addEventListener("change", drawView);
document.getElementById("selReg").addEventListener("change", drawView);

function drawView()
{
var selRace=document.getElementById("selRace").value;
var selGend=document.getElementById("selGend").value;
var selEdu=document.getElementById("selEdu").value;
var selReg=document.getElementById("selReg").value;
var ogData=data,filtData=data;
	if(iteration!=1)
	{	
	scene.remove(scene.children[(scene.children.length-1)]);
	if (filters!=0)
	scene.remove(scene.children[(scene.children.length-1)]);
	}
	if(selRace!=5||selGend!=3||selEdu!=5||selReg!=5)
	{
		filters++;
		if(selRace!=5)
		{
		filtData = filtData.filter(d => d.race==selRace);
		ogData = ogData.filter(d => d.race!=selRace);
		}
		if(selReg!=5)
		{
		filtData = filtData.filter(d => d.region==selReg);
		ogData = ogData.filter(d => d.region!=selReg);
		}
		if(selEdu!=5)
		{
		filtData = filtData.filter(d => d.edulevel==selEdu);
		ogData = ogData.filter(d => d.edulevel!=selEdu);
		}
		if(selGend!=3)
		{
		filtData = filtData.filter(d => d.gender==selGend);
		ogData = ogData.filter(d => d.gender!=selReg);
		}
	}
	else
	filters=0;
	iteration++;
	if(filters==0)
	{
	var geometry1 = new THREE.Geometry();
	for(var i=0; i<data.length; i++) 
	{
		var z=getZ(data[i].year);
		var y=getY(data[i].precarity_age);
		var x=getX(data[i].wages);
		geometry1.vertices.push(new THREE.Vector3(x,y ,z));
		if(data[i].female==1)
		geometry1.colors.push(new THREE.Color(0x8C0000));
		else
		geometry1.colors.push(new THREE.Color(0x071076));
		}
		var material1 = new THREE.PointsMaterial({
			size: 3, transparent:true,opacity:1, vertexColors: THREE.VertexColors
	  		});
		var pointCloud = new THREE.Points(geometry1, material1);
		scene.add(pointCloud);
}
else
	{
		var geometry1 = new THREE.Geometry();
		var geometry2 = new THREE.Geometry();
		if(ogData.length<filtData.length)
		{
		for(var i=0; i<filtData.length; i++) 
			{
				if(i<ogData.length)
				{
				var z1=getZ(ogData[i].year);
				var y1=getY(ogData[i].precarity_age);
				var x1=getX(ogData[i].wages);
				geometry1.vertices.push(new THREE.Vector3(x1,y1 ,z1));
				if(ogData[i].female==1)
				geometry1.colors.push(new THREE.Color(0x8C0000));
				else
				geometry1.colors.push(new THREE.Color(0x071076));
				}
				var z2=getZ(filtData[i].year);
				var y2=getY(filtData[i].precarity_age);
				var x2=getX(filtData[i].wages);
				geometry2.vertices.push(new THREE.Vector3(x2,y2 ,z2));
				if(filtData[i].female==1)
				geometry2.colors.push(new THREE.Color(0x8C0000));
				else
				geometry2.colors.push(new THREE.Color(0x071076));
		
			}
		}
		else
		{
			for(var i=0; i<ogData.length; i++) 
			{
				
				var z1=getZ(ogData[i].year);
				var y1=getY(ogData[i].precarity_age);
				var x1=getX(ogData[i].wages);
				geometry1.vertices.push(new THREE.Vector3(x1,y1 ,z1));
				if(ogData[i].female==1)
				geometry1.colors.push(new THREE.Color(0x8C0000));
				else
				geometry1.colors.push(new THREE.Color(0x071076));
				if(i<filtData.length)
				{
				var z2=getZ(filtData[i].year);
				var y2=getY(filtData[i].precarity_age);
				var x2=getX(filtData[i].wages);
				geometry2.vertices.push(new THREE.Vector3(x2,y2 ,z2));
				if(filtData[i].female==1)
				geometry2.colors.push(new THREE.Color(0x8C0000));
				else
				geometry2.colors.push(new THREE.Color(0x071076));
				}
			}
		}
		var material1 = new THREE.PointsMaterial({
			size: 3, transparent:true,opacity:0, vertexColors: THREE.VertexColors
			  });
		var material2 = new THREE.PointsMaterial({
				size: 3, transparent:true,opacity:1, vertexColors: THREE.VertexColors
				  });	  
		var pointCloud = new THREE.Points(geometry1, material1);
		var pointCloud2 = new THREE.Points(geometry2, material2);
		scene.add(pointCloud);
		scene.add(pointCloud2);

	}

}










const animate = function () {
				requestAnimationFrame( animate );
				controls.update();

				renderer.render( scene, camera );
			};

animate();
		
});
});
