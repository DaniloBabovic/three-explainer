import type { Nearest3DObjectEvents }       from '../../index'
import type { NearestRotationEvents }       from '../../index'
import type { NearestCameraEvents }         from '../../index'
import type { NearestTargetEvents }         from '../../index'
import type { TimeNode, StartTimeModel }    from "../../index"
import type { Anime, AnimeNull }            from "../../index"
import type { Explainer }                   from "../explainer"

import TWEEN, { now }                       from "@tweenjs/tween.js"
import AnimateCameraPosition                from "./animateCameraPosition"
import AnimateCameraTarget                  from "./animateCameraTarget"
import Animate                              from './animate';
import AnimateRotation                      from './animateRotation'

class AnimateManager {

    public timeNode: TimeNode = {
        animation:  null,
        parent:     null,
        id:         0,
        start:      0,
        end:        0,
        children:   []
    }

    public done                                                 = false
    public startTimes: StartTimeModel []                        = []
    public lastTimeNode: TimeNode | null                        = null
    public activeAnimations: ( Anime ) []                       = []
    public allAnimations: (Anime ) []                           = []

    public lastProgress: AnimeNull                              = null
    public lastProgressPercent                                  = 0

    //Tween
    public pause                                                = false

    constructor( protected exp: Explainer ) {

        const onSlider = ( newVal: number, oldVal: number ) => {

            oldVal
            this.onSlider ( newVal)
        }
        exp.player.onValue = onSlider
    }

    // Danger! recursion
    getTimeNode ( id: number, node: TimeNode ) : TimeNode | null  {

        if ( node.id == id ) return node

        for (let i = 0; i < node.children.length; i++) {

            const child = node.children[i]
            if ( child.id == id ) return child
            const result = this.getTimeNode( id, child )
            if ( result && result.id == id ) return result
        }
        return null
    }

    setStartTime ( timeNode: TimeNode ) {

        const getStartTime = ( start: number ) => {

            for (let i = 0; i < this.startTimes.length; i++) {

                const startTime = this.startTimes [ i ]
                if ( startTime.from == start ) return startTime
            }
            const newStartTime = {
                from: start,
                infos: []
            }
            this.startTimes.push ( newStartTime )
            return newStartTime
        }
        //console.log ( 'timeNode.start', timeNode.start )

        const startTime = getStartTime ( timeNode.start )
        startTime.infos.push ({
            id: timeNode.id,
            to: timeNode.end,
            name: timeNode.animation?.name || ''
        })
    }

    setLastTimeNode ( timeNode: TimeNode ) {

        if ( this.lastTimeNode == null ) {

            this.lastTimeNode = timeNode
            return
        }

        if ( this.lastTimeNode.end < timeNode.end ) {

            this.lastTimeNode = timeNode
        }
    }

    public onStart ( animation: Anime  ) {

        this.activeAnimations.push ( animation )
    }

    public onEnd ( animation: Anime ) {

        for( let i = 0; i < this.activeAnimations.length; i++){

            const current = this.activeAnimations [ i ]
            if ( current.id === animation.id ) {

                this.activeAnimations.splice ( i, 1)
            }
        }
    }

    public onProgress ( animation: Anime, percent: number ) {

        this.lastProgress = animation
        this.lastProgressPercent = percent
        //console.log ( animation.id, percent )
        if ( animation.timeNode ) {

            const duration = ( animation.timeNode.end - animation.timeNode.start ) * percent
            let durationAll = duration

            if ( animation.timeNode.parent && animation.timeNode.parent.timeNode ) {

                durationAll += animation.timeNode.parent.timeNode.end
            }

            durationAll = Math.round ( durationAll * 100 )/100
            //console.log ( durationAll )
            //store.dispatch ( setValue ( durationAll * 1000 ) )
            this.exp.player.setValue ( durationAll * 1000 )
        }
    }

    onPauseClick ( ) {

        this.pause = true
        for (let i = 0; i < this.activeAnimations.length; i++) {

            const activeAnimation = this.activeAnimations [ i ]
            activeAnimation.tween?.pause ( )
            activeAnimation.tweenPercent?.pause ( )
        }
    }

