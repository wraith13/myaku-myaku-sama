import { Url } from "./url";
import { Model } from "./model";
import { Render } from "./render";
import { Fps } from "./fps";
import { UI } from "./ui";
import { Event } from "./event";
import { Watch } from "./watch";
Url.initialize();
Event.initialize();
UI.fpsDiv.style.display = "none";
UI.updateStyleRoundBar();
UI.updateHdRoundBar();
UI.updateWatchVisibility();
UI.fullscreenButton.style.display = UI.fullscreenEnabled ? "block" : "none";
UI.setAriaHidden(UI.fullscreenButton, ! UI.fullscreenEnabled);
UI.updateFullscreenState();
UI.jumpOutButton.style.display = UI.isInIframe ? "block" : "none";
UI.setAriaHidden(UI.jumpOutButton, UI.isInIframe);
UI.resize();
const step = (timestamp: number) =>
{
    Model.updateData(timestamp);
    Render.draw();
    Watch.update();
    if (UI.fpsDiv.style.display !== "none")
    {
        Fps.step(timestamp);
        UI.fpsDiv.innerText = Fps.getText();
    }
    window.requestAnimationFrame(step);
};
window.requestAnimationFrame(step);
