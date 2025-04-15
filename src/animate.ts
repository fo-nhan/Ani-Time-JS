// Type definitions
interface AnimationConfig {
  targets: string | HTMLElement | HTMLElement[] | Record<string, any> | NodeList;
  props: Record<string, number | string | Record<string, any>>; // Support for keyframes
  duration: number;
  delay?: number | ((el: any, i: number, total: number) => number); // Support functional delays
  endDelay?: number;
  easing?: ((t: number) => number) | keyof typeof easingFunctions;
  round?: number | boolean;
  loop?: number | boolean;
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  update?: (currentState: any, progress: { completed: number, remaining: number }) => void;
  begin?: () => void;
  complete?: () => void;
  autoplay?: boolean;
}

interface TimelineConfig {
  autoplay?: boolean;
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse";
  loop?: number | boolean;
  update?: (progress: { completed: number, remaining: number }) => void;
  complete?: () => void;
}

interface Animation {
  play: () => Animation;
  pause: () => Animation;
  restart: () => Animation;
  seek: (progress: number) => Animation;
  reverse: () => Animation;
  completed: Promise<void>;
  progress: number;
  cancel: () => void;
}

interface Timeline {
  add: (animationConfig: AnimationConfig, timePosition?: string | number) => Timeline;
  play: () => Timeline;
  pause: () => Timeline;
  restart: () => Timeline;
  seek: (progress: number) => Timeline;
  reverse: () => Timeline;
  cancel: () => void;
  completed: Promise<void>;
}

// Enhanced easing functions
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) => 
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) => 
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 10 * (2 * t - 1)) / 2;
    return (2 - Math.pow(2, -10 * (2 * t - 1))) / 2;
  },
  easeOutBounce: (t: number) => {
    const n1 = 7.5625,
      d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  easeInBounce: (t: number) => 1 - easingFunctions.easeOutBounce(1 - t),
  easeInOutBounce: (t: number) => 
    t < 0.5
      ? easingFunctions.easeInBounce(t * 2) * 0.5
      : easingFunctions.easeOutBounce(t * 2 - 1) * 0.5 + 0.5,
  easeInElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
  },
  easeOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return 1 + Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI);
  },
  easeInOutElastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    if (t < 0.5) {
      return -0.5 * Math.pow(2, 10 * (2 * t - 1)) * Math.sin((2 * t - 1.1) * 5 * Math.PI);
    }
    return 0.5 * Math.pow(2, -10 * (2 * t - 1)) * Math.sin((2 * t - 1.1) * 5 * Math.PI) + 1;
  },
  spring: (t: number) => {
    const s = 1.70158;
    const s2 = 2.5949095;
    return t < 0.5
      ? 0.5 * (2 * t) * (2 * t) * ((s2 + 1) * 2 * t - s2)
      : 0.5 * (2 * t - 2) * (2 * t - 2) * ((s2 + 1) * (2 * t - 2) + s2) + 1;
  }
};

// Transform helpers
const transformFunctions = [
  'translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY',
  'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY'
];

// Color helpers
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToArray = (rgb: string) => {
  const result = rgb.match(/\d+/g);
  return result ? result.map(Number) : [0, 0, 0];
};

const interpolateColor = (color1: string, color2: string, progress: number) => {
  let rgb1: number[] = [], rgb2: number[] = [];
  
  if (color1.startsWith('#')) {
    const parsed = hexToRgb(color1);
    if (parsed) rgb1 = [parsed.r, parsed.g, parsed.b];
  } else if (color1.startsWith('rgb')) {
    rgb1 = rgbToArray(color1);
  }
  
  if (color2.startsWith('#')) {
    const parsed = hexToRgb(color2);
    if (parsed) rgb2 = [parsed.r, parsed.g, parsed.b];
  } else if (color2.startsWith('rgb')) {
    rgb2 = rgbToArray(color2);
  }
  
  if (rgb1.length === 3 && rgb2.length === 3) {
    const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * progress);
    const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * progress);
    const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * progress);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  return color2;
};

// Enhanced CSS value parser
const parseCSSValue = (value: string) => {
  const match = value.match(/^(-?\d*\.?\d+)(.*)$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2] || ''
    };
  }
  return { value: 0, unit: '' };
};

