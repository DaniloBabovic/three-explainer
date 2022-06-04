import { MW } from "src/explainerApi/explainer";
import { 
    CatmullRomCurve3,
    DoubleSide, 
    Mesh, 
    MeshStandardMaterial,
    TubeBufferGeometry,
    Vector2, 
    Vector3 
} from "three"

class Curve {

    protected mw:       MW

    public paramMaterial = {

        transparent:        true,
        opacity:            1,

        color:              0xFF0000,        
        emissive:           0xffd144,
        emissiveIntensity:  0.7,
        roughness:          0.5,
        metalness:          1,

        side:               DoubleSide,
        flatShading:        true,
        blending:           1,
        fog:                false,
        wireframe:          false
    }

    public size:        number
    public curve:       Mesh | null = null
    public points:      Vector3[] = []
    public curvePath:   CatmullRomCurve3 | null = null

    constructor ( 

        mw: MW, 
        points: [ number, number, number ][],
        size: number, 
        color: number, 
        emissive: number,         
    ) {

        for (let i = 0; i < points.length; i++) {

            const p = points[i]
            //const point = new Vector3 ( p [ 0 ], p[ 1 ], p[ 2 ] )
            const pos = mw.coordinate.mathWayToWorldTo (

                new Vector2 ( p[0], p[1] ),
                p[2]
            )
            if ( pos ) {

                this.points.push ( pos )
            }
            
        }
        //console.log ( 'points', this.points )
        
        this.mw = mw
        this.size = size
        this.paramMaterial.color = color
        this.paramMaterial.emissive = emissive
    }

    material ( params: Record<string, unknown> ) {

        this.paramMaterial = { ...this.paramMaterial, ...params }
    }

    create ( ) {

        //const size = this.size
        this.curvePath = new CatmullRomCurve3( this.points )
        
        /* 
        for (let i = 1; i < 100; i++) {
            const percent = i/100
            const point = this.curvePath.getPointAt ( percent )
            //console.log ( point.x, point.y )                        
        } 
        */
        const geometry = new TubeBufferGeometry ( 
            this.curvePath,
            this.points.length*15,
            this.size/5,//radius 
            16, 
            false 
        )
        const material = new MeshStandardMaterial(this.paramMaterial)
        this.curve = new Mesh(geometry, material)        
        /* const curveLength = geometry.index?.array.length
        if ( curveLength ) {

            geometry.drawRange.start = curveLength * 0.4
            geometry.drawRange.count = curveLength * 0.1
        }
        console.log ( curveLength )         */
    }
    
    insert ( ) {

        if ( this.curve ) {

            this.mw.stage.scene.add ( this.curve )
        }
    }
}

export default Curve