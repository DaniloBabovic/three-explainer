import type { Explainer } from "../explainer"
import PlayerUI from "./playerUI"

class Player {

    public defaultValue = 0
    public value        = 0
    public max          = 1000
    public min          = 0
    public step         = 1

    public onValue: ( ( newVal: number, oldVal: number ) => void ) | null = null

    public marks: {value: number, label: string} [] = [] 

    public ui: PlayerUI

    constructor( protected exp: Explainer ) {
        
        const onSliderChange = ( val: number ) => this.onSliderChange ( val )
        this.ui =  new PlayerUI ( exp, onSliderChange )
    }

    setDefaultValue ( defaultValue: number ) {
    
        console.log ( defaultValue )
        this.defaultValue = defaultValue
    }
    
    setMarks ( marks: {value: number, label: string} [] ) {
    
        console.log ( marks )
        this.marks = marks
        this.ui.setMarks ( marks )
    }
    
    onSliderChange ( val: number ) {
    
        //console.log( 'onSliderChange', val )
        
        if ( val == this.value ) return
        if ( this.onValue ) {

            this.onValue ( val, this.value )
        }
        this.value = val
    }

    setValue ( value: number ) {
            
        if ( value == this.value ) return
        this.value = value
        this.ui.explainerPlayerSlider.value= value +''
        this.ui.updateTooltipPosition ( value )
    }
    
    setMax ( max: number ) {
            
        console.log ( '[max = ', max )
        this.max = max
        this.ui.explainerPlayerSlider.max = max +''        
    }
    
    setMin ( min: number ) {
    
        console.log ( min )
        this.min = min
        this.ui.explainerPlayerSlider.min = min +''
    }
    
    setStep ( step: number ) {
    
        console.log ( step )
        this.step = step
    }
}


export default Player