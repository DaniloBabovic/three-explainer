import type { D3 }                  from './../index';
import { helvetiker_regular }       from "../font"
import { Object3D, Vector3 }        from "three"
import { Font }                     from "three/examples/jsm/loaders/FontLoader.js"
import { Add }                      from "./add/add"
import Animate                      from "./animate/animate"
import AnimateCameraToCenter        from "./animate/animateCameraToCenter"
import AnimateManager               from "./animate/animateManager"
import Coordinate                   from "./scene/coordinate"
import Pick                         from "./scene/pick"
import type { Stage }               from "./scene/stage"
import Player                       from "./player/player"
import AnimateCameraPos             from "./animate/animateCameraPosition"

import AnimateCameraTarget          from "./animate/animateCameraTarget"
import type { Anime }               from ".."
import AnimateRotation              from "./animate/animateRotation"
import { styleInject }              from "../inject_css"

console.log ( 'Imports works' )

export let exp = null as  ( Explainer | null)

export class Explainer {

    public add:             Add
    public pickEnable       = true
    public pick:            Pick
    public coordinate:      Coordinate    

    public xGroup:          Object3D | null = null
    public yGroup:          Object3D | null = null
    public zGroup:          Object3D | null = null
    
    public animationID      = 0
    public animateManager:  AnimateManager
    public player:          Player

    constructor  ( 
        public stage: Stage,
        public font: Font, 
        public divID: string, 
        public showPlayer: boolean,
    ) {
        
        this.add            = new Add ( this )
        this.pick           = new Pick ( this )
        this.coordinate     = new Coordinate ( this )
        this.player         = new Player ( this, showPlayer )
        this.animateManager = new AnimateManager ( this )
    }

    fade (
        name:         string,
        sec:          number,
        delay:        number,
        target:       D3,
        from:         { x: number, y: number, z: number },
        to:           { x: number, y: number, z: number },
        fade:         { from: number, to: number },
        onProgress:   ( ( progress: {percent: number} ) => void) | null = null)
    {
        this.animationID += 1

        const anim = new Animate (
            this.animateManager,
            this.animationID,
            name,
            this,
            null,
            sec,
            delay,
            target,
            from,
            to,
            fade,
            onProgress
        )
        this.animateManager.add ( anim )
        return anim
    }

    fadeAfter (
        name:         string,
        animation:    Anime,
        sec:          number,
        delay:        number,
        target:       D3,
        from:         { x: number, y: number, z: number },
        to:           { x: number, y: number, z: number },
        fade:         { from: number, to: number },
        onProgress:   ( ( progress: {percent: number} ) => void) | null = null)
    {
        this.animationID += 1
        const anim = new Animate (
            this.animateManager,
            this.animationID,
            name,
            this,
            animation,
            sec,
            delay,
            target,
            from,
            to,
            fade,
            onProgress
        )
        this.animateManager.add ( anim )
        return anim
    }

    rotate (
        name:         string,
        animation:    Anime,
        sec:          number,
        delay:        number,
        target:       D3,
        from:         { x: number, y: number, z: number },
        to:           { x: number, y: number, z: number },        
        onProgress:   ( ( progress: {percent: number} ) => void) | null = null)
    {
        this.animationID += 1
        const anim = new AnimateRotation (
            this.animateManager,
            this.animationID,
            name,
            this,
            animation,
            sec,
            delay,
            target,
            from,
            to,
            onProgress
        )
        this.animateManager.add ( anim )
        return anim
    }

    cameraPosition (

        name:         string,    
        sec:          number,
        delay:        number,
        from:         { x: number, y: number, z: number },
        to:           { x: number, y: number, z: number },
        onProgress:   ( ( progress: {percent: number} ) => void) | null = null)
    {
        this.animationID += 1
        const anim = new AnimateCameraPos (
            this.animateManager,
            this.animationID,
            name,
            this,
            null,
            sec,
            delay,
            from,
            to,
            onProgress
        )
        this.animateManager.add ( anim )
        return anim
    }

    cameraPosAfter (
        name:         string,
        animation:    Anime,
        sec:          number,
        delay:        number,
        from:         { x: number, y: number, z: number },
        to:           { x: number, y: number, z: number },
        onProgress:   ( ( progress: {percent: number} ) => void) | null = null)
    {
        this.animationID += 1
        const anim = new AnimateCameraPos (
            this.animateManager,
            this.animationID,
            name,
            this,
            animation,
            sec,
            delay,
            from,
            to,
            onProgress
        )
        this.animateManager.add ( anim )
        return anim
    }

    cameraTarget (

        name:         string,
        animation:    Anime,
        sec:          number,
        delay:        number,
        from:         { x: number, y: number, z: number } | Vector3,
        to:           { x: number, y: number, z: number } | Vector3,
        onProgress:   ( ( progress: {percent: number} ) => void) | null = null)
    {
       
        this.animationID += 1
        const anim = new AnimateCameraTarget (
            this.animateManager,
            this.animationID,
            name,
            this,
            animation,
            sec,
            delay,
            from,
            to,
            onProgress
        )
        this.animateManager.add ( anim )
        return anim
    }

    reCenter ( ) {

        console.log ( 'reCenter !' )
        new AnimateCameraToCenter ( this )
    }

    test ( ) {

        /*
        const v = new Vector3 ( )
        if ( this.add.axis.xAxis && this.add.axis.xAxis. sphere ) {

            this.add.axis.xAxis.sphere.getWorldPosition ( v )
        }
        console.log ( 'v = ', v )
        */
        let v = new Vector3 ( 40, 40, 40 )
        if ( this.add.planes[0] ) {
            if ( this.add.planes[0].plane ) {

                v = this.add.planes[0].plane.position
                if ( this.stage.controls ) {

                    console.log ( v )
                    this.stage.controls.target = this.add.planes[0].plane.position
                    this.stage.controls.update()
                }
                //this.stage.camera?.lookAt ( v )
            }
        }
        this.stage.render ()
    }

    free ( ) {

        this.add.free ( )
        //this.stage.free ()
    }
}

export const createExplainer = ( stage: Stage, divID: string, showPlayer: boolean ) => {

    if ( exp ) exp.free ( )
    styleInject()
    const font = new Font ( helvetiker_regular )
    exp = new Explainer ( stage, font, divID, showPlayer )
    return exp
}

export const useExplainer = createExplainer