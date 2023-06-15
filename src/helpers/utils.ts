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

  ease:{
    inOutQuart: function(x) {
      return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    },

    inQuad: function(x) {
      return x * x;
    },
  }
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));


const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

export default useHasMounted