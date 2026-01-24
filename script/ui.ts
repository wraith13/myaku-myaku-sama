import { Url } from "./url";
// import { Model } from "./model";
import { Color } from "./color";
import config from "@resource/config.json";
export namespace UI
{
    const getElementById = <T extends keyof HTMLElementTagNameMap>(tag: T, id: string): HTMLElementTagNameMap[T] =>
    {
        const element = document.getElementById(id);
        if ( ! element)
        {
            throw new Error(`🦋 FIXME: Element not found: ${id}`);
        }
        if (tag !== element.tagName.toLowerCase())
        {
            throw new Error(`🦋 FIXME: Element is not <${tag}>: ${id}`);
        }
        return element as HTMLElementTagNameMap[T];
    };
    export const canvas = getElementById("canvas", "canvas");
    export const overlayPanel = getElementById("div", "overlay-panel");
    export const date2 = getElementById("time", "date2");
    export const yyyymmw = getElementById("span", "yyyymmw");
    export const dd = getElementById("span", "dd");
    export const time = getElementById("time", "time");
    export const date = getElementById("time", "date");
    export const pattern = getElementById("div", "pattern");
    export const fpsDiv = getElementById("div", "fps");
    export const coloringButton = getElementById("button", "coloring-button");
    export const qualityButton = getElementById("button", "quality-button");
    export const pitchButton = getElementById("button", "pitch-button");
    export const watchButton = getElementById("button", "watch-button");
    export const fpsButton = getElementById("button", "fps-button");
    export const fullscreenButton = getElementById("button", "fullscreen-button");
    export const jumpOutButton = getElementById("button", "jump-out-button");
    export const fullscreenEnabled = document.fullscreenEnabled || (<any>document).webkitFullscreenEnabled;
    export const isInIframe = window.top !== window.self;
    export const setAriaHidden = (element: HTMLElement, hidden: boolean) =>
    {
        const attributeKey = "aria-hidden";
        if (hidden)
        {
            const attribute = document.createAttribute(attributeKey);
            attribute.value = "true";
            element.attributes.setNamedItem(attribute);
        }
        else
        {
            if (element.attributes.getNamedItem(attributeKey))
            {
                element.attributes.removeNamedItem(attributeKey);
            }
        }
    };
    export type WatchColor = typeof config["watch"]["presets"][number];
    export type PrimaryWatchColor = Exclude<WatchColor, `${string}2`>;
    export const WatchColorList = config.watch.presets as WatchColor[];
    export let watchColor: WatchColor = config.watch.default;
    export const getPrimaryWatchColor = (color: WatchColor = watchColor): PrimaryWatchColor =>
        isWatchStyle2(color) ? color.slice(0, -1) : color;
    export const isWatchStyle2 = (color: WatchColor = watchColor): boolean =>
        "2" === color.slice(-1);
    export const updateWatchVisibility = () =>
    {
        if ("none" !== watchColor)
        {
            const primaryWatchColor = getPrimaryWatchColor();
            WatchColorList.filter(i => ! isWatchStyle2(i)).forEach
            (
                color => overlayPanel.classList.toggle(color, primaryWatchColor === color)
            );
            const isStyle2 = isWatchStyle2();
            overlayPanel.classList.toggle("watch-style-2", isStyle2);
            yyyymmw.style.display = isStyle2 ? "block" : "none";
            dd.style.display = isStyle2 ? "block" : "none";
            time.style.display = "block";
            date.style.display = isStyle2 ? "none" : "block";
            setAriaHidden(yyyymmw, ! isStyle2);
            setAriaHidden(dd, ! isStyle2);
            setAriaHidden(time, false);
            setAriaHidden(date, isStyle2);
        }
        else
        {
            time.style.display = "none";
            date.style.display = "none";
            setAriaHidden(time, true);
            setAriaHidden(date, true);
        }
    };
    export const updateRoundBar = (button: HTMLButtonElement, properties: { low: number, high: number, rotate: number, }) =>
    {
        // console.log("updateRoundBar", button, properties);
        /* For older environments where the 'initial-value' setting isn't supported, all values must be specified. */
        setStyle(button, "--low", properties.low.toFixed(3));
        setStyle(button, "--high", properties.high.toFixed(3));
        setStyle(button, "--rotate", properties.rotate.toFixed(3));
    };
    let coloringRoundBarIndex: number | "custom" = 0;
    const mod = (n: number, m: number): number => ((n % m) + m) % m;
    export const updateColoringRoundBar = () =>
    {
        if ("custom" === coloringRoundBarIndex)
        {
            updateRoundBar(coloringButton, {low: 0, high: 0, rotate: 0, });
        }
        else
        {
            const keys = Object.keys(config.coloring).concat("random") as Color.ColoringType[];
            const max = keys.length -1;
            updateRoundBar
            (
                coloringButton,
                max <= mod(coloringRoundBarIndex, keys.length) ?
                {
                    low: 0,
                    high: 1,
                    rotate: (coloringRoundBarIndex -Math.floor(coloringRoundBarIndex /keys.length)) /max,
                }:
                {
                    low: 0 /max,
                    high: 1 /max,
                    rotate: (coloringRoundBarIndex -Math.floor(coloringRoundBarIndex /keys.length)) /max,
                }
            );
        }
    };
    export const toggleColoring = (style?: boolean | keyof typeof config["coloring"]) =>
    {
        const keys = Object.keys(config.coloring).concat("random") as Color.ColoringType[];
        if (typeof style === "boolean" || undefined === style)
        {
            if ("custom" === coloringRoundBarIndex)
            {
                Color.coloring = "regular";
                coloringRoundBarIndex = keys.indexOf(Color.coloring);
                Color.setCustomColoring(null);
            }
            else
            {
                const currentIndex = keys.indexOf(Color.coloring);
                const nextIndex = (keys.length +currentIndex + (false !== style ? 1: -1)) %keys.length;
                console.log({currentIndex, nextIndex, keysLength: keys.length, style});
                Color.coloring = keys[nextIndex];
                coloringRoundBarIndex += false !== style ? 1: -1;
                Color.setCustomColoring(null);
            }
        }
        else
        {
            if (keys.includes(style))
            {
                Color.coloring = style;
                coloringRoundBarIndex = keys.indexOf(style);
                Color.setCustomColoring(null);
            }
            else
            {
                const coloring = style.split(" ");
                if (3 === coloring.length)
                {
                    Color.coloring = "custom";
                    coloringRoundBarIndex = "custom";
                    Color.setCustomColoring
                    ({
                        base: "#" +coloring[0],
                        main: "#" +coloring[1],
                        accent: "#" +coloring[2],
                    });
                }
            }
        }
        updateColoringRoundBar();
        const result = "custom" === Color.coloring ?
            style as string:
            Color.coloring;
        Url.addParameter("coloring", result);
        console.log(`🎨 Coloring changed: ${result}`);
    };
    export type PixelRatioMode = keyof typeof config.quality.presets;
    export const PixelRatioModeKeys = Object.keys(config.quality.presets) as PixelRatioMode[];
    let pixelRatioMode: PixelRatioMode = config.quality.default as PixelRatioMode;
    export const updateQualityRoundBar = () => updateRoundBar
    (
        qualityButton,
        {
            low: 0 /PixelRatioModeKeys.length,
            high: (getPixcelRatioLevel() +1) /PixelRatioModeKeys.length,
            rotate: 0,
        }
    );
    export const toggleQuality = (value?: boolean | PixelRatioMode) =>
    {
        if (typeof value === "boolean" || undefined === value)
        {
            const currentIndex = PixelRatioModeKeys.indexOf(pixelRatioMode);
            const nextIndex = (PixelRatioModeKeys.length +currentIndex +(false !== value ? 1: -1)) %PixelRatioModeKeys.length;
            pixelRatioMode = PixelRatioModeKeys[nextIndex];
        }
        else
        {
            if (PixelRatioModeKeys.includes(value))
            {
                pixelRatioMode = value;
            }
        }
        updateQualityRoundBar();
        Url.addParameter("quality", pixelRatioMode);
        console.log(`🖥️ Quality changed: ${pixelRatioMode}`);
    };
    export const getPixcelRatioLevel = (): number =>
        PixelRatioModeKeys.indexOf(pixelRatioMode);
    export const getPixcelRatio = (): number =>
    {
        const value = config.quality.presets[pixelRatioMode] as number | "devicePixelRatio";
        if ("devicePixelRatio" === value)
        {
            return window.devicePixelRatio ?? 1;
        }
        else
        {
            return value;
        }
    };
    let pitch = config.pitch.default;
    export const getPitch = (): number =>
        pitch;
    export const updatePitchRoundBar = () => updateRoundBar
    (
        pitchButton,
        {
            low: 0 /config.pitch.presets.length,
            high: config.pitch.presets.indexOf(pitch) /(config.pitch.presets.length -1),
            rotate: 0,
        }
    );
    export const togglePitch = (value?: boolean | typeof config.pitch.presets[number]) =>
    {
        const presets = config.pitch.presets;
        if (typeof value === "boolean" || undefined === value)
        {
            const currentIndex = presets.indexOf(pitch);
            const nextIndex = (presets.length +currentIndex + (false !== value ? 1: -1)) %presets.length;
            pitch = presets[nextIndex];
            // Model.setPitch(presets[nextIndex]);
        }
        else
        {
            // if (presets.includes(value))
            // {
                pitch = value;
            // }
        }
        updatePitchRoundBar();
        Url.addParameter("pitch", pitch.toString());
        console.log(`🎵 Pitch changed: ${pitch}`);
    }
    let watchRoundBarIndex = 0;
    export const updateWatchRoundBar = () => updateRoundBar
    (
        watchButton,
        {
            low: "none" === watchColor ? 1 /(WatchColorList.length -1) : 0,
            high: 1 /(WatchColorList.length -1),
            rotate: (watchRoundBarIndex -Math.floor(watchRoundBarIndex /WatchColorList.length) -1) /(WatchColorList.length -1),
        }
    );
    export const toggleWatchDisplay = (value?: boolean | WatchColor) =>
    {
        if (typeof value === "boolean" || undefined === value)
        {
            const currentIndex = WatchColorList.indexOf(watchColor);
            const nextIndex = (WatchColorList.length +currentIndex + (false !== value ? 1: -1)) %WatchColorList.length;
            watchColor = WatchColorList[nextIndex];
            watchRoundBarIndex += false !== value ? 1: -1;
        }
        else
        {
            if (WatchColorList.includes(value))
            {
                watchColor = value;
                watchRoundBarIndex = WatchColorList.indexOf(value);
            }
        }
        updateWatchVisibility();
        updateWatchRoundBar();
        Url.addParameter("watch", UI.watchColor);
        console.log(`🕰️ Watch changed: ${UI.watchColor}`);
    };
    export const toggleFpsDisplay = (value?: boolean | undefined) =>
    {
        if ("none" === fpsDiv.style.display || true === value)
        {
            fpsDiv.style.display = "block";
            fpsButton.classList.add("on");
        }
        else
        {
            fpsDiv.style.display = "none";
            fpsButton.classList.remove("on");
        }
        const showFps = "none" !== fpsDiv.style.display ? "true": "false";
        Url.addParameter("fps", showFps);
        console.log(`📊 FPS display toggled: ${showFps}`);
    }
    export const toggleFullScreen = () =>
    {
        const elem = document.documentElement;
        if (document.fullscreenEnabled)
        {
            if ( ! document.fullscreenElement)
            {
                elem.requestFullscreen();
            }
            else
            {
                document.exitFullscreen();
            }
        }
        else
        {
            if ((<any>document).webkitFullscreenEnabled)
            {
                if ( ! (<any>document).webkitFullscreenElement)
                {
                    (<any>elem).webkitRequestFullscreen();
                }
                else
                {
                    (<any>document).webkitExitFullscreen();
                }
            }
        }
    };
    export const updateFullscreenState = () =>
    {
        const isFullscreen = document.fullscreenElement || (<any>document).webkitFullscreenElement;
        fullscreenButton.classList.toggle("on", Boolean(isFullscreen));
        resize();
    };
    export class ToggleClassForWhileTimer
    {
        timer: ReturnType<typeof setTimeout> | undefined;
        constructor()
        {
            this.timer = undefined;
        }
        start(element: HTMLElement, token: string, span: number, onEnd?: () => unknown)
        {
            if (this.isInTimer())
            {
                clearTimeout(this.timer);
            }
            element.classList.toggle(token, true);
            this.timer = setTimeout
            (
                () =>
                {
                    // if (config.log["ToggleClassForWhileTimer.Timeout"])
                    // {
                    //     console.log("⌛️ ToggleClassForWhileTimer.Timeout", element, token, span);
                    // }
                    this.timer = undefined;
                    element.classList.toggle(token, false);
                    onEnd?.();
                },
                span
            );
        }
        isInTimer = () => undefined !== this.timer;
    }
    const mouseMoveTimer = new ToggleClassForWhileTimer();
    export const mousemove = () =>
        mouseMoveTimer.start(document.body, "mousemove", 3000);
    export const resize = () =>
    {
        // Fallback for older environments
        setStyle(document.documentElement, "--short-side", `${Math.min(window.innerWidth, window.innerHeight) /100}px`);
        //console.log(`🔄 Resize: ${window.innerWidth}x${window.innerHeight}`);
    };
    export const setTextContent = (element: HTMLElement, text: string) =>
    {
        if (element.textContent !== text)
        {
            element.textContent = text;
            return true;
        }
        return false;
    };
    export const setAttribute = (element: HTMLElement, name: string, value: string | undefined) =>
    {
        if ((element.getAttribute(name) ?? "") !== (value ?? ""))
        {
            if (undefined === value || null === value)
            {
                element.removeAttribute(name);
            }
            else
            {
                element.setAttribute(name, value);
            }
            return true;
        }
        return false;
    };
    export const setStyle = (element: HTMLElement, name: string, value: string | undefined) =>
    {
        if ((element.style.getPropertyValue(name) ?? "") !== (value ?? ""))
        {
            if (undefined === value || null === value || "" === value)
            {
                element.style.removeProperty(name);
            }
            else
            {
                element.style.setProperty(name, value);
            }
            return true;
        }
        return false;
    };
    export const initialize = () =>
    {
        fullscreenButton.style.display = fullscreenEnabled ? "block" : "none";
        setAriaHidden(fullscreenButton, ! fullscreenEnabled);
        updateFullscreenState();
        jumpOutButton.style.display = isInIframe ? "block" : "none";
        setAriaHidden(jumpOutButton, isInIframe);
        resize();
    };
}