// Parse transform
const parseTransform = (transformString: string) => {
  const transforms: Record<string, { values: number[], units: string[] }> = {};
  const regex = /(\w+)\(([^)]*)\)/g;
  let matches;
  
  while ((matches = regex.exec(transformString)) !== null) {
    const name = matches[1];
    const args = matches[2].split(/,\s*/);
    
    transforms[name] = { values: [], units: [] };
    
    args.forEach(arg => {
      const { value, unit } = parseCSSValue(arg.trim());
      transforms[name].values.push(value);
      transforms[name].units.push(unit);
    });
  }
  
  return transforms;
};

// Interpolate transforms
const interpolateTransform = (start: string, end: string, progress: number) => {
  const startTransforms = parseTransform(start);
  const endTransforms = parseTransform(end);
  
  const allTransformTypes = new Set([
    ...Object.keys(startTransforms),
    ...Object.keys(endTransforms)
  ]);
  
  const result = [];
  
  for (const type of allTransformTypes) {
    const isStartDefined = type in startTransforms;
    const isEndDefined = type in endTransforms;
    
    if (!isEndDefined) continue;
    
    const endData = endTransforms[type];
    let startData = isStartDefined 
      ? startTransforms[type] 
      : { 
        values: Array(endData.values.length).fill(type.startsWith('scale') ? 1 : 0),
        units: [...endData.units]
      };
    
    const values = endData.values.map((endVal, i) => {
      const startVal = i < startData.values.length ? startData.values[i] : (type.startsWith('scale') ? 1 : 0);
      let interpolated = startVal + (endVal - startVal) * progress;
      return `${interpolated}${endData.units[i]}`;
    });
    
    result.push(`${type}(${values.join(', ')})`);
  }
  
  return result.join(' ');
};

// Process keyframes for a property
const processKeyframes = (
  propName: string, 
  keyframes: Record<string, any>, 
  initialValue: any,
  duration: number
) => {
  // Convert percentage keys to absolute time
  const timePoints: any[] = Object.entries(keyframes)
    .map(([keyPercent, value]) => {
      const percent = keyPercent === 'from' ? 0 : keyPercent === 'to' ? 100 : parseFloat(keyPercent);
      return [percent / 100 * duration, value];
    })
    .sort((a, b) => a[0] - b[0]);
  
  // Ensure we have a starting point (0%)
  if (timePoints[0][0] > 0) {
    timePoints.unshift([0, initialValue ?? timePoints[0][1]]);
  }
  
  // Return a function that calculates the value at a given time
  return (time: number) => {
    // Find the two keyframe points that surround the current time
    let startIdx = 0;
    for (let i = 0; i < timePoints.length - 1; i++) {
      if (time >= timePoints[i][0] && time <= timePoints[i+1][0]) {
        startIdx = i;
        break;
      }
    }
    
    if (startIdx === timePoints.length - 1 || time >= timePoints[timePoints.length - 1][0]) {
      return timePoints[timePoints.length - 1][1];
    }
    
    const [t0, v0] = timePoints[startIdx];
    const [t1, v1] = timePoints[startIdx + 1];
    
    // Calculate local progress between these two points
    const segmentProgress = (time - t0) / (t1 - t0);
    
    // Special case for colors
    if (typeof v0 === 'string' && (v0.startsWith('#') || v0.startsWith('rgb')) &&
        typeof v1 === 'string' && (v1.startsWith('#') || v1.startsWith('rgb'))) {
      return interpolateColor(v0, v1, segmentProgress);
    }
    
    // Special case for transforms
    if (propName === 'transform' && typeof v0 === 'string' && typeof v1 === 'string') {
      return interpolateTransform(v0, v1, segmentProgress);
    }
    
    // Regular numeric interpolation
    if (typeof v0 === 'number' && typeof v1 === 'number') {
      return v0 + (v1 - v0) * segmentProgress;
    }
    
    // Default to just returning the next value
    return v1;
  };
};

/**
 * Enhanced animate function
 */
