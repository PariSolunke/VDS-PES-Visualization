
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

d3.csv("/../../PESscores.csv").then(function(data) {


$(function() 
{

var getZVal = d3.scaleLinear()
    .domain([1986, 2016])
	.range([0, 10])
	
var getXVal = d3.scaleLinear()
    .domain([0, 370314])
	.range([0, 10]);

var getYVal = d3.scaleLinear()
    .domain([0, 8])
    .range([0, 10]);
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
var iteration=1,filters=0;
let box = document.querySelector('#scene');
let width = box.clientWidth;

const camera = new THREE.OrthographicCamera( -3, 12, 14, -1.5,1,1000 );
//new THREE.PerspectiveCamera( 90, width / 750, 0.1, 10000 );

const renderer = new THREE.WebGLRenderer();

renderer.setSize( width, 750 );
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

camera.position.x = -17;
controls.update();
camera.position.z = 2.905087950614372;

controls.update();
camera.position.y = 3.673679755767618;
controls.update();
camera.lookAt(5,5,5)
controls.update();

scene.add( axesHelper );


const loader = new THREE.FontLoader();

loader.load( 'helvetiker_regular.typeface.json', function ( font ) {

for(var i=1988; i<=2016; i=i+2) 
{	var textGeo = new THREE.TextGeometry( i.toString(), {
		font: font,
		size: 0.20,
		height: 0.35
	} );
	var material = new THREE.MeshBasicMaterial({color: 0x111111});
var textMesh = new THREE.Mesh(textGeo, material); 
textMesh.lookAt( camera.position );
textMesh.position.set(0, -0.7, getZVal(i));

scene.add(textMesh);
}

for(var i=0; i<=8; i++) 
{	
	if(i!=8)
	var textGeo = new THREE.TextGeometry( i.toString(), {
		font: font,
		size: 0.20,
		height: 0.35});
	else
	var textGeo = new THREE.TextGeometry( "No Job", {
		font: font,
		size: 0.20,
		height: 0.35
	} );	
	var material = new THREE.MeshBasicMaterial({color: 0x111111});
var textMesh = new THREE.Mesh(textGeo, material); 
textMesh.lookAt( camera.position );
textMesh.position.set(0,getYVal(i) , -1);

scene.add(textMesh);
}
for(var i=0; i<=300000; i=i+50000) 
{	var textGeo = new THREE.TextGeometry( i.toString(), {
		font: font,
		size: 0.20,
		height: 0.35
	} );
	var material = new THREE.MeshBasicMaterial({color: 0x111111});
var textMesh = new THREE.Mesh(textGeo, material); 
textMesh.lookAt( -2,20,0 );
textMesh.position.set(getXVal(i), 0, -1 );
scene.add(textMesh);

if(i==50000)
{
	var textGeo = new THREE.TextGeometry( "Wage(USD)", {
		font: font,
		size: 0.20,
		height: 0.35
	} );
	var material = new THREE.MeshBasicMaterial({color: 0x111111});
var textMesh = new THREE.Mesh(textGeo, material); 
textMesh.lookAt( -2,20,0 );
textMesh.position.set(getXVal(350000), 0, -2 );
scene.add(textMesh);

}
}
drawView();

} );

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
		filtData = filtData.filter(d => d.female==selGend);
		ogData = ogData.filter(d => d.female!=selGend);
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
		var z=getZVal(data[i].year);
		var y=getYVal(data[i].precarity_age);
		var x=getXVal(data[i].wages);
		geometry1.vertices.push(new THREE.Vector3(x,y ,z));
		if(data[i].female==1)
		geometry1.colors.push(new THREE.Color(0xebc36a));
		else
		geometry1.colors.push(new THREE.Color(0x2644ed));
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
				var z1=getZVal(ogData[i].year);
				var y1=getYVal(ogData[i].precarity_age);
				var x1=getXVal(ogData[i].wages);
				geometry1.vertices.push(new THREE.Vector3(x1,y1 ,z1));
				if(ogData[i].female==1)
				geometry1.colors.push(new THREE.Color(0xebc36a));
				else
				geometry1.colors.push(new THREE.Color(0x2644ed));
				}
				var z2=getZVal(filtData[i].year);
				var y2=getYVal(filtData[i].precarity_age);
				var x2=getXVal(filtData[i].wages);
				geometry2.vertices.push(new THREE.Vector3(x2,y2 ,z2));
				if(filtData[i].female==1)
				geometry2.colors.push(new THREE.Color(0xebc36a));
				else
				geometry2.colors.push(new THREE.Color(0x2644ed));
		
			}
		}
		else
		{
			for(var i=0; i<ogData.length; i++) 
			{
				
				var z1=getZVal(ogData[i].year);
				var y1=getYVal(ogData[i].precarity_age);
				var x1=getXVal(ogData[i].wages);
				geometry1.vertices.push(new THREE.Vector3(x1,y1 ,z1));
				if(ogData[i].female==1)
				geometry1.colors.push(new THREE.Color(0xebc36a));
				else
				geometry1.colors.push(new THREE.Color(0x2644ed));
				if(i<filtData.length)
				{
				var z2=getZVal(filtData[i].year);
				var y2=getYVal(filtData[i].precarity_age);
				var x2=getXVal(filtData[i].wages);
				geometry2.vertices.push(new THREE.Vector3(x2,y2 ,z2));
				if(filtData[i].female==1)
				geometry2.colors.push(new THREE.Color(0xebc36a));
				else
				geometry2.colors.push(new THREE.Color(0x2644ed));
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







/*
document.getElementById("scene").addEventListener('pointerup', function(f){ 
	
	setTimeout(function(){
	for(var i=2; i<33;i++)
	{
	scene.children[i].lookAt(camera.position)
	}
	},500);
	
});
*/

const animate = function () {
			
				requestAnimationFrame( animate );
				controls.update();
				

				renderer.render( scene, camera );
			};

animate();
		
});
});
