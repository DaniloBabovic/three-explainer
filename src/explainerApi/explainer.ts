import { helvetiker_regular }       from "../font"
import { Mesh, Object3D, Vector3 }  from "three"
import { Font }   from "three/examples/jsm/loaders/FontLoader.js"
import { Add }                      from "./add/add"
import Animate                      from "./animate/animate"
import AnimateCameraToCenter        from "./animate/animateCameraToCenter"
import AnimateManager               from "./animate/animateManager"
import Coordinate                   from "./scene/coordinate"
import Pick                         from "./scene/pick"
import { createStage, Stage }       from "./scene/stage"

export let exp = null as  ( Explainer | null)

export class Explainer {

    public stage:           Stage 
    public add:             Add 
    public pickEnable       = true
    public pick:            Pick
    public coordinate:      Coordinate
    public font:            Font
    
    public xGroup:          Object3D | null = null
    public yGroup:          Object3D | null = null
    public animationID      = 0
    public animateManager:  AnimateManager

    constructor  ( font: Font, divID: string ) {
        
        this.font           = font
        this.stage          = createStage ( divID )
        this.add            = new Add ( this )
        this.pick           = new Pick ( this )
        this.coordinate     = new Coordinate ( this )
        this.animateManager = new AnimateManager ( this )
    }

    fade (
        name:         string,          
        sec:          number,
        delay:        number,        
        target:       Mesh | Object3D | null | undefined,        
        from:         { x: number, y: number, z: number },
        to:           { x: number, y: number, z: number },
        fade:         { from: number, to: number },        
        onProgress:   ( ( progress: {percent: number} ) => void) | null = null) 
    {
        const wait = false
        this.animationID += 1

        const anim = new Animate (
            this.animateManager,
            this.animationID,
            name,
            this, 
            null,
            sec, 
            delay, 
            wait, 
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
        animation:    Animate,          
        sec:          number,
        delay:        number,        
        target:       Mesh | Object3D | null | undefined,        
        from:         { x: number, y: number, z: number },
        to:           { x: number, y: number, z: number },
        fade:         { from: number, to: number },        
        onProgress:   ( ( progress: {percent: number} ) => void) | null = null) 
    {
        const wait = true
        this.animationID += 1
        const anim = new Animate (
            this.animateManager,
            this.animationID,
            name,
            this,
            animation, 
            sec, 
            delay, 
            wait, 
            target, 
            from, 
            to, 
            fade,            
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

        const v = new Vector3 ( )
        if ( this.add.axis.xAxis && this.add.axis.xAxis. sphere ) {
            
            this.add.axis.xAxis.sphere.getWorldPosition ( v )
        }
        console.log ( 'v = ', v )
    }

    free ( ) {

        this.add.free ( )
        this.stage.free ()
    }
}
//const loader   = new FontLoader ( )
/* 
const loadFont = async () => {
            
    const font = await loader.loadAsync( '/helvetiker_regular.typeface.json' )
    return font
} 
*/


export const createExplainer = ( divID: string ) => {

    if ( exp ) exp.free ( )
    //const font = await loadFont ()
    const font = new Font ( helvetiker_regular )
    exp = new Explainer ( font, divID )
    return exp
}

export const useExplainer = createExplainer