interface AnimationConfig {
  targets: string | HTMLElement | HTMLElement[] | Record<string, any>;
  props: Record<string, number | string>;
  duration: number;
  delay?: number;
  easing?: ((t: number) => number) | keyof typeof defaultEasing;
  round?: number;
  loop?: number | boolean;
  direction?: "normal" | "reverse" | "alternate";
  update?: (currentState: any) => void;
  complete?: () => void;
}

const defaultEasing = {
  linear: (t: number) => t,
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeOutBounce: (t: number) => {
    const n1 = 7.5625,
      d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

export const animate = ({
  targets,
  props,
  duration,
  delay = 0,
  easing = "linear",
  round = 0,
  loop = false,
  direction = "normal",
  update,
  complete,
}: AnimationConfig) => {
  const isObjectTarget =
    typeof targets === "object" &&
    !Array.isArray(targets) &&
    !(targets instanceof HTMLElement);

  const elements = !isObjectTarget
    ? typeof targets === "string"
      ? Array.from(document.querySelectorAll(targets))
      : Array.isArray(targets)
      ? targets
      : [targets]
    : [];

  const loopCount = typeof loop === "boolean" ? Infinity : loop;
  let currentLoop = 0;
  let reverse = direction === "reverse";
  const easingFunction =
    typeof easing === "function" ? easing : defaultEasing[easing];

  const initialStates: any = isObjectTarget
    ? { ...targets }
    : elements.map((el) => {
        const state: Record<string, any> = {};
        Object.keys(props).forEach((key: any) => {
          if (key === "transform") {
            state[key] = window.getComputedStyle(el).transform;
          } else if (key in el.style) {
            state[key] = window.getComputedStyle(el)[key];
          } else if (el instanceof SVGElement && el.hasAttribute(key)) {
            state[key] = el.getAttribute(key);
          } else if (key in el) {
            state[key] = (el as any)[key];
          }
        });
        return state;
      });

  const parseTransform = (transform: string) => {
    const transforms = transform.match(/(\w+)\(([^)]*)\)/g) || [];
    return transforms.reduce((acc, t) => {
      const [, name, value] = t.match(/(\w+)\(([^)]*)\)/) || [];
      acc[name] = value.split(",").map(parseFloat);
      return acc;
    }, {} as Record<string, number[]>);
  };

  const interpolateTransform = (
    start: string,
    end: string,
    progress: number
  ) => {
    const startTransforms = parseTransform(start);
    const endTransforms = parseTransform(end);
    const interpolated = Object.keys(endTransforms).map((key) => {
      const startValues =
        startTransforms[key] || endTransforms[key].map(() => 0);
      const endValues = endTransforms[key];
      const values = endValues.map(
        (v, i) => startValues[i] + (v - startValues[i]) * progress
      );
      return `${key}(${values.join(",")})`;
    });
    return interpolated.join(" ");
  };

  const interpolatePoints = (start: string, end: string, progress: number) => {
    const startPoints = start
      .split(" ")
      .map((p) => p.split(",").map(parseFloat));
    const endPoints = end.split(" ").map((p) => p.split(",").map(parseFloat));
    return startPoints
      .map((startPoint, i) => {
        const endPoint = endPoints[i];
        return startPoint
          .map((v, j) => v + (endPoint[j] - v) * progress)
          .join(",");
      })
      .join(" ");
  };

  let canceled = false;

  const cancel = () => {
    canceled = true;
  };

  const runAnimation = (resolve: () => void) => {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      if (canceled) {
        resolve();
        return;
      }

      const elapsed = currentTime - startTime - delay;
      if (elapsed < 0) {
        requestAnimationFrame(step);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = reverse
        ? 1 - easingFunction(progress)
        : easingFunction(progress);

      if (isObjectTarget) {
        Object.keys(props).forEach((key: any) => {
          const start = parseFloat(initialStates[key] || "0");
          const end = parseFloat(props[key] as string);
          let value = start + (end - start) * easedProgress;
          if (round) value = parseFloat(value.toFixed(round));
          (targets as any)[key] = value;
        });

        update?.(targets);
      } else {
        elements.forEach((el, index) => {
          const initialValues = initialStates[index];
          Object.keys(props).forEach((key) => {
            if (key === "transform") {
              const value = interpolateTransform(
                initialValues[key] || "",
                props[key] as string,
                easedProgress
              );
              el.style.transform = value;
            } else if (key === "points" && el instanceof SVGElement) {
              const value = interpolatePoints(
                initialValues[key] || "",
                props[key] as string,
                easedProgress
              );
              el.setAttribute("points", value);
            } else {
              const start = parseFloat(initialValues[key] || "0");
              const end = parseFloat(props[key] as string);
              let value = start + (end - start) * easedProgress;
              if (round) value = parseFloat(value.toFixed(round));

              if (key in el.style) {
                el.style[key] =
                  typeof props[key] === "string" ? `${value}` : `${value}px`;
              } else if (el instanceof SVGElement && el.hasAttribute(key)) {
                el.setAttribute(key, `${value}`);
              } else if (key in el) {
                (el as any)[key] = value;
              }
            }
          });
        });

        update?.(elements);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        currentLoop += 1;
        if (currentLoop < loopCount || loopCount === Infinity) {
          if (direction === "alternate") reverse = !reverse;
          runAnimation(resolve);
        } else {
          complete?.();
          resolve();
        }
      }
    };

    requestAnimationFrame(step);
  };

  return {
    promise: new Promise<void>((resolve) => runAnimation(resolve)),
    cancel,
  };
};
