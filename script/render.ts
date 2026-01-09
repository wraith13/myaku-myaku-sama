import { Model } from "./model";
import config from "@resource/config.json";
export namespace Render
{
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    export let style = "regular" as keyof typeof config["styles"];
    type FusionStatus = "none" | "near" | "overlap" | "inclusion";
    const hasFusionPath = (fusionStatus: FusionStatus) =>
        [ "none", "inclusion" ].indexOf(fusionStatus) < 0;
    const isContacted = (fusionStatus: FusionStatus) =>
        0 <= [ "overlap", "inclusion" ].indexOf(fusionStatus);
    interface CirclesConnection
    {
        sumRadius: number;
        minRadius: number;
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
    const fusionLimitRate = 3;
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
                const maxRadius = Math.min(a.radius, b.radius);
                const fusionLimit = sumRadius +Math.min(minRadius *fusionLimitRate, maxRadius);
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const angle = Math.atan2(dy, dx);
                const distance = Math.hypot(dx, dy);
                const fusionStatus = getFusionStatus({ sumRadius, minRadius, fusionLimit, distance, });
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
                    const tp1: Model.Point =
                    {
                        x: a.x + a.radius * Math.cos(angle + theta1),
                        y: a.y + a.radius * Math.sin(angle + theta1)
                    };
                    const tp3: Model.Point =
                    {
                        x: b.x + b.radius * Math.cos(angle + (Math.PI +theta2)),
                        y: b.y + b.radius * Math.sin(angle + (Math.PI +theta2))
                    };

                    // 右タンジェント (tp2 on c1, tp4 on c2)
                    const tp2: Model.Point =
                    {
                        x: a.x + a.radius * Math.cos(angle -theta1),
                        y: a.y + a.radius * Math.sin(angle -theta1)
                    };
                    const tp4: Model.Point =
                    {
                        x: b.x + b.radius * Math.cos(angle +(Math.PI -theta2)),
                        y: b.y + b.radius * Math.sin(angle +(Math.PI -theta2))
                    };
                    const cp0: Model.Point =
                    {
                        x: (tp1.x +tp2.x + tp3.x + tp4.x) /4,
                        y: (tp1.y +tp2.y + tp3.y + tp4.y) /4,
                    };

                    // const cpRate = sumRadius +minRadius <= distance ? 0:
                    //     Math.min(1, (sumRadius +minRadius -distance) / (minRadius *2));
                    // const cp1: Model.Point =
                    // {
                    //     x: cp0.x *(1 -cpRate) + ((tp1.x +tp4.x) /2) *cpRate,
                    //     y: cp0.y *(1 -cpRate) + ((tp1.y +tp4.y) /2) *cpRate,
                    // };
                    // const cp2: Model.Point =
                    // {
                    //     x: cp0.x *(1 -cpRate) + ((tp2.x +tp3.x) /2) *cpRate,
                    //     y: cp0.y *(1 -cpRate) + ((tp2.y +tp3.y) /2) *cpRate,
                    // };


                    // // const contactDist = fusionLimit; //sumRadius +minRadius;
                    // // const surfaceDist = distance -sumRadius;
                    // // const fusionSurfaceLimit = fusionLimit -sumRadius;
                    
