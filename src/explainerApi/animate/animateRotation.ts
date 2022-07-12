import type { AnimeNull, TimeNode } from "../../index"
import type { Explainer }           from "../explainer"
import type { Stage }               from "../scene/stage"
import type AnimateManager          from "./animateManager"

import TWEEN, { Tween, now }        from "@tweenjs/tween.js"
import type { Euler, Mesh }         from "three"
import type { Object3D }            from "three"
import { degToRad }                 from "../utils"


class AnimateRotation {

    protected   stage:          Stage
    protected   done:           boolean

    protected   print:          boolean

    public      callbacks:      ( ()=> void )[] = []
    public      idParent        = -1
    public      timeNode:       TimeNode | null = null

    public      tween:          Tween<Euler> | null = null
    public      tweenPercent:   Tween<{percent: number}> | null = null
    public      pause           = false

    constructor (

        protected manager:      AnimateManager,
        public    id:           number,
        public    name:         string,
        protected exp:          Explainer,
        public    after:        AnimeNull = null,
        public    sec:          number,
        public    delay:        number,        
        public    target:       Mesh | Object3D,
        protected from:         { x: number, y: number, z: number },
        protected to:           { x: number, y: number, z: number },        
        protected onProgress:   ( ( progress: {percent: number} ) => void) | null = null

    ) {
        
        this.stage = exp.stage
        this.done = false
        this.print = true
        this.toRad ( )
        if ( after ) {

            this.idParent = after.id
            const insertAnimate = ( ) => { this.insertAnimate () }
            after.callbacks.push ( insertAnimate )

        } else {

            this.insertAnimate ( )
        }
    }

    toRad ( ) {

        this.from.x = degToRad ( this.from.x )
        this.from.y = degToRad ( this.from.y )
        this.from.z = degToRad ( this.from.z )

        this.to.x = degToRad ( this.to.x )
        this.to.y = degToRad ( this.to.y )
        this.to.z = degToRad ( this.to.z )
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

        const target    = this.target

        if ( target ) {

            target.rotation.x = this.to.x,
            target.rotation.y = this.to.y,
            target.rotation.z = this.to.z
        }        
    }

    public reset ( ) {

        const target    = this.target

        if ( target ) {

            target.rotation.x = this.from.x,
            target.rotation.y = this.from.y,
            target.rotation.z = this.from.z
        }        
    }

    insertAnimate ( part = 0 ) {

        if ( !this.target ) return
        if ( !this.stage.controls ) return
        if ( !this.stage.camera ) return
        if ( !this.stage.controls ) return

        this.done       = false

        this.manager.onStart ( this )
        const percentTarget = { percent: 0 }
        
        this.target.rotation.set (
            this.from.x,
            this.from.y,
            this.from.z
        )

        this.tween = new TWEEN.Tween ( this.target.rotation )
        this.tween.delay  ( this.delay * 1000 )
        this.tween.to ( this.to, this.sec * 1000 )
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

export default AnimateRotation