export const animate = (config: AnimationConfig): Animation => {
  const {
    targets,
    props,
    duration,
    delay = 0,
    endDelay = 0,
    easing = "easeOutQuad",
    round = false,
    loop = false,
    direction = "normal",
    update,
    begin,
    complete,
    autoplay = true,
  } = config;
  
  const isObjectTarget =
    typeof targets === "object" &&
    !Array.isArray(targets) &&
    !(targets instanceof HTMLElement) &&
    !(targets instanceof NodeList);

  // Normalize targets to array
  const elements = !isObjectTarget
    ? typeof targets === "string"
      ? Array.from(document.querySelectorAll(targets))
      : targets instanceof NodeList
      ? Array.from(targets)
      : Array.isArray(targets)
      ? targets
      : [targets]
    : [];

  // Setup animation properties
  const loopCount = typeof loop === "boolean" ? (loop ? Infinity : 0) : loop;
  let currentLoop = 0;
  let currentDirection = direction;
  let isPaused = !autoplay;
  let startTime: number | null = null;
  let pauseTime: number | null = null;
  let pausedDuration = 0;
  let animationProgress = 0;
  let easingFunc = typeof easing === "function" ? easing : easingFunctions[easing] || easingFunctions.linear;
  
  // Gather initial values
  const initialStates: any[] = isObjectTarget
    ? [{ ...targets }]
    : elements.map((el) => {
        const state: Record<string, any> = {};
        
        Object.keys(props).forEach((key: any) => {
          // Handle special properties
          if (key === "transform") {
            state[key] = window.getComputedStyle(el).transform === "none" 
              ? "" 
              : window.getComputedStyle(el).transform;
          }
          // Handle standard CSS properties
          else if (key in el.style) {
            state[key] = window.getComputedStyle(el)[key];
          }
          // Handle SVG attributes
          else if (el instanceof SVGElement && el.hasAttribute(key)) {
            state[key] = el.getAttribute(key) || "";
          }
          // Handle direct properties
          else if (key in el) {
            state[key] = (el as any)[key];
          }
          // Handle special cases like scroll
          else if (key === "scroll") {
            state[key] = el.scrollTop;
          } else if (key === "scrollX") {
            state[key] = el.scrollLeft;
          }
        });
        
        return state;
      });
  
  // Process keyframes and calculate end values
  interface KeyframeInfo {
    isKeyframes: boolean;
    valueAtTime: (time: number) => any;
    endValue: any;
  }
  
  const processedProps: Record<string, KeyframeInfo> = {};
  
  Object.entries(props).forEach(([propName, propValue]) => {
    const isKeyframeObject = propValue !== null && 
      typeof propValue === "object" && 
      !Array.isArray(propValue) &&
      (
        Object.keys(propValue).some(key => 
          key === "from" || key === "to" || /^\d+%$/.test(key)
        )
      );
    
    if (isKeyframeObject) {
      const initialValue = isObjectTarget 
        ? initialStates[0][propName] 
        : initialStates[0]?.[propName];
        
      const valueAtTime = processKeyframes(
        propName, 
        propValue as Record<string, any>, 
        initialValue,
        duration
      );
      
      processedProps[propName] = {
        isKeyframes: true,
        valueAtTime,
        endValue: propValue.to || propValue["100%"] || Object.values(propValue).pop()
      };
    } else {
      processedProps[propName] = {
        isKeyframes: false,
        valueAtTime: () => propValue,
        endValue: propValue
      };
    }
  });
  
  // Animation control
  let rafId: number | null = null;
  let canceled = false;
  
  // Create a promise that resolves when animation completes
  let resolveAnimation: () => void;
  const animationCompletePromise = new Promise<void>((resolve) => {
    resolveAnimation = resolve;
  });
  
  // Calculate delay for element
  const getDelay = (el: any, index: number, total: number) => {
    if (typeof delay === "function") {
      return delay(el, index, total);
    }
    return delay;
  };
  
  // Apply values to targets based on progress
  const applyValues = (rawProgress: number) => {
    // Get actual progress depending on direction
    let progress = rawProgress;
    
    if (currentDirection === "reverse") {
      progress = 1 - rawProgress;
    } else if (currentDirection === "alternate") {
      progress = currentLoop % 2 === 0 ? rawProgress : 1 - rawProgress;
    } else if (currentDirection === "alternate-reverse") {
      progress = currentLoop % 2 === 0 ? 1 - rawProgress : rawProgress;
    }
    
    // Apply easing
    const easedProgress = easingFunc(Math.min(1, Math.max(0, progress)));
    
    if (isObjectTarget) {
      // Apply to object target
      Object.keys(processedProps).forEach((key) => {
        const prop = processedProps[key];
        let value;
        
        if (prop.isKeyframes) {
          value = prop.valueAtTime(progress * duration);
        } else {
          const initial = initialStates[0][key];
          const target = prop.endValue;
          
          if (typeof initial === 'string' && typeof target === 'string') {
            // Handle colors
            if ((initial.startsWith('#') || initial.startsWith('rgb')) && 
                (target.startsWith('#') || target.startsWith('rgb'))) {
              value = interpolateColor(initial, target, easedProgress);
            } 
            // Handle transforms
            else if (key === 'transform') {
              value = interpolateTransform(initial || '', target, easedProgress);
            }
            // Handle other string values (try to parse numbers)
            else {
              const initialVal = parseCSSValue(initial);
              const targetVal = parseCSSValue(target);
              
              if (!isNaN(initialVal.value) && !isNaN(targetVal.value)) {
                let interpolated = initialVal.value + (targetVal.value - initialVal.value) * easedProgress;
                if (round) {
                  interpolated = typeof round === 'number' 
                    ? parseFloat(interpolated.toFixed(round)) 
                    : Math.round(interpolated);
                }
                value = `${interpolated}${targetVal.unit || initialVal.unit}`;
              } else {
                value = easedProgress >= 0.5 ? target : initial;
              }
            }
          } 
          // Handle numeric values
          else if (typeof initial === 'number' && typeof target === 'number') {
            let interpolated = initial + (target - initial) * easedProgress;
            if (round) {
              interpolated = typeof round === 'number' 
                ? parseFloat(interpolated.toFixed(round)) 
                : Math.round(interpolated);
            }
            value = interpolated;
          } else {
            value = easedProgress >= 0.5 ? target : initial;
          }
        }
        
        (targets as any)[key] = value;
      });

      // Call update callback
      update?.(targets, {
        completed: progress * 100,
        remaining: (1 - progress) * 100
      });
    } else {
      // Apply to DOM elements
      elements.forEach((el, index) => {
        const initialValues = initialStates[index];
        
        Object.keys(processedProps).forEach((key) => {
          const prop = processedProps[key];
          let value;
          
          if (prop.isKeyframes) {
            value = prop.valueAtTime(progress * duration);
          } else {
            const initial = initialValues[key];
            const target = prop.endValue;
            
            // Handle transform property specially
            if (key === "transform") {
              value = interpolateTransform(initial || "", target as string, easedProgress);
            }
            // Handle SVG points attribute
            else if (key === "points" && el instanceof SVGElement) {
              const startPoints = (initial || "").split(" ").map((p: any) => p.split(",").map(parseFloat));
              const endPoints = (target as string).split(" ").map(p => p.split(",").map(parseFloat));
              
              value = startPoints.map((startPoint: any, i:number) => {
                if (!endPoints[i]) return startPoint.join(",");
                return startPoint.map((v: any, j: number) => {
                  if (isNaN(v)) v = 0;
                  const endValue = endPoints[i][j] || 0;
                  return v + (endValue - v) * easedProgress;
                }).join(",");
              }).join(" ");
            }
            // Handle color values
            else if (typeof initial === 'string' && typeof target === 'string' &&
                    ((initial.startsWith('#') || initial.startsWith('rgb')) && 
                     (target.startsWith('#') || target.startsWith('rgb')))) {
              value = interpolateColor(initial, target, easedProgress);
            }
            // Handle scroll properties
            else if (key === "scroll") {
              const start = parseFloat(initial || "0");
              const end = parseFloat(target as string);
              const scrollValue = start + (end - start) * easedProgress;
              el.scrollTop = scrollValue;
              return; // Skip normal assignment below
            } 
            else if (key === "scrollX") {
              const start = parseFloat(initial || "0");
              const end = parseFloat(target as string);
              const scrollValue = start + (end - start) * easedProgress;
              el.scrollLeft = scrollValue;
              return; // Skip normal assignment below
            }
            // Handle standard numeric properties
            else {
              const initialVal = parseCSSValue(initial || "0");
              const targetVal = parseCSSValue(target as string || "0");
              
              let interpolated = initialVal.value + (targetVal.value - initialVal.value) * easedProgress;
              if (round) {
                interpolated = typeof round === 'number' 
                  ? parseFloat(interpolated.toFixed(round)) 
                  : Math.round(interpolated);
              }
              
              value = `${interpolated}${targetVal.unit || initialVal.unit}`;
            }
          }
          
          // Apply the calculated value
          if (key in el.style) {
            el.style[key as any] = value;
          } else if (el instanceof SVGElement && el.hasAttribute(key)) {
            el.setAttribute(key, value);
          } else if (key in el) {
            (el as any)[key] = value;
          }
        });
      });
      
      // Call update callback
      update?.(elements, {
        completed: progress * 100,
        remaining: (1 - progress) * 100
      });
    }
    
    return easedProgress;
  };
  
  // Create animation timeline function
  const runAnimation = () => {
    if (canceled) {
      resolveAnimation();
      return;
    }
    
    if (isPaused) {
      pauseTime = pauseTime || performance.now();
      rafId = requestAnimationFrame(runAnimation);
      return;
    }
    
    const now = performance.now();
    
    // Initialize or resume animation
    if (startTime === null) {
      startTime = now;
      begin?.();
    } else if (pauseTime !== null) {
      // Adjust for pause duration
      pausedDuration += now - pauseTime;
      pauseTime = null;
    }
    
    // Calculate elapsed time considering pauses
    const elapsed = now - startTime - pausedDuration;
    const totalDuration = duration + (typeof delay === "function" ? 0 : delay);
    
    // Calculate raw progress (0-1)
    let progress = Math.min(Math.max(0, (elapsed - (typeof delay === "function" ? getDelay(elements[0], 0, elements.length) : delay)) / duration), 1);
    animationProgress = progress;
    
    // Apply animation values based on progress
    applyValues(progress);
    
    // Continue animation if not complete
    if (progress < 1) {
      rafId = requestAnimationFrame(runAnimation);
    } else {
      // Animation completed
      currentLoop++;
      
      // Check if we need to loop
      if (currentLoop < loopCount || loopCount === Infinity) {
        // Reset for next loop
        startTime = performance.now();
        pausedDuration = 0;
        
        // Toggle direction if needed
        if (direction === "alternate") {
          currentDirection = currentDirection === "normal" ? "reverse" : "normal";
        } else if (direction === "alternate-reverse") {
          currentDirection = currentDirection === "reverse" ? "normal" : "reverse";
        }
        
        rafId = requestAnimationFrame(runAnimation);
      } else {
        // All loops completed
        complete?.();
        resolveAnimation();
      }
    }
  };
  
  // Control methods
  const animation: Animation = {
    play: () => {
      if (canceled) return animation;
      isPaused = false;
      if (rafId === null) {
        rafId = requestAnimationFrame(runAnimation);
      }
      return animation;
    },
    
    pause: () => {
      isPaused = true;
      return animation;
    },
    
    restart: () => {
      if (canceled) return animation;
      startTime = null;
      pauseTime = null;
      pausedDuration = 0;
      currentLoop = 0;
      currentDirection = direction;
      isPaused = false;
      if (rafId === null) {
        rafId = requestAnimationFrame(runAnimation);
      }
      return animation;
    },
    
    seek: (seekProgress: number) => {
      if (canceled) return animation;
      animationProgress = Math.min(1, Math.max(0, seekProgress));
      applyValues(animationProgress);
      return animation;
    },
    
    reverse: () => {
      if (currentDirection === "normal") {
        currentDirection = "reverse";
      } else if (currentDirection === "reverse") {
        currentDirection = "normal";
      } else if (currentDirection === "alternate") {
        currentDirection = "alternate-reverse";
      } else {
        currentDirection = "alternate";
      }
      return animation;
    },
    
    cancel: () => {
      canceled = true;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      resolveAnimation();
    },
    
    completed: animationCompletePromise,
    
    get progress() {
      return animationProgress;
    }
  };
  
  // Start animation if autoplay is true
  if (autoplay && !isPaused) {
    animation.play();
  }
  
  return animation;
};