    /* 
    ----------- | | ---------- | | ------- 
    */

    setCameraPosition (

        value: number, 
        animation: AnimateCameraPosition, 
        state: {
            updateOrbit: boolean
            cameraAnimationDone: boolean
            cameraTargetDone: boolean
            cameraEvents: NearestCameraEvents[]
            cameraTargetEvents: NearestTargetEvents[]
        } 
    ) {

        if ( !animation.timeNode ) return      
        // Slider time is inside camera move animation:
        if (
            ( value < (animation.timeNode.end * 1000 ) ) && 
            (value > (animation.timeNode.start * 1000 ) )
        ) {
            const part = value - animation.timeNode.start * 1000
            animation.insertAnimate ( part )
            this.done = false
            this.pause = false
            setTimeout(() => {
                this.pause = true
            }, 100)

            state.cameraAnimationDone = true
            state.cameraEvents.length = 0

        } else {

            if ( !state.cameraAnimationDone ) {

                const distanceStart = Math.abs ( value - (animation.timeNode.start * 1000 ) )
                const eventStart = {
                    distance: distanceStart,
                    isStart: true,
                    animation
                }
                state.cameraEvents.push ( eventStart )

                const distanceEnd = Math.abs ( value - (animation.timeNode.end * 1000 ) )
                const eventEnd = {
                    distance: distanceEnd,
                    isStart: false,
                    animation
                }
                state.cameraEvents.push ( eventEnd )
            }
        }
    }

    setCameraTarget (
        
        value: number, 
        animation: AnimateCameraTarget, 
        state: {
            updateOrbit: boolean
            cameraAnimationDone: boolean
            cameraTargetDone: boolean
            cameraEvents: NearestCameraEvents[]
            cameraTargetEvents: NearestTargetEvents[]
        } 
    ) {

        if ( !animation.timeNode ) return      
        // Slider time is inside camera move animation:
        if (
            ( value < (animation.timeNode.end * 1000 ) ) && 
            (value > (animation.timeNode.start * 1000 ) )
        ) {
            
            const part = value - animation.timeNode.start * 1000
            animation.insertAnimate ( part )
            this.done = false
            this.pause = false
            setTimeout(() => {
                this.pause = true
            }, 100)

            state.cameraTargetDone = true
            state.cameraTargetEvents.length = 0

        } else {

            if ( !state.cameraTargetDone ) {

                const distanceStart = Math.abs ( value - (animation.timeNode.start * 1000 ) )
                const eventStart = {
                    distance: distanceStart,
                    isStart: true,
                    animation
                }
                state.cameraTargetEvents.push ( eventStart )

                const distanceEnd = Math.abs ( value - (animation.timeNode.end * 1000 ) )
                const eventEnd = {
                    distance: distanceEnd,
                    isStart: false,
                    animation
                }
                state.cameraTargetEvents.push ( eventEnd )
            }
        }
    }

    resetCamera (
            
        state: {
            updateOrbit: boolean
            cameraAnimationDone: boolean
            cameraTargetDone: boolean
            cameraEvents: NearestCameraEvents[]
            cameraTargetEvents: NearestTargetEvents[]
        } 
    ) {

        const compare = ( a: NearestCameraEvents, b: NearestCameraEvents ) => {
    
            if ( a.distance < b.distance ) return -1
            if ( a.distance > b.distance ) return 1            
            return 0
        }          
        state.cameraEvents.sort( compare )
        //console.log ( 'cameraEvent', cameraEvent )
        const event = state.cameraEvents [0]
        if ( event.isStart ) {

            event.animation.reset ( )

        } else {

            event.animation.resetToEnd ( )
        }
    }
    
