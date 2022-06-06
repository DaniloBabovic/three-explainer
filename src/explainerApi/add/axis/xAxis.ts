import { AxisOptions, Direction, Origin } from "../../model"
import { Font } from 'three/examples/jsm/loaders/FontLoader.js'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
//import { ConvexGeometry } from '../../convex.js';

import { 

    CatmullRomCurve3,
    Color, 
    ConeGeometry, 
    DoubleSide,
    Mesh, 
    MeshPhongMaterial, 
    MeshPhongMaterialParameters, 
    Object3D, 
    ShapeGeometry, 
    SphereGeometry, 
    TubeGeometry, 
    Vector3 

} from "three"

import { Axis } from "./axis"

class XAxis {

    protected axis:             Axis
    protected options:          AxisOptions

    protected paramMaterial:    MeshPhongMaterialParameters
    public    material:         MeshPhongMaterial

    protected  position         = new Vector3 ( )
    protected  startPoint       = new Vector3 ( )
    protected  endPoint         = new Vector3 ( )
    protected  direction        = Direction.LEFT_RIGHT
    protected  textXPosition    = new Vector3 ( )
    protected  textOPosition    = new Vector3 ( )

    public xMesh:               Mesh | null = null
    public xArrow:              Mesh | null = null
    public textXMesh:           Mesh | null = null
    public textOMesh:           Mesh | null = null
    public sphere:              Mesh | null = null
    
    public periodLines:         Mesh[]      = []
    public periodTexts:         Mesh[]      = []
    
    protected font:             Font
    protected fontSize:         number
    protected origin:           Origin    
    
    public size:                number
    public sizeHalf:            number
    
    public periodGroup:         Object3D    = new Object3D ( )
    public xArrowGroup:         Object3D    = new Object3D ( )
    public rootGroup:           Object3D    = new Object3D ( )
    public showO:               boolean     = false

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
        

        this.paramMaterial = {
            transparent : true,
            opacity : 1,

            color : color,
            specular : 0xf0f0f0,
            emissive : 0x00ffd1,
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
        this.axis.exp.coordinate.xDirection = this.direction
    }

    createGeometry ( ) {

        const point1 = new Vector3 ( -this.sizeHalf, 0, 0 )
        const point2 = new Vector3 ( this.sizeHalf, 0, 0 )
        const curve = new CatmullRomCurve3( [point1, point2] )

        const xGeometry = new TubeGeometry ( 
            curve, 
            this.sizeHalf,
            this.options.thickness/5,//radius 
            24, 
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
            xGeometry, 
            meshCone,            
            point1, point2
        )

        this.insert ( xGeometry,  meshCone )

        this.insertOText ( )
        this.insertText ( 'x', this.fontSize, this.textXPosition )
        this.insertPeriods ( )
        this.axis.exp.stage.scene.add ( this.rootGroup )     
    }

