import { CSS3DObject }                          from 'three/examples/jsm/renderers/CSS3DRenderer'
import type { ParentGL, ParentCSS }             from '../../../index'

import { 
    Mesh, 
    MeshStandardMaterial, 
    Object3D, 
    PlaneGeometry, 
    Scene, 
    Vector3, 
}                                               from "three"
import type { MeshStandardMaterialParameters }  from "three"
import type { Explainer }                       from "../../explainer"
import MeshLike from './mesh_like'


class HTML3D {

    public position: Vector3
    public widthHtml                        = 0
    public heightHtml                       = 0

    public plane: Mesh | null               = null
    public css3D: CSS3DObject | null        = null

    public meshLike: MeshLike | null        = null

    public parentGL: ParentGL               = null
    public parentCSS: ParentCSS             = null    
    public scaleDown                        = 0.1

    constructor (

        public exp:             Explainer,
        public paramMaterial:   MeshStandardMaterialParameters,
        public html:            string,
        public css:             CSSStyleDeclaration,
        position:               [ number, number, number ]
    ) {
        const pos = exp.coordinate.userToWorldPosition (

            new Vector3 ( position[0], position[1], position[2] )    
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

        this.createCSS3D ()
        this.createPlane ()
        if ( this.plane && this.css3D ) {

            this.meshLike = new MeshLike ( this.plane, this.css3D )
        }
    }

    createCSS3D ( ) {
        
        const element = document.createElement( 'div' );
        element.innerHTML = this.html     
        
        for (const property in this.css ) {
        
            //console.log(`${property}: ${object[property]}`);
            element.style [ property  ] = this.css [ property ]
        }
        
        if ( this.exp.stage.outDiv ) {

            this.exp.stage.outDiv.append ( element )
            const rect = element.getBoundingClientRect()
            console.log ( 'rect:', rect, element )
            
            this.exp.stage.outDiv.removeChild ( element )

            this.css3D = new CSS3DObject ( element )            
            this.css3D.position.set (

                this.position.x, 
                this.position.y, 
                this.position.z 
            )
            
            const size = this.scaleDown
            this.css3D.scale.set ( size, size, size )

            if ( this.parentCSS ) {

                if (  this.parentCSS instanceof CSS3DObject) {

                    this.parentCSS.add( this.css3D )
                }

                if ( this.parentCSS instanceof Scene || this.parentCSS instanceof Object3D) {

                    this.parentCSS.add( this.css3D )
                }

            } else {

                this.exp.stage.sceneCSS.add( this.css3D )
            }
            this.widthHtml = rect.width
            this.heightHtml = rect.height
        }
    }

    createPlane ( ) {

        const geometry = new PlaneGeometry ( 
            this.widthHtml  * this.scaleDown, 
            this.heightHtml * this.scaleDown
        )
        const material = new MeshStandardMaterial(this.paramMaterial)
        this.plane = new Mesh(geometry, material)
        this.plane.position.set (
            this.position.x,
            this.position.y,
            this.position.z
        )
    }

    insert ( ) {

        if ( this.plane ) {

            if ( this.parentGL ) {

                if ( this.parentGL instanceof Mesh || this.parentGL instanceof Scene || this.parentGL instanceof Object3D) {
                    this.parentGL.add ( this.plane )
                }

            } else {

                this.exp.stage.scene.add ( this.plane )
            }
        }
    }
}

export default HTML3D