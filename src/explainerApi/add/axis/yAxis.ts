import { AxisOptions, Direction, Origin } from "src/explainerApi/model"
import { Font } from 'three/examples/jsm/loaders/FontLoader.js'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';

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
    TubeGeometry, 
    Vector3 

} from "three"

import { Axis } from "./axis"

class YAxis {

    protected axis:             Axis
    protected options:          AxisOptions

    protected paramMaterial:    MeshPhongMaterialParameters
    public    material:         MeshPhongMaterial

    protected  position         = new Vector3 ( )
    protected  startPoint       = new Vector3 ( )
    protected  endPoint         = new Vector3 ( )
    protected  direction        = Direction.LEFT_RIGHT
    protected  textYPosition    = new Vector3 ( )    

    public yMesh:               Mesh        | null = null
    public yArrow:              Mesh        | null = null
    public textYMesh:           Mesh        | null = null    
    
    public periodLines:         Mesh[]      = []
    public periodTexts:         Mesh[]      = []
    
    protected font:             Font
    protected fontSize:         number
    protected origin:           Origin    
    
    public size:                number
    public sizeHalf:            number
    
    public periodGroup:         Object3D    = new Object3D ( )
    public yArrowGroup:         Object3D    = new Object3D ( )
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
        this.axis.mw.coordinate.yDirection = this.direction
    }

    createGeometry ( ) {

        const point1 = new Vector3 ( 0, -this.sizeHalf, 0 )
        const point2 = new Vector3 ( 0, this.sizeHalf, 0 )
        const curve = new CatmullRomCurve3( [point1, point2] )

        const yGeometry = new TubeGeometry ( 
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
            yGeometry, 
            meshCone,             
            point1, point2
        )

        this.insert ( yGeometry, meshCone )

        this.insertText ( 'y', this.fontSize, this.textYPosition )
        this.insertPeriods ( )
        this.axis.mw.stage.scene.add ( this.rootGroup )        
    }

    setPositions (

        yGeometry:  TubeGeometry, 
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
                this.startPoint.set ( 0, -off, 0 )
                this.endPoint.set   ( 0, off, 0 )
                this.direction      = Direction.BOTTOM_TOP
                yGeometry.translate ( 0, 0, 0 )
                //Cone
                meshCone.position.set   ( point1.x, point1.y, point1.z )
                meshCone.lookAt         ( point2 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, 0, point2.x )
                this.yArrowGroup.position.set  ( this.position.x, this.size, this.position.z )
                // Text
                this.textYPosition.set ( this.position.x  - ( fontSize  ), this.sizeHalf,  this.position.z )                
                break

            case Origin.TOP_LEFT:
                
                this.position.set   ( -off, off, 0 )
                this.startPoint.set ( -off, off, 0 )
                this.endPoint.set   ( -off, -off, 0 )
                this.direction      = Direction.TOP_BOTTOM
                yGeometry.translate ( 0, -off, 0 )
                //Cone
                meshCone.position.set   ( point2.x, point2.y, point2.z )
                meshCone.lookAt         ( point1 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point2.x, 0 )
                this.yArrowGroup.position.set  ( -off, -this.size, this.position.z )
                // Text
                this.textYPosition.set ( -off + fontSize, -off, this.position.z )
                break
                   
            case Origin.TOP_RIGHT:
            
                this.position.set ( off, off, 0 )
                this.startPoint.set ( off, off, 0 )
                this.endPoint.set   ( off, -off, 0 )
                this.direction      = Direction.TOP_BOTTOM
                yGeometry.translate ( 0, -off, 0 )
                //Cone
                meshCone.position.set   ( point2.x, point2.y, point2.z )
                meshCone.lookAt         ( point1 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point1.x, 0 )
                this.yArrowGroup.position.set  ( off, -this.size, this.position.z )
                // Text
                this.textYPosition.set ( off - fontSize, -off, this.position.z )
                break

            case Origin.BOTTOM_LEFT:
        
                this.position.set ( 0, 0, 0 )
                this.startPoint.set ( -off, -off, 0 )
                this.endPoint.set   ( -off, -off, 0 )
                this.direction      = Direction.BOTTOM_TOP
                yGeometry.translate ( -off, 0, 0 )

                //Cone
                meshCone.position.set   ( point1.x, point1.y, point1.z )
                meshCone.lookAt         ( point2 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point2.x, 0 )
                this.yArrowGroup.position.set  ( -this.sizeHalf, this.size, this.position.z )
                // Text
                this.textYPosition.set ( -this.sizeHalf + ( fontSize ), this.sizeHalf , this.position.z )
                break

            case Origin.BOTTOM_RIGHT:

                this.position.set   ( off, -off, 0 )
                this.startPoint.set ( off, -off, 0 )
                this.endPoint.set   ( off, off, 0 )
                this.direction      = Direction.BOTTOM_TOP
                yGeometry.translate ( 0, off, 0 )
                
                //Cone
                meshCone.position.set   ( point1.x, point1.y, point1.z )
                meshCone.lookAt         ( point2 )
                meshCone.rotateX        ( Math.PI / 2 )
                geometryCone.translate  ( 0, point2.x, 0 )
                this.yArrowGroup.position.set  ( this.sizeHalf, this.size, this.position.z )
                // Text
                this.textYPosition.set ( this.sizeHalf - fontSize, off, this.position.z )
                break

            default:
                break
        }
    }

    insert ( yGeometry:  TubeGeometry,  meshCone: Mesh ) {
        // X Axis Tube
        const yMaterial = new MeshPhongMaterial ( this.paramMaterial )
        //const yMaterial = new MeshBasicMaterial ( {color: this.options.color} )
        this.yMesh = new Mesh( yGeometry, yMaterial )
        this.yMesh.position.set ( this.position.x, this.position.y, this.position.z )        
        this.rootGroup.add( this.yMesh )
    
        // X Axis Arrow
        this.yArrowGroup.add ( meshCone )
        this.rootGroup.add( this.yArrowGroup )
        
        this.yArrow = meshCone
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
        
        const insertPeriod = ( y: number ) => {

            let side = -1
            
            if ( [Origin.TOP_RIGHT, Origin.BOTTOM_RIGHT].includes (this.origin) ) side = 1
            
            const periodSize = this.options.periodSize / 2
            const ySize = this.options.periodSize / 16
            
            const points = []            
            points.push( new Vector3( 0, -ySize + y, 0 ) )
            points.push( new Vector3( 0, ySize + y, 0 ) )
            points.push( new Vector3( side * periodSize, y+ySize, 0 ) )
            points.push( new Vector3( side * periodSize, y-ySize, 0 ) )
            
            const meshGeometry = new ConvexGeometry( points )
            
            const line = new Mesh( meshGeometry, this.material );
            this.periodLines.push ( line )
            this.periodGroup.add ( line )
        }

        const insertPeriodText = ( text: string, y: number ) => {

            let side = -1            
            if ( [Origin.TOP_RIGHT, Origin.BOTTOM_RIGHT].includes (this.origin) ) side = 1

            const position = new Vector3 ( side * 10, y- this.fontSize/2, 0)
            const textMesh = this.insertText ( text, this.fontSize, position, true )
            this.periodTexts.push ( textMesh )
            this.periodGroup.add ( textMesh )
        }
        const count = Math.abs (this.options.to - this.options.from) / this.options.period
        const width = this.size
        const space = width / count

        if ( this.origin == Origin.CENTER ) {
            
            let startY = 0        
            let startText = this.options.from

            for (let i = 0; i < count - 1; i++) {
                startY += space
                startText += this.options.period
                startText = Math.round ( startText * 100 )/100
                const text = startText + ""
                if ( startText ) {
                    
                    insertPeriod ( startY )
                    insertPeriodText ( text, startY )
                }
            }
            this.periodGroup.position.set (
                this.startPoint.x,
                this.startPoint.y,
                this.startPoint.z
            )

        } else if ( this.direction == Direction.BOTTOM_TOP ) {

            let startY = 0        
            let startText = this.options.from

            for (let i = 0; i < count - 1; i++) {
                startY += space
                insertPeriod ( startY )
                startText += this.options.period
                startText = Math.round ( startText * 100 )/100
                const text = startText + ""
                insertPeriodText ( text, startY )
            }
            this.periodGroup.position.set (
                this.startPoint.x,
                this.startPoint.y,
                this.startPoint.z
            )

        } else{

            let startY = ( count ) * space        
            let startText = this.options.from

            for (let i = 0; i < count - 1; i++) {
                startY -= space
                insertPeriod ( startY )
                startText += this.options.period
                startText = Math.round ( startText * 100 )/100
                const text = startText + ""
                insertPeriodText ( text, startY )
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
    
        if ( this.axis.mw.stage ) {

            if ( this.yMesh ) {

                this.rootGroup.remove( this.yMesh )
                let material: any = this.yMesh.material
                material.dispose ()
                this.yMesh.geometry.dispose ()
                this.yMesh = null
            }
            if ( this.yArrowGroup ) {

                if ( this.yArrow ) {

                    this.yArrowGroup.remove ( this.yArrow )
                    let material: any = this.yArrow.material
                    material.dispose ()
                    this.yArrow.geometry.dispose ()
                    this.yArrow = null
                }
                this.rootGroup.remove( this.yArrowGroup )                
            }
            if ( this.textYMesh ) {

                this.rootGroup.remove( this.textYMesh )
                let material: any = this.textYMesh.material
                material.dispose ()
                this.textYMesh.geometry.dispose ()
                this.textYMesh = null
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
        }
        this.axis.mw.stage.scene.remove ( this.rootGroup )
    }
}

export default YAxis