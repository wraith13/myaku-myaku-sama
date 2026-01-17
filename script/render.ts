import { Geometry } from "./geometry";
import { Color } from "./color";
import { Model } from "./model";
import { UI } from "./ui";
export namespace Render
{
    const context = UI.canvas.getContext("2d") as CanvasRenderingContext2D;
    const mappingCircle = (parent: Model.Circle, circle: Model.Circle): Model.Circle =>
    ({
        x: (circle.x * parent.radius) + parent.x,
        y: (circle.y * parent.radius) + parent.y,
        radius: circle.radius *parent.radius,
    });
    // const remappingCircle = (parent: Model.Circle, circle: Model.Circle): Model.Circle =>
    // ({
    //     x: (circle.x -parent.x) /parent.radius,
    //     y: (circle.y -parent.y) /parent.radius,
    //     radius: circle.radius /parent.radius,
    // });
    // export const remappingPoint = (parent: Model.Circle, point: Geometry.Point): Geometry.Point =>
    // ({
    //     x: (point.x -parent.x) /parent.radius,
    //     y: (point.y -parent.y) /parent.radius,
    // });
    export const getCanvasCircle = (): Model.Circle =>
    ({
        x: UI.canvas.width / 2,
        y: UI.canvas.height / 2,
        radius: Math.hypot(UI.canvas.width, UI.canvas.height) /2,
    });
    // export const getWindowCircle = (): Model.Circle =>
    // ({
    //     x: window.innerWidth / 2,
    //     y: window.innerHeight / 2,
    //     radius: Math.hypot(window.innerWidth, window.innerHeight) /2,
    // });
    type FusionStatus = "none" | "wired" | "near" | "overlap" | "inclusion";
    const hasFusionPath = (fusionStatus: FusionStatus) =>
        [ "none", "inclusion" ].indexOf(fusionStatus) < 0;
    const isContacted = (fusionStatus: FusionStatus) =>
        0 <= [ "overlap", "inclusion" ].indexOf(fusionStatus);
    interface CirclesConnection
    {
        sumRadius: number;
        minRadius: number;
        wireLimit: number;
        fusionLimit: number;
        //angle: number;
        distance: number;
    }
    const getFusionStatus = (data: CirclesConnection): FusionStatus =>
    {
        if (data.fusionLimit < data.distance)
        {
            return "none";
        }
        if (data.wireLimit < data.distance)
        {
            return "wired";
        }
        if (data.sumRadius < data.distance)
        {
            return "near";
        }
        if (data.sumRadius -data.minRadius *2 < data.distance)
        {
            return "overlap";
        }
        return "inclusion";
    };
    const fusionLimitRate = 1.0;
    const wireLimitRate = 0.7;
    const minCurveAngleRate = 1.0;
    const drawFusionPath = (circles: Model.Circle[], color: string) =>
    {
        for (let i = 0; i < circles.length; i++)
        {
            for (let j = i + 1; j < circles.length; j++)
            {
                const a = circles[i];
                const b = circles[j];
                const sumRadius = a.radius +b.radius;
                const minRadius = Math.min(a.radius, b.radius);
                //const maxRadius = Math.max(a.radius, b.radius);
                const fusionLimit = sumRadius +(minRadius *fusionLimitRate);
                const wireLimit = sumRadius +(fusionLimit -sumRadius) *wireLimitRate;
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const angle = Math.atan2(dy, dx);
                const distance = Math.hypot(dx, dy);
                const fusionStatus = getFusionStatus({ sumRadius, minRadius, wireLimit, fusionLimit, distance, });
                if (hasFusionPath(fusionStatus))
                {
                    const contactAngle: number | null = isContacted(fusionStatus) ? Math.acos(distance / sumRadius): null;
                    const curveAngleRate = minCurveAngleRate *
                    (
                        isContacted(fusionStatus) ? 1:
                        Math.pow(((fusionLimit -sumRadius) -(distance -sumRadius)) /(fusionLimit -sumRadius), 0.3)
                    );
                    const minCurveAngle1 = curveAngleRate * minRadius /a.radius;
                    const minCurveAngle2 = curveAngleRate * minRadius /b.radius;
                    const theta1 = Math.min((contactAngle ?? 0) +minCurveAngle1, Math.PI -minCurveAngle1);
                    const theta2 = Math.min((contactAngle ?? 0) +minCurveAngle2, Math.PI -minCurveAngle2);

                    // 左タンジェント (tp1 on c1, tp3 on c2)
                    const tp1: Geometry.Point =
                    {
                        x: a.x + a.radius * Math.cos(angle + theta1),
                        y: a.y + a.radius * Math.sin(angle + theta1)
                    };
                    const tp3: Geometry.Point =
                    {
                        x: b.x + b.radius * Math.cos(angle + (Math.PI +theta2)),
                        y: b.y + b.radius * Math.sin(angle + (Math.PI +theta2))
                    };

                    // 右タンジェント (tp2 on c1, tp4 on c2)
                    const tp2: Geometry.Point =
                    {
                        x: a.x + a.radius * Math.cos(angle -theta1),
                        y: a.y + a.radius * Math.sin(angle -theta1)
                    };
                    const tp4: Geometry.Point =
                    {
                        x: b.x + b.radius * Math.cos(angle +(Math.PI -theta2)),
                        y: b.y + b.radius * Math.sin(angle +(Math.PI -theta2))
                    };
                    const cp0: Geometry.Point =
                    {
                        x: (tp1.x +tp2.x + tp3.x + tp4.x) /4,
                        y: (tp1.y +tp2.y + tp3.y + tp4.y) /4,
                    };
                    let cpRate: number = 0;;
                    //const surfaceDist = distance -sumRadius;
                    //const fusionSurfaceLimit = fusionLimit -sumRadius;
                    switch(fusionStatus)
                    {
                    case "near":
                        cpRate = sumRadius +minRadius <= distance ?
                            -Math.min(1, (distance -(sumRadius +minRadius)) / (fusionLimit - (sumRadius +minRadius))):
                            Math.min(1, (sumRadius +minRadius -distance) / (minRadius *2));
                        break;
                    case "overlap":
                        cpRate = Math.min(1, (sumRadius +minRadius -distance) / (minRadius *2));
                        break;
                    }
                    const cp1: Geometry.Point =
                    {
                        x: 0 <= cpRate ?
                            cp0.x *(1 -cpRate) + ((tp1.x +tp4.x) /2) *cpRate:
                            cp0.x *(1 +cpRate) + ((tp2.x +tp3.x) /2) *-cpRate,
                        y: 0 <= cpRate ?
                            cp0.y *(1 -cpRate) + ((tp1.y +tp4.y) /2) *cpRate:
                            cp0.y *(1 +cpRate) + ((tp2.y +tp3.y) /2) *-cpRate,
                    };
                    const cp2: Geometry.Point =
                    {
                        x: 0 <= cpRate ?
                            cp0.x *(1 -cpRate) + ((tp2.x +tp3.x) /2) *cpRate:
                            cp0.x *(1 +cpRate) + ((tp1.x +tp4.x) /2) *-cpRate,
                        y: 0 <= cpRate ?
                            cp0.y *(1 -cpRate) + ((tp2.y +tp3.y) /2) *cpRate:
                            cp0.y *(1 +cpRate) + ((tp1.y +tp4.y) /2) *-cpRate,
                    };

                    context.beginPath();

                    // 上側ベジェ: tp1 -> cp -> tp3 (cpは中点+オフセットで曲げ)
                    context.moveTo(tp1.x, tp1.y);
                    const wireLength = distance -wireLimit;
                    if (0 < wireLength) // == "wired" === fusionStatus
                    {
                        const wireWidthAdjustRate = 1.15;   // This adjustment is probably necessary because something is wrong somewhere,
                                                            // but I won't actively investigate the cause this time. (This isn't the only place where the animation isn't smooth.)
                                                            // If you want to smooth out this and other parts, first implement a verification mode
                                                            // that renders only two Units whose distance can be adjusted by the user.
                        const wireWidthRate = 1 - (wireLength /(fusionLimit -wireLimit));
                        const spikeMinHight = (Math.hypot(tp1.x -tp2.x, tp1.y -tp2.y) +Math.hypot(tp3.x -tp4.x, tp3.y -tp4.y)) /8;
                        const fusionLength = Math.hypot(tp1.x -tp4.x, tp1.y -tp4.y);
                        const wireLengthRate = ((fusionLength - spikeMinHight *2) *(1 - wireWidthRate)) /fusionLength;
                        const mp0a: Geometry.Point = Geometry.averagePoints([Geometry.mulPoint(Geometry.averagePoints([tp1, tp4]), wireWidthRate *wireWidthAdjustRate), Geometry.mulPoint(cp1, 2 -(wireWidthRate *wireWidthAdjustRate))]);
                        const mp1: Geometry.Point = Geometry.addPoints(mp0a, Geometry.mulPoint(Geometry.subPoints(tp1, tp4), wireLengthRate *0.5));
                        const cxp1: Geometry.Point = Geometry.addPoints(mp0a, Geometry.mulPoint(Geometry.subPoints(tp1, tp4), (2 -wireWidthRate) /4));
                        const cxp2: Geometry.Point = Geometry.addPoints(mp0a, Geometry.mulPoint(Geometry.subPoints(tp4, tp1), (2 -wireWidthRate) /4));
                        const mp2: Geometry.Point = Geometry.addPoints(mp0a, Geometry.mulPoint(Geometry.subPoints(tp4, tp1), wireLengthRate *0.5));
                        context.quadraticCurveTo(cxp1.x, cxp1.y, mp1.x, mp1.y);
                        context.lineTo(mp2.x, mp2.y);
                        context.quadraticCurveTo(cxp2.x, cxp2.y, tp4.x, tp4.y);

                        context.lineTo(tp3.x, tp3.y);

                        //const wireRate = wireLength / Math.hypot(tp3.x -tp2.x, tp3.y -tp2.y);
                        const mp0b: Geometry.Point = Geometry.averagePoints([Geometry.mulPoint(Geometry.averagePoints([tp3, tp2]), wireWidthRate *wireWidthAdjustRate), Geometry.mulPoint(cp2, 2 -(wireWidthRate *wireWidthAdjustRate))]);
                        const mp3: Geometry.Point = Geometry.addPoints(mp0b, Geometry.mulPoint(Geometry.subPoints(tp3, tp2), wireLengthRate *0.5));
                        const cxp3: Geometry.Point = Geometry.addPoints(mp0b, Geometry.mulPoint(Geometry.subPoints(tp3, tp2), (2 -wireWidthRate) /4));
                        const cxp4: Geometry.Point = Geometry.addPoints(mp0b, Geometry.mulPoint(Geometry.subPoints(tp2, tp3), (2 -wireWidthRate) /4));
                        const mp4: Geometry.Point = Geometry.addPoints(mp0b, Geometry.mulPoint(Geometry.subPoints(tp2, tp3), wireLengthRate *0.5));
                        context.quadraticCurveTo(cxp3.x, cxp3.y, mp3.x, mp3.y);
                        context.lineTo(mp4.x, mp4.y);
                        context.quadraticCurveTo(cxp4.x, cxp4.y, tp2.x, tp2.y);
                        //console.log({ wireRate, wireLength, distance, mp0a, mp1, cxp1, cxp2, mp2, mp0b, mp3, cxp3, cxp4, mp4, });
                    }
                    else
                    {
                        context.quadraticCurveTo(cp1.x, cp1.y, tp4.x, tp4.y);
                        context.lineTo(tp3.x, tp3.y);
                        context.quadraticCurveTo(cp2.x, cp2.y, tp2.x, tp2.y);
                    }

                    context.lineTo(tp1.x, tp1.y);

                    context.fillStyle = color;
                    // connection.fillStyle = "#00000088";
                    context.fill();
                    context.closePath();
                }
            }
        }
    };
    const drawCircle = (circle: Model.Circle, color: string) =>
    {
        if (0 <= circle.radius)
        {
            context.beginPath();
            context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
            context.fillStyle = color;
            context.fill();
            context.closePath();
        }
    };
    const drawLayer = (layer: Model.Layer, color: string, coloring: Color.Coloring) =>
    {
        const canvasCircle = getCanvasCircle();
        const bodies = layer.units.map(u => u.body)
            .filter(c => !Model.isOutOfCanvas(c))
            .map(c => mappingCircle(canvasCircle, c));
        drawFusionPath(bodies, color);
        bodies.forEach(body => drawCircle(body, color));
        if (layer === Model.Data.main)
        {
            const whites = layer.units
                .filter(u => undefined !== u.eye && ! Model.isOutOfCanvas(u.body))
                .map(u => mappingCircle(mappingCircle(canvasCircle, u.body), u.eye!.white));
            drawFusionPath(whites, coloring.base);
            whites.forEach(white => drawCircle(white, coloring.base));
            const irises = layer.units
                .filter(u => undefined !== u.eye && ! Model.isOutOfCanvas(u.body))
                .map(u => mappingCircle(mappingCircle(canvasCircle, u.body), u.eye!.iris));
            drawFusionPath(irises, coloring.accent);
            irises.forEach(iris => drawCircle(iris, coloring.accent));
        }
    };
    export const draw = (isUpdatedModel: boolean) =>
    {
        if (Color.isExpiredRandomColoring())
        {
            Color.updateColoring();
        }
        const coloring = Color.getCurrentColors();
        const isColoringChanged = ! Color.isSameColoring(Color.previousColors, coloring);
        if (isUpdatedModel || isColoringChanged)
        {
            Color.previousColors = coloring;
            context.fillStyle = coloring.base;
            context.fillRect(0, 0, UI.canvas.width, UI.canvas.height);
            drawLayer(Model.Data.accent, coloring.accent, coloring);
            drawLayer(Model.Data.main, coloring.main, coloring);
        }
    };
}
