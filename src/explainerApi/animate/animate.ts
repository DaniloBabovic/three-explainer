import type { AnimeNull, D3, TimeNode } from "../../index"
import type { Explainer }               from "../explainer"
import type { Stage }                   from "../scene/stage"
import type AnimateManager              from "./animateManager"

import TWEEN, { Tween, now }            from "@tweenjs/tween.js"
import { Line, Material }               from "three"
import { Mesh, Vector3 }                from "three"
import { Object3D }                     from "three"
import MeshLike from "../add/html/mesh_like"

class Animate {

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

    constructor (

        protected manager:      AnimateManager,
        public    id:           number,
        public    name:         string,
        protected exp:          Explainer,
        public    after:        AnimeNull = null,
        public    sec:          number,
        public    delay:        number,        
        public    target:       D3,
        protected from:         { x: number, y: number, z: number },
        protected to:           { x: number, y: number, z: number },
        protected fade:         { from: number, to: number },
        protected onProgress:   ( ( progress: {percent: number} ) => void) | null = null

    ) {
        
        //console.log(id)

        this.stage = exp.stage
        this.done = false
        this.print = true

        if ( fade ) {

            if ( target ) {

                if ( target instanceof Object3D ) {
                    target.children.forEach ( mesh => {

                        if ( mesh instanceof Mesh || mesh instanceof Line || mesh instanceof MeshLike ) {
                            const material = mesh.material as Material
                            material.opacity = fade.from
                            material.needsUpdate = true
                        }
                    });
                }
                if ( target instanceof Mesh || target instanceof MeshLike || target instanceof Line ) {

                    const material = target.material as Material
                    //console.log(opacity)
                    material.opacity = fade.from
                    material.needsUpdate = true
                }
            }
        }
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

        const target    = this.target

        if ( target ) {

            target.position.x = this.toWorld.x,
            target.position.y = this.toWorld.y,
            target.position.z = this.toWorld.z
        }
        if ( this.target instanceof Object3D ) {
            this.target.children.forEach ( mesh => {

                if ( mesh instanceof Mesh || mesh instanceof MeshLike ) {
                    const material = mesh.material as Material
                    material.opacity = this.fade.to
                    material.needsUpdate = true
                }
            });
        }
        if ( this.target instanceof Mesh || this.target instanceof MeshLike ) {

            const material = this.target.material as Material
            material.opacity = this.fade.to
            material.needsUpdate = true
        }
        if ( this.target instanceof Line ) {

            const material = this.target.material as Material
            material.opacity = this.fade.to
            material.needsUpdate = true
        }
    }

    public reset ( ) {

        const target    = this.target

        if ( target ) {

            target.position.x = this.fromWorld.x,
            target.position.y = this.fromWorld.y,
            target.position.z = this.fromWorld.z
        }
        if ( this.target instanceof Object3D ) {
            this.target.children.forEach ( mesh => {

                if ( mesh instanceof Mesh || mesh instanceof MeshLike ) {
                    const material = mesh.material as Material
                    material.opacity = this.fade.from
                    material.needsUpdate = true
                }
            });
        }
        if ( this.target instanceof Mesh || this.target instanceof MeshLike ) {

            const material = this.target.material as Material
            material.opacity = this.fade.from
            material.needsUpdate = true
        }
        if ( this.target instanceof Line ) {

            const material = this.target.material as Material
            material.opacity = this.fade.from
            material.needsUpdate = true
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
        
        this.target.position.x = this.fromWorld.x
        this.target.position.y = this.fromWorld.y
        this.target.position.z = this.fromWorld.z

        this.tween = new TWEEN.Tween ( this.target.position as unknown as Vector3 )
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

            if ( this.fade ) {
                const range = this.fade.to - this.fade.from
                const opacity = range * percentTarget.percent

                if ( this.target instanceof Object3D ) {
                    this.target.children.forEach ( mesh => {

                        if ( mesh instanceof Mesh || mesh instanceof MeshLike ) {
                            const material = mesh.material as Material
                            material.opacity = opacity
                            material.needsUpdate = true
                        }
                    });
                }
                if ( this.target instanceof Mesh || this.target instanceof MeshLike ) {

                    const material = this.target.material as Material
                    material.opacity = opacity
                    material.needsUpdate = true
                }
                if ( this.target instanceof Line ) {

                    const material = this.target.material as Material
                    material.opacity = opacity
                    material.needsUpdate = true
                }
            }

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

export default Animate