/**
 * Timeline for sequencing animations
 */
export const timeline = (config: TimelineConfig = {}): Timeline => {
  const {
    autoplay = true,
    direction = "normal",
    loop = false,
    update,
    complete
  } = config;
  
  let animations: Array<{
    config: AnimationConfig;
    position: number;
    animation?: Animation;
  }> = [];
  
  let timelineLength = 0;
  let currentProgress = 0;
  let isPaused = !autoplay;
  let isReversed = direction === "reverse" || direction === "alternate-reverse";
  let currentLoop = 0;
  let loopCount = typeof loop === "boolean" ? (loop ? Infinity : 0) : loop;
  let rafId: number | null = null;
  let canceled = false;
  
  // Promise for completion
  let resolveTimeline: () => void;
  const timelineCompletePromise = new Promise<void>((resolve) => {
    resolveTimeline = resolve;
  });
  
  // Calculate relative position
  const parseTimePosition = (pos: string | number, refLength: number): number => {
    if (typeof pos === "number") {
      return pos;
    }
    
    // Handle relative positioning like "+=100" or "-=50"
    if (pos.startsWith("+=")) {
      return refLength + parseFloat(pos.substring(2));
    } else if (pos.startsWith("-=")) {
      return refLength - parseFloat(pos.substring(2));
    } else {
      return parseFloat(pos);
    }
  };
  
  // Sort animations by position
  const sortAnimations = () => {
    animations.sort((a, b) => a.position - b.position);
  };
  
  // Run the timeline
  const runTimeline = (currentTime: number = 0) => {
    if (canceled) {
      resolveTimeline();
      return;
    }
    
    if (isPaused) {
      rafId = requestAnimationFrame(() => runTimeline(currentTime));
      return;
    }
    
    // Update progress and trigger animations
    animations.forEach(anim => {
      const { config, position } = anim;
      
      // Ensure animation has the necessary properties
      config.autoplay = false; // We control playback
      
      // Create animation instance if not already
      if (!anim.animation) {
        anim.animation = animate(config);
      }
      
      // Calculate if this animation should be active
      const animEndTime = position + config.duration + (config.endDelay || 0);
      
      if (currentTime >= position && currentTime <= animEndTime) {
        // Animation is active, calculate local progress
        const localProgress = (currentTime - position) / config.duration;
        anim.animation.seek(isReversed ? 1 - localProgress : localProgress);
      } else if (currentTime < position) {
        // Animation hasn't started yet
        anim.animation.seek(isReversed ? 1 : 0);
      } else if (currentTime > animEndTime) {
        // Animation has completed
        anim.animation.seek(isReversed ? 0 : 1);
      }
    });
    
    // Calculate overall timeline progress
    currentProgress = timelineLength > 0 ? currentTime / timelineLength : 1;
    
    // Update callback
    update?.({
      completed: currentProgress * 100,
      remaining: (1 - currentProgress) * 100
    });
    
    // Check if timeline is complete
    if (currentTime >= timelineLength) {
      currentLoop++;
      
      if (currentLoop < loopCount || loopCount === Infinity) {
        // Handle loop and direction changes
        if (direction === "alternate" || direction === "alternate-reverse") {
          isReversed = !isReversed;
        }
        
        // Reset for next loop
        runTimeline(0); 
      } else {
        // All done
        complete?.();
        resolveTimeline();
      }
    } else {
      // Continue timeline
      rafId = requestAnimationFrame(() => runTimeline(currentTime + (isReversed ? -1 : 1)));
    }
  };
  
  // Create timeline object
  const timelineObj: Timeline = {
    add: (animConfig: AnimationConfig, timePosition: string | number = "+=0") => {
      const position = parseTimePosition(timePosition, timelineLength);
      
      animations.push({
        config: { ...animConfig },
        position
      });
      
      // Update timeline length
      const animEndTime = position + animConfig.duration + (animConfig.endDelay || 0);
      if (animEndTime > timelineLength) {
        timelineLength = animEndTime;
      }
      
      sortAnimations();
      return timelineObj;
    },
    
    play: () => {
      if (canceled) return timelineObj;
      isPaused = false;
      
      if (rafId === null) {
        runTimeline(isReversed ? timelineLength : 0);
      }
      
      return timelineObj;
    },
    
    pause: () => {
      isPaused = true;
      return timelineObj;
    },
    
    restart: () => {
      if (canceled) return timelineObj;
      
      // Reset all animations
      animations.forEach(anim => {
        if (anim.animation) {
          anim.animation.seek(isReversed ? 1 : 0);
        }
      });
      
      currentLoop = 0;
      isPaused = false;
      
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      
      runTimeline(isReversed ? timelineLength : 0);
      return timelineObj;
    },
    
    seek: (progress: number) => {
      const targetTime = timelineLength * Math.min(1, Math.max(0, progress));
      runTimeline(targetTime);
      return timelineObj;
    },
    
    reverse: () => {
      isReversed = !isReversed;
      return timelineObj;
    },
    
    cancel: () => {
      canceled = true;
      
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      
      // Cancel all animations
      animations.forEach(anim => {
        anim.animation?.cancel();
      });
      
      resolveTimeline();
    },
    
    completed: timelineCompletePromise
  };
  
  // Auto-start if required
  if (autoplay) {
    setTimeout(() => timelineObj.play(), 0);
  }
  
  return timelineObj;
};

