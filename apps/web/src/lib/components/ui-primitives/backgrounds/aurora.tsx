import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useTheme } from 'tanstack-theme-kit';
import { useHydrated } from '@/lib/hooks/use-hydrated';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uDarkMode; 
out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  // Light mode: tighter clamp range for subtlety
  // Dark mode: full range for drama
  float lightModeMin = 0.1; // Was 0.3, lower = more transparent
  float lightModeMax = 0.9;  // NEW: cap brightness in light mode
  float darkModeMin = 0.0;
  float darkModeMax = 1.0;
  
  float minIntensity = mix(lightModeMin, darkModeMin, uDarkMode);
  float maxIntensity = mix(lightModeMax, darkModeMax, uDarkMode);
  intensity = clamp(intensity, minIntensity, maxIntensity);

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  // Theme-aware color blending using mix
  vec3 lightModeColor = mix(vec3(1.0), rampColor, intensity * 0.8);
  vec3 darkModeColor = intensity * rampColor;
  vec3 auroraColor = mix(lightModeColor, darkModeColor, uDarkMode);

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
  colorStops?: string[];
  lightColorStops?: string[];
  darkColorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
}

export function Aurora(props: AuroraProps) {
  const isHydrated = useHydrated();
  const {
    colorStops,
    lightColorStops = ['#034a95', '#b3d7ff', '#7cff67'],
    darkColorStops = ['#b3d7ff', '#034a95', '#7cff67'],
    amplitude = 1,
    blend = 0.5,
  } = props;
  const propsRef = useRef<AuroraProps>(props);
  // Ref for the program to be accessible in the update loop
  const programRef = useRef<Program | undefined>(undefined);
  const rendererRef = useRef<Renderer | undefined>(undefined);
  const meshRef = useRef<Mesh | undefined>(undefined);
  const { theme } = useTheme();
  const ctnDom = useRef<HTMLDivElement>(null);
  // Update propsRef when props change
  useEffect(() => {
    propsRef.current = props;
  });

  // Effect to handle theme changes and update uniforms without rebuilding context
  useEffect(() => {
    if (programRef.current) {
      const isDark = theme === 'dark';
      programRef.current.uniforms.uDarkMode.value = isDark ? 1 : 0;

      // Update color stops based on new theme
      const newStops = colorStops || (isDark ? darkColorStops : lightColorStops);
      const stopsArray = newStops.map((hex) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });
      programRef.current.uniforms.uColorStops.value = stopsArray;
    }
  }, [theme, colorStops, darkColorStops, lightColorStops]);

  useEffect(() => {
    if (!isHydrated) return;

    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    function resize(entries?: ResizeObserverEntry[]) {
      if (!ctn) return;
      let width, height;
      if (entries?.[0]) {
        width = entries[0].contentRect.width;
        height = entries[0].contentRect.height;
      } else {
        width = ctn.offsetWidth;
        height = ctn.offsetHeight;
      }
      renderer.setSize(width, height);
      if (programRef.current) {
        programRef.current.uniforms.uResolution.value = [width, height];
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(ctn);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    // Initial color setup
    const initialStops = colorStops || (theme === 'dark' ? darkColorStops : lightColorStops);
    const initialColorStopsArray = initialStops.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: initialColorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uDarkMode: { value: theme === 'dark' ? 1 : 0 },
        uBlend: { value: blend },
      },
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;
    ctn.append(gl.canvas as Node);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      const { time = t * 0.01, speed = 1 } = propsRef.current;
      if (programRef.current) {
        programRef.current.uniforms.uTime.value = time * speed * 0.1;
        programRef.current.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1;
        programRef.current.uniforms.uBlend.value = propsRef.current.blend ?? blend;
        // Note: uDarkMode and uColorStops are handled by the other useEffect

        renderer.render({ scene: mesh });
      }
    };
    animateId = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateId);
      resizeObserver.disconnect();
      if (ctn && gl.canvas.parentNode === ctn) {
        gl.canvas.remove();
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude, blend, isHydrated]); // Added isHydrated to prevent render before hydration

  return <div ref={ctnDom} className="pointer-events-none absolute inset-0 z-0 h-full w-full" />;
}

