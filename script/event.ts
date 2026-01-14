import { Model } from "./model";
import { Render } from "./render";
import { UI } from "./ui";
export namespace Event
{
    export const initialize = () =>
    {
        window.addEventListener("resize", UI.resize);
        window.addEventListener("orientationchange", UI.resize);
        document.addEventListener("fullscreenchange", UI.updateFullscreenState);
        document.addEventListener("webkitfullscreenchange", UI.updateFullscreenState);
        document.addEventListener("mousemove", UI.mousemove);
        const commandList: { key?: string, button: HTMLButtonElement, command: (event: KeyboardEvent | MouseEvent) => unknown }[] =
        [
            {
                key: "C",
                button: UI.coloringButton,
                command: event =>
                {
                    UI.toggleColoring( ! event.shiftKey);
                    Render.updateColoring();
                }
            },
            {
                key: "Q",
                button: UI.hdButton,
                command: event =>
                {
                    Model.togglePixelRatioMode( ! event.shiftKey);
                    UI.updateHdRoundBar();
                }
            },
            {
                key: "P",
                button: UI.pitchButton,
                command: event => UI.togglePitch( ! event.shiftKey),
            },
            {
                key: "W",
                button: UI.watchButton,
                command: event => UI.toggleWatchDisplay( ! event.shiftKey)
            },
            {
                key: "S",
                button: UI.fpsButton,
                command: () => UI.toggleFpsDisplay()
            },
            {
                key: "F",
                button: UI.fullscreenButton,
                command: () => UI.toggleFullScreen()
            },
            {
                button: UI.jumpOutButton,
                command: () => window.open(window.location.href, "_blank")
            }
        ];
        document.addEventListener
        (
            "keydown",
            (event) =>
            {
                if ( ! (event.metaKey || event.ctrlKey || event.altKey))
                {
                    const command = commandList.find(cmd => cmd.key === event.key.toUpperCase());
                    if (command)
                    {
                        event.preventDefault();
                        command.command(event);
                    }
                }
                UI.mousemove();
            }
        );
        commandList.forEach
        (
            command =>
            {
                command.button.addEventListener
                (
                    "click",
                    (event) =>
                    {
                        event.stopPropagation();
                        event.preventDefault();
                        command.command(event);
                        UI.mousemove();
                    }
                );
            }
        );
    };
}
