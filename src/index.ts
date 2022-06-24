import { createExplainer, Explainer }   from "./explainerApi/explainer"
import type { Vector3 }                 from 'three';
import type AnimateCameraPosition       from './explainerApi/animate/animateCameraPosition';
import type AnimateCameraPos            from "./explainerApi/animate/animateCameraPosition"
import type AnimateCameraTarget         from './explainerApi/animate/animateCameraTarget';
import type AnimateCameraTar            from "./explainerApi/animate/animateCameraTarget"
import type Animate                     from "./explainerApi/animate/animate";

export const sum = (a: number, b: number):number|string => {

	if ('development' === process.env.NODE_ENV) {

		console.log('boop');
	}
	return a + b;
};

if ('development' === process.env.NODE_ENV) {

    console.log(' mode');
} else {

    console.log('production mode');
}

export const hi = ( name: string ): string => {

	return `Hi ${name}`
};

export const useExplainer = createExplainer as ( divID: string) => Explainer

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

export type AnimeNull = Animate | AnimateCameraPos | AnimateCameraTar | null
export type Anime = Animate | AnimateCameraPos | AnimateCameraTar
export type Target = Vector3 | { x: number, y: number, z: number,  }

export interface NearestCameraEvents {

    distance:   number
    isStart:    boolean
    animation: AnimateCameraPosition
}

export interface NearestTargetEvents {

    distance:   number
    isStart:    boolean
    animation: AnimateCameraTarget
}

export interface Nearest3DObjectEvents {

    distance:   number
    isStart:    boolean
    animation: Animate
}