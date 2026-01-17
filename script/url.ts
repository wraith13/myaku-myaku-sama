//import config from "@resource/config.json";
export namespace Url
{
    export const parseParameter = (url: string): Record<string, string> =>
    {
        const result: Record<string, string> = {};
        const urlObj = new URL(url.replace(/#/g, "?"));
        const params = urlObj.searchParams;
        params.forEach
        (
            (value, key) => result[key] = value
        );
        return result;
    };
    export const make = () =>
    {
        const url = new URL(window.location.href.replace(/#/g, "?"));
        for (const [ key, value ] of Object.entries(params))
        {
            url.searchParams.set(key, value);
        }
        return url.toString().replace(/\?/g, "#");
    };
    export const addParameter = (key: string, value: string): Record<string, string> =>
    {
        params[key] = value;
        pushUrl();
        return params;
    };
    const pushUrl = () =>
        window.history.replaceState({}, "", Url.make());
    export const initialize = () =>
    {
    };
    export const params = parseParameter(window.location.href);
}
