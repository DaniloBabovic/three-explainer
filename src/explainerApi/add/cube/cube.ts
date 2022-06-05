import { Explainer } from "../../explainer";
import { BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial, Vector2, Vector3 } from "three";
/* 
data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
    envMaps: envMapKeysPBR[ 0 ],
    map: diffuseMapKeys[ 0 ],
    roughnessMap: roughnessMapKeys[ 0 ],
    alphaMap: alphaMapKeys[ 0 ]
} 
*/
class Cube {

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

    public position: Vector3
    public size:     number
    public cube:     Mesh | null = null

    constructor ( 

        exp: Explainer, 
        size: number, 
        color: number, 
        emissive: number, 
        position: [ number, number, number ] 
    ) {

        this.exp = exp
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

        const size = this.size
        const geometry = new BoxGeometry ( size, size, size)
        const material = new MeshStandardMaterial(this.paramMaterial)
        this.cube = new Mesh(geometry, material)
        this.cube.position.set ( 
            this.position.x,  
            this.position.y,
            this.position.z
        )
    }
    
    insert ( ) {

        if ( this.cube ) {

            this.exp.stage.scene.add ( this.cube )
        }
    }
}

export default Cube