import { Url } from "./url";
import { UI } from "./ui";
import { Random } from "./random";
import { FlounderStyle } from "flounder.style.js";
import config from "@resource/config.json";
export namespace Watch
{
    export const locale = Url.get("locale") || navigator.language;
    const phi = (1 + Math.sqrt(5)) / 2;
    export const makeDate = (date: Date, locale: string): string =>
        date.toLocaleDateString
        (
            locale,
            config.watch.dateFormat as Intl.DateTimeFormatOptions
        );
    export const makeDateYyyymmw = (date: Date, locale: string): string =>
        date.toLocaleDateString
        (
            locale,
            config.watch.dateYyyymmwFormat as Intl.DateTimeFormatOptions
        );
    export const makeDateDd = (date: Date, locale: string): string =>
        new Intl.DateTimeFormat(locale, { "day": "numeric" }).formatToParts(date).filter(part => "day" === part.type).map(part => part.value).join("");;
    export const makeTime = (date: Date, locale: string): string =>
        date.toLocaleTimeString
        (
            locale,
            config.watch.timeFormat as Intl.DateTimeFormatOptions
        );
    let patternCount = 0;
    let currentPatternStartAt = 0;
    let currentPattern: FlounderStyle.Type.Arguments | null = null;
    export const makePattern = (date: Date) =>
    {
        const now = date.getTime();
        if (null === currentPattern || config.watch.patternSpan <= now -currentPatternStartAt)
        {
            const type = "stripe";
            const foregroundColor = "white";
            const diagonal = Math.hypot(window.innerWidth, window.innerHeight) /100;
            const intervalSize = diagonal *(3 +Random.makeInteger(30));
            currentPattern =
            {
                type,
                layoutAngle: Math.random(),
                foregroundColor,
                intervalSize,
                depth: 0.0,
                maxPatternSize: Random.select([ undefined, intervalSize /(2 +Random.makeInteger(9)), ]),
                anglePerDepth: Random.select([ undefined, "auto", "-auto", ]),
                //maximumFractionDigits: getEnoughPatternFractionDigits(),
            };
            ++patternCount;
            currentPatternStartAt = now;
        }
        const step = (now -currentPatternStartAt) /config.watch.patternSpan;
        // In flounder.style.js, when depth is 0 or 1 only the background-color is produced and no pattern is generated, so avoid 0.
        currentPattern.depth = Math.min
        (
            1 -config.watch.minPatternDepth,
            Math.max
            (
                config.watch.minPatternDepth,
                1 === (patternCount % 2) ? step : 1 -step
            )
        );
        return currentPattern;
    };
    export const backgroundToMask = (backgroundStyle: FlounderStyle.Style): FlounderStyle.Style =>
    {
        const maskStyle: FlounderStyle.Style =
        {
            //"mask-color": backgroundStyle["background-color"],
            "mask-image": backgroundStyle["background-image"],
            "mask-size": backgroundStyle["background-size"],
            "mask-position": backgroundStyle["background-position"],
        };
        return maskStyle;
    };
    export const setColor = (color: string | undefined): void =>
    {
        UI.setStyle(UI.date2, "color", color);
        UI.setStyle(UI.time, "color", color);
        UI.setStyle(UI.date, "color", color);
    };
    export const update = (): void =>
    {
        if ("none" !== UI.watchColor)
        {
            const date = new Date();
            UI.setTextContent(UI.time, makeTime(date, locale));
            UI.setAttribute(UI.time, "datatime", makeTime(date, "ja-JP"));
            const datetime = date.toISOString().slice(0, 10);
            if (UI.isWatchStyle2())
            {
                UI.setTextContent(UI.yyyymmw, makeDateYyyymmw(date, locale));
                UI.setTextContent(UI.dd, makeDateDd(date, locale));
                UI.setAttribute(UI.date2, "datatime", datetime);
            }
            else
            {
                UI.setTextContent(UI.date, makeDate(date, locale));
                UI.setAttribute(UI.date, "datatime", datetime);
            }
            switch (UI.getPrimaryWatchColor())
            {
                case "white":
                    setColor("white");
                    break;
                case "black":
                    setColor("black");
                    break;
                case "zebra":
                    setColor("white");
                    FlounderStyle.setStyle
                    (
                        UI.pattern,
                        backgroundToMask(FlounderStyle.makeStyle(makePattern(date)))
                    );
                    break;
                case "rainbow":
                    setColor(`hsl(${((date.getTime() *360) / (24000 *phi)).toFixed(2)}deg, 100%, 61%)`);
                    setColor(`oklch(70% 0.18 ${((date.getTime() *360) / (24000 *phi)).toFixed(2)}deg)`);
                    break;
            }
        }
        else
        {
            UI.setTextContent(UI.yyyymmw, "");
            UI.setTextContent(UI.dd, "");
            UI.setAttribute(UI.date2, "datatime", undefined);
            UI.setTextContent(UI.time, "");
            UI.setAttribute(UI.time, "datatime", undefined);
            UI.setTextContent(UI.date, "");
            UI.setAttribute(UI.date, "datatime", undefined);
        }
    };
}
