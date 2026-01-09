//import { Comparer } from "./comparer";
import { Model } from "./model";
import { Render } from "./render";
import { Fps } from "./fps";
import config from "@resource/config.json";
const stylesButton = document.getElementById("styles-button");
const hdButton = document.getElementById("hd-button");
const fpsDiv = document.getElementById("fps");
const fullscreenButton = document.getElementById("fullscreen-button");
const fpsButton = document.getElementById("fps-button");
const jumpOutButton = document.getElementById("jump-out-button");
console.log("Window loaded.");
const step = (timestamp: number) =>
{
    Model.updateData(timestamp);
    Render.draw();
    if (fpsDiv && fpsDiv.style.display !== "none")
    {
        Fps.step(timestamp);
        fpsDiv.innerText = Fps.getText();
    }
    window.requestAnimationFrame(step);
};
window.requestAnimationFrame(step);
const setAriaHidden = (element: HTMLElement, hidden: boolean) =>
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
const toggleFpsDisplay = () =>
{
    if (fpsDiv)
    {
        if ("none" === fpsDiv.style.display)
        {
            fpsDiv.style.display = "block";
            fpsButton?.classList.add("on");
        }
        else
        {
            fpsDiv.style.display = "none";
            fpsButton?.classList.remove("on");
        }
    }
}
if (fpsDiv)
{
    fpsDiv.style.display = "none";
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if ("s" === event.key.toLowerCase())
            {
                toggleFpsDisplay();
            }
        }
    );
}
const fullscreenEnabled = document.fullscreenEnabled || (<any>document).webkitFullscreenEnabled;
const toggleFullScreen = () =>
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
if (fullscreenEnabled)
{
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if ("f" === event.key.toLowerCase())
            {
                toggleFullScreen();
            }
        }
    );
}
let styleRoundBarIndex = 0;
const updateStyleRoundBar = () =>
{
    if (stylesButton)
    {
        const keys = Object.keys(config.styles) as (keyof typeof config["styles"])[];
        //stylesButton.style.setProperty("--low", `${styleRoundBarIndex /keys.length}`);
        stylesButton.style.setProperty("--high", `${1 /keys.length}`);
        stylesButton.style.setProperty("--rotate", `${styleRoundBarIndex /keys.length}`);
    }
};
updateStyleRoundBar();
if (stylesButton)
{
    const toggleStyle = (style?: boolean | keyof typeof config["styles"]) =>
    {
        const keys = Object.keys(config.styles) as (keyof typeof config["styles"])[];
        if (typeof style === "boolean" || undefined === style)
        {
            const currentIndex = keys.indexOf(Render.style);
            const nextIndex = (keys.length +currentIndex + (false !== style ? 1: -1)) %keys.length;
            console.log({currentIndex, nextIndex, keysLength: keys.length, style});
            Render.style = keys[nextIndex];
            styleRoundBarIndex += false !== style ? 1: -1;
        }
        else
        {
            if (Object.keys(config.styles).includes(style))
            {
                Render.style = style;
                styleRoundBarIndex = keys.indexOf(style);
            }
        }
        updateStyleRoundBar();
        console.log(`🎨 Style changed: ${Render.style}`);
    };
    stylesButton.addEventListener
    (
        "click",
        event =>
        {
            event.stopPropagation();
            toggleStyle( ! event.shiftKey);
        }
    );
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if ("c" === event.key.toLowerCase())
            {
                toggleStyle( ! event.shiftKey);
            }
        }
    );
}
const updateHdRoundBar = () =>
{
    if (hdButton)
    {
        hdButton.style.setProperty("--high", `${Model.getPixcelRatioLevel() /Model.PixelRatioModeKeys.length}`);
    }
};
updateHdRoundBar();
if (hdButton)
{
    hdButton.addEventListener
    (
        "click",
        event =>
        {
            event.stopPropagation();
            Model.togglePixelRatioMode( ! event.shiftKey);
            updateHdRoundBar();
        }
    );
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if ("q" === event.key.toLowerCase())
            {
                Model.togglePixelRatioMode( ! event.shiftKey);
                updateHdRoundBar();
            }
        }
    );
}
if (fpsButton && fpsDiv)
{
    fpsButton.addEventListener
    (
        "click",
        event =>
        {
            event.stopPropagation();
            toggleFpsDisplay();
        }
    );
};
if (fullscreenButton)
{
    fullscreenButton.style.display = fullscreenEnabled ? "block" : "none";
    setAriaHidden(fullscreenButton, ! fullscreenEnabled);
    fullscreenButton.addEventListener
    (
        "click",
        event =>
        {
            event.stopPropagation();
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
        }
    );
}
const updateFullscreenState = () =>
{
    if (fullscreenButton)
    {
        const isFullscreen = document.fullscreenElement || (<any>document).webkitFullscreenElement;
        fullscreenButton.classList.toggle("on", Boolean(isFullscreen));
    }
};
document.addEventListener("fullscreenchange", updateFullscreenState);
document.addEventListener("webkitfullscreenchange", updateFullscreenState);
updateFullscreenState();
if (jumpOutButton)
{
    const isInIframe = window.top !== window.self;
    jumpOutButton.style.display = isInIframe ? "block" : "none";
    setAriaHidden(jumpOutButton, isInIframe);
    jumpOutButton.addEventListener
    (
        "click",
        event =>
        {
            event.stopPropagation();
            window.open(window.location.href, "_blank");
        }
);
}
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
document.addEventListener
(
    "mousemove",
    (_event) =>
    {
        mousemove();
    }
);
console.log("Canvas initialized.");
