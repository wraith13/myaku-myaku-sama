import { Model } from "./model";
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
                if ("s" === event.key.toLowerCase())
                {
                    UI.toggleFpsDisplay();
                }
            }
        );
        if (UI.fullscreenEnabled)
        {
            document.addEventListener
            (
                "keydown",
                (event) =>
                {
                    if ("f" === event.key.toLowerCase())
                    {
                        UI.toggleFullScreen();
                    }
                }
            );
        }
        UI.stylesButton.addEventListener
        (
            "click",
            event =>
            {
                event.stopPropagation();
                UI.toggleStyle( ! event.shiftKey);
            }
        );
        document.addEventListener
        (
            "keydown",
            (event) =>
            {
                if ("c" === event.key.toLowerCase())
                {
                    UI.toggleStyle( ! event.shiftKey);
                }
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
        document.addEventListener
        (
            "keydown",
            (event) =>
            {
                if ("q" === event.key.toLowerCase())
                {
                    Model.togglePixelRatioMode( ! event.shiftKey);
                    UI.updateHdRoundBar();
                }
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
        document.addEventListener
        (
            "keydown",
            (event) =>
            {
                if ("w" === event.key.toLowerCase())
                {
                    UI.toggleWatchDisplay( ! event.shiftKey);
                }
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
