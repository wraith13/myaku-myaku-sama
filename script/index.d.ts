declare module "script/url" {
    export namespace Url {
        const parseParameter: (url: string) => Record<string, string>;
        const make: (params: Record<string, string>) => string;
        const addParameter: (params: Record<string, string>, key: string, value: string) => Record<string, string>;
        const initialize: () => void;
        const params: Record<string, string>;
    }
}
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
            moveAnimation: FloatAnimation;
            appearAnimation?: Animation;
            vanishAnimation?: Animation;
        }
        interface Circle extends Point {
            radius: number;
        }
        const makeCircle: (point: Point, radius: number) => Circle;
        interface Eye {
            white: Circle;
            iris: Circle;
            animation: EyeAnimation;
        }
        interface Unit {
            body: Circle;
            scale: number;
            animation: UnitAnimation;
            eye?: Eye;
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
        const makeEye: () => Eye;
        const updateUnit: (layer: Layer, unit: Unit, step: number) => void;
        const updateLayer: (layer: Layer, timestamp: number, step: number) => void;
        type PixelRatioMode = "thirty-second" | "sixteenth" | "eighth" | "quarter" | "half" | "regular" | "full";
        const PixelRatioModeKeys: readonly ["thirty-second", "sixteenth", "eighth", "quarter", "half", "regular", "full"];
        const togglePixelRatioMode: (value?: boolean | PixelRatioMode) => void;
        const getPixcelRatioLevel: () => number;
        const getPixcelRatio: () => number;
        const updateStretch: () => void;
        const updateData: (timestamp: number) => void;
    }
}
declare module "script/ui" {
    import config from "resource/config";
    export namespace UI {
        const canvas: HTMLCanvasElement;
        const overlayPanel: HTMLDivElement;
        const time: HTMLTimeElement;
        const date: HTMLTimeElement;
        const fpsDiv: HTMLDivElement;
        const stylesButton: HTMLButtonElement;
        const hdButton: HTMLButtonElement;
        const watchButton: HTMLButtonElement;
        const fpsButton: HTMLButtonElement;
        const fullscreenButton: HTMLButtonElement;
        const jumpOutButton: HTMLButtonElement;
        const fullscreenEnabled: any;
        const isInIframe: boolean;
        const setAriaHidden: (element: HTMLElement, hidden: boolean) => void;
        type WatchColor = "none" | "white" | "black" | "rainbow";
        const WatchColorList: readonly ["none", "white", "black", "rainbow"];
        let watchColor: WatchColor;
        const updateWatchVisibility: () => void;
        const updateWatchRoundBar: () => void;
        const toggleWatchDisplay: (value?: boolean | WatchColor) => void;
        const toggleFpsDisplay: () => void;
        const toggleFullScreen: () => void;
        const updateFullscreenState: () => void;
        const updateStyleRoundBar: () => void;
        let style: keyof (typeof config)["styles"];
        const toggleStyle: (style?: boolean | keyof (typeof config)["styles"]) => void;
        const updateHdRoundBar: () => void;
        class ToggleClassForWhileTimer {
            timer: ReturnType<typeof setTimeout> | undefined;
            constructor();
            start(element: HTMLElement, token: string, span: number, onEnd?: () => unknown): void;
            isInTimer: () => boolean;
        }
        const mousemove: () => void;
        const setTextContent: (element: HTMLElement, text: string) => boolean;
        const setAttribute: (element: HTMLElement, name: string, value: string | undefined) => boolean;
        const setStyle: (element: HTMLElement, name: string, value: string | undefined) => boolean;
    }
}
declare module "script/render" {
    import { Model } from "script/model";
    export namespace Render {
        const updateStyleColors: () => void;
        const getCanvasCircle: () => Model.Circle;
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
declare module "script/event" {
    export namespace Event {
        const initialize: () => void;
    }
}
declare module "script/watch" {
    export namespace Watch {
        const locale: string;
        const makeDate: (date: Date, locale: string) => string;
        const makeTime: (date: Date, locale: string) => string;
        const setColor: (color: string | undefined) => void;
        const update: () => void;
    }
}
declare module "script/index" { }
