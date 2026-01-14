import { Model } from "./model";
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
    export const time = getElementById("time", "time");
    export const date = getElementById("time", "date");
    export const fpsDiv = getElementById("div", "fps");
    export const coloringButton = getElementById("button", "coloring-button");
    export const hdButton = getElementById("button", "hd-button");
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
    export type WatchColor = "none" | "white" | "black" | "rainbow";
    export const WatchColorList = [ "none", "white", "black", "rainbow" ] as const;
    export let watchColor: WatchColor = "none";
    export const updateWatchVisibility = () =>
    {
        if ("none" !== UI.watchColor)
        {
            WatchColorList.forEach
            (
                color => overlayPanel.classList.toggle(color, watchColor === color)
            );
            time.style.display = "block";
            date.style.display = "block";
            setAriaHidden(time, false);
            setAriaHidden(date, false);
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
        console.log("updateRoundBar", button, properties);
        /* For older environments where the 'initial-value' setting isn't supported, all values must be specified. */
        setStyle(button, "--low", properties.low.toFixed(3));
        setStyle(button, "--high", properties.high.toFixed(3));
        setStyle(button, "--rotate", properties.rotate.toFixed(3));
    };
    let coloringRoundBarIndex = 0;
    const mod = (n: number, m: number): number => ((n % m) + m) % m;
    export const updateColoringRoundBar = () =>
    {
        const keys = Object.keys(config.coloring).concat("random") as ColoringType[];
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
    };
    export type ColoringType = keyof typeof config["coloring"] | "random";
    export let coloring = "regular" as ColoringType;
    export const toggleColoring = (style?: boolean | keyof typeof config["coloring"]) =>
    {
        const keys = Object.keys(config.coloring).concat("random") as ColoringType[];
        if (typeof style === "boolean" || undefined === style)
        {
            const currentIndex = keys.indexOf(UI.coloring);
            const nextIndex = (keys.length +currentIndex + (false !== style ? 1: -1)) %keys.length;
            console.log({currentIndex, nextIndex, keysLength: keys.length, style});
            UI.coloring = keys[nextIndex];
            coloringRoundBarIndex += false !== style ? 1: -1;
        }
        else
        {
            if (keys.includes(style))
            {
                UI.coloring = style;
                coloringRoundBarIndex = keys.indexOf(style);
            }
        }
        updateColoringRoundBar();
        console.log(`🎨 Coloring changed: ${UI.coloring}`);
    };
    export const updateHdRoundBar = () => updateRoundBar
    (
        hdButton,
        {
            low: 0 /Model.PixelRatioModeKeys.length,
            high: Model.getPixcelRatioLevel() /Model.PixelRatioModeKeys.length,
            rotate: 0,
        }
    );
    export const updatePitchRoundBar = () => updateRoundBar
    (
        pitchButton,
        {
            low: 0 /config.pitch.presets.length,
            high: config.pitch.presets.indexOf(Model.Data.pitch) /(config.pitch.presets.length -1),
            rotate: 0,
        }
    );
    export const togglePitch = (value?: boolean | typeof config.pitch.presets[number]) =>
    {
        const presets = config.pitch.presets;
        if (typeof value === "boolean" || undefined === value)
        {
            const currentIndex = presets.indexOf(Model.Data.pitch);
            const nextIndex = (presets.length +currentIndex + (false !== value ? 1: -1)) %presets.length;
            Model.setPitch(presets[nextIndex]);
        }
        else
        {
            if (presets.includes(value))
            {
                Model.setPitch(value);
            }
        }
        updatePitchRoundBar();
        console.log(`🎵 Pitch changed: ${Model.Data.pitch}`);
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
        console.log(`🕰️ Watch changed: ${UI.watchColor}`);
    };
    export const toggleFpsDisplay = () =>
    {
        if ("none" === fpsDiv.style.display)
        {
            fpsDiv.style.display = "block";
            fpsButton.classList.add("on");
        }
        else
        {
            fpsDiv.style.display = "none";
            fpsButton.classList.remove("on");
        }
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
        console.log(`🔄 Resize: ${window.innerWidth}x${window.innerHeight}`);
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
}