    resetCameraTarget (
            
        state: {
            updateOrbit: boolean
            cameraAnimationDone: boolean
            cameraTargetDone: boolean
            cameraEvents: NearestCameraEvents[]
            cameraTargetEvents: NearestTargetEvents[]
        } 
    ) {

        const compare = ( a: NearestTargetEvents, b: NearestTargetEvents ) => {
    
            if ( a.distance < b.distance ) return -1
            if ( a.distance > b.distance ) return 1            
            return 0
        }          
        state.cameraTargetEvents.sort( compare )
        console.log ( 'cameraEvent', state.cameraTargetEvents )
        const event = state.cameraTargetEvents [0]
        if ( event.isStart ) {

            event.animation.reset ( )

        } else {

            event.animation.resetToEnd ( )
        }
    }
    
    reset3DObject (
            
        state: {            
            objects3D:  {
                uuid: string,
                object3DDone: boolean,
                objects3DEvents: Nearest3DObjectEvents[]
            }[]
        } 
    ) {

        for ( let i = 0; i < state.objects3D.length; i++ ) {

            const object3D = state.objects3D[i]
            if ( !object3D.object3DDone ) {

                const compare = ( a: Nearest3DObjectEvents, b: Nearest3DObjectEvents ) => {
            
                    if ( a.distance < b.distance ) return -1
                    if ( a.distance > b.distance ) return 1            
                    return 0
                }          
                object3D.objects3DEvents.sort( compare )
                
                const event = object3D.objects3DEvents [0]
                if ( event.isStart ) {
        
                    event.animation.reset ( )
        
                } else {
        
                    event.animation.resetToEnd ( )
                }
            }
        }
    }

    resetRotation (
            
        state: {            
            rotations: {
                uuid: string,
                rotationDone: boolean,
                rotationsEvents: NearestRotationEvents[]
            }[],
        } 
    ) {

        for ( let i = 0; i < state.rotations.length; i++ ) {

            const rotation = state.rotations[i]
            if ( !rotation.rotationDone ) {

                const compare = ( a: NearestRotationEvents, b: NearestRotationEvents ) => {
            
                    if ( a.distance < b.distance ) return -1
                    if ( a.distance > b.distance ) return 1            
                    return 0
                }          
                rotation.rotationsEvents.sort( compare )
                
                const event = rotation.rotationsEvents [0]
                if ( event.isStart ) {
        
                    event.animation.reset ( )
        
                } else {
        
                    event.animation.resetToEnd ( )
                }
            }
        }
    }

    setRotations (
        
        value: number, 
        animation: AnimateRotation, 
        state: {            
            rotations: {
                uuid: string,
                rotationDone: boolean,
                rotationsEvents: NearestRotationEvents[]
            }[],
        } 
    ) { 
        
        if ( !animation.timeNode ) return

        let rotation : {
            uuid: string,
                rotationDone: boolean,
                rotationsEvents: NearestRotationEvents[]
        } | undefined = undefined

        for (let i = 0; i < state.rotations.length; i++) {
            
            const item = state.rotations[i]
            if ( item.uuid == animation.target.uuid ) {
                rotation = item
            }
        }

        if ( !rotation ) {
            rotation = {
                uuid: animation.target.uuid,
                rotationDone: false,
                rotationsEvents: []
            }
            state.rotations.push ( rotation )
        }
        if (
            ( value < (animation.timeNode.end * 1000 ) ) && 
            (value > (animation.timeNode.start * 1000 ) )
        ) {
            const part = value - animation.timeNode.start * 1000
            animation.insertAnimate ( part )
            this.done = false
            this.pause = false
            setTimeout(() => {
                this.pause = true
            }, 100)

            rotation.rotationDone = true
            rotation.rotationsEvents.length = 0

        } else {

            if ( !rotation.rotationDone ) {
                
                const distanceStart = Math.abs ( value - (animation.timeNode.start * 1000 ) )
                const eventStart = {
                    distance: distanceStart,
                    isStart: true,
                    animation
                }
                rotation.rotationsEvents.push ( eventStart )

                const distanceEnd = Math.abs ( value - (animation.timeNode.end * 1000 ) )
                const eventEnd = {
                    distance: distanceEnd,
                    isStart: false,
                    animation
                }
                rotation.rotationsEvents.push ( eventEnd )
            }
        }
    }

