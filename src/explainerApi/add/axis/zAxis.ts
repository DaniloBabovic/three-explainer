import type {  MeshPhongMaterialParameters }    from "three"
import type { AxisOptions }                     from "../../../index"
import type { Font }                            from 'three/examples/jsm/loaders/FontLoader.js'

import { Direction, Origin }                    from "../../../index"
import { ConvexGeometry }                       from 'three/examples/jsm/geometries/ConvexGeometry.js'
import { Material }                             from "three"

import {

    CatmullRomCurve3,
    Color,
    ConeGeometry,
    DoubleSide,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    ShapeGeometry,
    TubeGeometry,
    Vector3

} from "three"

import type { Axis } from "./axis"

class ZAxis {

    protected axis:             Axis
    protected options:          AxisOptions

    protected paramMaterial:    MeshPhongMaterialParameters
    public    material:         MeshPhongMaterial

    protected  position         = new Vector3 ( )
    protected  startPoint       = new Vector3 ( )
    protected  endPoint         = new Vector3 ( )
    protected  direction        = Direction.LEFT_RIGHT
    protected  textZPosition    = new Vector3 ( )

    public zMesh:               Mesh        | null = null
    public zArrow:              Mesh        | null = null
    public textYMesh:           Mesh        | null = null

    public periodLines:         Mesh[]      = []
    public periodTexts:         Mesh[]      = []

    protected font:             Font
    protected fontSize:         number
    protected origin:           Origin

    public size:                number
    public sizeHalf:            number

    public periodGroup:         Object3D    = new Object3D ( )
    public zArrowGroup:         Object3D    = new Object3D ( )
    public rootGroup:           Object3D    = new Object3D ( )

    constructor (
        axis:       Axis,
        options:    AxisOptions,
        font:       Font,
        origin:     Origin
    ) {

        this.axis       = axis
        this.options    = options
        this.font       = font
        this.fontSize   = options.fontSize
        this.origin     = origin
        this.size       = axis.size
        this.sizeHalf   = axis.sizeHalf

        const color = new Color ( this.options.color )
        const emissive  = new Color ( this.options.emissive )
        
        this.setVisible ( this.options.visible )


        this.paramMaterial = {
            transparent : true,
            opacity : 1,

            color : color,
            specular : 0xf0f0f0,
            emissive : emissive,
            emissiveIntensity : 0.02,
            shininess : 1.2,

            side : DoubleSide, //THREE.FrontSide, THREE.BackSide, THREE.DoubleSide
            flatShading : true, //THREE.SmoothShading, //THREE.FlatShading
            blending : 1, // NoBlending, NormalBlending, AdditiveBlending, SubtractiveBlending, MultiplyBlending, CustomBlending
            fog : true,
            wireframe : false
        }
        this.material = new MeshPhongMaterial ( this.paramMaterial )
        this.createGeometry ( )
        this.axis.exp.coordinate.yDirection = this.direction
    }

    public setVisible ( visible: boolean ) {

        this.periodGroup.visible = visible
        this.zArrowGroup.visible = visible
        this.rootGroup.visible = visible
    }

    createGeometry ( ) {

        const point1 = new Vector3 ( 0, 0, -this.sizeHalf )
        const point2 = new Vector3 ( 0, 0, this.sizeHalf )
        const curve = new CatmullRomCurve3( [point1, point2] )

        const zGeometry = new TubeGeometry (
            curve,
            this.sizeHalf * 6,
            this.options.thickness/5,//radius
            44,
            true
        )

        //Cone
        const radius = 0.5
        const geometryCone = new ConeGeometry (
            3 * radius,
            6 * radius,
            20
        )

        const meshCone = new Mesh( geometryCone, this.material )

        this.setPositions (
            zGeometry,
            meshCone,
            point1, point2
        )

        this.insert ( zGeometry, meshCone )

        this.insertText ( 'Z', this.fontSize, this.textZPosition )
        this.insertPeriods ( )
        this.axis.exp.stage.scene.add ( this.rootGroup )
    }

