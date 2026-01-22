import { Url } from "./url";
import { Model } from "./model";
import { Color } from "./color";
import { Render } from "./render";
import { Fps } from "./fps";
import { UI } from "./ui";
import { Event } from "./event";
import { Watch } from "./watch";
import config from "@resource/config.json";
Url.initialize();
Event.initialize();
//console.log("URL Parameters:", Url.params);
if (Url.params["coloring"])
{
    //console.log(`🎨 Coloring from URL parameter: ${Url.params["coloring"]}`);
    UI.toggleColoring(Url.params["coloring"] as keyof typeof config.coloring);
    Color.updateColoring();
}
else
{
    //console.log("🎨 Default coloring");
    UI.updateColoringRoundBar();
}
if (UI.PixelRatioModeKeys.includes(Url.params["quality"] as UI.PixelRatioMode))
{
    //console.log(`🖼️ Quality from URL parameter: ${Url.params["quality"]}`);
    UI.toggleQuality(Url.params["quality"] as UI.PixelRatioMode);
    Model.updateStretch();
}
else
{
    //console.log("🖼️ Default quality");
    UI.updateQualityRoundBar();
}
if (Url.params["pitch"] && ! isNaN(Number(Url.params["pitch"])))
{
    //console.log(`🎵 Pitch from URL parameter: ${Url.params["pitch"]}`);
    UI.togglePitch(Number(Url.params["pitch"]));
    Model.setPitch(UI.getPitch());
}
else
{
    //console.log("🎵 Default pitch");
    UI.updatePitchRoundBar();
}
if (UI.WatchColorList.includes(Url.params["watch"] as UI.WatchColor))
{
    //console.log(`⌚ Watch display from URL parameter: ${Url.params["watch"]}`);
    UI.toggleWatchDisplay(Url.params["watch"] as UI.WatchColor);
}
else
{
    //console.log("⌚ Default watch display");
    UI.updateWatchVisibility();
}
if ("true" === Url.params["fps"])
{
    //console.log("⚡ FPS display from URL parameter: true");
    UI.toggleFpsDisplay(true);
}
else
{
    //console.log("⚡ Default FPS display");
    UI.fpsDiv.style.display = "none";
}
UI.fullscreenButton.style.display = UI.fullscreenEnabled ? "block" : "none";
UI.setAriaHidden(UI.fullscreenButton, ! UI.fullscreenEnabled);
UI.updateFullscreenState();
UI.jumpOutButton.style.display = UI.isInIframe ? "block" : "none";
UI.setAriaHidden(UI.jumpOutButton, UI.isInIframe);
UI.resize();
const step = (timestamp: number) =>
{
    Render.draw(Model.updateData(timestamp));
    Watch.update();
    if (UI.fpsDiv.style.display !== "none")
    {
        Fps.step(timestamp);
        UI.fpsDiv.innerText = Fps.getText();
    }
    window.requestAnimationFrame(step);
};
window.requestAnimationFrame(step);
