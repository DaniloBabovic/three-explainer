import { MW } from "src/explainerApi/explainer"
import { Camera, Intersection, Object3D, Raycaster, Scene, Vector2, Event, Vector3 } from "three"
import { Stage } from "./stage"

class Pick {

    protected mw: MW
    protected stage: Stage | null
    protected print: boolean
    protected camera: Camera | null
    protected scene: Scene
    protected pointer = new Vector2 ( )
    protected raycaster = new Raycaster ( )
    protected pMove: (evt: any) => void
    protected pClick: (evt: any) => void
    protected container: HTMLElement | null
    protected INTERSECTED: Intersection<Object3D<Event>>[] | null = null
    protected mouseWorldPosition = new Vector3 ()

    constructor ( mw: MW ) {

        this.mw = mw
        this.stage = mw.stage
        this.camera = mw.stage.camera
        this.scene = mw.stage.scene
        this.container = mw.stage.containerElement

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

        if ( this.mw.pickEnable ==  false ) return
        if ( this.container ) {

            this.mw.coordinate.onScreenPosition ( event.offsetX, event.offsetY )
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
            this.mw.coordinate.onWorldPosition ( intersection.point )
            //console.log ( 'intersection', intersection.point.x, intersection.point.y )
        }
    }

    onPickClick ( event: MouseEvent ) {

        //console.log ( 'click', this.INTERSECTED )       
        if ( this.INTERSECTED && this.INTERSECTED.length > 0 ) {
            const intersection = this.INTERSECTED [0]
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