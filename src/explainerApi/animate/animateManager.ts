import TWEEN, { now }                           from "@tweenjs/tween.js"
import type { TimeNode, StartTimeModel }             from "../model"
import type { Explainer }                            from "../explainer"
import type Animate                                  from "./animate"

class AnimateManager {

    public timeNode: TimeNode = {
        animation:  null,
        parent:     null,
        id:         0,
        start:      0, 
        end:        0,
        children:   []
    }

    public done                             = false
    public startTimes: StartTimeModel []    = []
    public lastTimeNode: TimeNode | null    = null
    public activeAnimations: Animate []     = []
    public allAnimations: Animate []        = []

    public lastProgress: Animate | null     = null
    public lastProgressPercent      = 0

    //Tween
    public pause                            = false
    
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

    public onStart ( animation: Animate ) {

        this.activeAnimations.push ( animation )
    }

    public onEnd ( animation: Animate ) {

        for( let i = 0; i < this.activeAnimations.length; i++){ 
    
            const current = this.activeAnimations [ i ]
            if ( current.id === animation.id ) { 
        
                this.activeAnimations.splice ( i, 1) 
            }
        }
    }

    public onProgress ( animation: Animate, percent: number ) {

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

    onSlider ( value: number ) {

        //console.log ( 'onSliderUP', value )
        TWEEN.removeAll ()
        this.activeAnimations.length = 0
        for (let i = 0; i < this.allAnimations.length; i++) {
                
            const animation = this.allAnimations [ i ]
            if ( animation.timeNode ) {
                if ( (animation.timeNode.end * 1000 ) < value ) {

                    animation.resetToEnd ()

                } else if ( (animation.timeNode.start * 1000 ) < value ) {

                    //console.log ( animation.name )
                    //const range = ( animation.timeNode.end - animation.timeNode.start ) * 1000
                    const part = value - animation.timeNode.start * 1000
                    if ( part <  0 ) {

                        console.error ( 'part <  0', part )

                        return

                    } else {
                        
                        //const percent = part/range
                        animation.insertAnimate ( part )
                        this.done = false
                        this.pause = false
                        this.animate ( now() )
                        setTimeout(() => {                            
                            this.pause = true
                        }, 100)                        
                    }

                } else {

                    animation.reset ()
                }
            }
        } 
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

    add ( animation: Animate ) {

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

        // store.dispatch ( setMin ( 0 ) )
        // store.dispatch ( setMax ( this.timeNode.end * 1000 ) )
        // store.dispatch ( setStep ( 1 ) )
        // store.dispatch ( setDefaultValue ( 0 ) )
        // store.dispatch ( setValue ( 0 ) )
        // store.dispatch ( setMarks ( marks ) )

        this.exp.player.setMin ( 0 )
        this.exp.player.setMax ( this.timeNode.end * 1000 )
        this.exp.player.setStep ( 1 )
        this.exp.player.setDefaultValue ( 0 )
        this.exp.player.setValue ( 0 )
        this.exp.player.setMarks ( marks )


        const onAllDone = ( ) => {

            this.done = true
            const toStart = ( ) => {

                //store.dispatch ( setValue ( 0 ) )
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