/**
 * Helper function to create staggered animations
 */
export const stagger = (
  value: number,
  options: {
    start?: number;
    from?: number | 'center' | 'edges' | 'first' | 'last';
    direction?: 'normal' | 'reverse';
    grid?: [rows: number, cols: number];
    axis?: 'x' | 'y';
    easing?: (t: number) => number;
  } = {}
) => {
  const {
    start = 0,
    from = 0,
    direction = 'normal',
    grid,
    axis,
    easing = easingFunctions.linear
  } = options;
  
  return (el: any, i: number, total: number) => {
    let index = i;
    
    // Handle grid positioning
    if (grid) {
      const [rows, cols] = grid;
      const fromX = from === 'first' ? 0 : from === 'last' ? cols - 1 : from === 'center' ? (cols - 1) / 2 : from;
      const fromY = from === 'first' ? 0 : from === 'last' ? rows - 1 : from === 'center' ? (rows - 1) / 2 : from;
      
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      // Calculate distance based on axis
      if (axis === 'x') {
        index = col;
      } else if (axis === 'y') {
        index = row;
      } else {
        // Calculate distance based on position from origin
        const distX = typeof fromX === 'number' ? Math.abs(col - fromX) : 0;
        const distY = typeof fromY === 'number' ? Math.abs(row - fromY) : 0;
        
        index = Math.sqrt(distX * distX + distY * distY);
      }
    } else {
      // Handle linear positioning
      if (from === 'first') {
        index = i;
      } else if (from === 'last') {
        index = total - 1 - i;
      } else if (from === 'center') {
        index = Math.abs((total - 1) / 2 - i);
      } else if (from === 'edges') {
        index = Math.abs(i - (total - 1) * (i / (total - 1) < 0.5 ? 0 : 1));
      } else if (typeof from === 'number') {
        index = Math.abs(from - i);
      }
    }
    
    // Apply direction
    if (direction === 'reverse') {
      index = total - 1 - index;
    }
    
    // Apply easing to the index for non-linear distribution
    const progress = index / Math.max(total - 1, 1);
    const easedProgress = easing(progress);
    
    return start + value * easedProgress;
  };
};

