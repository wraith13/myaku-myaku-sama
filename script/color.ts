//import { UI } from "./ui";
import config from "@resource/config.json";
export namespace Color
{
    export type Coloring = (typeof config.coloring)[keyof typeof config.coloring];
    export type ColoringType = keyof typeof config["coloring"] | "random" | "custom";
    export let coloring = "regular" as ColoringType;
    let customColoring: Coloring | null = null;
    export const isCustomColoring = (): boolean =>
        null !== customColoring;
    export const setCustomColoring = (coloring: Coloring | null) =>
    {
        customColoring = coloring;
    };
    export const isRandomColoring = (): boolean =>
        ! isCustomColoring() &&
        undefined === config.coloring[coloring as keyof typeof config.coloring];
    export const getColoring = (): Coloring =>
    {
        if (isCustomColoring())
        {
            return customColoring as Coloring;
        }
        if (isRandomColoring())
        {
            let index = Math.floor(Math.random() * Object.keys(config.coloring).length);
            let key = Object.keys(config.coloring)[index] as keyof typeof config.coloring;
            let result = config.coloring[key];
            if (isSameColoring(newColors, result))
            {
                index = (index + 1) % Object.keys(config.coloring).length;
                key = Object.keys(config.coloring)[index] as keyof typeof config.coloring;
                result = config.coloring[key];
            }
            return result;
        }
        else
        {
            return config.coloring[coloring as keyof typeof config.coloring];
        }
    };
    const getColors = (): Coloring =>
    {
        const coloring = getColoring();
        return { base: coloring.base, main: coloring.main, accent: coloring.accent, };
    };
    let changedColoringAt = 0;
    let oldColors: Coloring = getColors();
    let newColors: Coloring = getColors();
    export const isExpiredRandomColoring = (): boolean =>
        isRandomColoring() &&
        config.rendering.randomColoringUnitDuration <= (performance.now() - changedColoringAt);
    export let previousColors: Coloring = getColors();
    export const isSameColoring = (a: Coloring, b: Coloring): boolean =>
        a.base === b.base && a.main === b.main && a.accent === b.accent;
    export const updateColoring = () =>
    {
        const colors = getColors();
        if ( ! isSameColoring(newColors, colors))
        {
            oldColors = getCurrentColors();
            newColors = colors;
            changedColoringAt = performance.now();
        }
    };
    const mixColor = (oldColor: string, newColor: string, rate: number): string =>
    {
        const boost = 1.0 +(config.rendering.antiDullnessBoost * Math.sin(Math.PI * rate)); // Adjustment to reduce dullness of intermediate colors
        const oldR = parseInt(oldColor.slice(1, 3), 16);
        const oldG = parseInt(oldColor.slice(3, 5), 16);
        const oldB = parseInt(oldColor.slice(5, 7), 16);
        const newR = parseInt(newColor.slice(1, 3), 16);
        const newG = parseInt(newColor.slice(3, 5), 16);
        const newB = parseInt(newColor.slice(5, 7), 16);
        const currR = Math.round(Math.min((oldR + (newR -oldR) *rate) *boost, 255));
        const currG = Math.round(Math.min((oldG + (newG -oldG) *rate) *boost, 255));
        const currB = Math.round(Math.min((oldB + (newB -oldB) *rate) *boost, 255));
        return `#${currR.toString(16).padStart(2, "0")}${currG.toString(16).padStart(2, "0")}${currB.toString(16).padStart(2, "0")}`;
    };
    const mixColors = (oldColors: Coloring, newColors: Coloring, rate: number): Coloring =>
    ({
        base: mixColor(oldColors.base, newColors.base, rate),
        main: mixColor(oldColors.main, newColors.main, rate),
        accent: mixColor(oldColors.accent, newColors.accent, rate),
    });
    export const getCurrentColors = () =>
    {
        if (isCustomColoring())
        {
            return getColors();
        }
        else
        {
            const now = performance.now();
            const span = isRandomColoring() ?
                config.rendering.coloringRandomFadeDuration:
                config.rendering.coloringRegularFadeDuration;
            const rate = (now -changedColoringAt) /span;
            if (1.0 <= rate)
            {
                return newColors;
            }
            else
            if (rate <= 0.0)
            {
                return oldColors;
            }
            else
            {
                return mixColors(oldColors, newColors, rate);
            }
        }
    };
}