import { Url } from "./url";
import { UI } from "./ui";
import config from "@resource/config.json";
export namespace Watch
{
    export const locale = Url.params["locale"] || navigator.language;
    const phi = (1 + Math.sqrt(5)) / 2;
    export const makeDate = (date: Date, locale: string): string =>
        date.toLocaleDateString
        (
            locale,
            config.watch.dateFormat as Intl.DateTimeFormatOptions
        );
    export const makeTime = (date: Date, locale: string): string =>
        date.toLocaleTimeString
        (
            locale,
            config.watch.timeFormat as Intl.DateTimeFormatOptions
        );
    export const setColor = (color: string | undefined): void =>
    {
        UI.setStyle(UI.date, "color", color);
        UI.setStyle(UI.time, "color", color);
    };
    export const update = (): void =>
    {
        if ("none" !== UI.watchColor)
        {
            const date = new Date();
            UI.setTextContent(UI.time, makeTime(date, locale));
            UI.setAttribute(UI.time, "datatime", makeTime(date, "ja-JP"));
            UI.setTextContent(UI.date, makeDate(date, locale));
            UI.setAttribute(UI.date, "datatime", date.toISOString().slice(0, 10));
            switch (UI.watchColor)
            {
                case "white":
                    setColor("white");
                    break;
                case "black":
                    setColor("black");
                    break;
                case "raindom":
                    setColor(`hsl(${(date.getTime() *360) / (24000 *phi)}, 100%, 50%)`);
                    break;
            }
        }
        else
        {
            UI.setTextContent(UI.time, "");
            UI.setAttribute(UI.time, "datatime", undefined);
            UI.setTextContent(UI.date, "");
            UI.setAttribute(UI.date, "datatime", undefined);
        }
    };
}
