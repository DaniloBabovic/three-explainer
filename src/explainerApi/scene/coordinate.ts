import type { AxisOptions }     from "../../index"
import type { Explainer }       from "../explainer"

import { Direction, Origin }    from "../../index"
import { Vector2, Vector3 }     from "three"

class Coordinate {

    protected exp: Explainer

    protected oPosition = new Vector3 ( 0, 0, 0 )
    protected worldPosition = new Vector3 ( 0, 0, 0 )
    protected screenPosition = new Vector2 ( 0, 0 )

    public optionsX: AxisOptions | null = null
    public optionsY: AxisOptions | null = null
    public optionsZ: AxisOptions | null = null

    public xDirection = Direction.LEFT_RIGHT
    public yDirection = Direction.BOTTOM_TOP

    public size: number // 200

    constructor( exp: Explainer ) {

        this.exp = exp
        this.size = exp.add.axis.size
    }

    onOPosition ( v: Vector3 ) {

        this.oPosition.copy ( v )
        console.log ( 'Coordinate center =', v )
    }

    onWorldPosition ( v: Vector3 ) {

        this.worldPosition.copy ( v )
        this.worldToUserPosition ( v )
        //console.log ( 'onWorldPosition', this.worldPosition )
    }

    userToWorldPosition ( userPosition: Vector3 ) {

        if ( !this.optionsX ) return
        if ( !this.optionsY ) return
        if ( !this.optionsZ ) return

        let worldX = 0
        let worldY = 0
        let worldZ = 0

        if ( this.xDirection == Direction.LEFT_RIGHT ) {

            const center = (this.exp.add.axis.origin == Origin.CENTER)
            let oX = this.oPosition.x
            if ( center ) oX -= this.size/2

            const xRange = Math.abs ( this.optionsX.to - this.optionsX.from )
            const percent = (userPosition.x - this.optionsX.from) /xRange
            worldX = oX + percent * this.size

        } else {

            const xRange = Math.abs ( this.optionsX.to - this.optionsX.from )
            const percent = (userPosition.x - this.optionsX.from) /xRange
            worldX =  this.oPosition.x - percent * this.size
        }

        if ( this.yDirection == Direction.TOP_BOTTOM ) {

            const center = (this.exp.add.axis.origin == Origin.CENTER)
            let oY = this.oPosition.y
            if ( center ) oY -= this.size/2

            const yRange = Math.abs ( this.optionsY.to - this.optionsY.from )
            const percent = (userPosition.y - this.optionsY.from) /yRange
            worldY = oY - percent * this.size

        } else {

            const center = (this.exp.add.axis.origin == Origin.CENTER)
            let oY = this.oPosition.y
            if ( center ) oY -= this.size/2

            const yRange = Math.abs ( this.optionsY.to - this.optionsY.from )
            const percent = (userPosition.y - this.optionsY.from) /yRange
            worldY = oY + percent * this.size
        }

        const zRange = Math.abs ( this.optionsZ.to - this.optionsZ.from )
        const percent = (userPosition.z - this.optionsZ.from) /zRange
        worldZ = percent * this.size - this.size/2
 
        const result = new Vector3 ()
        result.x = worldX
        result.y = worldY
        result.z = worldZ

        //console.log ( 'worldX = ', worldX, 'worldY = ', worldY )
        return result
    }

    worldToUserPosition ( worldPosition: Vector3 ) {

        if ( !this.optionsX ) return
        if ( !this.optionsY ) return
        if ( !this.optionsZ ) return
        

        let userX = 0
        let userY = 0
        let userZ = 0

        if ( this.xDirection == Direction.LEFT_RIGHT ) {

            const center = this.exp.add.axis.origin == Origin.CENTER
            let oX = this.oPosition.x
            if ( center ) oX -= this.size/2

            const xRange = Math.abs ( this.optionsX.to - this.optionsX.from )
            const worldXSize = worldPosition.x - oX
            const percent = worldXSize/this.size
            userX = xRange * percent + this.optionsX.from
            //console.log ( userX )

        } else {

            const xRange = Math.abs ( this.optionsX.to - this.optionsX.from )
            const worldXSize = this.oPosition.x - worldPosition.x
            const percent = worldXSize/this.size
            userX = xRange * percent + this.optionsX.from
            //console.log ( userX )
        }
        if ( this.yDirection == Direction.TOP_BOTTOM ) {

            const yRange = Math.abs ( this.optionsY.to - this.optionsY.from )
            const worldYSize = worldPosition.y - this.oPosition.y
            const percent = worldYSize/this.size
            userY = this.optionsY.from - yRange * percent
            //console.log ( userY )

        } else {

            let oY = this.oPosition.y
            if ( this.exp.add.axis.origin == Origin.CENTER ) {
                oY -= this.size/2
            }
            const yRange = Math.abs ( this.optionsY.to - this.optionsY.from )
            const worldYSize = worldPosition.y - oY
            const percent = worldYSize/this.size
            userY = this.optionsY.from + yRange * percent
            //console.log ( userY )
        }
        //console.log ( Math.round ( userX * 100 )/100, Math.round ( userY * 100 )/100 )

        const zRange = Math.abs ( this.optionsZ.to - this.optionsZ.from )
        const worldZSize = worldPosition.z
        const percent = worldZSize/this.size
        userZ = zRange * percent + this.optionsZ.from

        return new Vector3 ( userX, userY, userZ )
    }

    onScreenPosition ( x: number, y: number, ) {

        this.screenPosition.x = x
        this.screenPosition.y = y
        //console.log ( 'onScreenPosition', x, y )
    }
}

export default Coordinate