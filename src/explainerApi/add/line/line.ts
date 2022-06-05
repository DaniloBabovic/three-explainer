import { Explainer } from "../../explainer";
import { 
    BufferGeometry,
    DoubleSide, 
    LineBasicMaterial,
    Vector2, 
    Vector3,
    LineSegments
} from "three"

class Lines {

    protected exp:       Explainer

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
    public line:        LineSegments | null = null
    public points:      Vector3[] = []
    
    constructor ( 

        exp: Explainer, 
        points: [ number, number, number ][],
        size: number, 
        color: number, 
        emissive: number,         
    ) {
        for (let i = 0; i < points.length; i++) {

            const p = points[i]
            const pos = exp.coordinate.mathWayToWorldTo (

                new Vector2 ( p[0], p[1] ),
                p[2]
            )
            if ( pos ) {

                this.points.push ( pos )
            }
        }
        
        this.exp = exp
        this.size = size
        this.paramMaterial.color = color
        this.paramMaterial.emissive = emissive
    }

    material ( params: Record<string, unknown> ) {

        this.paramMaterial = { ...this.paramMaterial, ...params }
    }

    create ( ) {

        //const size = this.size        
        const geometry = new BufferGeometry().setFromPoints( this.points )        
        
        const material = new LineBasicMaterial ( { 
            
            transparent: true,
            opacity:    1,
            color:       0x00FFFF 
        } )
        this.line = new LineSegments(geometry, material)                
    }
    
    insert ( ) {

        if ( this.line ) {

            this.exp.stage.scene.add ( this.line )
        }
    }
}

export default Lines