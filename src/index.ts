import { createExplainer } from "./explainerApi/explainer"

export const sum = (a: number, b: number) => {

	if ('development' === process.env.NODE_ENV) {

		console.log('boop');
	}
	return a + b;
};

export const hi = ( name: string ) => {  
  
	return `Hi ${name}`
};

export const useExplainer = createExplainer
