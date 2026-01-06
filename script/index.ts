//import { Comparer } from "./comparer";
import { Model } from "./model";
import { Render } from "./render";
import { Fps } from "./fps";
import config from "@resource/config.json";
const fpsDiv = document.getElementById("fps");
const controlPanelDiv = document.getElementById("control-panel");
const stylesButton = document.getElementById("styles-button");
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
        }
        else
        {
            fpsDiv.style.display = "none";
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
if (controlPanelDiv)
{
    const toggleControlPanelDisplay = (show?: boolean) =>
    {
        if (true === show || (undefined === show && "none" === controlPanelDiv.style.display))
        {
            controlPanelDiv.style.display = "flex";
        }
        else
        {
            controlPanelDiv.style.display = "none";
        }
    };
    toggleControlPanelDisplay(false);
    document.addEventListener("click", () => toggleControlPanelDisplay());
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if (" " === event.key.toLowerCase())
            {
                toggleControlPanelDisplay();
            }
        }
    );
}
if (stylesButton)
{
    const toggleStyle = (style?: boolean | keyof typeof config["styles"]) =>
    {
        if (typeof style === "boolean" || undefined === style)
        {
            const keys = Object.keys(config.styles) as (keyof typeof config["styles"])[];
            const currentIndex = keys.indexOf(Render.style);
            const nextIndex = (currentIndex + (false !== style ? 1: -1)) %keys.length;
            Render.style = keys[nextIndex];
        }
        else
        {
            if (Object.keys(config.styles).includes(style))
            {
                Render.style = style;
            }
        }
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
