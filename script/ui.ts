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
    export const stylesButton = getElementById("button", "styles-button");
    export const hdButton = getElementById("button", "hd-button");
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
    export type WatchColor = "none" | "white" | "black" | "raindom";
    export const WatchColorList = [ "none", "white", "black", "raindom" ] as const;
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
    let watchRoundBarIndex = 0;
    export const updateWatchRoundBar = () =>
    {
        //stylesButton.style.setProperty("--low", `${watchRoundBarIndex /WatchColorList.length}`);
        if ("none" === watchColor)
        {
            watchButton.style.setProperty("--low", `${1 /(WatchColorList.length -1)}`);
        }
        else
        {
            watchButton.style.setProperty("--low", "0");
        }
        watchButton.style.setProperty("--high", `${1 /(WatchColorList.length -1)}`);
        watchButton.style.setProperty("--rotate", `${(watchRoundBarIndex -Math.floor(watchRoundBarIndex /WatchColorList.length) -1) /(WatchColorList.length -1)}`);
    };
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
    };
    let styleRoundBarIndex = 0;
    export const updateStyleRoundBar = () =>
    {
        const keys = Object.keys(config.styles) as (keyof typeof config["styles"])[];
        //stylesButton.style.setProperty("--low", `${styleRoundBarIndex /keys.length}`);
        stylesButton.style.setProperty("--high", `${1 /keys.length}`);
        stylesButton.style.setProperty("--rotate", `${styleRoundBarIndex /keys.length}`);
    };
    export let style = "regular" as keyof typeof config["styles"];
    export const toggleStyle = (style?: boolean | keyof typeof config["styles"]) =>
    {
        const keys = Object.keys(config.styles) as (keyof typeof config["styles"])[];
        if (typeof style === "boolean" || undefined === style)
        {
            const currentIndex = keys.indexOf(UI.style);
            const nextIndex = (keys.length +currentIndex + (false !== style ? 1: -1)) %keys.length;
            console.log({currentIndex, nextIndex, keysLength: keys.length, style});
            UI.style = keys[nextIndex];
            styleRoundBarIndex += false !== style ? 1: -1;
        }
        else
        {
            if (keys.includes(style))
            {
                UI.style = style;
                styleRoundBarIndex = keys.indexOf(style);
            }
        }
        updateStyleRoundBar();
        console.log(`🎨 Style changed: ${UI.style}`);
    };
    export const updateHdRoundBar = () =>
    {
        hdButton.style.setProperty("--high", `${Model.getPixcelRatioLevel() /Model.PixelRatioModeKeys.length}`);
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
