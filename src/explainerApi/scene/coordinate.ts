import { AxisOptions, Direction, Origin }   from "src/explainerApi/model"
import { Explainer }                               from "src/explainerApi/explainer"
import { Vector2, Vector3 }                 from "three"

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
        console.log ( 'onOPosition', v )
    }

    onWorldPosition ( v: Vector3 ) {

        this.worldPosition.copy ( v )
        this.worldToMathWay ( v )
        //console.log ( 'onWorldPosition', this.worldPosition )
    }

    mathWayToWorldTo ( mathWayPosition: Vector2, z: number ) {

        if ( !this.optionsX ) return
        if ( !this.optionsY ) return

        let worldX = 0
        let worldY = 0

        if ( this.xDirection == Direction.LEFT_RIGHT ) {

            const center = (this.exp.add.axis.origin == Origin.CENTER)
            let oX = this.oPosition.x
            if ( center ) oX -= this.size/2
                    
            const xRange = Math.abs ( this.optionsX.to - this.optionsX.from )             
            const percent = (mathWayPosition.x - this.optionsX.from) /xRange
            worldX = oX + percent * this.size

        } else {

            const xRange = Math.abs ( this.optionsX.to - this.optionsX.from )             
            const percent = (mathWayPosition.x - this.optionsX.from) /xRange
            worldX =  this.oPosition.x - percent * this.size
        }

        if ( this.yDirection == Direction.TOP_BOTTOM ) {

            const center = (this.exp.add.axis.origin == Origin.CENTER)
            let oY = this.oPosition.y
            if ( center ) oY -= this.size/2
                    
            const yRange = Math.abs ( this.optionsY.to - this.optionsY.from )             
            const percent = (mathWayPosition.y - this.optionsY.from) /yRange
            worldY = oY - percent * this.size

        } else {

            const center = (this.exp.add.axis.origin == Origin.CENTER)
            let oY = this.oPosition.y
            if ( center ) oY -= this.size/2
                    
            const yRange = Math.abs ( this.optionsY.to - this.optionsY.from )             
            const percent = (mathWayPosition.y - this.optionsY.from) /yRange
            worldY = oY + percent * this.size
        }

        const result = new Vector3 ()
        result.x = worldX
        result.y = worldY
        result.z = z

        //console.log ( 'worldX = ', worldX, 'worldY = ', worldY )
        return result
    }

    worldToMathWay ( worldPosition: Vector3 ) {

        if ( !this.optionsX ) return
        if ( !this.optionsY ) return

        let mathWayX = 0
        let mathWayY = 0
        if ( this.xDirection == Direction.LEFT_RIGHT ) {

            const center = this.exp.add.axis.origin == Origin.CENTER
            let oX = this.oPosition.x
            if ( center ) oX -= this.size/2
            
            const xRange = Math.abs ( this.optionsX.to - this.optionsX.from ) 
            const worldXSize = worldPosition.x - oX
            const percent = worldXSize/this.size
            mathWayX = xRange * percent + this.optionsX.from
            //console.log ( mathWayX )
            
        } else {

            const xRange = Math.abs ( this.optionsX.to - this.optionsX.from ) 
            const worldXSize = this.oPosition.x - worldPosition.x
            const percent = worldXSize/this.size
            mathWayX = xRange * percent + this.optionsX.from
            //console.log ( mathWayX )
        }
        if ( this.yDirection == Direction.TOP_BOTTOM ) {

            const yRange = Math.abs ( this.optionsY.to - this.optionsY.from ) 
            const worldYSize = worldPosition.y - this.oPosition.y
            const percent = worldYSize/this.size
            mathWayY = this.optionsY.from - yRange * percent
            //console.log ( mathWayY )
            
        } else {

            let oY = this.oPosition.y
            if ( this.exp.add.axis.origin == Origin.CENTER ) {
                oY -= this.size/2
            }
            const yRange = Math.abs ( this.optionsY.to - this.optionsY.from ) 
            const worldYSize = worldPosition.y - oY
            const percent = worldYSize/this.size
            mathWayY = this.optionsY.from + yRange * percent
            //console.log ( mathWayY )
        }
        //console.log ( Math.round ( mathWayX * 100 )/100, Math.round ( mathWayY * 100 )/100 )
        
        return new Vector2 ( mathWayX, mathWayY )
    }

    onScreenPosition ( x: number, y: number, ) {

        this.screenPosition.x = x
        this.screenPosition.y = y
        //console.log ( 'onScreenPosition', x, y )
    }
}

export default Coordinate