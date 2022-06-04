import { exp }                   from "src/explainerApi/explainer"
import {  LineSegments }        from "three"
import TWEEN, { Tween, now }    from "@tweenjs/tween.js"

let testDrawRange : TestDrawRange | null = null

class TestDrawRange {

    tween : Tween<{percent: number}> | null = null
    current                                 = { percent: 0 }
    done                                    = false

    constructor( ) {
        
        console.log ( 'TestDrawRange' )
        if ( exp?.add.lines && exp?.add.lines.length > 0 ) {

            console.log ( exp?.add.lines[0] )
            if ( exp?.add.lines[0].line ) {

                //this.testDraw ( exp?.add.lines[0].line )
                this.insertAnimation ( exp?.add.lines[0].line )
            }
        }
    }

    testDraw ( line: LineSegments ) {

        const lineLength = line.geometry.attributes.position.count
        if ( lineLength ) {

            line.geometry.setDrawRange( 0, lineLength * 0.5 )            
            line.geometry.attributes.position.needsUpdate = true            
        }
        console.log ( lineLength, line.geometry.getIndex () )        
    }

    insertAnimation ( line: LineSegments ) {

        this.tween = new TWEEN.Tween ( this.current ) 
        this.tween.to ( { percent: 1 }, 2000 )

        this.tween.onUpdate(() => {
            //console.log( this.current.percent )
            const lineLength = line.geometry.attributes.position.count
            if ( lineLength ) {

                line.geometry.setDrawRange( 0, lineLength * this.current.percent ) 
                line.geometry.attributes.position.needsUpdate = true            
            }
        })
        this.tween.yoyo ( true ) 
        this.tween.repeat(2)
        this.tween.start ( )
        this.animate ()
        this.tween.onComplete( () => {

            this.done = true
            testDrawRange = null
        })
    }

    animate ( time = 0 ) {

        if ( time == 0 ) time = now()
        if ( this.done ) return

        const animate = ( time: number ) => { this.animate ( time ) }         
        requestAnimationFrame ( animate )

        TWEEN.update (  )
        if ( exp ) exp.stage.render ( )
   }
}

export default TestDrawRange

export const startYoYo = ( ) => {

    if ( testDrawRange == null ) testDrawRange = new TestDrawRange ( )
}
