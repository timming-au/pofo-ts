import { ColorRepresentation } from "three";
import {useEffect, useState} from "react"


export const colors:{
  randHSL: {
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
  },
  /**
   * Saturates a color by a given amount.
   * @param r Red value (0-1)
   * @param g Green value (0-1)
   * @param b Blue value (0-1)
   * @param amount Amount to saturate (0-1 saturation, HSL)
   * @returns [r,g,b]
   */
  vibrantise:(r:number, g:number, b:number, amount:number) => [r:number,g:number,b:number],

  /**
   * Converts RGB to HSV.
   * @param r Red value (0-1)
   * @param g Green value (0-1)
   * @param b Blue value (0-1)
   * @returns [h,s,v]
   */
  rgbToHsv:(r:number, g:number, b:number) => [h:number,s:number,v:number],

  /**
   * Converts HSV to RGB.
   * @param h Hue (0-1)
   * @param s Saturation (0-1)
   * @param v Value (0-255)
   * @returns [r,g,b]
   */
  hsvToRgb:(h:number, s:number, v:number) => [r:number,g:number,b:number]

  /**
   * Boosts a color.
   * @param r Red value (0-255)
   * @param g Green value (0-255)
   * @param b Blue value (0-255)
   * @param amount Amount to boost (0-255)
   * @param threshold Difference needed to boost the smaller between two colors (0-255), defaults to 0
   * @returns [r,g,b]
   */
  boostRGB:(r:number, g:number, b:number, amount:number, threshold?:number) => [r:number,g:number,b:number],

}={
  randHSL: {
    default: function(){
      return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`
    },

    pastel: function(){
      return `hsl(${Math.floor(Math.random() * 360)}, ${Math.random() * 10 + 80}%, 75%)`
    },

    noColor: function(){
      return `hsl(100, 0%, ${Math.random() * 40 + 30}%)`
    }
  },

  vibrantise:function(r, g, b, amount) {
    // Convert RGB to HSL
    const [h, s, l] = this.rgbToHsv(r, g, b);

    // Modify saturation
    const saturatedS = Math.min(1, Math.max(0, s + amount));

    // Convert HSL back to RGB
    const [red, green, blue] = this.hsvToRgb(h, saturatedS, l);

    return [red, green, blue];
  },

  rgbToHsv:function(r, g, b) {
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
  },

  hsvToRgb:function(h, s, v) {
    let r, g, b;

    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r, g, b];
  },

  boostRGB:function(r, g, b, amount, threshold = 0) {
    const diff1 = Math.abs(r - g);
    const diff2 = Math.abs(r - b);
    const diff3 = Math.abs(g - b);

    if (diff1 <= threshold && diff2 <= threshold && diff3 <= threshold) {
      // All three colors are within the threshold, no boosting
      return [r, g, b];
    }

    const max = Math.max(r, g, b);

    if (r === max || (diff1 <= threshold && diff2 > threshold && diff3 > threshold)) {
      r = Math.min(255, r + amount);
    }
    if (g === max || (diff1 > threshold && diff2 <= threshold && diff3 > threshold)) {
      g = Math.min(255, g + amount);
    }
    if (b === max || (diff1 > threshold && diff2 > threshold && diff3 <= threshold)) {
      b = Math.min(255, b + amount);
    }

    return [r, g, b];
  },
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
  },

  map:(x:number, imin:number, imax:number, omin:number, omax:number) => number,

  max: (arr:number[] | Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array, range?:[start:number, end:number]) => number,

  avg: (arr:number[] | Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array, range?:[start:number, end:number]) => number, 

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
  },
  map: function(x:number, imin:number, imax:number, omin:number, omax:number): number {
    // First, normalize the input value to a range of 0 to 1
    const normalizedX = (x - imin) / (imax - imin);

    // Map the normalized value to the output range
    const mappedValue = normalizedX * (omax - omin) + omin;

    return mappedValue;
  },

  max: function(arr: number[] | Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array, range:[start:number, end:number] = [0,arr.length]): number {
    if(arr.length <= 1 || range[0] - range[1] == 0) return arr[range[0]]

    let max = arr[range[0]]
    let i = range[0]+1
    while (i < range[1]) {
      if (arr[i] > max) {
        max = arr[i];
      }
      i++;
    }
    return max;
  },

  avg: function (arr: number[] | Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array, range:[start:number, end:number] = [0,arr.length]): number {
    if(arr.length <= 1 || range[0] - range[1] == 0) return arr[range[0]]
    
    let sum = 0;
    let i = range[0]
    while (i < range[1]) {
      sum += arr[i];
      i++;
    }
    return sum / (range[1] - range[0]);
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



class Grad {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    dot2(x: number, y: number): number {
        return this.x * x + this.y * y;
    }

    dot3(x: number, y: number, z: number): number {
        return this.x * x + this.y * y + this.z * z;
    }
}

/**
 * Perlin noise generator from https://github.com/alanko0511/noisejs-typescript.
 */
export class Perlin {
    permutationTable = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37,
        240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
        33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146,
        158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
        63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100,
        109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
        59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153,
        101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246,
        97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192,
        214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114,
        67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];

    grad3 = [
        new Grad(1, 1, 0),
        new Grad(-1, 1, 0),
        new Grad(1, -1, 0),
        new Grad(-1, -1, 0),
        new Grad(1, 0, 1),
        new Grad(-1, 0, 1),
        new Grad(1, 0, -1),
        new Grad(-1, 0, -1),
        new Grad(0, 1, 1),
        new Grad(0, -1, 1),
        new Grad(0, 1, -1),
        new Grad(0, -1, -1),
    ];

    perm = new Array(512);
    gradP = new Array(512);

    F2 = 0.5 * (Math.sqrt(3) - 1);
    G2 = (3 - Math.sqrt(3)) / 6;

    F3 = 1 / 3;
    G3 = 1 / 6;

    constructor(seed = 0) {
        if (seed > 0 && seed < 1) {
            // Scale the seed out
            seed *= 65536;
        }

        seed = Math.floor(seed);
        if (seed < 256) {
            seed |= seed << 8;
        }

        for (let i = 0; i < 256; i++) {
            let v: number;
            if (i & 1) {
                v = this.permutationTable[i] ^ (seed & 255);
            } else {
                v = this.permutationTable[i] ^ ((seed >> 8) & 255);
            }

            this.perm[i] = this.perm[i + 256] = v;
            this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12];
        }
    }

    simplex2(xin: number, yin: number): number {
        let n0: number, n1: number, n2: number; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        let s = (xin + yin) * this.F2; // Hairy factor for 2D
        let i = Math.floor(xin + s);
        let j = Math.floor(yin + s);
        let t = (i + j) * this.G2;
        let x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
        let y0 = yin - j + t;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        let i1: number, j1: number; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
            // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            i1 = 1;
            j1 = 0;
        } else {
            // upper triangle, YX order: (0,0)->(0,1)->(1,1)
            i1 = 0;
            j1 = 1;
        }
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        let x1 = x0 - i1 + this.G2; // Offsets for middle corner in (x,y) unskewed coords
        let y1 = y0 - j1 + this.G2;
        let x2 = x0 - 1 + 2 * this.G2; // Offsets for last corner in (x,y) unskewed coords
        let y2 = y0 - 1 + 2 * this.G2;
        // Work out the hashed gradient indices of the three simplex corners
        i &= 255;
        j &= 255;
        let gi0 = this.gradP[i + this.perm[j]];
        let gi1 = this.gradP[i + i1 + this.perm[j + j1]];
        let gi2 = this.gradP[i + 1 + this.perm[j + 1]];
        // Calculate the contribution from the three corners
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) {
            n0 = 0;
        } else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) {
            n1 = 0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot2(x1, y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot2(x2, y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70 * (n0 + n1 + n2);
    }

    simplex3(xin: number, yin: number, zin: number): number {
        let n0: number, n1: number, n2: number, n3: number; // Noise contributions from the four corners

        // Skew the input space to determine which simplex cell we're in
        let s = (xin + yin + zin) * this.F3; // Hairy factor for 2D
        let i = Math.floor(xin + s);
        let j = Math.floor(yin + s);
        let k = Math.floor(zin + s);

        let t = (i + j + k) * this.G3;
        let x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
        let y0 = yin - j + t;
        let z0 = zin - k + t;

        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        let i1: number, j1: number, k1: number; // Offsets for second corner of simplex in (i,j,k) coords
        let i2: number, j2: number, k2: number; // Offsets for third corner of simplex in (i,j,k) coords
        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            } else if (x0 >= z0) {
                i1 = 1;
                j1 = 0;
                k1 = 0;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 1;
                j2 = 0;
                k2 = 1;
            }
        } else {
            if (y0 < z0) {
                i1 = 0;
                j1 = 0;
                k1 = 1;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else if (x0 < z0) {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 0;
                j2 = 1;
                k2 = 1;
            } else {
                i1 = 0;
                j1 = 1;
                k1 = 0;
                i2 = 1;
                j2 = 1;
                k2 = 0;
            }
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        let x1 = x0 - i1 + this.G3; // Offsets for second corner
        let y1 = y0 - j1 + this.G3;
        let z1 = z0 - k1 + this.G3;

        let x2 = x0 - i2 + 2 * this.G3; // Offsets for third corner
        let y2 = y0 - j2 + 2 * this.G3;
        let z2 = z0 - k2 + 2 * this.G3;

        let x3 = x0 - 1 + 3 * this.G3; // Offsets for fourth corner
        let y3 = y0 - 1 + 3 * this.G3;
        let z3 = z0 - 1 + 3 * this.G3;

        // Work out the hashed gradient indices of the four simplex corners
        i &= 255;
        j &= 255;
        k &= 255;
        let gi0 = this.gradP[i + this.perm[j + this.perm[k]]];
        let gi1 = this.gradP[i + i1 + this.perm[j + j1 + this.perm[k + k1]]];
        let gi2 = this.gradP[i + i2 + this.perm[j + j2 + this.perm[k + k2]]];
        let gi3 = this.gradP[i + 1 + this.perm[j + 1 + this.perm[k + 1]]];

        // Calculate the contribution from the four corners
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) {
            n0 = 0;
        } else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
        }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) {
            n1 = 0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
        }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
        }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) {
            n3 = 0;
        } else {
            t3 *= t3;
            n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 32 * (n0 + n1 + n2 + n3);
    }

    // ##### Perlin noise stuff

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(a: number, b: number, t: number): number {
        return (1 - t) * a + t * b;
    }

    perlin2(x: number, y: number): number {
        let X = Math.floor(x),
            Y = Math.floor(y);
        // Get relative xy coordinates of point within that cell
        x = x - X;
        y = y - Y;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255;
        Y = Y & 255;

        // Calculate noise contributions from each of the four corners
        let n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
        let n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
        let n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
        let n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);

        // Compute the fade curve value for x
        let u = this.fade(x);

        // Interpolate the four results
        return this.lerp(this.lerp(n00, n10, u), this.lerp(n01, n11, u), this.fade(y));
    }

    perlin3(x: number, y: number, z: number): number {
        // Find unit grid cell containing point
        let X = Math.floor(x),
            Y = Math.floor(y),
            Z = Math.floor(z);
        // Get relative xyz coordinates of point within that cell
        x = x - X;
        y = y - Y;
        z = z - Z;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255;
        Y = Y & 255;
        Z = Z & 255;

        // Calculate noise contributions from each of the eight corners
        let n000 = this.gradP[X + this.perm[Y + this.perm[Z]]].dot3(x, y, z);
        let n001 = this.gradP[X + this.perm[Y + this.perm[Z + 1]]].dot3(x, y, z - 1);
        let n010 = this.gradP[X + this.perm[Y + 1 + this.perm[Z]]].dot3(x, y - 1, z);
        let n011 = this.gradP[X + this.perm[Y + 1 + this.perm[Z + 1]]].dot3(x, y - 1, z - 1);
        let n100 = this.gradP[X + 1 + this.perm[Y + this.perm[Z]]].dot3(x - 1, y, z);
        let n101 = this.gradP[X + 1 + this.perm[Y + this.perm[Z + 1]]].dot3(x - 1, y, z - 1);
        let n110 = this.gradP[X + 1 + this.perm[Y + 1 + this.perm[Z]]].dot3(x - 1, y - 1, z);
        let n111 = this.gradP[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]].dot3(x - 1, y - 1, z - 1);

        // Compute the fade curve value for x, y, z
        let u = this.fade(x);
        let v = this.fade(y);
        let w = this.fade(z);

        // Interpolate
        return this.lerp(
            this.lerp(this.lerp(n000, n100, u), this.lerp(n001, n101, u), w),
            this.lerp(this.lerp(n010, n110, u), this.lerp(n011, n111, u), w),
            v
        );
    }
}



