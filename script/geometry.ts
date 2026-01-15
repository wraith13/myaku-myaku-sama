export namespace Geometry
{
    export interface Point
    {
        x: number;
        y: number;
    };
    export const addPoints = (a: Point, b: Point): Point =>
    ({
        x: a.x + b.x,
        y: a.y + b.y,
    });
    export const subPoints = (a: Point, b: Point): Point =>
    ({
        x: a.x - b.x,
        y: a.y - b.y,
    });
    export const mulPoint = (a: Point, b: number): Point =>
    ({
        x: a.x *b,
        y: a.y *b,
    });
    export const averagePoints = (points: Point[]): Point =>
        mulPoint(points.reduce(addPoints, { x: 0, y: 0, }), 1 / points.length);
}
