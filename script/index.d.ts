declare module "script/model" {
    export namespace Model {
        const pseudoGaussian: (samples?: number) => number;
        interface Point {
            x: number;
            y: number;
        }
        interface Animation {
            period: number;
            phase: number;
            scale: number;
        }
        interface FloatAnimation {
            x: Animation[];
            y: Animation[];
        }
        interface UnitAnimation {
            moveAnimation: FloatAnimation;
            sizeAnimation: Animation[];
            appearAnimation?: Animation;
            vanishAnimation?: Animation;
        }
        interface EyeAnimation {
            moveAnimation: FloatAnimation[];
            appearAnimation?: Animation;
            vanishAnimation?: Animation;
        }
        interface Circle extends Point {
            radius: number;
        }
        const makeCircle: (point: Point, radius: number) => Circle;
        interface Unit {
            body: Circle;
            scale: number;
            animation: UnitAnimation;
            eye?: {
                white: Circle;
                iris: Circle;
                animation: EyeAnimation;
            };
        }
        interface Layer {
            units: Unit[];
            lastMadeAt: number;
            lastRemovedAt: number;
        }
        const Data: {
            previousTimestamp: number;
            width: number;
            height: number;
            accent: Layer;
            main: Layer;
        };
        const isOutOfCanvas: (circle: Circle) => boolean;
        const sumValidAreas: (layer: Layer) => number;
        const sumAllAreas: (layer: Layer) => number;
        const calculateAnimationSineIntegral: (animation: Animation, step: number) => number;
        const accumulateAnimationSineIntegral: (animations: Animation[], step: number) => number;
        const accumulateAnimationSize: (animations: Animation[], step: number) => number;
        const updateAnimation: (animation: Animation, step: number) => void;
        const updateAnimations: (animations: Animation[], step: number) => void;
        const updateFloatAnimation: (floatAnimation: FloatAnimation, step: number) => void;
        const makeAnimation: (specific: {
            period: {
                base: number;
                pseudoGaussian: number;
                range: number;
            };
            scale: {
                base: number;
                pseudoGaussian: number;
                range: number;
            };
        }, scaleRate: number) => Animation;
        const makeUnitAnimation: () => UnitAnimation;
        const makeUnit: (point: Point) => Unit;
        const updateUnit: (unit: Unit, step: number) => void;
        const updateLayer: (layer: Layer, timestamp: number, step: number) => void;
        const updateStretch: () => void;
        const updateData: (timestamp: number) => void;
    }
}
declare module "script/render" {
    import config from "resource/config";
    export namespace Render {
        let style: keyof (typeof config)["coloring"];
        const draw: () => void;
    }
}
declare module "script/fps" {
    export namespace Fps {
        export class OnlineStandardDeviation {
            count: number;
            mean: number;
            m2: number;
            reset: () => void;
            update: (value: number) => void;
            isValid: () => boolean;
            getVariance: () => number;
            getStandardDeviation: () => number;
        }
        export const standardDeviation: OnlineStandardDeviation;
        interface FpsHistoryEntry {
            fps: number;
            now: number;
            text: string;
        }
        export let currentMaxFps: FpsHistoryEntry;
        export let currentNowFps: FpsHistoryEntry;
        export let currentMinFps: FpsHistoryEntry;
        export let fuseFps: number;
        export let isValid: boolean;
        export let averageFps: number;
        export const reset: () => void;
        export const step: (now: number) => void;
        export const getText: () => string;
        export const isUnderFuseFps: () => boolean;
        export {};
    }
}
declare module "script/index" {
    export class ToggleClassForWhileTimer {
        timer: ReturnType<typeof setTimeout> | undefined;
        constructor();
        start(element: HTMLElement, token: string, span: number, onEnd?: () => unknown): void;
        isInTimer: () => boolean;
    }
    export const mousemove: () => void;
}
