import { Explainer } from "../../explainer"
import { 
    DoubleSide, 
    Mesh, 
    MeshStandardMaterial, 
    ShapeGeometry,
    Vector2, 
    Vector3 
} from "three"

class Text {

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
    public widthSegments    = 32
    public heightSegments   = 16 

    public position: Vector3
    public size:     number
    public textMesh:     Mesh | null = null
    public text: string

    constructor ( 

        exp: Explainer, 
        text: string,
        size: number, 
        color: number, 
        emissive: number, 
        position: [ number, number, number ] 
    ) {

        this.exp = exp
        this.text = text
        this.size = size
        this.paramMaterial.color = color
        this.paramMaterial.emissive = emissive

        const pos = exp.coordinate.mathWayToWorldTo (

            new Vector2 ( position[0], position[1] ),
            position[2]
        )
        if ( pos ) {

            this.position = pos
        } else {

            this.position = new Vector3 ()
        }
    }

    material ( params: Record<string, unknown> ) {

        this.paramMaterial = { ...this.paramMaterial, ...params }
    }

    create ( ) {

        const material = new MeshStandardMaterial(this.paramMaterial)
        const shapes    = this.exp.font.generateShapes ( this.text, this.size )
        const geometry  = new ShapeGeometry ( shapes )

        geometry.computeBoundingBox()
        let xMid = 0
        let factor = -0.5
        if ( geometry && geometry.boundingBox ) {

            xMid = factor * ( 
                geometry.boundingBox.max.x - 
                geometry.boundingBox.min.x 
            )
        }
        geometry.translate( xMid, 0, 0 )

        this.textMesh = new Mesh( geometry, material )
        this.textMesh.position.set ( 
            this.position.x, 
            this.position.y, 
            this.position.z
        )
    }
    
    insert ( ) {

        if ( this.textMesh ) {

            this.exp.stage.scene.add ( this.textMesh )
        }
    }
}

export default Text