
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";

d3.csv("/../../PESscores.csv").then(function(data) {


$(function() 
{
	
		
//scale for z axis values for 3d plot
var getZVal = d3.scaleLinear()
    .domain([1986, 2016])
	.range([0, 20])

	var jitter = 0.75;	
//scale for X axis values for 3d plot
var getXVal = d3.scaleLinear()
    .domain([0, 370314])
	.range([0, 20]);

//scale for Y axis values for 3d plot
var getYVal = d3.scaleLinear()
    .domain([0, 8])
	.range([0, 20]);

var colorWage = d3.scaleLinear()
    .domain([0, 85000])
	.range(["#bcbddc","#3f007d"])	
	
//initiating the scene	
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
var iteration=1,filters=0,prevFilters=0;
let box = document.querySelector('#twoDim');
let width = box.clientWidth;
const camera = new THREE.OrthographicCamera( -6, 24, 28, -3,1,1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, 750 );
document.getElementById("scene").appendChild( renderer.domElement );
const light = new THREE.DirectionalLight( 0xdddddd, 1.5);

//initiating the axes guides and setting the colours
const axesHelper = new THREE.AxesHelper( 20 );
var axesColors = axesHelper.geometry.attributes.color;
axesColors.setXYZ( 0, 0, 0, 0 ); 
axesColors.setXYZ( 1, 0, 0, 0 ); 
axesColors.setXYZ( 2, 0, 0, 0 );
axesColors.setXYZ( 3, 0, 0, 0 ); 
axesColors.setXYZ( 4, 0, 0, 0 );
axesColors.setXYZ( 5, 0, 0, 0 ); 

//adding controls and light to the scene and setting camera position
const controls = new OrbitControls( camera, renderer.domElement );

controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI/2;
controls.minAzimuthAngle =Math.PI*1.5 ;
controls.maxAzimuthAngle = Math.PI*1.6;


light.position.set(0,2,20);
light.lookAt(0,0,0);
camera.add(light);
scene.add( camera );
camera.position.x = -25;
controls.update();
camera.position.z = 0;
controls.update();
camera.position.y = 0;
controls.update();
camera.lookAt(10,10,10)
controls.update();
scene.add( axesHelper );

//load the font for text mesh
const loader = new THREE.FontLoader();
loader.load( 'helvetiker_regular.typeface.json', function ( font ) {

//adding textlabels to Z axis	
for(var i=1988; i<=2016; i=i+2) 
{	var textGeo = new THREE.TextGeometry( i.toString(), {
		font: font,
		size: 0.40,
		height: 0.70
	} );
	var material = new THREE.MeshBasicMaterial({color: 0x111111});
var textMesh = new THREE.Mesh(textGeo, material); 
textMesh.lookAt( camera.position );
textMesh.position.set(0, -2, getZVal(i)-0.25);
scene.add(textMesh);
}

//adding textlabels to Y axis
for(var i=0; i<=8; i++) 
{	
	if(i!=8)
	var textGeo = new THREE.TextGeometry( i.toString(), {
		font: font,
		size: 0.40,
		height: 0.70});
	else
	var textGeo = new THREE.TextGeometry( "No Job", {
		font: font,
		size: 0.40,
		height: 0.70
	} );	
	var material = new THREE.MeshBasicMaterial({color: 0x111111});
var textMesh = new THREE.Mesh(textGeo, material); 
textMesh.lookAt( camera.position );
textMesh.position.set(0,getYVal(i) , -1);
scene.add(textMesh);
}

//adding textlabels to X axis
for(var i=0; i<=300000; i=i+50000) 
{	var textGeo = new THREE.TextGeometry( i.toString(), {
		font: font,
		size: 0.40,
		height: 0.70
	} );
	var material = new THREE.MeshBasicMaterial({color: 0x111111});
var textMesh = new THREE.Mesh(textGeo, material); 
textMesh.lookAt( -4,40,2 );
textMesh.position.set(getXVal(i), 0, -2 );
scene.add(textMesh);

if(i==50000)
{
	var textGeo = new THREE.TextGeometry( "Wage(USD)", {
		font: font,
		size: 0.40,
		height: 0.70
	} );
	var material = new THREE.MeshBasicMaterial({color: 0x111111});
var textMesh = new THREE.Mesh(textGeo, material); 
textMesh.lookAt( -2,20,0 );
textMesh.position.set(getXVal(350000), 0, -4 );
scene.add(textMesh);
}
}
	

} );
//redrawing views whenever filters get changed
document.getElementById("selRace").addEventListener("change", drawView);
document.getElementById("selGend").addEventListener("change", drawView);
document.getElementById("selEdu").addEventListener("change", drawView);
document.getElementById("selReg").addEventListener("change", drawView);

$('input[name=3dToggle]').change(function(){
	if($(this).is(':checked')) 
	{
		document.getElementById("scene").style.display =  "block";
		document.getElementById("twoDim").style.display =  "none";
		drawView();
	//	$('.filters').each(function(){ this.style.display="block";})
    } else {
		document.getElementById("scene").style.display =  "none";
		document.getElementById("twoDim").style.display =  "block";
		drawView();
	//	$('.filters').each(function(){ this.style.display="none";})



    }
});


drawView();

//drawing the 3d plot
function drawView()
{
var selRace=document.getElementById("selRace").value;
var selGend=document.getElementById("selGend").value;
var selEdu=document.getElementById("selEdu").value;
var selReg=document.getElementById("selReg").value;
var ogData=data,filtData=data;
	
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
	
	if(filters==0)
	{
		if($('input[name=3dToggle]').is(':checked')) 
		{
			if(iteration!=1)
			{	
			scene.remove(scene.children[(scene.children.length-1)]);
			if(prevFilters!=0)
			scene.remove(scene.children[(scene.children.length-1)]);
			}	
		iteration++;
		var geometry1 = new THREE.Geometry();
		for(var i=0; i<data.length; i++) 
		{
		var z=getZVal(data[i].year) - jitter/2 + Math.random()*jitter;
		var y=getYVal(data[i].precarity_age);
		var x=getXVal(data[i].wages);
		geometry1.vertices.push(new THREE.Vector3(x,y ,z));
		if(data[i].female==1)
		geometry1.colors.push(new THREE.Color(0xd99282));
		else
		geometry1.colors.push(new THREE.Color(0x5aedc7));
		}
		var material1 = new THREE.PointsMaterial({
			size: 3, transparent:true,opacity:1, vertexColors: THREE.VertexColors
	  		});
		var pointCloud = new THREE.Points(geometry1, material1);
		scene.add(pointCloud);
		}
		else
		{
		drawTwoDim(data,width);
		}
		prevFilters=filters;
	}
else
	{
		if($('input[name=3dToggle]').is(':checked')) 
		{
			if(iteration!=1)
			{	
			scene.remove(scene.children[(scene.children.length-1)]);
			if(prevFilters!=0)
			scene.remove(scene.children[(scene.children.length-1)]);
			}	
		iteration++;	
		var geometry1 = new THREE.Geometry();
		var geometry2 = new THREE.Geometry();
		if(ogData.length<filtData.length)
		{
		for(var i=0; i<filtData.length; i++) 
			{
				if(i<ogData.length)
				{
				var z1=getZVal(ogData[i].year) -jitter/2 + Math.random()*jitter;
				var y1=getYVal(ogData[i].precarity_age);
				var x1=getXVal(ogData[i].wages);
				geometry1.vertices.push(new THREE.Vector3(x1,y1 ,z1));
				if(ogData[i].female==1)
				geometry1.colors.push(new THREE.Color(0xd99282));
				else
				geometry1.colors.push(new THREE.Color(0x5aedc7));
				}
				var z2=getZVal(filtData[i].year) -jitter/2 + Math.random()*jitter;
				var y2=getYVal(filtData[i].precarity_age);
				var x2=getXVal(filtData[i].wages);
				geometry2.vertices.push(new THREE.Vector3(x2,y2 ,z2));
				if(filtData[i].female==1)
				geometry2.colors.push(new THREE.Color(0xd99282));
				else
				geometry2.colors.push(new THREE.Color(0x5aedc7));
		
			}
		}
		else
		{
			for(var i=0; i<ogData.length; i++) 
			{
				var z1=getZVal(ogData[i].year)- jitter/2 + Math.random()*jitter;
				var y1=getYVal(ogData[i].precarity_age);
				var x1=getXVal(ogData[i].wages);
				geometry1.vertices.push(new THREE.Vector3(x1,y1 ,z1));
				if(ogData[i].female==1)
				geometry1.colors.push(new THREE.Color(0xd99282));
				else
				geometry1.colors.push(new THREE.Color(0x5aedc7));
				if(i<filtData.length)
				{
				var z2=getZVal(filtData[i].year)- jitter/2 + Math.random()*jitter;
				var y2=getYVal(filtData[i].precarity_age);
				var x2=getXVal(filtData[i].wages);
				geometry2.vertices.push(new THREE.Vector3(x2,y2 ,z2));
				if(filtData[i].female==1)
				geometry2.colors.push(new THREE.Color(0xd99282));
				else
				geometry2.colors.push(new THREE.Color(0x5aedc7));
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
		else
		drawTwoDim(filtData,width);
		
		prevFilters=filters;
	}

}



function drawTwoDim(ogData,width)
{

document.getElementById("svgOverview").innerHTML="";
// set the dimensions and margins of the graph

var margin = {top: 30, right: 30, bottom: 30, left: 40},
    width = width - margin.left - margin.right,
    height = 780 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#svgOverview")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
		  "translate(" + margin.left + "," + margin.top + ")");



		  var x = d3.scaleBand()
		  .range([ 0, width ])
		  .domain(["1988", "1990", "1992","1994","1996","1998","2000", "2002", "2004","2006","2008", "2010", "2012","2014","2016"])
		  .paddingInner(1)
		  .paddingOuter(.5)
		svg.append("g")
		 
		  .call(d3.axisTop(x))
	  
		// Show the Y scale
		var y = d3.scaleLinear()
		  .domain([-0.5,8])
		  .range([0, height])
		
	  svg.append("g").call(d3.axisLeft(y).ticks(9).tickFormat(function(d) {
			
			if(d == 8) return "Nojob";
			else
			return d;
		  
		   }))
		   
		svg.append("text")
		   .attr("transform", "rotate(-90)")
		   .attr("y", 0 - margin.left)
		   .attr("x",0 - (height / 2))
		   .attr("dy", "1em")
		   .style("text-anchor", "middle")
		   .text("PES Value"); 

		var jitterWidth = 40;
	svg
  .selectAll("indPoints")
  .data(ogData)
  .enter()
  .append("circle")
    .attr("cx", function(d){return(x(d.year) - jitterWidth/2 + Math.random()*jitterWidth )})
    .attr("cy", function(d){return(y(d.precarity_age))})
    .attr("r", 3)
    .style("fill", function(d){

		return colorWage(d.wages);
	});
    
	  



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
var it=1;
const animate = function () {
			
				requestAnimationFrame( animate );
				controls.update();
				renderer.render( scene, camera );
			};

animate();
		
});
});
