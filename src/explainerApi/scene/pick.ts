import type { Explainer } from "../explainer"
import { Camera, Object3D, Raycaster, Scene, Vector2, Vector3 } from "three"
import type { Intersection } from "three"
import type { Event } from "three"
import type { Stage } from "./stage"

class Pick {

    protected exp: Explainer
    protected stage: Stage | null
    protected print: boolean
    protected camera: Camera | null
    protected scene: Scene
    protected pointer = new Vector2 ( )
    protected raycaster = new Raycaster ( )
    protected pMove: (evt:  MouseEvent ) => void
    protected pClick: (evt:  MouseEvent ) => void
    protected container: HTMLElement | null
    protected INTERSECTED: Intersection<Object3D<Event>>[] | null = null
    protected mouseWorldPosition = new Vector3 ()

    constructor ( exp: Explainer ) {

        this.exp = exp
        this.stage = exp.stage
        this.camera = exp.stage.camera
        this.scene = exp.stage.scene
        this.container = exp.stage.containerElement

        this.print = false

        this.INTERSECTED = null

        this.pMove = ( evt ) => { this.onPointerMove ( evt ) }
        this.pClick = ( evt ) => { this.onPickClick ( evt ) }
        if ( this.container ) {

            this.container.addEventListener( 'mousemove', this.pMove )
            this.container.addEventListener( 'click', this.pClick )
        }
    }

    onPointerMove( event: MouseEvent ) {

        if ( this.exp.pickEnable ==  false ) return
        if ( this.container ) {

            this.exp.coordinate.onScreenPosition ( event.offsetX, event.offsetY )
            this.pointer.x = ( ( event.offsetX  ) / this.container.offsetWidth ) * 2 - 1
            this.pointer.y = - ( ( event.offsetY) / this.container.offsetHeight ) * 2 + 1
            if ( this.print ) {
                
                console.log ( this.pointer.x, this.pointer.y )
            }
            this.testPick ( ) 
        }
    }

    testPick ( ) {

        if ( !this.camera ) return

        this.raycaster.setFromCamera( this.pointer, this.camera )

        const getIntersects = ( ) => {

            if ( this.stage && this.stage.wall ) {

                const wall = this.raycaster.intersectObjects ( [this.stage.wall] )
                return wall
            }            
            return []
        }
        const intersects = getIntersects ( ) 
        if ( intersects.length > 0 ) {
            this.INTERSECTED = intersects
            const intersection = this.INTERSECTED [0]
            this.mouseWorldPosition.x = intersection.point.x
            this.mouseWorldPosition.y = intersection.point.y
            this.mouseWorldPosition.z = intersection.point.z
            this.exp.coordinate.onWorldPosition ( intersection.point )
            //console.log ( 'intersection', intersection.point.x, intersection.point.y )
        }
    }

    onPickClick ( event: MouseEvent ) {

        //console.log ( 'click', this.INTERSECTED )       
        if ( this.INTERSECTED && this.INTERSECTED.length > 0 ) {
            const intersection = this.INTERSECTED [0]
            // eslint-disable-next-line no-constant-condition
            if (false ) console.log ( 'intersection', intersection.point.x, intersection.point.y, event )
        }
    }

    reset ( ) {

        if ( this.container ) {

            this.container.removeEventListener ( 'mousemove', this.pMove )
            this.container.removeEventListener( 'click', this.pClick )
        }
    }
}

export default Pick