    set3DObjects (
        
        value: number, 
        animation: Animate, 
        state: {
            updateOrbit: boolean
            cameraAnimationDone: boolean
            cameraTargetDone: boolean            
            cameraEvents: NearestCameraEvents[]
            cameraTargetEvents: NearestTargetEvents[],
            objects3D: {
                uuid: string,
                object3DDone: boolean,
                objects3DEvents: Nearest3DObjectEvents[]
            }[]
        } 
    ) { 
        
        if ( !animation.timeNode ) return

        let object3D : {
            uuid: string,
            object3DDone: boolean,
            objects3DEvents: Nearest3DObjectEvents[]
        } | undefined = undefined

        for (let i = 0; i < state.objects3D.length; i++) {
            
            const item = state.objects3D[i]
            if ( item.uuid == animation.target.uuid ) {
                object3D = item
            }
        }

        if ( !object3D ) {
            object3D = {
                uuid: animation.target.uuid,
                object3DDone: false,
                objects3DEvents: []
            }
            state.objects3D.push ( object3D )
        }
        if (
            ( value < (animation.timeNode.end * 1000 ) ) && 
            (value > (animation.timeNode.start * 1000 ) )
        ) {
            const part = value - animation.timeNode.start * 1000
            animation.insertAnimate ( part )
            this.done = false
            this.pause = false
            setTimeout(() => {
                this.pause = true
            }, 100)

            object3D.object3DDone = true
            object3D.objects3DEvents.length = 0

        } else {

            if ( !object3D.object3DDone ) {
                
                const distanceStart = Math.abs ( value - (animation.timeNode.start * 1000 ) )
                const eventStart = {
                    distance: distanceStart,
                    isStart: true,
                    animation
                }
                object3D.objects3DEvents.push ( eventStart )

                const distanceEnd = Math.abs ( value - (animation.timeNode.end * 1000 ) )
                const eventEnd = {
                    distance: distanceEnd,
                    isStart: false,
                    animation
                }
                object3D.objects3DEvents.push ( eventEnd )
            }
        }
    }

    onSlider ( value: number ) {

        const state = {

            updateOrbit: false,
            
            cameraAnimationDone: false,
            cameraTargetDone: false,
            
            cameraEvents: [] as NearestCameraEvents [],
            cameraTargetEvents: [] as NearestTargetEvents [],
            objects3D: [] as {
                uuid: string,
                object3DDone: boolean,
                objects3DEvents: Nearest3DObjectEvents[]
            }[],
            rotations: [] as {
                uuid: string,
                rotationDone: boolean,
                rotationsEvents: NearestRotationEvents[]
            }[],
        }

        //console.log ( 'onSliderUP', value )
        TWEEN.removeAll ()
        this.activeAnimations.length = 0
        

        for (let i = 0; i < this.allAnimations.length; i++) {  
        //for (let i = this.allAnimations.length -1; i > -1; i--) {

            const animation = this.allAnimations [ i ]
            
            if ( !animation.timeNode ) continue

            if ( animation instanceof AnimateCameraPosition ) {

                state.updateOrbit = true
                this.setCameraPosition ( value, animation, state )
                continue
            }

            if ( animation instanceof AnimateCameraTarget ) {

                state.updateOrbit = true
                this.setCameraTarget ( value, animation, state )
                continue
            }

            if ( animation instanceof Animate ) {

                this.set3DObjects ( value, animation, state )
            }

            if ( animation instanceof AnimateRotation ) {

                this.setRotations ( value, animation, state )
            }
        }
        // Reset Mesh, Object3D and LineSegments to Start or to end
        this.reset3DObject ( state )

        // Reset Rotations
        if ( state.rotations.length > 0 ) this.resetRotation ( state )

        // Reset camera position to Start or to end
        if ( state.cameraEvents.length > 0 ) this.resetCamera ( state )

        // Reset camera target to Start or to end
        if ( state.cameraTargetEvents.length > 0 ) this.resetCameraTarget ( state )
        
        if ( state.updateOrbit ) {

            this.exp.stage.skipOrbitRender = true
            this.exp.stage.controls?.update()
        }
        this.animate ( now() )
    }

