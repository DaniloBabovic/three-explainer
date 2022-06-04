import TWEEN        from "@tweenjs/tween.js"
import { Explainer }       from "src/explainerApi/explainer"
import { Vector3 }  from "three"
import { Stage }    from "../scene/stage"

class AnimateCameraToCenter {

    protected exp: Explainer
    protected stage: Stage
    protected animation_done: boolean
    protected animation_1_done: boolean
    protected print: boolean

    constructor ( exp: Explainer ) {

        this.exp = exp
        this.stage = exp.stage

        this.animation_done = false
        this.animation_1_done = false

        this.print = true
        if ( this.print ) {

            console.log ( 'AnimateCameraToCenter' )
        }
        if ( this.stage != null ) {

            this.insertAnimate ( )

        } else {

            console.error ( 'Viewer is not loaded yet.' )
        }
    }

    insertAnimate ( ) {

        if ( !this.stage.controls ) return
        if ( !this.stage.camera ) return
        if ( !this.stage.controls ) return

        this.animate ( )
        // Move camera
        const position = this.stage.cameraStartPosition
        const tween = new TWEEN.Tween ( this.stage.camera.position ) 
        tween.to({x: position.x, y: position.y, z: position.z }, 700 )
        tween.easing(TWEEN.Easing.Quadratic.Out) 
        tween.onUpdate(() => {

        })
        tween.onComplete( () => {

            this.animation_done = true
        })
        tween.start()

        // LookAt camera
        this.stage.controls.update ()
        const target = new Vector3 ( 

            this.stage.controls.target.x,
            this.stage.controls.target.y,
            this.stage.controls.target.z
        )
        const tween1 = new TWEEN.Tween ( target ) 
        tween1.to({x: position.x, y: position.y, z: 0 }, 700 )
        tween1.easing(TWEEN.Easing.Quadratic.Out) 
        tween1.onUpdate(() => {

            if ( this.stage.controls ) {

                this.stage.controls.target.set( target.x, target.y, target.z )
                this.stage.controls.update ()
            }
        })
        tween1.onComplete( () => {

            this.animation_1_done = true
        })
        tween1.start()
    }

    //time ms from application start
    animate( time: number = 0) {

        //console.log ( time )
        if ( false ) console.log( time )
        
        if ( this.animation_1_done && this.animation_done ) return        
        const animate = ( time: number ) => { this.animate ( time ) } 

        requestAnimationFrame ( animate )

        TWEEN.update ( )
        this.stage.render ( )
    }
}

export default AnimateCameraToCenter
