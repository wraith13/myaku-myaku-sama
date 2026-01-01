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
declare module "script/index" { }
