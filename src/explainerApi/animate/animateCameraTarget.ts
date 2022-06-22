import type { Target }                  from './../model';
import type { AnimeNull, TimeNode }     from "../model"
import type { Explainer }               from "../explainer"
import  { Vector3 }                     from "three"
import type { Stage }                   from "../scene/stage"
import type AnimateManager              from "./animateManager"

import { Vector2 }                      from "three"
import TWEEN, { Tween, now }            from "@tweenjs/tween.js"
import type { OrbitControls }           from 'three/examples/jsm/controls/OrbitControls';

class AnimateCameraTarget {

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
    protected   orbit:          OrbitControls | null = null

    constructor (

        protected manager:      AnimateManager,
        public    id:           number,
        public    name:         string,
        protected exp:          Explainer,
        public    after:        AnimeNull = null,
        public    sec:          number,
        public    delay:        number,        
        protected from:         Target,
        protected to:           Target,
        protected onProgress:   ( ( progress: {percent: number} ) => void) | null = null

    ) {

        console.log(id)
        this.done = false
        this.stage = exp.stage
        this.print = true
       
        if ( !exp.stage.controls ) {

            console.error ( 'Orbit controls not found' )
            return
        }
        this.orbit = exp.stage.controls

        this.convertPositions ( )
        if ( after ) {

            this.idParent = after.id
            const insertAnimate = ( ) => { this.insertAnimate () }
            after.callbacks.push ( insertAnimate )

        } else {

            this.insertAnimate ( )
        }
    }

    convertPositions ( ) {

        if ( !this.from ) return
        if ( !this.to ) return

        let destinationVector

        if ( this.to instanceof Vector3 ) {

            destinationVector = this.to

        } else {

            destinationVector = this.exp.coordinate.userToWorldPosition ( 
                new Vector2 ( this.to.x, this.to.y ),this.to.z 
            )
        }

        if ( destinationVector ) {

            this.toWorld.x = destinationVector.x
            this.toWorld.y = destinationVector.y
            this.toWorld.z = destinationVector.z
        }

        let startVector
        if ( this.from instanceof Vector3 ) {

            startVector = this.from

        } else {
        
            startVector = this.exp.coordinate.userToWorldPosition (
                new Vector2 ( this.from.x, this.from.y ), this.from.z
            )
        }

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

        if ( this.orbit ) {

            const target    = this.orbit.target
            if ( target ) {
    
                target.x = this.toWorld.x,
                target.y = this.toWorld.y,
                target.z = this.toWorld.z
            }
        }
    }

    public reset ( ) {

        if ( this.orbit ) {

            const target    = this.orbit.target
            if ( target ) {

                target.x = this.fromWorld.x,
                target.y = this.fromWorld.y,
                target.z = this.fromWorld.z
            }
        }
    }

    insertAnimate ( part = 0 ) {
                
        if ( !this.orbit ) return

        this.done       = false

        this.manager.onStart ( this )
        const percentTarget = { percent: 0 }

        //console.log( 'insertAnimate' )


        this.orbit.target.set (
            this.fromWorld.x,
            this.fromWorld.y,
            this.fromWorld.z
        )

        this.tween = new TWEEN.Tween ( this.orbit.target )
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
            this.orbit?.update()
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

export default AnimateCameraTarget