/**
 * 

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import { useTheme } from 'tanstack-theme-kit';
import { useHydrated } from '@/lib/hooks/use-hydrated';

const VERT = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uDarkMode; 
in vec2 vUv;
out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = vUv;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  // Light mode: tighter clamp range for subtlety
  // Dark mode: full range for drama
  float lightModeMin = 0.1; // Was 0.3, lower = more transparent
  float lightModeMax = 0.9;  // NEW: cap brightness in light mode
  float darkModeMin = 0.0;
  float darkModeMax = 1.0;
  
  float minIntensity = mix(lightModeMin, darkModeMin, uDarkMode);
  float maxIntensity = mix(lightModeMax, darkModeMax, uDarkMode);
  intensity = clamp(intensity, minIntensity, maxIntensity);

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  // Theme-aware color blending using mix
  vec3 lightModeColor = mix(vec3(1.0), rampColor, intensity * 0.8);
  vec3 darkModeColor = intensity * rampColor;
  vec3 auroraColor = mix(lightModeColor, darkModeColor, uDarkMode);

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
  colorStops?: string[];
  lightColorStops?: string[];
  darkColorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
}

export function Aurora(props: AuroraProps) {
  const {
    colorStops,
    lightColorStops = ['#034a95', '#b3d7ff', '#7cff67'],
    darkColorStops = ['#b3d7ff', '#034a95', '#7cff67'],
    amplitude = 1,
    blend = 0.5,
  } = props;
    const propsRef = useRef<AuroraProps>(props);
  // Ref for the program to be accessible in the update loop
  const programRef = useRef<Program | undefined>(undefined);
  const rendererRef = useRef<Renderer | undefined>(undefined);
  const meshRef = useRef<Mesh | undefined>(undefined);
  const { theme } = useTheme();
  const isHydrated = useHydrated();
  const ctnDom = useRef<HTMLDivElement>(null);
  // Update propsRef when props change
  useEffect(() => {
    propsRef.current = props;
  });

  // Effect to handle theme changes and update uniforms without rebuilding context
  useEffect(() => {
    if (programRef.current) {
      // Robust theme detection for hydration
      const isDark =
        theme === 'dark' ||
        (theme === 'system' &&
          globalThis.window != undefined &&
          document.documentElement.classList.contains('dark'));

      programRef.current.uniforms.uDarkMode.value = isDark ? 1 : 0;

      // Update color stops based on new theme
      const newStops = colorStops || (isDark ? darkColorStops : lightColorStops);
      const stopsArray = newStops.map((hex) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });
      programRef.current.uniforms.uColorStops.value = stopsArray;
    }
  }, [theme, colorStops, darkColorStops, lightColorStops]);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      dpr: window.devicePixelRatio,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    function resize(entries?: ResizeObserverEntry[]) {
      if (!ctn) return;
      let width, height;
      if (entries?.[0]) {
        width = entries[0].contentRect.width;
        height = entries[0].contentRect.height;
      } else {
        width = ctn.offsetWidth;
        height = ctn.offsetHeight;
      }
      renderer.setSize(width, height);
      // Explicit viewport set just in case autoClear/setSize is tricky on some hardware
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      if (programRef.current) {
        programRef.current.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(ctn);

    const geometry = new Triangle(gl);

    // Initial theme detection (mirroring robust check above)
    const isDarkInitial =
      theme === 'dark' ||
      (theme === 'system' &&
        globalThis.window != undefined &&
        document.documentElement.classList.contains('dark'));

    // Initial color setup
    const initialStops = colorStops || (isDarkInitial ? darkColorStops : lightColorStops);
    const initialColorStopsArray = initialStops.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: initialColorStopsArray },
        uResolution: { value: [gl.canvas.width, gl.canvas.height] },
        uDarkMode: { value: isDarkInitial ? 1 : 0 },
        uBlend: { value: blend },
      },
    });
    programRef.current = program;

    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;
    ctn.append(gl.canvas);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      const { time = t * 0.01, speed = 1 } = propsRef.current;
      if (programRef.current) {
        programRef.current.uniforms.uTime.value = time * speed * 0.1;
        programRef.current.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1;
        programRef.current.uniforms.uBlend.value = propsRef.current.blend ?? blend;
        // Note: uDarkMode and uColorStops are handled by the other useEffect
        
        renderer.render({ scene: mesh });
      }
    };
    animateId = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateId);
      resizeObserver.disconnect();
      if (ctn && gl.canvas.parentNode === ctn) {
        gl.canvas.remove();
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude, blend, isHydrated]); // Added isHydrated to ensure initialization after hydration

  if (!isHydrated) {
    return (
      <div className="absolute inset-0 z-0 h-full w-full bg-white dark:bg-[#0b0b0b]" />
    );
  }

  return (
    <div
      ref={ctnDom}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-white dark:bg-[#0b0b0b]"
    />
  );
}

 */