/**
 * Spring animation helper
 */
export const spring = (
  config: {
    mass?: number;
    stiffness?: number;
    damping?: number;
    velocity?: number;
  } = {}
) => {
  const { 
    mass = 1, 
    stiffness = 100, 
    damping = 10, 
    velocity = 0 
  } = config;
  
  return (t: number) => {
    // Approximation of a spring function using damped sine wave
    const omega = Math.sqrt(stiffness / mass);
    const zeta = damping / (2 * Math.sqrt(stiffness * mass));
    
    if (zeta < 1) {
      // Underdamped
      const omega_d = omega * Math.sqrt(1 - zeta * zeta);
      return 1 - Math.exp(-zeta * omega * t) * 
        (Math.cos(omega_d * t) + (zeta * omega * velocity) / omega_d * Math.sin(omega_d * t));
    } else {
      // Critically damped (zeta = 1)
      return 1 - (1 + omega * t) * Math.exp(-omega * t);
    }
  };
};

/**
 * Create a physics-based animation
 */
export const physics = (
  config: AnimationConfig & {
    physics?: {
      mass?: number;
      stiffness?: number;
      damping?: number;
      velocity?: number;
    }
  }
): Animation => {
  const { physics = {}, ...animConfig } = config;
  const springEasing = spring(physics);
  
  return animate({
    ...animConfig,
    easing: springEasing
  });
};

