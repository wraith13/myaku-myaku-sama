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
    export const make = (params: Record<string, string>) =>
    {
        const url = new URL(window.location.href.replace(/#/g, "?"));
        for (const [ key, value ] of Object.entries(params))
        {
            url.searchParams.set(key, value);
        }
        return url.toString().replace(/\?/g, "#");
    };
    export const addParameter = (params: Record<string, string>, key: string, value: string): Record<string, string> =>
    {
        params[key] = value;
        return params;
    };
    export const initialize = () =>
    {
    };
    export const params = parseParameter(window.location.href);
}