                    // // const cpRate = contactDist <= distance ? 1:
                    // //     //Math.min(1, (contactDist -distance) / (minRadius *2));
                    // //     fusionSurfaceLimit /2 <= surfaceDist ?
                    // //         Math.min(1, (surfaceDist -(fusionSurfaceLimit /2)) / (fusionSurfaceLimit /2)):
                    // //         0;
                    let cpRate: number = 0;;
                    //const surfaceDist = distance -sumRadius;
                    //const fusionSurfaceLimit = fusionLimit -sumRadius;
                    switch(fusionStatus)
                    {
                    case "near":
                        cpRate = sumRadius +minRadius <= distance  ?
                            -Math.min(1, (distance -(sumRadius +minRadius)) / (fusionLimit - (sumRadius +minRadius))):
                            Math.min(1, (sumRadius +minRadius -distance) / (minRadius *2));
                        break;
                    case "overlap":
                        cpRate = Math.min(1, (sumRadius +minRadius -distance) / (minRadius *2));
                        break;
                    }
                    const cp1: Model.Point =
                    {
                        x: 0 <= cpRate ?
                            cp0.x *(1 -cpRate) + ((tp1.x +tp4.x) /2) *cpRate:
                            cp0.x *(1 +cpRate) + ((tp2.x +tp3.x) /2) *-cpRate,
                        y: 0 <= cpRate ?
                            cp0.y *(1 -cpRate) + ((tp1.y +tp4.y) /2) *cpRate:
                            cp0.y *(1 +cpRate) + ((tp2.y +tp3.y) /2) *-cpRate,
                    };
                    const cp2: Model.Point =
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
                    context.quadraticCurveTo(cp1.x, cp1.y, tp4.x, tp4.y);  // またはbezierCurveToでcubic

                    // 下側ベジェ: tp2 -> cp -> tp4
                    context.lineTo(tp3.x, tp3.y);
                    context.quadraticCurveTo(cp2.x, cp2.y, tp2.x, tp2.y);
                    context.lineTo(tp1.x, tp1.y);

                    context.fillStyle = color;
                    // connection.fillStyle = "#00000088";
                    context.fill();
                    context.closePath();


            // connection.beginPath();
            // connection.arc(tangents.tp1.x, tangents.tp1.y, 4, 0, Math.PI * 2);
            // connection.arc(tangents.tp2.x, tangents.tp2.y, 4, 0, Math.PI * 2);
            // connection.arc(tangents.tp3.x, tangents.tp3.y, 4, 0, Math.PI * 2);
            // connection.arc(tangents.tp4.x, tangents.tp4.y, 4, 0, Math.PI * 2);
            // connection.fillStyle = "#00000088";
            // connection.fill();
            // connection.closePath();

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
    const drawLayer = (layer: Model.Layer, color: string) =>
    {
        const shortSide = Math.min(canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const bodies = layer.units.map(u => u.body)
            // .concat([ { x: 0, y: 0, radius: 0.1, } ])
            .filter(c => !Model.isOutOfCanvas(c))
            .map
            (
                c =>
                ({
                    x: (c.x * shortSide) + centerX,
                    y: (c.y * shortSide) + centerY,
                    radius: c.radius *shortSide,
                })
            );
        drawFusionPath(bodies, color);
        bodies.forEach(body => drawCircle(body, color));
        if (layer === Model.Data.main)
        {
            const whites = layer.units
                .filter(u => undefined !== u.eye && ! Model.isOutOfCanvas(u.eye.white))
                .map
                (
                    u =>
                    ({
                        x: ((u.body.x +(u.eye!.white.x *u.body.radius)) * shortSide) + centerX,
                        y: ((u.body.y +(u.eye!.white.y *u.body.radius)) * shortSide) + centerY,
                        radius: u.body.radius *u.eye!.white.radius *shortSide,
                    })
                );
            drawFusionPath(whites, config.styles[style].base);
            whites.forEach(white => drawCircle(white, config.styles[style].base));
            const irises = layer.units
                .filter(u => undefined !== u.eye && ! Model.isOutOfCanvas(u.eye.iris))
                .map
                (
                    u =>
                    ({
                        x: ((u.body.x +(u.eye!.iris.x *u.body.radius)) * shortSide) + centerX,
                        y: ((u.body.y +(u.eye!.iris.y *u.body.radius)) * shortSide) + centerY,
                        radius: u.body.radius *u.eye!.iris.radius *shortSide,
                    })
                );
            drawFusionPath(irises, config.styles[style].accent);
            irises.forEach(iris => drawCircle(iris, config.styles[style].accent));
            console.log({ whites, irises });
        }
    };
    export const draw = () =>
    {
        context.fillStyle = config.styles[style].base;
        context.fillRect(0, 0, canvas.width, canvas.height);
        drawLayer(Model.Data.accent, config.styles[style].accent);
        drawLayer(Model.Data.main, config.styles[style].main);
    };
}