    setPositions (

        zGeometry:  TubeGeometry,
        meshCone:   Mesh,
        point1:     Vector3,
        point2:     Vector3
    ) {


        const off = this.sizeHalf
        const geometryCone = meshCone.geometry
        const fontSize = this.fontSize

        switch ( this.origin ) {

            case Origin.CENTER:

                this.position.set   ( 0, 0, 0 )
                this.startPoint.set ( 0, 0, -off )
                this.endPoint.set   ( 0, 0, off )
                this.direction      = Direction.BOTTOM_TOP
                zGeometry.translate ( 0, 0, 0 )
                //Cone
                meshCone.position.set   ( point1.x, point1.y, point1.z )
                meshCone.lookAt         ( point2 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( point2.x, 0, 0 )
                this.zArrowGroup.position.set  ( this.position.x, this.position.y, this.size )
                // Text
                this.textZPosition.set ( this.position.x, this.position.y  - 2 * ( fontSize  ), this.sizeHalf )
                break

            case Origin.TOP_LEFT:

                this.position.set   ( -off, off, 0 )
                this.startPoint.set ( -off, off, -off )
                this.endPoint.set   ( -off, -off, off )
                this.direction      = Direction.TOP_BOTTOM
                zGeometry.translate ( 0, 0, 0 )
                //Cone
                meshCone.position.set   ( point1.x, point1.y, point1.z )
                meshCone.lookAt         ( point2 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point2.x, 0 )
                this.zArrowGroup.position.set  ( this.position.x, off, this.size )
                // Text
                this.textZPosition.set ( this.position.x, off + 2 * fontSize, off )
                break

            case Origin.TOP_RIGHT:

                this.position.set   ( off, off, 0 )
                this.startPoint.set ( off, off, -off )
                this.endPoint.set   ( off, -off, off )
                this.direction      = Direction.TOP_BOTTOM
                zGeometry.translate ( 0, 0, 0 )
                //Cone
                meshCone.position.set           ( point1.x, point1.y, point1.z )
                meshCone.lookAt                 ( point2 )
                meshCone.rotateX                ( Math.PI / 2 )
                geometryCone.translate          ( 0, point1.x, 0 )
                this.zArrowGroup.position.set   ( this.position.x, off, this.size )
                // Text
                this.textZPosition.set ( this.position.x, off + fontSize, off )
                break

            case Origin.BOTTOM_LEFT:

                this.position.set   ( 0, 0, 0 )
                this.startPoint.set ( -off, -off, -off )
                this.endPoint.set   ( -off, -off, off )
                this.direction      = Direction.BOTTOM_TOP
                zGeometry.translate ( -off, -off, 0 )

                //Cone
                meshCone.position.set           ( point1.x, point1.y, point1.z )
                meshCone.lookAt                 ( point2 )
                meshCone.rotateX                ( Math.PI / 2 )
                geometryCone.translate          ( 0, point2.x, 0 )
                this.zArrowGroup.position.set   ( -off, -this.sizeHalf, this.size )
                // Text
                this.textZPosition.set ( -off, -this.sizeHalf + ( fontSize ), this.sizeHalf )
                break

            case Origin.BOTTOM_RIGHT:

                this.position.set   ( off, -off, 0 )
                this.startPoint.set ( off, -off, -off )
                this.endPoint.set   ( off, off, off )
                this.direction      = Direction.BOTTOM_TOP
                zGeometry.translate ( 0, 0, 0 )

                //Cone
                meshCone.position.set   ( point1.x, point1.y, point1.z )
                meshCone.lookAt         ( point2 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point2.x, 0 )
                this.zArrowGroup.position.set  ( this.position.x, -off, this.size )
                // Text
                this.textZPosition.set ( this.position.x, -this.sizeHalf + fontSize, off )
                break

            default:
                break
        }
    }

    insert ( yGeometry:  TubeGeometry,  meshCone: Mesh ) {

        // X Axis Tube
        const yMaterial = new MeshPhongMaterial ( this.paramMaterial )
        //const yMaterial = new MeshBasicMaterial ( {color: this.options.color} )
        this.zMesh = new Mesh( yGeometry, yMaterial )
        this.zMesh.position.set ( this.position.x, this.position.y, this.position.z )
        this.rootGroup.add( this.zMesh )

        // X Axis Arrow
        this.zArrowGroup.add ( meshCone )
        this.rootGroup.add( this.zArrowGroup )

        this.zArrow = meshCone
    }


    insertText ( text: string, fontSize: number, position: Vector3, skipInsert = false ) {

        const shapes    = this.font.generateShapes ( text, fontSize )

        const geometry = new ShapeGeometry ( shapes )
        geometry.computeBoundingBox()
        let xMid = 0
        if ( geometry && geometry.boundingBox ) {

            xMid = - 0.5* (
                geometry.boundingBox.max.x -
                geometry.boundingBox.min.x
            )
        }
        geometry.translate( xMid, 0, 0 )
        
        const textMesh = new Mesh( geometry, this.material )
        if ( (this.origin == Origin.TOP_RIGHT) || (this.origin == Origin.BOTTOM_RIGHT) ) {

            textMesh.rotateY( - Math.PI / 2 )

        } else {

            textMesh.rotateY( Math.PI / 2 )
        }
        textMesh.position.set (
            position.x,
            position.y,
            position.z
        )
        if ( !skipInsert ) {

            this.rootGroup.add( textMesh )
        }
        return textMesh
    }

    insertPeriods ( ) {

        const insertPeriod = ( z: number ) => {

            let side = 1

            if ( [Origin.CENTER, Origin.TOP_RIGHT, Origin.BOTTOM_RIGHT, Origin.BOTTOM_LEFT].includes (this.origin) ) side = -1

            const periodSize = this.options.periodSize / 2
            const zSize = this.options.periodSize / 16

            const points: Vector3 [] = []
            points.push( new Vector3( 0, 0, -zSize + z ) )
            points.push( new Vector3( 0, 0, zSize + z ) )
            points.push( new Vector3( 0, side * periodSize, z + zSize ) )
            points.push( new Vector3( 0, side * periodSize, z - zSize ) )

            const meshGeometry = new ConvexGeometry( points )

            const line = new Mesh( meshGeometry, this.material );
            this.periodLines.push ( line )
            this.periodGroup.add ( line )
        }

        const insertPeriodText = ( text: string, z: number ) => {

            let side = 1
            if ( [Origin.CENTER, Origin.TOP_RIGHT, Origin.BOTTOM_RIGHT, Origin.BOTTOM_LEFT].includes (this.origin) ) side = -1

            const position = new Vector3 ( 0, side * this.options.periodSize * 1.8, z )
            const textMesh = this.insertText ( text, this.fontSize, position, true )
            this.periodTexts.push ( textMesh )
            this.periodGroup.add ( textMesh )
        }
        const count = Math.abs (this.options.to - this.options.from) / this.options.period
        const width = this.size
        const space = width / count

        let startZ = 0
        let startText = this.options.from

        for (let i = 0; i < count - 1; i++) {
            startZ += space
            startText += this.options.period
            startText = Math.round ( startText * 100 )/100
            const text = startText + ""
            if ( startText ) {

                insertPeriod ( startZ )
                insertPeriodText ( text, startZ )
            }
        }
        this.periodGroup.position.set (
            this.startPoint.x,
            this.startPoint.y,
            this.startPoint.z
        )

        this.rootGroup.add ( this.periodGroup )
    }

    public free ( ) {

        console.log ( 'Axis free' )

        if ( this.axis.exp.stage ) {

            if ( this.zMesh ) {

                this.rootGroup.remove( this.zMesh )
                const material = this.zMesh.material
                if ( material instanceof Material ) material.dispose ()
                this.zMesh.geometry.dispose ()
                this.zMesh = null
            }
            if ( this.zArrowGroup ) {

                if ( this.zArrow ) {

                    this.zArrowGroup.remove ( this.zArrow )
                    const material = this.zArrow.material
                    if ( material instanceof Material ) material.dispose ()
                    this.zArrow.geometry.dispose ()
                    this.zArrow = null
                }
                this.rootGroup.remove( this.zArrowGroup )
            }
            if ( this.textYMesh ) {

                this.rootGroup.remove( this.textYMesh )
                const material = this.textYMesh.material
                if ( material instanceof Material ) material.dispose ()
                this.textYMesh.geometry.dispose ()
                this.textYMesh = null
            }
            if ( this.periodGroup ) {

                if ( this.periodLines.length > 0 ) {

                    this.periodLines.forEach( line => {
                        this.periodGroup.remove ( line )
                        const material = line.material
                        if ( material instanceof Material ) material.dispose ()
                        line.geometry.dispose ()
                    })
                    this.periodLines.length = 0
                }
                if ( this.periodTexts.length > 0 )  {

                    this.periodTexts.forEach( text => {
                        this.periodGroup.remove ( text )
                        const material = text.material
                        if ( material instanceof Material ) material.dispose ()
                        text.geometry.dispose ()
                    })
                    this.periodTexts.length = 0
                }
                this.rootGroup.remove( this.periodGroup )
            }
        }
        this.axis.exp.stage.scene.remove ( this.rootGroup )
    }
}

export default ZAxis
