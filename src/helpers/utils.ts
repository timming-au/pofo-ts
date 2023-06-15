import { ColorRepresentation } from "three";
import {useEffect, useState} from "react"

export const randHSL: {

  /**
   * Returns a random color
   * @returns {import("three").ColorRepresentation}
   */
  default: () => ColorRepresentation;
  
  /**
   * Returns a pastel color
   * @returns {import("three").ColorRepresentation}
   */
  pastel: () => ColorRepresentation;

  /**
   * Returns a monochrome color
   * @returns {import("three").ColorRepresentation}
   */
  noColor: () => ColorRepresentation;
} = {
  default: function(){
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
  },

  pastel: function(){
    return `hsl(${Math.floor(Math.random() * 360)}, ${Math.random() * 10 + 80}%, 75%)`
  },

  noColor: function(){
    return `hsl(100, 0%, ${Math.random() * 40 + 30}%)`
  }
}

export const maths:{
  /**
   * Gets a number between `min` and `max`
   * @param {number} min 
   * @param {number} max 
   * @returns {number}
   */
  between: (min:number, max:number) => number,

  /**
   * Generates at least one of x or y is set to either 0 or 100, while the other number is randomly generated between 0 and 100.
   * @returns {[number,number]} 
   */
  numberPairWithBoundary: (min:number,max:number) => [x:number,y:number],

  ease:{
    /**
     * InOutQuart easing function
     * @param {number} x 
     * @returns {number}
     */
    inOutQuart: (x:number) => number,

    /**
     * InQuad easing function
     * @param {number} x 
     * @returns {number}
     */
    inQuad: (x:number) => number,
  }

} = {
  between: function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  numberPairWithBoundary: function(min,max){
    const rand = Math.random();
    let x:number, y:number;

    if (rand < 0.5) {
      if (rand < 0.25) {
        x = min;
      } else {
        x = max;
      }
      y = this.between(0, 100);
    } else {
      x = this.between(0, 100);
      if (rand < 0.75) {
        y = min;
      } else {
        y = max;
      }
    }

    return [x,y];
  },
  ease:{
    inOutQuart: function(x) {
      return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    },

    inQuad: function(x) {
      return x * x;
    },
  }
}

/**
 * Sleeps for `ms` milliseconds
 * @param ms Time to sleep
 */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Hook to check if the component has mounted
 * @returns {boolean} State of whether the component has mounted
 */
export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

/**
 * Hook for window event listeners
 * @param event Event to listen for
 * @param handler Function to run when event is triggered
 * @param passive Whether the event is passive
 */
export default function useEvent(event, handler, passive = false) {
  useEffect(() => {
    // initiate the event handler
    window.addEventListener(event, handler, passive);

    // this will clean up the event every time the component is re-rendered
    return () => window.removeEventListener(event, handler);
  });
}



