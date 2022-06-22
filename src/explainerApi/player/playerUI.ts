import type { Explainer } from "../explainer";

class PlayerUI {

    public containerElement:            HTMLElement | null = null
    public explainerRootDiv:            HTMLDivElement
    public threeDiv:                    HTMLDivElement
    public explainerPlayerRootDiv:      HTMLDivElement
    public explainerPlayerTooltip:      HTMLDivElement
    public explainerPlayerTooltipVal:   HTMLDivElement

    public explainerPlayerPauseButton:  HTMLDivElement
    public explainerPlayerPlayButton:   HTMLDivElement
    public explainerPlayerCenterButton: HTMLDivElement

    public explainerPlayerSlider:       HTMLInputElement

    public explainerMarkers:            HTMLDivElement
    public explainerTestButton:         HTMLDivElement

    private onSliderChange: ( ( val: number) => void )

    constructor ( protected exp: Explainer, onChange: ( ( val: number) => void ) ) {

        this.onSliderChange = onChange

        this.containerElement =             exp.stage.containerElement
        this.explainerRootDiv =             document.getElementById ( 'explainerRootDiv' ) as       HTMLDivElement
        this.threeDiv =                     document.getElementById ( 'threeDiv' ) as               HTMLDivElement
        this.explainerPlayerRootDiv =       document.getElementById ( 'explainerPlayerRootDiv' ) as HTMLDivElement

        this.explainerPlayerSlider =        document.getElementById ( 'explainerPlayerSlider' ) as HTMLInputElement
        this.explainerPlayerTooltip =       document.getElementById ( 'explainerPlayerTooltip' ) as HTMLDivElement
        this.explainerPlayerTooltipVal =    document.getElementById ( 'explainerPlayerTooltipVal' ) as HTMLDivElement

        this.explainerMarkers =             document.getElementById ( 'explainerMarkers' ) as       HTMLDivElement

        this.explainerPlayerPauseButton =   document.getElementById ( 'explainerPlayerPauseButton' ) as HTMLDivElement
        this.explainerPlayerPlayButton =    document.getElementById ( 'explainerPlayerPlayButton' )  as HTMLDivElement
        this.explainerPlayerCenterButton =  document.getElementById ( 'explainerPlayerCenterButton' )as HTMLDivElement

        this.explainerTestButton =          document.getElementById ( 'explainerTestButton' )as HTMLDivElement

        this.createEvents ( )
    }

    createEvents ( ) {

        console.log ( 'createEvent' )
        //Slider
        const onSlider = ( evt: Event ) => this.onSlider ( evt )
        this.explainerPlayerSlider.addEventListener ( "input", onSlider )

        //Pause
        const onPause = ( ) => {

            this.exp.animateManager.onPauseClick ( )
        }
        this.explainerPlayerPauseButton.addEventListener ( 'click', onPause )


        //Play
        const onPlay = ( ) => {

            this.exp.animateManager.onPlayClick ()
        }
        this.explainerPlayerPlayButton.addEventListener ( 'click', onPlay )

        //Center
        const onCenter = ( ) => {

            this.exp.reCenter ()
        }
        this.explainerPlayerCenterButton.addEventListener ( 'click', onCenter )

        //Test
        const onTest = ( ) => {

            this.exp.test ()
        }
        this.explainerTestButton.addEventListener ( 'click', onTest )
    }

    onSlider ( event: Event ) {

        if ( event && event.target ) {

            const element = event.currentTarget as HTMLInputElement
            let val
            if ( typeof element.value == 'string' ) val = parseInt ( element.value )
            else val = element.value
            this.updateTooltipPosition ( val )
            //this.exp.player.setValue ( val )
            this.onSliderChange ( val )
        }
    }

    updateTooltipPosition ( val: number) {

        if ( !this.explainerPlayerTooltip ) return
        if ( !this.explainerPlayerTooltipVal ) return
        if ( !this.explainerPlayerTooltip ) return

        let value = Math.round ( val/10 )/100 + ''
        const splitted = value.split ( '.' )
        if ( splitted.length == 2 ) {

            if ( splitted[1].length == 0 ) {

                value = splitted[0] + '.00'

            } else if ( splitted[1].length == 1 ) {

                value += '0'

            }

        } else {

            value += '.00'
        }
        value += ' sec'


        this.explainerPlayerTooltipVal.innerText = value + ''
        //this.explainerPlayerTooltipVal.innerText = "100000000"
        const rectTooltip = this.explainerPlayerTooltipVal.getBoundingClientRect()

        const min = this.exp.player.min
        const max = this.exp.player.max
        const range = max - min
        const percent = val/range

        const rect = this.explainerPlayerSlider.getBoundingClientRect()
        const left = ( rect.width - 16) * percent


        const leftPx  = ( left + 100 - (rectTooltip.width/2)) + 'px'
        this.explainerPlayerTooltip.style.left = leftPx

        //console.log( rectTooltip.width )

    }

    setMarks ( marks: {value: number, label: string} [] ) {


        setTimeout(() => {

            const min = this.exp.player.min
            const max = this.exp.player.max
            const range = max - min

            const rect = this.explainerPlayerSlider.getBoundingClientRect()
            this.explainerMarkers.innerHTML = ''

            let markDivS = ''
            for (let i = 0; i < marks.length; i++) {

                const mark = marks [ i ]
                const percent = mark.value/range
                const left = percent* rect.width + 88

                const ui = `
                <div style="position: absolute; left: ${left}px; pointer-events: none;">
                    <span style="height: 5px; margin-top: 0px; margin-left: -5px;">●</span>
                    <div style="transform: translate(-50%, 0%); margin-top: 0px;">
                        ${mark.label}
                    </div>
                </div> `
                // const ui = `
                //     <div style="position: absolute; left: ${left}px;">
                //     .<br>
                //     44
                //     </div>
                // `
                markDivS += ui
            }
            this.explainerMarkers.innerHTML = markDivS

        }, 200);

    }
}

export default PlayerUI
