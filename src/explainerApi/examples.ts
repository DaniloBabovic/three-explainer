
import { useExplainer, exp } from "./explainer"
import { Origin }            from "./model"
import { Vector2, Vector3 }  from "three"

export const examples = ( ) =>  example_1 ( )


const example_1 = ( log = false ) => {

    // 3D Explainer APi
    const exp = useExplainer ( 'three_container' )
    exp.add.axis.setOrigin ( Origin.CENTER )

    // Axis X Options
    const axisOptX = {
        from: -5, to: 5,    period: 1,      periodSize: 8,
        color: '#888888',   thickness: 2,   fontSize: 4
    }
	exp.add.axis.addXAxis ( axisOptX )

    // Axis Y Options
    const axisOptY = {
        from: -5, to: 5,    period: 1,      periodSize: 8,
        color: '#448888',   thickness: 2,   fontSize: 4
    }
    exp.add.axis.addYAxis ( axisOptY )
	exp.add.axis.create ()

    //Plane
    const plane = exp.add.plane ( 10, 0x000000, 0x99FFFF, [ 4, 5, 1 ] )

    //Cube
    const cube = exp.add.cube ( 7, 0x00FF00, 0xffd144, [ -4, 5, 4 ] )
    cube.paramMaterial.roughness = 0.8

    //Sphere
    const sphere = exp.add.sphere ( 8, 0x888888, 0x00FFFF, [ -4, -4, 8 ] )
    sphere.heightSegments = 64; sphere.widthSegments = 64
    sphere.paramMaterial.emissiveIntensity = 0.1

    // Text
    const text3D = exp.add.text ( '3D Explainer', 4,  0x888888, 0x00FFFF, [ 4, -4.5, 0 ] )

    //Function
    const pointsLine: Vector3[] = []
    const pointsSin2: Vector3[] = []

    function getSinPoints ( size: number, count: number, from: number, to: number ) {

        const pointsSin: Vector3[]  = []
        const range                 = to - from;
        const step                  = range/count
        let current                 = from

        for (let i = 1; i < count; i++) {

            current     += step
            const rad   = size * current * 10 * ( Math.PI / 180 ) - size
            const v     = new Vector3 ( current, 2 * Math.sin ( rad ), 0  )
            const v1    = new Vector3 ( v.x, 2.2 * v.y, -50 )

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
    const a1 = exp.fade      ( 'xAxis',        2, 0, exp.xGroup,        { x: -10, y: 0, z: 0 }, { x: 0, y: 0, z: 0 },   { from: 0, to: 1 } )
    const a2 = exp.fadeAfter ( 'YAxis',    a1, 1, 0, exp.yGroup,        { x: 0, y: -10, z: 0 }, { x: 0, y: 0, z: 0 },   { from: 0, to: 1 } )
    const a3 = exp.fadeAfter ( 'Plane',    a2, 10, 0, plane.plane,      { x: 60, y: 6, z: 0 },   { x: 4, y: 5, z: 1 },   { from: 0, to: 1 } )
    const a4 = exp.fadeAfter ( 'Text',     a2, 1, 0, text3D.textMesh,  { x: 6, y: -6, z: 0 },  { x: 4, y: -4.5, z: 0 },{ from: 0, to: 1 } )
    const a5 = exp.fadeAfter ( 'Sphere',   a4, 1, 0, sphere.sphereMesh,{ x: -6, y: -6, z: 0 }, { x: -4, y: -4, z: 8 }, { from: 0, to: 1 } )
    const a6 = exp.fadeAfter ( 'Cube',     a4, 1, 0, cube.cube,        { x: -6, y: 6, z: 0 },  { x: -4, y: 5, z: 4 },  { from: 0, to: 1 } )
    const a7 = exp.fadeAfter ( 'Curve',    a6, 2, 0, curveSin.curve,   { x: 0, y: 0, z: 0 },   { x: 0, y: 0, z: 0 },   { from: 0, to: 1 } )
    const a8 = exp.fadeAfter ( 'Curve',    a7, 1, 0, curveSin2.curve,  { x: 0, y: 0, z: 0 },   { x: 0, y: 0, z: 0 },   { from: 0, to: 1 } )
    const a9 = exp.fadeAfter ( 'Lines',    a8, 2, 0, line.line,        { x: 0, y: 0, z: 0 },   { x: 0, y: 0, z: 0 },   { from: 0, to: 1 } )

    if ( log  ) console.log( a3, a5, a9 )

    //exp.animateManager.updatePlayer ( )

    exp.stage.render ( )
}

export const testCoordinate = ( ) => {

    if ( !exp ) return

    const v         = new Vector2 ( 0, -50 )
    const position  = exp.coordinate.userToWorldPosition ( v, 0 )

    console.log ( 'testCoordinate', position )

    if ( exp.stage.cube && position ) {

        exp.stage.cube.position.set ( position.x, position.y, 0 )
        exp.stage.render ( )
    }
}

/*
    // Curve
    const curvePoints = new EllipseCurve(
        4,    -3.9,               // ax,          aY
        1,     1,               // xRadius,     yRadius
        0,      2 * Math.PI,    // aStartAngle, aEndAngle
        false,  0               // aClockwise,  aRotation
    );
    const pointsCurve = curvePoints.getPoints( 50 )
    //const curve = exp.add.curve ( 'V2', pointsCurve, 2,  0x00FF00, 0xffd144, )
*/