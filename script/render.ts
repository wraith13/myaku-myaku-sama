import { Model } from "./model";
import { UI } from "./ui";
import config from "@resource/config.json";
export namespace Render
{
    type Coloring = (typeof config.coloring)[keyof typeof config.coloring];
    const isRandomColoring = (): boolean =>
        undefined === config.coloring[UI.coloring as keyof typeof config.coloring];
    const getColoring = (): Coloring =>
    {
        if (isRandomColoring())
        {
            let index = Math.floor(Math.random() * Object.keys(config.coloring).length);
            let key = Object.keys(config.coloring)[index] as keyof typeof config.coloring;
            let result = config.coloring[key];
            if (isSameColoring(newColors, result))
            {
                index = (index + 1) % Object.keys(config.coloring).length;
                key = Object.keys(config.coloring)[index] as keyof typeof config.coloring;
                result = config.coloring[key];
            }
            return result;
        }
        else
        {
            return config.coloring[UI.coloring as keyof typeof config.coloring];
        }
    };
    const getColors = (): Coloring =>
    {
        const coloring = getColoring();
        return { base: coloring.base, main: coloring.main, accent: coloring.accent, };
    };
    let changedColoringAt = 0;
    let oldColors: Coloring = getColors();
    let newColors: Coloring = getColors();
    const isSameColoring = (a: Coloring, b: Coloring): boolean =>
        a.base === b.base && a.main === b.main && a.accent === b.accent;
    export const updateColoring = () =>
    {
        const colors = getColors();
        if ( ! isSameColoring(newColors, colors))
        {
            oldColors = getCurrentColors();
            newColors = colors;
            changedColoringAt = performance.now();
        }
    };
    const mixColor = (oldColor: string, newColor: string, rate: number): string =>
    {
        const boost = 1.0 +(config.rendering.antiDullnessBoost * Math.sin(Math.PI * rate)); // Adjustment to reduce dullness of intermediate colors
        const oldR = parseInt(oldColor.slice(1, 3), 16);
        const oldG = parseInt(oldColor.slice(3, 5), 16);
        const oldB = parseInt(oldColor.slice(5, 7), 16);
        const newR = parseInt(newColor.slice(1, 3), 16);
        const newG = parseInt(newColor.slice(3, 5), 16);
        const newB = parseInt(newColor.slice(5, 7), 16);
        const currR = Math.round(Math.min((oldR + (newR -oldR) *rate) *boost, 255));
        const currG = Math.round(Math.min((oldG + (newG -oldG) *rate) *boost, 255));
        const currB = Math.round(Math.min((oldB + (newB -oldB) *rate) *boost, 255));
        return `#${currR.toString(16).padStart(2, "0")}${currG.toString(16).padStart(2, "0")}${currB.toString(16).padStart(2, "0")}`;
    };
    const mixColors = (oldColors: Coloring, newColors: Coloring, rate: number): Coloring =>
    ({
        base: mixColor(oldColors.base, newColors.base, rate),
        main: mixColor(oldColors.main, newColors.main, rate),
        accent: mixColor(oldColors.accent, newColors.accent, rate),
    });
    const getCurrentColors = () =>
    {
        const now = performance.now();
        const span = isRandomColoring() ?
            config.rendering.coloringRandomFadeDuration:
            config.rendering.coloringRegularFadeDuration;
        const rate = (now -changedColoringAt) /span;
        if (1.0 <= rate)
        {
            return newColors;
        }
        else
        if (rate <= 0.0)
        {
            return oldColors;
        }
        else
        {
            return mixColors(oldColors, newColors, rate);
        }
    };
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
    // export const remappingPoint = (parent: Model.Circle, point: Model.Point): Model.Point =>
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
    const drawLayer = (layer: Model.Layer, color: string, coloring: Coloring) =>
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
    export const draw = () =>
    {
        if (isRandomColoring() && config.rendering.randomColoringUnitDuration < (performance.now() -changedColoringAt))
        {
            updateColoring();
        }
        const coloring = getCurrentColors();
        context.fillStyle = coloring.base;
        context.fillRect(0, 0, UI.canvas.width, UI.canvas.height);
        drawLayer(Model.Data.accent, coloring.accent, coloring);
        drawLayer(Model.Data.main, coloring.main, coloring);
    };
}