// https://discourse.threejs.org/t/how-to-properly-rotate-a-virtual-sphere/54094

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

console.clear( );

var scene = new THREE.Scene();
    scene.background = new THREE.Color( 'gainsboro' );

var camera = new THREE.PerspectiveCamera( 30, innerWidth/innerHeight );
    camera.position.set( 0, 0, 5 );
    camera.lookAt( scene.position );

var renderer = new THREE.WebGLRenderer( {antialias: true} );
    renderer.setSize( innerWidth, innerHeight );
    renderer.setAnimationLoop( animationLoop );
    document.body.appendChild( renderer.domElement );
			
window.addEventListener( "resize", (event) => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix( );
    renderer.setSize( innerWidth, innerHeight );
});

var controls = new OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;

var numPoints = 100;

// from https://discourse.threejs.org/t/how-to-properly-rotate-a-virtual-sphere/54094
function fibonacciSphere( numPoints, point )
{
		var rnd = 1,
  			offset = 2 / numPoints,
  			increment = Math.PI * (3 - Math.sqrt(5));

  	var y = point * offset - 1 + offset / 2,
  			r = Math.sqrt(1 - Math.pow(y, 2));

  	var phi = ((point + rnd) % numPoints) * increment;

		var x = Math.cos(phi) * r,
				z = Math.sin(phi) * r;

		return new THREE.Vector3( x, y, z );
}


// a group to hold all 3D labels
var group = new THREE.Group( );
		scene.add( group );


// load the font
new FontLoader().load( 'https://unpkg.com/three@0.154.0/examples/fonts/helvetiker_regular.typeface.json', createLabels );


// create label when font is loaded
function createLabels( font )
{
		var material = new THREE.MeshBasicMaterial( {color: 'black'} ),
				options = {		font: font,
											size: 0.05,
											height: 0.01,
										};
	
		for( var i=0; i<numPoints; ++i )
		{
    		var geometry = new TextGeometry( `p${i}`, options ),
      			mesh = new THREE.Mesh( geometry, material );
			
	      mesh.position.copy( fibonacciSphere(numPoints,i) );
      	group.add(mesh);
  	}
}


function animationLoop( t )
{
		//group.rotation.y = t/3000;
	
		// turn the labels towards the camera
		for( var label of group.children )
		{
				label.rotation.set(
						controls.getPolarAngle( )-Math.PI/2,
						controls.getAzimuthalAngle( )-group.rotation.y,
						0,
						'YXZ'
				);
		}
	
	
    controls.update( );
    renderer.render( scene, camera );
}