    setPositions (

        xGeometry:  TubeGeometry, 
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
                this.startPoint.set ( -off, 0, 0 )
                this.endPoint.set   ( off, 0, 0 )
                this.direction      = Direction.LEFT_RIGHT
                xGeometry.translate ( 0, 0, 0 )
                //Cone
                meshCone.position.set   ( point1.x, point1.y, point1.z )
                meshCone.lookAt         ( point2 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point2.x, 0 )
                this.xArrowGroup.position.set  ( this.sizeHalf, this.position.y, this.position.z )
                // Text
                this.textXPosition.set ( this.sizeHalf, this.position.y  - ( fontSize * 2 ), this.position.z )
                this.textOPosition.set ( fontSize * 2,  this.position.y + ( fontSize  ), this.position.z )                
                break

            case Origin.TOP_LEFT:
                
                this.position.set   ( off, off, 0 )
                this.startPoint.set ( -off, off, 0 )
                this.endPoint.set   ( off, off, 0 )
                this.direction      = Direction.LEFT_RIGHT
                xGeometry.translate ( -off, 0, 0 )
                //Cone
                meshCone.position.set   ( point1.x, point1.y, point1.z )
                meshCone.lookAt         ( point2 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point2.x, 0 )
                this.xArrowGroup.position.set  ( this.sizeHalf, this.position.y, this.position.z )
                // Text
                this.textXPosition.set ( this.sizeHalf, this.position.y  - ( fontSize * 2 ), this.position.z )
                this.textOPosition.set ( -this.sizeHalf, this.position.y + ( fontSize ), this.position.z )                
                break
                   
            case Origin.TOP_RIGHT:
            
                this.position.set ( off, off, 0 )
                this.startPoint.set ( off, off, 0 )
                this.endPoint.set   ( -off, off, 0 )
                this.direction      = Direction.RIGHT_LEFT
                xGeometry.translate ( -off, 0, 0 )
                //Cone
                meshCone.position.set   ( point2.x, point2.y, point2.z )
                meshCone.lookAt         ( point1 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point1.x, 0 )
                this.xArrowGroup.position.set  ( -3 * this.sizeHalf, this.position.y, this.position.z )
                // Text
                this.textXPosition.set ( -this.sizeHalf, this.position.y  - ( fontSize * 2 ), this.position.z )
                this.textOPosition.set ( this.sizeHalf, this.position.y + ( fontSize ), this.position.z )                
                break

            case Origin.BOTTOM_LEFT:
        
                this.position.set ( -off, -off, 0 )
                this.startPoint.set ( -off, -off, 0 )
                this.endPoint.set   ( off, -off, 0 )
                this.direction      = Direction.LEFT_RIGHT
                xGeometry.translate ( off, 0, 0 )

                //Cone
                meshCone.position.set   ( point1.x, point1.y, point1.z )
                meshCone.lookAt         ( point2 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point2.x, 0 )
                this.xArrowGroup.position.set  ( this.sizeHalf, this.position.y, this.position.z )
                // Text
                this.textXPosition.set ( this.sizeHalf, this.position.y + ( fontSize ), this.position.z )
                this.textOPosition.set ( -this.sizeHalf, this.position.y - ( fontSize * 2.5), this.position.z )
                break

            case Origin.BOTTOM_RIGHT:

                this.position.set   ( off, -off, 0 )
                this.startPoint.set ( off, -off, 0 )
                this.endPoint.set   ( -off, -off, 0 )
                this.direction      = Direction.RIGHT_LEFT
                xGeometry.translate ( -off, 0, 0 )
                
                //Cone
                meshCone.position.set   ( point2.x, point2.y, point2.z )
                meshCone.lookAt         ( point1 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point2.x, 0 )
                this.xArrowGroup.position.set  ( -this.sizeHalf, this.position.y, this.position.z )
                // Text
                this.textXPosition.set ( -this.sizeHalf, this.position.y + ( fontSize ), this.position.z )
                this.textOPosition.set ( this.sizeHalf, this.position.y - ( fontSize * 2.5), this.position.z )
                break

            default:
                break
        }
    }

    insert ( xGeometry:  TubeGeometry,  meshCone:   Mesh ) {

        // X Axis Tube        
        this.xMesh = new Mesh( xGeometry, this.material )
        this.xMesh.position.set ( this.position.x, this.position.y, this.position.z )        
        this.rootGroup.add( this.xMesh )
    
        // X Axis Arrow
        this.xArrowGroup.add ( meshCone )
        this.rootGroup.add( this.xArrowGroup )
    
        this.xArrow = meshCone
    }

    insertOText ( ) {
        
        //if ( !this.showO ) return
        let xFrom = 0
        if ( this.options.from ) xFrom = this.options.from
        let yFrom = 0
        if ( this.axis.yAxisOptions?.from ) {
            yFrom = this.axis.yAxisOptions?.from
        }
        let center = this.axis.origin == Origin.CENTER
        let text      = `(${xFrom}, ${yFrom})`
        if ( center ) {

            let XO = (this.options.to - this.options.from)
            if ( XO ) XO = this.options.from + XO/2  
            let YO = 0
            if ( this.axis.yAxisOptions?.from ) {
                YO = (this.axis.yAxisOptions?.to - this.axis.yAxisOptions?.from )/2
                YO += this.axis.yAxisOptions?.from 
            }
            text = `(${XO}, ${YO})`
        }
        
        const shapes    = this.font.generateShapes ( text, this.fontSize )
        const geometry  = new ShapeGeometry ( shapes )

        geometry.computeBoundingBox()
        let xMid = 0
        let factor = -0.5
        if ( center ) factor = -0.3
        if ( geometry && geometry.boundingBox ) {

            xMid = factor * ( 
                geometry.boundingBox.max.x - 
                geometry.boundingBox.min.x 
            )
        }
        geometry.translate( xMid, 0, 0 )

        const textMesh = new Mesh( geometry, this.material )
        textMesh.position.set ( 
            this.textOPosition.x, 
            this.textOPosition.y, 
            this.textOPosition.z
        )
        this.textOMesh = textMesh
        this.rootGroup.add( textMesh )

        const geometrySphere = new SphereGeometry( 
            this.axis.sphereRadius, 
            32, 
            16 
        )        
        this.sphere = new Mesh( geometrySphere, this.material )
        if ( this.origin != Origin.CENTER ) {
            
            this.sphere.position.copy ( this.startPoint )
        }
        this.rootGroup.add( this.sphere )
        const v = new Vector3 ()
        this.sphere.getWorldPosition ( v )
        this.axis.exp.coordinate.onOPosition ( v )
    }

    insertText ( text: string, fontSize: number, position: Vector3, skipInsert = false ) {
                               
        const shapes    = this.font.generateShapes ( text, fontSize )

        const geometry = new ShapeGeometry ( shapes )
        geometry.computeBoundingBox()
        let xMid = 0
        if ( geometry && geometry.boundingBox ) {

            xMid = - 0.5 * ( 
                geometry.boundingBox.max.x - 
                geometry.boundingBox.min.x 
            )
        }
        geometry.translate( xMid, 0, 0 )

        const textMesh = new Mesh( geometry, this.material )
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
        
        const insertPeriod = ( x: number ) => {

            let side = -1
            if ( [Origin.TOP_LEFT, Origin.TOP_RIGHT].includes ( this.origin ) ) side = 1
            const periodSize = this.options.periodSize / 2
            const xSize = this.options.periodSize / 16            

            const front = 0
            const points = []            
            points.push( new Vector3( -xSize + x, 0, front ) )
            points.push( new Vector3( xSize + x, 0, front ) )
            points.push( new Vector3( x+xSize, side * periodSize, front ) )
            points.push( new Vector3( x-xSize, side * periodSize, front ) )
            
            const meshGeometry = new ConvexGeometry( points )
            
            const line = new Mesh( meshGeometry, this.material )
            this.periodLines.push ( line )
            this.periodGroup.add ( line )
        }

        const insertPeriodText = ( text: string, x: number ) => {

            let side = -1
            if ( [Origin.TOP_LEFT, Origin.TOP_RIGHT].includes ( this.origin ) ) side = 1

            let off = 0
            if ( text == "1" ) off = -1.3
            const position = new Vector3 ( x + off, side *10, 0)
            const textMesh = this.insertText ( text, this.fontSize, position, true )
            this.periodTexts.push ( textMesh )
            this.periodGroup.add ( textMesh )
        }

        let count = (this.options.to - this.options.from) / this.options.period
        //count = Math.round ( count )
        const width = this.size
        let space = width / count
        //space = Math.round ( space)
        
        if ( this.origin == Origin.CENTER ) {

            let startX = 0
            let startText = this.options.from

            for (let i = 0; i < count - 1; i++) {
                startX += space
                startText += this.options.period
                startText = Math.round ( startText * 100 )/100
                const text = startText + ""
                if ( startText ) {
                    
                    insertPeriod ( startX )
                    insertPeriodText ( text, startX )
                }
            }
            this.periodGroup.position.set (
                this.startPoint.x,
                this.startPoint.y,
                this.startPoint.z
            )

        } else if ( this.direction == Direction.LEFT_RIGHT ) {

            let startX = 0
            let startText = this.options.from

            for (let i = 0; i < count - 1; i++) {
                startX += space
                insertPeriod ( startX )
                startText += this.options.period
                startText = Math.round ( startText * 100 )/100
                const text = startText + ""
                insertPeriodText ( text, startX )
            }
            this.periodGroup.position.set (
                this.startPoint.x,
                this.startPoint.y,
                this.startPoint.z
            )

        } else{

            let startX = count * space  
            let startText = this.options.from

            for (let i = 0; i < count - 1; i++) {
                startX -= space
                insertPeriod ( startX )
                startText += this.options.period
                startText = Math.round ( startText * 100 )/100
                const text = startText + ""
                insertPeriodText ( text, startX )
            }
            this.periodGroup.position.set (
                this.endPoint.x,
                this.endPoint.y,
                this.endPoint.z
            )
        }
        this.rootGroup.add ( this.periodGroup )                
    }

    public free ( ) {

        console.log ( 'Axis free' )
    
        if ( this.axis.exp.stage ) {

            if ( this.sphere ) {
                this.rootGroup.remove( this.sphere )
                let material: any = this.sphere.material
                material.dispose ()
                this.sphere.geometry.dispose ()
                this.sphere = null
            }
            if ( this.xMesh ) {

                this.rootGroup.remove( this.xMesh )
                let material: any = this.xMesh.material
                material.dispose ()
                this.xMesh.geometry.dispose ()
                this.xMesh = null
            }
            if ( this.xArrowGroup ) {

                if ( this.xArrow ) {

                    this.xArrowGroup.remove ( this.xArrow )
                    let material: any = this.xArrow.material
                    material.dispose ()
                    this.xArrow.geometry.dispose ()
                    this.xArrow = null
                }
                this.rootGroup.remove( this.xArrowGroup )                
            }
            if ( this.textXMesh ) {

                this.rootGroup.remove( this.textXMesh )
                let material: any = this.textXMesh.material
                material.dispose ()
                this.textXMesh.geometry.dispose ()
                this.textXMesh = null
            }
            if ( this.textOMesh ) {

                this.rootGroup.remove( this.textOMesh )
                let material: any = this.textOMesh.material
                material.dispose ()
                this.textOMesh.geometry.dispose ()
                this.textOMesh = null
            }
            if ( this.periodGroup ) {

                if ( this.periodLines.length > 0 ) {

                    this.periodLines.forEach( line => {
                        this.periodGroup.remove ( line )
                        let material: any = line.material
                        material.dispose ()
                        line.geometry.dispose ()
                    })
                    this.periodLines.length = 0
                }
                if ( this.periodTexts.length > 0 )  {

                    this.periodTexts.forEach( text => {
                        this.periodGroup.remove ( text )
                        let material: any = text.material
                        material.dispose ()
                        text.geometry.dispose ()
                    })
                    this.periodTexts.length = 0
                }
                this.rootGroup.remove( this.periodGroup )
            }
            this.axis.exp.stage.scene.remove( this.rootGroup )
        }
    }
}

export default XAxis