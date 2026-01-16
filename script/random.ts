export namespace Random
{
    export type Function = (index?: number, prime?: number) => number;
    export const makeInteger = (size: number, random: Function = () => Math.random(), index?: number, prime?: number) =>
        Math.floor(random(index, prime) *size);
    export const select = <T>(list: T[], random: Function = Math.random, index?: number, prime?: number): T =>
        list[makeInteger(list.length, random, index, prime)];
    export const pseudoGaussian = (samples: number = 6, random: Function = Math.random, index?: number, prime?: number): number =>
    {
        let total = 0;
        for (let i = 0; i < samples; i++)
        {
            total += random(undefined === index ? index: (index +i), prime);
        }
        return total / samples;
    };
}
