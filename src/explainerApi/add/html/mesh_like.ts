import type {  Material, Mesh } from "three"
import type { CSS3DObject }     from 'three/examples/jsm/renderers/CSS3DRenderer'
import VectorMulti              from "./vector_like"

class MaterialLike {


    constructor ( public mesh: Mesh, public css3D: CSS3DObject ) {
        
    }

    get opacity ( ) {
        const material = this.mesh.material as Material
        return material.opacity
    }

    set opacity ( val: number ) {
    
        ///const material = this.mesh.material as Material
        //material.opacity = val        
        this.css3D.element.style.opacity = '' + val
        
    }

    set needsUpdate ( val: boolean ) {

        const material = this.mesh.material as Material
        material.needsUpdate = val
    }
}

class MeshLike {

    public uuid : string
    public position : VectorMulti
    public rotation : VectorMulti
    public scale : VectorMulti
    public material: MaterialLike
    constructor(  public mesh: Mesh, public css3D: CSS3DObject ) {

        this.position = new VectorMulti ()
        this.position.vectors = [ mesh.position, css3D.position ]
        this.uuid = mesh.uuid

        this.rotation = new VectorMulti ()
        this.rotation.vectors = [ mesh.rotation, css3D.rotation ]

        this.scale = new VectorMulti ()
        this.scale.vectors = [ mesh.scale, css3D.scale ]

        this.material = new MaterialLike ( mesh, css3D )
    }

    get visible ( ) {

        return this.mesh.visible        
    }

    set visible ( visible: boolean ) {

        this.mesh.visible = visible
        this.css3D.visible = visible
    }
}

export default MeshLike   