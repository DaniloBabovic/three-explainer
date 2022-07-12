const DEG2RAD = Math.PI / 180
const RAD2DEG = 180 / Math.PI

export const degToRad = ( degrees: number ) => {

	return degrees * DEG2RAD
}

export const radToDeg = ( radians: number ) => {

	return radians * RAD2DEG
}