    onPlayClick ( ) {

        if ( this.done ) {

            this.done = false
            TWEEN.removeAll ()
            //for (let i = 0; i < this.allAnimations.length; i++) {
            for (let i = this.allAnimations.length-1; i >-1; i--) {

                const animation = this.allAnimations [ i ]
                animation.reset ()
            }
            //for (let i = 0; i < this.timeNode.children.length; i++) {
            for (let i = this.timeNode.children.length-1; i >-1; i--) {    

                const animate = this.timeNode.children [ i ]
                animate.animation?.insertAnimate ( )
            }		

        } else {

            this.pause = false
            for (let i = 0; i < this.activeAnimations.length; i++) {

                const activeAnimation = this.activeAnimations [ i ]
                activeAnimation.tween?.resume ()
                activeAnimation.tweenPercent?.resume ()
            }
        }
        this.animate ( )
    }

    add ( animation: Anime ) {

        this.allAnimations.push ( animation )
        if ( animation.after == null ) {

            const timeNode: TimeNode  = {
                animation:  animation,
                parent:     animation.after,
                id:         animation.id,
                start:      0,
                end:        animation.sec + animation.delay,
                children:   []
            }
            animation.timeNode = timeNode
            this.timeNode.children.push ( timeNode )
            this.setStartTime ( timeNode )
            this.setLastTimeNode ( timeNode )
            if ( timeNode.end > this.timeNode.end ) {

                this.timeNode.end = timeNode.end
            }

        } else {

            const parentNode = this.getTimeNode (

                animation.after.id,
                this.timeNode
            )
            if ( parentNode ) {

                const timeNode: TimeNode  = {

                    animation:  animation,
                    parent:     animation.after,
                    id:         animation.id,
                    start:      parentNode.end,
                    end:        parentNode.end + animation.sec + animation.delay,
                    children:   []
                }
                animation.timeNode = timeNode
                parentNode.children.push ( timeNode )
                this.setStartTime ( timeNode )
                this.setLastTimeNode ( timeNode )
                if ( timeNode.end > this.timeNode.end ) {

                    this.timeNode.end = timeNode.end
                }
            } else {

                alert ( 'Parent Animation Not Found!' )
            }
        }
    }

    public updatePlayer ( ) {

        const marks: {
            value: number
            label: string
        }[] = []
        for (let i = 0; i < this.startTimes.length; i++) {

            const startTime = this.startTimes [ i ]

            const mark = {

                value: startTime.from * 1000,
                label: startTime.infos[0].name,
            }
            marks.push ( mark )
        }

        /* 
            console.log ( 'timeNode', this.timeNode )
            console.log ( 'this.timeNode.end', this.timeNode.end )
            console.log ( 'this.startTimes', this.startTimes )
        */

        this.exp.player.setMin ( 0 )
        this.exp.player.setMax ( this.timeNode.end * 1000 )
        this.exp.player.setStep ( 1 )
        this.exp.player.setDefaultValue ( 0 )
        this.exp.player.setValue ( 0 )
        this.exp.player.setMarks ( marks )


        const onAllDone = ( ) => {

            this.done = true
            const toStart = ( ) => {

                // this.exp.stage.controls?.target.set ( 0, 0, 0 )
                // this.exp.stage.camera?.position.set ( 0, 0, 170 )
                // this.exp.stage.controls?.update()
                this.exp.player.setValue ( 1 )
                this.exp.stage.render ()

                console.log( 'TWEEN.getAll().length=', TWEEN.getAll().length )
            }
            setTimeout ( toStart, 200 )
        }

        if ( this.lastTimeNode ) {

            this.lastTimeNode.animation?.callbacks.push ( onAllDone )
            this.animate ( )
        }
    }

    animate( time = 0) {

         //console.log ( time )
        if ( this.done ) return
        if ( this.pause ) return
        const animate = ( time: number ) => { this.animate ( time ) }
        requestAnimationFrame ( animate )

        if ( time > 0 ) {

            TWEEN.update (  )
        }

        this.exp.stage.render ( )
    }
}


export default AnimateManager
