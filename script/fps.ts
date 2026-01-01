export namespace Fps
{
    export class OnlineStandardDeviation
    {
        count: number = 0;
        mean: number = 0;
        m2: number = 0;
        public reset = () =>
        {
            this.count = 0;
            this.mean = 0;
            this.m2 = 0;
        };
    
        public update = (value: number) =>
        {
            this.count += 1;
            const delta = value - this.mean;
            this.mean += delta / this.count;
            const delta2 = value - this.mean;
            this.m2 += delta * delta2;
        }
        public isValid = () => 1 < this.count;
        public getVariance = () =>
            this.isValid() ? this.m2 / (this.count - 1) : 0;
        public getStandardDeviation = () =>
            Math.sqrt(this.getVariance());
    }
    export const standardDeviation = new OnlineStandardDeviation();
    interface FpsHistoryEntry
    {
        fps: number;
        now: number;
        text: string;
    }
    const fpsWindow = 1000; // ms
    let frameTimings: number[] = [];
    let fpsHistory: FpsHistoryEntry[] = [];
    export let currentMaxFps: FpsHistoryEntry;
    export let currentNowFps: FpsHistoryEntry;
    export let currentMinFps: FpsHistoryEntry;
    export let fuseFps: number;
    export let isValid: boolean;
    export let averageFps: number = NaN; // Stores the average FPS over the most recent 1 second
    const makeInvalidFpsHistoryEntry = (): FpsHistoryEntry =>
        ({
            fps: NaN,
            now: NaN,
            text: "N/A FPS",
        });
    export const reset = () =>
    {
        isValid = false;
        frameTimings = [];
        fpsHistory = [];
        currentMaxFps = currentNowFps = currentMinFps =
            makeInvalidFpsHistoryEntry();
        standardDeviation.reset();
        averageFps = NaN; // リセット時に初期化
    };
    export const step = (now: number) =>
    {
        frameTimings.push(now);
        isValid = 2 <= frameTimings.length;
        if (isValid)
        {
            while (2 < frameTimings.length && fpsWindow < now - frameTimings[0])
            {
                frameTimings.shift();
            }
            const timeSpan = Math.max(now - frameTimings[0], 0.001); // max for avoid 0 div
            const frameCount = frameTimings.length - 1;
            const fps = (frameCount * 1000) / timeSpan;
            standardDeviation.update(fps);
            currentNowFps =
            {
                fps,
                now,
                text: makeFpsText(fps),
            };
            const expiredAt = now -fpsWindow;
            while(0 < fpsHistory.length && fpsHistory[0].now < expiredAt)
            {
                fpsHistory.shift();
            }
            fpsHistory.push(currentNowFps);
            currentMaxFps = currentNowFps;
            currentMinFps = currentNowFps;
            fpsHistory.forEach
            (
                i =>
                {
                    if (currentMaxFps.fps < i.fps)
                    {
                        currentMaxFps = i;
                    }
                    if (i.fps < currentMinFps.fps)
                    {
                        currentMinFps = i;
                    }
                }
            );
            const totalFps = fpsHistory.map(i => i.fps).reduce((a, v) => a +v, 0);
            averageFps = totalFps / fpsHistory.length;
            if (isUnderFuseFps())
            {
                console.error
                (
                    "❌ UnderFuseFps:",
                    {
                        fuseFps: Fps.fuseFps,
                        maxFps: Fps.currentMaxFps.fps,
                        nowFps: Fps.currentMaxFps.fps,
                        minFps: Fps.currentMinFps.fps,
                        averageFps: Fps.averageFps,
                    }
                );
            }
        }
    };
    const makeFpsText = (fps: number) =>
        `${fps.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 2, minimumFractionDigits: 2, })} FPS`;
    export const getText = () =>
            (currentMaxFps?.text ?? "N/A") +" (Max)\n"
            +`${averageFps.toFixed(2)} FPS (Avg)\n`
            //+currentNowFps.text + " (Now)\n"
            +(currentMinFps?.text ?? "N/A") +" (Min)";
    export const isUnderFuseFps = () => isValid && currentMaxFps.fps < fuseFps;
}