/**
 * Utility to create a sequence of animations
 */
export const sequence = (animations: AnimationConfig[]): Timeline => {
  const tl = timeline();
  
  animations.forEach((anim, index) => {
    tl.add(anim, index === 0 ? 0 : "+=0");
  });
  
  return tl;
};

/**
 * Create transform string from individual transform properties
 */
export const createTransform = (transforms: Record<string, number | string>) => {
  return Object.entries(transforms)
    .map(([key, value]) => {
      // Handle special cases
      if (key === 'rotate' || key === 'rotateX' || key === 'rotateY' || key === 'rotateZ') {
        const val = typeof value === 'number' ? `${value}deg` : value;
        return `${key}(${val})`;
      }
      
      if (key === 'scale' || key === 'scaleX' || key === 'scaleY' || key === 'scaleZ') {
        return `${key}(${value})`;
      }
      
      if (key === 'translateX' || key === 'translateY' || key === 'translateZ') {
        const val = typeof value === 'number' ? `${value}px` : value;
        return `${key}(${val})`;
      }
      
      if (key === 'skew' || key === 'skewX' || key === 'skewY') {
        const val = typeof value === 'number' ? `${value}deg` : value;
        return `${key}(${val})`;
      }
      
      return `${key}(${value})`;
    })
    .join(' ');
};

