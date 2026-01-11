import { Model } from "./model";
import { Render } from "./render";
import { UI } from "./ui";
export namespace Event
{
    export const initialize = () =>
    {
        document.addEventListener
        (
            "keydown",
            (event) =>
            {
                switch(event.key.toLowerCase())
                {
                case "c":
                    UI.toggleStyle( ! event.shiftKey);
                    Render.updateStyleColors();
                    break;
                case "q":
                    Model.togglePixelRatioMode( ! event.shiftKey);
                    UI.updateHdRoundBar();
                    break;
                case "w":
                    UI.toggleWatchDisplay( ! event.shiftKey);
                    break;
                case "s":
                    UI.toggleFpsDisplay();
                    break;
                case "f":
                    if (UI.fullscreenEnabled)
                    {
                        UI.toggleFullScreen();
                    }
                    break;
                }
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
        document.addEventListener("fullscreenchange", UI.updateFullscreenState);
        document.addEventListener("webkitfullscreenchange", UI.updateFullscreenState);
        UI.jumpOutButton.addEventListener
        (
            "click",
            event =>
            {
                event.stopPropagation();
                window.open(window.location.href, "_blank");
            }
        );
        document.addEventListener
        (
            "mousemove",
            _event => UI.mousemove()
        );
    };
}
