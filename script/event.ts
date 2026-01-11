import { Model } from "./model";
import { Render } from "./render";
import { UI } from "./ui";
export namespace Event
{
    export const initialize = () =>
    {
        document.addEventListener("fullscreenchange", UI.updateFullscreenState);
        document.addEventListener("webkitfullscreenchange", UI.updateFullscreenState);
        document.addEventListener("mousemove", UI.mousemove);
        document.addEventListener("resize", UI.resize);
        document.addEventListener("orientationchange", UI.resize);
        document.addEventListener
        (
            "keydown",
            (event) =>
            {
                switch(event.key.toUpperCase())
                {
                case "C":
                    UI.toggleStyle( ! event.shiftKey);
                    Render.updateStyleColors();
                    break;
                case "Q":
                    Model.togglePixelRatioMode( ! event.shiftKey);
                    UI.updateHdRoundBar();
                    break;
                case "W":
                    UI.toggleWatchDisplay( ! event.shiftKey);
                    break;
                case "S":
                    UI.toggleFpsDisplay();
                    break;
                case "F":
                    if (UI.fullscreenEnabled)
                    {
                        UI.toggleFullScreen();
                    }
                    break;
                }
                UI.mousemove();
            }
        );
        UI.stylesButton.addEventListener
        (
            "click",
            event =>
            {
                event.stopPropagation();
                UI.toggleStyle( ! event.shiftKey);
                Render.updateStyleColors();
            }
        );
        UI.hdButton.addEventListener
        (
            "click",
            event =>
            {
                event.stopPropagation();
                Model.togglePixelRatioMode( ! event.shiftKey);
                UI.updateHdRoundBar();
            }
        );
        UI.watchButton.addEventListener
        (
            "click",
            event =>
            {
                event.stopPropagation();
                UI.toggleWatchDisplay( ! event.shiftKey);
            }
        );
        UI.fpsButton.addEventListener
        (
            "click",
            event =>
            {
                event.stopPropagation();
                UI.toggleFpsDisplay();
            }
        );
        UI.fullscreenButton.addEventListener
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
        UI.jumpOutButton.addEventListener
        (
            "click",
            event =>
            {
                event.stopPropagation();
                window.open(window.location.href, "_blank");
            }
        );
    };
}