/**
 * Quick one-shot animations for common use cases
 */
export const effects = {
  fadeIn: (targets: any, duration = 500, options = {}) => {
    return animate({
      targets,
      props: { opacity: [0, 1] },
      duration,
      easing: 'easeOutQuad',
      ...options
    });
  },
  
  fadeOut: (targets: any, duration = 500, options = {}) => {
    return animate({
      targets,
      props: { opacity: [1, 0] },
      duration,
      easing: 'easeOutQuad',
      ...options
    });
  },
  
  slideIn: (targets: any, direction = 'left', distance = '100%', duration = 500, options = {}) => {
    const prop = direction === 'left' || direction === 'right' ? 'translateX' : 'translateY';
    const start = direction === 'left' || direction === 'up' ? distance : `-${distance}`;
    
    return animate({
      targets,
      props: { 
        transform: [
          `${prop}(${start})`,
          `${prop}(0)`
        ] 
      },
      duration,
      easing: 'easeOutQuad',
      ...options
    });
  },
  
  slideOut: (targets: any, direction = 'left', distance = '100%', duration = 500, options = {}) => {
    const prop = direction === 'left' || direction === 'right' ? 'translateX' : 'translateY';
    const end = direction === 'right' || direction === 'down' ? distance : `-${distance}`;
    
    return animate({
      targets,
      props: { 
        transform: [
          `${prop}(0)`,
          `${prop}(${end})`
        ] 
      },
      duration,
      easing: 'easeOutQuad',
      ...options
    });
  },
  
  zoom: (targets: any, start = 0.5, end = 1, duration = 500, options = {}) => {
    return animate({
      targets,
      props: { 
        transform: [
          `scale(${start})`,
          `scale(${end})`
        ] 
      },
      duration,
      easing: 'easeOutQuad',
      ...options
    });
  },
  
  pulse: (targets: any, scale = 1.05, duration = 600, options = {}) => {
    return animate({
      targets,
      props: { 
        transform: [
          'scale(1)',
          `scale(${scale})`,
          'scale(1)'
        ] 
      },
      duration,
      easing: 'easeInOutQuad',
      ...options
    });
  },
  
  shake: (targets: any, intensity = 10, duration = 800, options = {}) => {
    return animate({
      targets,
      props: { 
        transform: [
          'translateX(0)',
          `translateX(${intensity}px)`,
          `translateX(-${intensity}px)`,
          `translateX(${intensity * 0.8}px)`,
          `translateX(-${intensity * 0.8}px)`,
          `translateX(${intensity * 0.5}px)`,
          `translateX(-${intensity * 0.5}px)`,
          'translateX(0)'
        ] 
      },
      duration,
      easing: 'easeOutQuad',
      ...options
    });
  },
  
  flipIn: (targets: any, axis = 'X', duration = 800, options = {}) => {
    return animate({
      targets,
      props: { 
        transform: [
          `rotate${axis}(90deg)`,
          `rotate${axis}(0deg)`
        ],
        opacity: [0, 1]
      },
      duration,
      easing: 'easeOutQuad',
      ...options
    });
  },
  
  bounce: (targets: any, height = '20px', duration = 1000, options = {}) => {
    return animate({
      targets,
      props: { 
        transform: [
          'translateY(0)',
          `translateY(-${height})`,
          'translateY(0)',
          `translateY(-${parseInt(height) * 0.6}px)`,
          'translateY(0)',
          `translateY(-${parseInt(height) * 0.3}px)`,
          'translateY(0)'
        ] 
      },
      duration,
      easing: 'easeOutQuad',
      ...options
    });
  }
};