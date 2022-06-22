import type { Explainer } from "../../explainer";
import {
    DoubleSide,
    Mesh,
    MeshStandardMaterial,
    SphereGeometry,
    Vector2,
    Vector3
} from "three"
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
class Sphere {

    protected exp:       Explainer

    public paramMaterial = {

        transparent:        true,
        opacity:            1,

        color:              0xFF0000,
        emissive:           0x00FFFF,
        emissiveIntensity:  1,
        roughness:          1,
        metalness:          0.2,

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
    public sphereMesh:     Mesh | null = null

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

        const pos = exp.coordinate.userToWorldPosition (

            new Vector2 ( position[0], position[1] ),
            position[2]
        )
        if ( pos ) {

            this.position = pos
        } else {

            this.position = new Vector3 ()
        }
        //console.log ( 'sphere position', this.position.x, this.position.y )

    }

    material ( params: Record<string, unknown> ) {

        this.paramMaterial = { ...this.paramMaterial, ...params }
    }

    create ( ) {

        const size = this.size
        const geometry = new SphereGeometry (
            size,
            this.widthSegments,
            this.heightSegments
        )
        const material = new MeshStandardMaterial(this.paramMaterial)
        this.sphereMesh = new Mesh(geometry, material)
        this.sphereMesh.position.set (
            this.position.x,
            this.position.y,
            this.position.z
        )
    }

    insert ( ) {

        if ( this.sphereMesh ) {

            this.exp.stage.scene.add ( this.sphereMesh )
        }
    }
}

export default Sphere