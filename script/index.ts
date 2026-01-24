import { Url } from "./url";
import { Model } from "./model";
// import { Color } from "./color";
import { Render } from "./render";
import { Fps } from "./fps";
import { UI } from "./ui";
import { Event } from "./event";
import { Watch } from "./watch";
//import config from "@resource/config.json";
Url.initialize();
Event.initialize();
UI.initialize();
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
