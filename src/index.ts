import type { CSS3DObject }             from 'three/examples/jsm/renderers/CSS3DRenderer'
import type { Object3D }                from 'three'
import type { Mesh }                    from 'three'
import type { Scene }                   from 'three'
import { Color }                        from 'three'
import { NoBlending }                   from 'three'
import { DoubleSide }                   from 'three'

import type { Stage }                   from './explainerApi/scene/stage'
import { createExplainer, Explainer }   from "./explainerApi/explainer"
import type { Vector3 }                 from 'three'
import type AnimateCameraPosition       from './explainerApi/animate/animateCameraPosition'
import type AnimateCameraPos            from "./explainerApi/animate/animateCameraPosition"
import type AnimateCameraTarget         from './explainerApi/animate/animateCameraTarget'
import type AnimateCameraTar            from "./explainerApi/animate/animateCameraTarget"
import type Animate                     from "./explainerApi/animate/animate"
import type AnimateRotation             from "./explainerApi/animate/animateRotation"
import type MeshLike                    from './explainerApi/add/html/mesh_like'

export const sum = (a: number, b: number):number|string => {

	if ('development' === process.env.NODE_ENV) {

		console.log('boop')
	}
	return a + b
}

if ('development' === process.env.NODE_ENV) {

    console.log(' mode')
} else {

    console.log('production mode')
}

export const hi = ( name: string ): string => {

	return `Hi ${name}`
}

export const useExplainer = createExplainer as ( stage: Stage, divID: string, showPlayer: boolean ) => Explainer

export enum Origin {

    CENTER,
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
}

export enum AxisName { X, Y, Z }

export enum Direction {
    LEFT_RIGHT,
    RIGHT_LEFT,
    TOP_BOTTOM,
    BOTTOM_TOP,
    BACKWARD_FORWARD,
    FORWARD_BACKWARD
}

export interface AxisOptions {

    from:           number
    to:             number
    period:         number
    thickness:      number
    periodSize:     number

    visible:        boolean
    color:          string
    emissive:       string
    fontSize:       number
}

export const defaultOptions = {

    from:       -5, 
    to:         5,    
    period:     1,      
    thickness:  2,   
    periodSize: 4,

    visible:    true,
    color:      '#AAAAAA',
    emissive:   '#FFFFFF',   
    fontSize:   3
}

export interface TimeNode  {

    animation:  AnimeNull
    parent:     AnimeNull
    id:         number
    start:      number
    end:        number
    children:   TimeNode[]
}

export interface StartTimeModel  {

    from: number
    infos: {
        id: number
        to: number
        name: string
    }[]
}

export type AnimeNull = Animate | AnimateCameraPos | AnimateCameraTar | AnimateRotation | null
export type Anime = Animate | AnimateCameraPos | AnimateCameraTar | AnimateRotation
export type Target = Vector3 | { x: number, y: number, z: number,  }

export interface NearestCameraEvents {

    distance:   number
    isStart:    boolean
    animation:  AnimateCameraPosition
}

export interface NearestTargetEvents {

    distance:   number
    isStart:    boolean
    animation:  AnimateCameraTarget
}

export interface Nearest3DObjectEvents {

    distance:   number
    isStart:    boolean
    animation:  Animate
}

export interface NearestRotationEvents {

    distance:   number
    isStart:    boolean
    animation:  AnimateRotation
}


export const defaultCss = {

    position:   'absolute',
    color:      "#FFFFFF",
    background: 'blue',
    padding:    '0px',
    margin:     '0px',
    fontSize:   '128px',
    lineHeight: '128px',
    overflow: 'hidden'
}

export const standardMaterial = {

    transparent: true,
    opacity:    0,
    color:      new Color ( '#000000' ),
    emissive:   new Color('#000000'),
    metalness:  0.5,
    roughness:  0.5,
    blending:   NoBlending,
    side:       DoubleSide,
}

export type ParentGL = Mesh | Scene | Object3D | null
export type ParentCSS = CSS3DObject | Scene | Object3D | null

export type D3 = Mesh | Object3D | MeshLike