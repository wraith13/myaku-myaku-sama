//import { Comparer } from "./comparer";
import { Model } from "./model";
import { Render } from "./render";
import { Fps } from "./fps";
import config from "@resource/config.json";
const fpsDiv = document.getElementById("fps");
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
if (document.fullscreenEnabled || (<any>document).webkitFullscreenEnabled)
{
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if ("f" === event.key.toLowerCase())
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
            }
        }
    );
}
if (fpsDiv)
{
    //fpsDiv.style.display = "none";
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if ("s" === event.key.toLowerCase())
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
    );
}
document.addEventListener
(
    "click",
    () =>
    {
        const keys = Object.keys(config.coloring) as (keyof typeof config["coloring"])[];
        const currentIndex = keys.indexOf(Render.style);
        const nextIndex = (currentIndex + 1) %keys.length;
        Render.style = keys[nextIndex];
        console.log(`🎨 Style changed: ${Render.style}`);
    }
);
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
