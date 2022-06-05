import { createExplainer, Explainer } from "./explainerApi/explainer"

export const sum = (a: number, b: number):number|string => {

	if ('development' === process.env.NODE_ENV) {

		console.log('boop');
	}
	return a + b;
};

export const hi = ( name: string ): string => {  
  
	return `Hi ${name}`
};

export const useExplainer = createExplainer as ( divID: string) => Explainer
