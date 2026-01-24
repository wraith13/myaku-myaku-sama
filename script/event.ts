import { Url } from "./url";
import { Model } from "./model";
import { Color } from "./color";
import { UI } from "./ui";
import config from "@resource/config.json";
export namespace Event
{
    export const loadFromUrlParameters = () =>
    {
        //console.log("URL Parameters:", Url.params);
        if (Url.get("coloring"))
        {
            //console.log(`🎨 Coloring from URL parameter: ${Url.params["coloring"]}`);
            UI.toggleColoring(Url.get("coloring") as string as keyof typeof config.coloring);
            Color.updateColoring();
        }
        else
        {
            //console.log("🎨 Default coloring");
            UI.updateColoringRoundBar();
        }
        if (UI.PixelRatioModeKeys.includes(Url.get("quality") as UI.PixelRatioMode))
        {
            //console.log(`🖼️ Quality from URL parameter: ${Url.params["quality"]}`);
            UI.toggleQuality(Url.get("quality") as UI.PixelRatioMode);
            Model.updateStretch();
        }
        else
        {
            //console.log("🖼️ Default quality");
            UI.updateQualityRoundBar();
        }
        if (Url.get("pitch") && ! isNaN(Number(Url.get("pitch"))))
        {
            //console.log(`🎵 Pitch from URL parameter: ${Url.params["pitch"]}`);
            UI.togglePitch(Number(Url.get("pitch")));
            Model.setPitch(UI.getPitch());
        }
        else
        {
            //console.log("🎵 Default pitch");
            UI.updatePitchRoundBar();
        }
        if (UI.WatchColorList.includes(Url.get("watch") as UI.WatchColor))
        {
            //console.log(`⌚ Watch display from URL parameter: ${Url.params["watch"]}`);
            UI.toggleWatchDisplay(Url.get("watch") as UI.WatchColor);
        }
        else
        {
            //console.log("⌚ Default watch display");
            UI.updateWatchVisibility();
        }
        if ("true" === Url.get("fps"))
        {
            //console.log("⚡ FPS display from URL parameter: true");
            UI.toggleFpsDisplay(true);
        }
        else
        {
            //console.log("⚡ Default FPS display");
            UI.fpsDiv.style.display = "none";
        }
    }
    export const initialize = () =>
    {
        window.addEventListener
        (
            "hashchange", () =>
            {
                Url.reloadParameters();
                loadFromUrlParameters();
            }
        );
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
                    Color.updateColoring();
                }
            },
            {
                key: "Q",
                button: UI.qualityButton,
                command: event =>
                {
                    UI.toggleQuality( ! event.shiftKey);
                    Model.updateStretch();
                }
            },
            {
                key: "P",
                button: UI.pitchButton,
                command: event =>
                {
                    UI.togglePitch( ! event.shiftKey);
                    Model.setPitch(UI.getPitch());
                },
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
        loadFromUrlParameters();
    };
}
