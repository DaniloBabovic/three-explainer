import type Animate from "./animate/animate"

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
    color:          string
    thickness:      number
    period:         number
    periodSize:     number
    fontSize:       number
}

export const defaultOptions = {

    from:       -10,
    to:         90,
    color:      '#FFFFFF',
    thickness:  3,
    period:     10,
    periodSize: 5,
    fontSize:   4
}

export interface TimeNode  {

    animation:  Animate |null
    parent:     Animate |null
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