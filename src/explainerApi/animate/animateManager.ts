import TWEEN, { now }                       from "@tweenjs/tween.js"
import type { TimeNode, StartTimeModel }    from "../model"
import type { Anime, AnimeNull }            from "../model"
import type { Explainer }                   from "../explainer"
import AnimateCameraPosition                from "./animateCameraPosition"
import AnimateCameraTarget             from "./animateCameraTarget"

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
        console.log ( 'timeNode.start', timeNode.start )

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

    onSlider ( value: number ) {

        let updateOrbit = false
        let cameraAnimationDone = false
        let cameraTargetDone = false

        //console.log ( 'onSliderUP', value )
        TWEEN.removeAll ()
        this.activeAnimations.length = 0
        interface NearestCameraEvents {

            distance:   number
            isStart:    boolean
            animation: AnimateCameraPosition
        }
        interface NearestTargetEvents {

            distance:   number
            isStart:    boolean
            animation: AnimateCameraTarget
        }
        const cameraEvents: NearestCameraEvents [] = [] 
        const cameraTargetEvents: NearestTargetEvents [] = [] 

        const setCameraPosition = ( animation: AnimateCameraPosition ) => {

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

                cameraAnimationDone = true
                cameraEvents.length = 0

            } else {

                if ( !cameraAnimationDone ) {

                    const distanceStart = Math.abs ( value - (animation.timeNode.start * 1000 ) )
                    const eventStart = {
                        distance: distanceStart,
                        isStart: true,
                        animation
                    }
                    cameraEvents.push ( eventStart )

                    const distanceEnd = Math.abs ( value - (animation.timeNode.end * 1000 ) )
                    const eventEnd = {
                        distance: distanceEnd,
                        isStart: false,
                        animation
                    }
                    cameraEvents.push ( eventEnd )
                }
            }
        }

        const setCameraTarget = ( animation: AnimateCameraTarget ) => {

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

                cameraTargetDone = true
                cameraTargetEvents.length = 0

            } else {

                if ( !cameraTargetDone ) {

                    const distanceStart = Math.abs ( value - (animation.timeNode.start * 1000 ) )
                    const eventStart = {
                        distance: distanceStart,
                        isStart: true,
                        animation
                    }
                    cameraTargetEvents.push ( eventStart )

                    const distanceEnd = Math.abs ( value - (animation.timeNode.end * 1000 ) )
                    const eventEnd = {
                        distance: distanceEnd,
                        isStart: false,
                        animation
                    }
                    cameraTargetEvents.push ( eventEnd )
                }
            }
        }

        for (let i = 0; i < this.allAnimations.length; i++) {  
        //for (let i = this.allAnimations.length -1; i > -1; i--) {

            const animation = this.allAnimations [ i ]
            
            if ( !animation.timeNode ) continue

            if ( animation instanceof AnimateCameraPosition ) {

                updateOrbit = true
                setCameraPosition ( animation )
                continue
            }

            if ( animation instanceof AnimateCameraTarget ) {

                updateOrbit = true
                setCameraTarget ( animation )
                continue
            }

            if ( value > (animation.timeNode.end * 1000 ) ) {

                animation.resetToEnd ()

            } else if ( value > (animation.timeNode.start * 1000 ) ) {

                const part = value - animation.timeNode.start * 1000
                if ( part <  0 ) {

                    console.error ( 'part <  0', part )
                    return

                } else {

                    animation.insertAnimate ( part )
                    this.done = false
                    this.pause = false
                    setTimeout(() => {
                        this.pause = true
                    }, 100)
                }
                
            } else {
                
                animation.reset ()
            }
        }

        // Reset camera position to Start or to end
        if ( cameraEvents.length > 0 ) {

            const compare = ( a:NearestCameraEvents, b:NearestCameraEvents ) => {
    
                if ( a.distance < b.distance ) return -1
                if ( a.distance > b.distance ) return 1            
                return 0
            }          
            cameraEvents.sort( compare )
            //console.log ( 'cameraEvent', cameraEvent )
            const event = cameraEvents [0]
            if ( event.isStart ) {

                event.animation.reset ( )

            } else {

                event.animation.resetToEnd ( )
            }
        }

        // Reset camera target to Start or to end
        if ( cameraTargetEvents.length > 0 ) {

            const compare = ( a: NearestTargetEvents, b: NearestTargetEvents ) => {
    
                if ( a.distance < b.distance ) return -1
                if ( a.distance > b.distance ) return 1            
                return 0
            }          
            cameraTargetEvents.sort( compare )
            //console.log ( 'cameraEvent', cameraEvent )
            const event = cameraTargetEvents [0]
            if ( event.isStart ) {

                event.animation.reset ( )

            } else {

                event.animation.resetToEnd ( )
            }
        }
        
        if ( updateOrbit ) {

            this.exp.stage.skipOrbitRender = true
            this.exp.stage.controls?.update()
        }
        this.animate ( now() )
    }

    onPlayClick ( ) {

        if ( this.done ) {

            this.done = false
            TWEEN.removeAll ()
            for (let i = 0; i < this.allAnimations.length; i++) {

                const animation = this.allAnimations [ i ]
                animation.reset ()
            }
            for (let i = 0; i < this.timeNode.children.length; i++) {

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

        console.log ( 'timeNode', this.timeNode )
        console.log ( 'this.timeNode.end', this.timeNode.end )
        console.log ( 'this.startTimes', this.startTimes )

        this.exp.player.setMin ( 0 )
        this.exp.player.setMax ( this.timeNode.end * 1000 )
        this.exp.player.setStep ( 1 )
        this.exp.player.setDefaultValue ( 0 )
        this.exp.player.setValue ( 0 )
        this.exp.player.setMarks ( marks )


        const onAllDone = ( ) => {

            this.done = true
            const toStart = ( ) => {

                this.exp.player.setValue ( 0 )
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
