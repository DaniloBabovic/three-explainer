import Plane                                    from "./plane/plane"
import type { Vector2, Vector3 }                from "three"
import type { MeshStandardMaterialParameters }  from "three"
import type { Explainer }                       from "../explainer"
import { Axis }                                 from "./axis/axis"
import Cube                                     from "./cube/cube"
import Curve                                    from "./curve/curve"
import Line                                     from "./line/line"
import Sphere                                   from "./sphere/sphere"
import Text                                     from "./text/text"
import HTML3D                                   from "./html/html3d"

export class Add {

    public axis:    Axis
    public cubes:   Cube[]      = []
    public planes:  Plane[]     = []
    public spheres: Sphere[]    = []
    public text3Ds: Text[]      = []
    public curves:  Curve[]     = []
    public lines:   Line[]      = []
    public html3ds:  HTML3D[]   = []

    constructor ( protected exp: Explainer ) {

        this.axis = new Axis ( this.exp )
    }

    cube (
        size: number,
        color: number,
        emissive: number,
        position: [ number, number, number ]
    ) {

        const cube = new Cube ( this.exp, size, color, emissive, position )
        this.cubes.push ( cube )
        return cube
    }

    plane (
        size: number,
        color: number,
        emissive: number,
        position: [ number, number, number ]
    ) {

        const plane = new Plane ( this.exp, size, color, emissive, position )
        this.planes.push ( plane )
        return plane
    }

    sphere (
        size: number,
        color: number,
        emissive: number,
        position: [ number, number, number ]
    ) {

        const sphere = new Sphere ( this.exp, size, color, emissive, position )
        this.spheres.push ( sphere )
        return sphere
    }

    text (
        text:       string,
        size:       number,
        color:      number,
        emissive:   number,
        position:   [ number, number, number ]
    ) {

        const text3D = new Text ( this.exp, text, size, color, emissive, position )
        this.text3Ds.push ( text3D )
        return text3D
    }

    curve (
        vectorType: string,
        points:     number [][] | Vector2[] | Vector3[],
        size:       number,
        color:      number,
        emissive:   number
    ) {

        let pts = points as [number, number, number][]
        if ( vectorType === 'V2' ) {

            pts = []
            for (let i = 0; i < points.length; i++) {

                const point = points [ i ] as Vector2
                pts.push ( [point.x, point.y, 0 ] )
            }
        }
        if ( vectorType === 'V3' ) {

            pts = []
            for (let i = 0; i < points.length; i++) {

                const point = points [ i ] as Vector3
                pts.push ( [point.x, point.y, point.z ] )
            }
        }

        const curve = new Curve ( this.exp, pts, size, color, emissive )
        this.curves.push ( curve )
        return curve
    }

    line (
        vectorType: string,
        points:     number [][] | Vector2[] | Vector3[],
        size:       number,
        color:      number,
        emissive:   number
    ) {

        let pts = points as [number, number, number][]
        if ( vectorType === 'V2' ) {

            pts = []
            for (let i = 0; i < points.length; i++) {

                const point = points [ i ] as Vector2
                pts.push ( [point.x, point.y, 0 ] )
            }
        }
        if ( vectorType === 'V3' ) {

            pts = []
            for (let i = 0; i < points.length; i++) {

                const point = points [ i ] as Vector3
                pts.push ( [point.x, point.y, point.z ] )
            }
        }

        const line = new Line ( this.exp, pts, size, color, emissive )
        this.lines.push ( line )
        return line
    }

    html3d ( 
        paramMaterial:   MeshStandardMaterialParameters,
        html:            string,
        css:             CSSStyleDeclaration,
        position:        [ number, number, number ]
    ) {

        const html3d = new HTML3D ( 

            this.exp,
            paramMaterial,
            html,
            css,
            position
        )
        this.html3ds.push ( html3d )
        return html3d
    }

    insert ( ) {

        for (let i = 0; i < this.cubes.length; i++) {

            const cube = this.cubes [ i ]
            cube.create ()
            cube.insert ( )
        }

        for (let i = 0; i < this.planes.length; i++) {

            const plane = this.planes [ i ]
            plane.create ()
            plane.insert ( )
        }

        for (let i = 0; i < this.spheres.length; i++) {

            const sphere = this.spheres [ i ]
            sphere.create ()
            sphere.insert ( )
        }

        for (let i = 0; i < this.text3Ds.length; i++) {

            const text3D = this.text3Ds [ i ]
            text3D.create ()
            text3D.insert ( )
        }

        for (let i = 0; i < this.curves.length; i++) {

            const curve = this.curves [ i ]
            curve.create ()
            curve.insert ( )
        }

        for (let i = 0; i < this.lines.length; i++) {

            const line = this.lines [ i ]
            line.create ()
            line.insert ( )
        }

        for (let i = 0; i < this.html3ds.length; i++) {

            const html3d = this.html3ds [ i ]
            html3d.create ()
            html3d.insert ( )
        }
    }

    free ( ) {

        this.axis.free ( )
    }
}