import type { AnimeNull, TimeNode }     from "../../index"
import type { Explainer }               from "../explainer"
import type { Camera }                  from "three"
import { Vector3 }                      from "three"
import type { Stage }                   from "../scene/stage"
import type AnimateManager              from "./animateManager"

import TWEEN, { Tween, now }            from "@tweenjs/tween.js"

class AnimateCameraPosition {

    protected   stage:          Stage
    protected   done:           boolean

    protected   print:          boolean
    public      callbacks:      ( ()=> void )[] = []
    public      idParent        = -1
    public      timeNode:       TimeNode | null = null

    public      tween:          Tween<Vector3> | null = null
    public      tweenPercent:   Tween<{percent: number}> | null = null
    protected   fromWorld       = { x: 0, y: 0, z: 0 }
    protected   toWorld         = { x: 0, y: 0, z: 0 }
    public      pause           = false
    protected   camera:         Camera | null = null

    constructor (

        protected manager:      AnimateManager,
        public    id:           number,
        public    name:         string,
        protected exp:          Explainer,
        public    after:        AnimeNull = null,
        public    sec:          number,
        public    delay:        number,        
        protected from:         { x: number, y: number, z: number } | null,
        protected to:           { x: number, y: number, z: number } | null,
        protected onProgress:   ( ( progress: {percent: number} ) => void) | null = null

    ) {

        //console.log(id)

        this.done = false
        this.stage = exp.stage
        this.print = true
        if ( !exp.stage.camera ) {

            console.error ( 'Camera not found' )

            return
        }
        //console.log('from, to', from, to)
        this.camera = exp.stage.camera
        this.init ( )
    }
    
    init ( ) {

        this.convertPositions ( )
        if ( this.after ) {
    
            this.idParent = this.after.id
            const insertAnimate = ( ) => { this.insertAnimate () }
            this.after.callbacks.push ( insertAnimate )
    
        } else {
    
            this.insertAnimate ( )
        }
        
    }

    convertPositions ( ) {

        if ( !this.from ) return
        if ( !this.to ) return

        const destinationVector = this.exp.coordinate.userToWorldPosition ( new Vector3 ( this.to.x, this.to.y, this.to.z ) )

        if ( destinationVector ) {

            this.toWorld.x = destinationVector.x
            this.toWorld.y = destinationVector.y
            this.toWorld.z = destinationVector.z
        }
        const startVector = this.exp.coordinate.userToWorldPosition (

            new Vector3 ( this.from.x, this.from.y, this.from.z )
        )

        if ( startVector ) {

            this.fromWorld.x = startVector.x
            this.fromWorld.y = startVector.y
            this.fromWorld.z = startVector.z
        }
    }

    onDone ( ) {

        if ( !this.done ) {

            this.done = true
            for (let i = 0; i < this.callbacks.length; i++) {
                const callback = this.callbacks [ i ]
                callback ( )
            }
        }
    }

    public resetToEnd ( ) {

        const camera    = this.camera
        //console.log ( 'resetToEnd', this.toWorld ) 
        if ( camera ) {

            camera.position.x = this.toWorld.x,
            camera.position.y = this.toWorld.y,
            camera.position.z = this.toWorld.z
        }
    }

    public reset ( ) {

        const target    = this.camera
        //console.log ( 'reset', this.fromWorld ) 
        
        if ( target ) {

            target.position.x = this.fromWorld.x,
            target.position.y = this.fromWorld.y,
            target.position.z = this.fromWorld.z
        }
    }

    insertAnimate ( part = 0 ) {

        if ( !this.camera ) return
        if ( !this.stage.controls ) return
        if ( !this.stage.camera ) return
        if ( !this.stage.controls ) return

        this.done       = false

        this.manager.onStart ( this )
        const percentTarget = { percent: 0 }

        //console.log( 'insertAnimate' )


        this.camera.position.set (
            this.fromWorld.x,
            this.fromWorld.y,
            this.fromWorld.z
        )

        this.tween = new TWEEN.Tween ( this.camera.position )
        this.tween.delay  ( this.delay * 1000 )
        this.tween.to ( this.toWorld, this.sec * 1000 )
        //this.tween.easing(TWEEN.Easing.Quadratic.Out)
        this.tween.onComplete( () => {

            this.onDone ()
        })

        if ( part ) {

            this.tween.start( now() - part )
            this.pause = true

        } else {

            this.tween.start( )
        }
        this.tweenPercent = new TWEEN.Tween ( percentTarget )
        this.tweenPercent.delay  ( this.delay * 1000 )
        this.tweenPercent.to ( { percent: 1 }, this.sec * 1000)

        this.tweenPercent.onUpdate(() => {

            this.exp.stage.skipOrbitRender = true
            this.exp.stage.controls?.update()
            if ( this.onProgress ) {
                this.onProgress ( percentTarget )
            }
            this.manager.onProgress ( this, percentTarget.percent )
            if ( this.pause ) {
                this.pause = false
                this.tween?.pause ()
                this.tweenPercent?.pause ()
            }
        })

        this.tweenPercent.onComplete( () => {

            this.onDone ()
            this.manager.onEnd ( this )
        })
        if ( part ) {

            this.tweenPercent.start( now() - part )
            this.pause = true

        } else {

            this.tweenPercent.start( )
        }
    }
}

export default AnimateCameraPosition
