### Vue Usage (The React example is coming soon) ###

## Live Vue example
[Explainer example vue](https://explainervue.mapalchemy.com/)

Install

```bash
    //Install vue
    npm init vue@latest

    cd your-project-name
    npm install

    //Install explainer
    npm i @mapalchemy/explainer

    //Run
    npm run dev
```

Open TheWelcome.vue in your code editor and overwrite TheWelcome.vue:

```javascript

<script setup>

	import { Vector3 } 								from 'three'
	import { onMounted } 							from 'vue'
	import { useExplainer, Origin, defaultOptions } from '@mapalchemy/explainer'

	onMounted(() => {  insertExplainer () })

	const insertExplainer = ( ) => {

	// 3D Explainer APi 
	const showPlayerUI = true
    const exp = useExplainer ( 'three_container', showPlayerUI )
    exp.add.axis.setOrigin ( Origin.CENTER )

    // Axis X Options    
	exp.add.axis.addXAxis ( { ...defaultOptions, from: -7, to: 7 } )

    // Axis Y Options
    exp.add.axis.addYAxis ( { ...defaultOptions, from: -5, to: 5 } )

    // Axis Z Options
    exp.add.axis.addZAxis ( { ...defaultOptions, from: -2, to: 2, period: 0.5, visible: false } )

	exp.add.axis.create ()

    //Plane
    const plane = exp.add.plane ( 10, 0x000000, 0x99FFFF, [ 4, 5, 0 ] )    

    //Cube
    const cube = exp.add.cube ( 7, 0x00FF00, 0xffd144, [ -4, 5, 0 ] )
    cube.paramMaterial.roughness = 0.8

    //Sphere
    const sphere = exp.add.sphere ( 8, 0x888888, 0x00FFFF, [ -4, -4, 0 ] )
    sphere.heightSegments = 64; sphere.widthSegments = 64
    sphere.paramMaterial.emissiveIntensity = 0.1    

    // Text 
    const text3D = exp.add.text ( '3D Explainer', 4,  0x888888, 0x00FFFF, [ 4, -4.5, 0 ] )
    
    //Function
    const pointsLine = []
    const pointsSin2 = []

    function getSinPoints ( size, count, from, to ) {
        
        const pointsSin  			= []
        const range                 = to - from; 
        const step                  = range/count
        let current                 = from

        for (let i = 1; i < count; i++) {

            current     += step            
            const rad   = size * current * 10 * ( Math.PI / 180 ) - size
            const v     = new Vector3 ( current, 2 * Math.sin ( rad ), 0  )
            const v1    = new Vector3 ( v.x, 2.2 * v.y, -1 )

            pointsSin.push  ( v );  pointsLine.push ( v )
            pointsLine.push ( v1 ); pointsSin2.push ( v1 )
        }
        return pointsSin        
    }
    const sinPoints = getSinPoints ( Math.PI, 80, -4.5, 4.55 )
    const curveSin  = exp.add.curve ( 'V3', sinPoints,   4,  0x00FF00, 0xffd144, )
    const curveSin2 = exp.add.curve ( 'V3', pointsSin2,  4,  0x008888, 0x000000, )
 
    //Line
    const line      = exp.add.line ( 'V3', pointsLine,   2,  0x00FF00, 0xffd144, )

    //Insert All
    exp.add.insert ()

    // Animate 
    if ( exp.xGroup && exp.yGroup && exp.zGroup && plane.plane && text3D.textMesh && sphere.sphereMesh && cube.cube && curveSin.curve && curveSin2.curve && line.line ) {

        const c1 = exp.cameraPosition   ( 'Camera',       2, 0,                    { x: 0, y: 0, z: 4 },    { x: 8, y: 8, z: 2 },                        )
        const a1 = exp.fade             ( 'xAxis',        2, 0, exp.xGroup,        { x: -10, y: 0, z: 0 },  { x: 0, y: 0, z: 0 },   { from: 0, to: 1 }   )    
        
        const a2 = exp.fadeAfter        ( 'yAxis',    a1, 1, 0, exp.yGroup,        { x: 0, y: -10, z: 0 },  { x: 0, y: 0, z: 0 },   { from: 0, to: 1 }   )
        const a25= exp.fadeAfter        ( 'zAxis',    a1, 1, 0, exp.zGroup,        { x: 0, y: 10, z: 0 },   { x: 0, y: 0, z: 0 },   { from: 0, to: 1 }   )
        const t1 = exp.cameraTarget     ( 'CTarget',  a1, 1, 0,                    { x: 0, y: 0, z: 0 },    { x: 4, y: 5, z: 0 },                        )
        
        const a3 = exp.fadeAfter        ( 'Plane',    a2, 2, 0, plane.plane,       { x: 6, y: 6, z: 0 },    { x: 4, y: 5, z: 0 },   { from: 0, to: 1 }   )
        const a4 = exp.fadeAfter        ( 'Text',     a2, 1, 0, text3D.textMesh,   { x: 6, y: -6, z: 0 },   { x: 4, y: -4.5, z: 0 },{ from: 0, to: 1 }   )
    
        const a5 = exp.fadeAfter        ( 'Sphere',   a4, 1, 0, sphere.sphereMesh, { x: -6, y: -6, z: 0 },  { x: -4, y: -4, z: 0 }, { from: 0, to: 1 }   )
        const a6 = exp.fadeAfter        ( 'Cube',     a4, 1, 0, cube.cube,         { x: -6, y: 6, z: 0 },   { x: -4, y: 5, z: 0 },  { from: 0, to: 1 }   )
        //A new feature, rotate: 
		const a65= exp.rotate           ( 'Rotate',   a4, 1, 0, cube.cube,         { x: 0, y: 0, z: 0 },    { x: 0, y: 720, z: 0 }                       )
        const t2 = exp.cameraTarget     ( 'CTarget',  a4, 2, 0,                    { x: 4, y: 5, z: 0 },    { x: 0, y: 0, z: 0 },                        )
        
        const a7 = exp.fadeAfter        ( 'Curve',    a5, 2, 0, curveSin.curve,    { x: 0, y: 0, z: 0 },    { x: 0, y: 0, z: 0 },   { from: 0, to: 1 }   )    
        const c2 = exp.cameraPosAfter   ( 'Camera',   a5, 2, 0,                    { x: 8, y: 8, z: 2 },    { x: 1, y: 0, z: 2 },                        )
        
        const a8 = exp.fadeAfter        ( 'Curve',    a7, 1, 0, curveSin2.curve,   { x: 0, y: 0, z: 0 },    { x: 0, y: 0, z: 0 },   { from: 0, to: 1 }   )
        const a9 = exp.fadeAfter        ( 'Lines',    a8, 2, 0, line.line,         { x: 0, y: 0, z: 0 },    { x: 0, y: 0, z: 0 },   { from: 0, to: 1 }   )
        const c3 = exp.cameraPosAfter   ( 'Camera',   c2, 2, 0,                    { x: 1, y: 0, z: 2 },    { x: 7, y: -4, z: 2 },                       )
        
        if ( print ) console.log( a25, a3, a6, a9, c1, c2, c3, t1, t2, a65 ) 
    }
    exp.animateManager.updatePlayer ( )

    exp.stage.render ( )
	}

</script>

<template>
	
		<div class="three_container" id="three_container" style="height: 600px; width: 800px; background: #424242" >
			Explainer will be inserted here
		</div>		
	
</template>

<style>

	/* Here you can overwrite Bottom Player UI styling */

	.explainerRootDiv {

		height: 100%; 
		min-height: 100%; 
		display: flex; 
		flex-direction: column; 
	}

	.threeDiv {

		flex: 1; 
		display: flex; 
		flex-direction: column; 
		justify-content: center;
		color: #99BBBB;
	}

	.explainerPlayerRootDiv {
		
		height: 60px; 
		display: flex; 
		flex-direction: column; 
		justify-content: center;
		position: relative;
		background: #000;
	}

	.explainerPlayerTooltip {

		position: absolute; 
		color: #99BBBB; 
		left: 500px; 
		top: -30px;
		z-index: 100;
	}

	.explainerPlayerTooltipVal {
		
		padding: 3px;
		padding-left: 6px;
		padding-right: 6px;
		border-radius: 8px;
		font-size: 14px;                       
		outline: 2px solid #99BBBB;
	}

	table {
		border:0px;
		border-collapse:collapse;
		border-spacing:0px;
	}
		
	td { 
		padding:0px; 
		border-width:0px; 
		margin:0px; 
	}

	.explainerPlayerTable {

		width: 100%; 
		
	}

	.explainerPlayerTableTr {

		height: 36px; 
	}

	.explainerPlayerPauseButton {
	
		width: 36px; 
		height: 36px; 
		border-radius: 25px; 
		margin-left: 10px;
		background: '';
	}

	.explainerPlayerPauseButton:hover {

		background: #484848;
	}

	.explainerPlayerPlayButton {

		width: 36px; 
		height: 36px; 
		border-radius: 25px;
		background: '';
	}

	.explainerPlayerPlayButton:hover {

		background: #484848;
	}

	.explainerPlayerSlider {

		width: 100%; 
		accent-color: #99BBBB; 
		padding: 0px; 
		margin: 0px;
		margin-top: 6px;
		height: 10px;
	}

	.explainerPlayerCenterButton {

		width: 36px; 
		height: 36px; 
		border-radius: 25px; 
		margin-right: 10px;
		background: '';
	}

	.explainerPlayerCenterButton:hover {
		background: #484848;
	}

	.explainerMarkers {

		color: #99BBBB; 
		position: relative; 
		width: 0px; 
		height: 40px;
		margin-top: -30px   
	}
</style>

```
If everything went well, you should see this:

![Vue.js application](https://github.com/DaniloBabovic/three-explainer/blob/main/explainer-vue.png)
