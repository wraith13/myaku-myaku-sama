export namespace Random
{
    export type Function = (index?: number, prime?: number) => number;
    export const makeInteger = (size: number, random: Function = () => Math.random(), index?: number, prime?: number) =>
        Math.floor(random(index, prime) *size);
    export const select = <T>(list: T[], random: Function = Math.random, index?: number, prime?: number): T =>
        list[makeInteger(list.length, random, index, prime)];
}