//import { Comparer } from "./comparer";
import { Model } from "./model";
import { Render } from "./render";
import { Fps } from "./fps";
import config from "@resource/config.json";
const fpsDiv = document.getElementById("fps");
const controlPanelDiv = document.getElementById("control-panel");
const stylesButton = document.getElementById("styles-button");
const fullScreenButton = document.getElementById("full-screen-button");
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
    controlPanelDiv.style.display = "none";
    document.addEventListener
    (
        "click",
        () =>
        {
            if ("none" === controlPanelDiv.style.display)
            {
                controlPanelDiv.style.display = "flex";
            }
            else
            {
                controlPanelDiv.style.display = "none";
            }
        }
    );
}
if (stylesButton)
{
    stylesButton.addEventListener
    (
        "click",
        event =>
        {
            event.stopPropagation();
            const keys = Object.keys(config.styles) as (keyof typeof config["styles"])[];
            const currentIndex = keys.indexOf(Render.style);
            const nextIndex = (currentIndex + 1) %keys.length;
            Render.style = keys[nextIndex];
            console.log(`🎨 Style changed: ${Render.style}`);
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
if (fullScreenButton)
{
    fullScreenButton.style.display = fullscreenEnabled ? "block" : "none";
    fullScreenButton.addEventListener
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
    jumpOutButton.style.display = window.top !== window.self ? "block" : "none";
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
