import type { Explainer }           from "../../explainer"
import type { Font }                from 'three/examples/jsm/loaders/FontLoader.js'


import { defaultOptions, Origin }   from "../../../index"
import XAxis                        from "./xAxis"
import YAxis                        from "./yAxis"
import ZAxis                        from "./zAxis"
import type { AxisOptions }         from "../../../index"

export class Axis {

    public xAxisOptions:    AxisOptions | null = null
    public yAxisOptions:    AxisOptions | null = null
    public zAxisOptions:    AxisOptions | null = null
    public origin:          Origin | null = null

    public size             = 200
    public sizeHalf         = 100

    public font:            Font | null = null

    public xAxis:           XAxis | null = null
    public yAxis:           YAxis | null = null
    public zAxis:           ZAxis | null = null

    public sphereRadius     = 1.5

    constructor ( public exp: Explainer ) {

    }

    public setOrigin ( origin: Origin | null) {

        this.origin = origin
    }

    public addXAxis ( options: AxisOptions | null = null ) {

        if ( !options ) {

            this.xAxisOptions = { ...defaultOptions }

        } else {

            this.xAxisOptions = options
        }
        this.exp.coordinate.optionsX = this.xAxisOptions
        return this
    }

    public addYAxis ( options: AxisOptions | null = null ) {

        if ( !options ) {

            this.yAxisOptions = { ...defaultOptions }

        } else {

            this.yAxisOptions = options
        }
        this.exp.coordinate.optionsY = this.yAxisOptions
        return this
    }

    public addZAxis ( options: AxisOptions | null = null ) {

        if ( !options ) {

            this.zAxisOptions = { ...defaultOptions }

        } else {

            this.zAxisOptions = options
        }
        this.exp.coordinate.optionsZ = this.zAxisOptions
        return this
    }

    public create ( ) {

        console.log ( 'create X, Y and Z axis.' )

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this

        const font = this.exp.font
        self.font = font
        if ( self.origin == null )  self.origin = Origin.CENTER

        if ( self.xAxisOptions )  {

            self.xAxis = new XAxis (
                self,
                self.xAxisOptions,
                font,
                self.origin
            )
            this.exp.xGroup = self.xAxis.rootGroup
        }

        if ( self.yAxisOptions )  {

            self.yAxis = new YAxis (
                self,
                self.yAxisOptions,
                font,
                self.origin
            )
            this.exp.yGroup = self.yAxis.rootGroup
        }

        if ( self.zAxisOptions )  {

            self.zAxis = new ZAxis (
                self,
                self.zAxisOptions,
                font,
                self.origin
            )
            this.exp.zGroup = self.zAxis.rootGroup
        }
    }

    public free ( ) {

        console.log ( 'Axis free' )

        if ( this.xAxis ) {

            this.xAxis.free ()
        }
    }
}

