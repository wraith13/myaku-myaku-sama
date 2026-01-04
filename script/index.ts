//import { Comparer } from "./comparer";
import { Fps } from "./fps";
import config from "@resource/config.json";
const fpsDiv = document.getElementById("fps");
const pseudoGaussian = (samples: number = 6): number =>
{
    let total = 0;
    for (let i = 0; i < samples; i++)
    {
        total += Math.random();
    }
    return total / samples;
};
interface Point
{
    x: number;
    y: number;
};
// const addPoints = (a: Point, b: Point): Point =>
// ({
//     x: a.x + b.x,
//     y: a.y + b.y,
// });
interface Animation
{
    period: number;
    phase: number;
    scale: number;
}
interface FloatAnimation
{
    x: Animation[];
    y: Animation[];
};
interface UnitAnimation
{
    moveAnimation: FloatAnimation;
    sizeAnimation: Animation[];
    appearAnimation?: Animation;
    vanishAnimation?: Animation;
};
//type animationMode = "gaze" | "float";
interface EyeAnimation
{
    //animationMode: animationMode;
    moveAnimation: FloatAnimation[];
    appearAnimation?: Animation;
    vanishAnimation?: Animation;
};
interface Circle extends Point
{
    radius: number;
};
const makeCircle = (point: Point, radius: number): Circle =>
({
    x: point.x,
    y: point.y,
    radius,
});
interface Unit
{
    body: Circle;
    scale: number;
    animation: UnitAnimation;
    eye?:
    {
        white: Circle;
        iris: Circle;
        animation: EyeAnimation;
    };
};
interface Layer
{
    units: Unit[];
    lastMadeAt: number;
    lastRemovedAt: number;
};
const Data =
{
    previousTimestamp: 0,
    width: 0,
    height: 0,
    accent: { units: [], lastMadeAt: 0, lastRemovedAt: 0, } as Layer,
    main: { units: [], lastMadeAt: 0, lastRemovedAt: 0, } as Layer,
};
const isOutOfCanvas = (circle: Circle) =>
{
    const marginRate = config.rendering.marginRate;
    const shortSide = Math.min(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const x = (circle.x *marginRate *shortSide) +centerX;
    const y = (circle.y *marginRate *shortSide) +centerY;
    return (x +circle.radius *shortSide < 0 ||
            y +circle.radius *shortSide < 0 ||
            canvas.width < x -circle.radius *shortSide ||
            canvas.height < y -circle.radius *shortSide);
};
const sumValidAreas = (layer: Layer) =>
    layer.units
        .filter(unit => ! isOutOfCanvas(unit.body))
        .reduce((sum, unit) => sum + Math.PI * unit.body.radius * unit.body.radius, 0);
const sumAllAreas = (layer: Layer) =>
    layer.units
        .reduce((sum, unit) => sum + Math.PI * unit.body.radius * unit.body.radius, 0);
const calculateAnimationSineIntegral = (animation: Animation, step: number): number =>
{
    // return stepで積分(Math.sin((animation.phase / animation.period) * Math.PI * 2));
    if (animation.period <= 0 || 0 === step)
    {
        return 0;
    }
    else
    {
        const omega = (2 * Math.PI) / animation.period;
        // ∫0^step sin(omega*(phase + τ)) dτ = (cos(omega*phase) - cos(omega*(phase + step))) / omega
        const integral = (Math.cos(omega * animation.phase) - Math.cos(omega * (animation.phase + step))) / omega;
        return integral * animation.scale;
    }
};
const accumulateAnimationSineIntegral = (animations: Animation[], step: number): number =>
    animations.reduce((sum, animation) => sum + calculateAnimationSineIntegral(animation, step), 0);
const accumulateAnimationSize = (animations: Animation[], step: number): number =>
    animations.reduce
    (
        (product, animation) =>
        {
            const phase = animation.phase + step;
            return product +Math.pow(Math.sin((phase / animation.period) * Math.PI), 2) *0.5 *animation.scale;
        },
        0.0
    );
const updateAnimation = (animation: Animation, step: number) =>
{
    animation.phase += step;
    while(animation.period <= animation.phase)
    {
        animation.phase -= animation.period;
    }
};
const updateAnimations = (animations: Animation[] , step: number) =>
    animations.forEach((animation) => updateAnimation(animation, step));
const updateFloatAnimation = (floatAnimation: FloatAnimation, step: number) =>
{
    updateAnimations(floatAnimation.x, step);
    updateAnimations(floatAnimation.y, step);
};
const makeAnimation = (specific: { period: { base: number, pseudoGaussian: number, range: number }, scale: { base: number, pseudoGaussian: number, range: number } }, scaleRate: number): Animation =>
{
    const period = specific.period.base +(pseudoGaussian(specific.period.pseudoGaussian) * specific.period.range);
    const phase = period *Math.random();
    const scale = (specific.scale.base +(pseudoGaussian(specific.scale.pseudoGaussian) * specific.scale.range)) *scaleRate;
    return { phase, period, scale, };
};
const makeUnitAnimation = (): UnitAnimation =>
{
    // const shortSide = Math.min(window.innerWidth, window.innerHeight) *3.0;
    // const xRatio = window.innerWidth / shortSide;
    // const yRatio = window.innerHeight / shortSide;
    const xRatio = 1.0;
    const yRatio = 1.0;
    const result: UnitAnimation =
    {
        moveAnimation:
        {
            x: config.Layer.unit.moveAnimation.elements.map(i => makeAnimation(config.Layer.unit.moveAnimation, i *xRatio)),
            y: config.Layer.unit.moveAnimation.elements.map(i => makeAnimation(config.Layer.unit.moveAnimation, i *yRatio)),
        },
        sizeAnimation:
            config.Layer.unit.sizeAnimation.elements.map(i => makeAnimation(config.Layer.unit.sizeAnimation, i)),
    };
    return result;
};
const makeUnit = (point: Point): Unit =>
{
    const body = makeCircle(point, (Math.pow(pseudoGaussian(4), 2) *0.19) +0.01);
    const result =
    {
        body,
        scale: body.radius,
        animation: makeUnitAnimation(),
    };
    //updateUnit(result, Math.random() *10000);
    result.animation.appearAnimation =
    {
        period: config.Layer.unit.appearAnimation.period,
        phase: 0,
        scale: result.scale,
    };
    return result;
};
const updateUnit = (unit: Unit, step: number) =>
{
    const rate = 0.0005;
    unit.body.x += accumulateAnimationSineIntegral(unit.animation.moveAnimation.x, step) *rate;
    unit.body.y += accumulateAnimationSineIntegral(unit.animation.moveAnimation.y, step) *rate;
    const transion = unit.animation.appearAnimation ?? unit.animation.vanishAnimation;
    if (transion)
    {
        transion.phase += step;
        if (unit.animation.vanishAnimation)
        {
            unit.body.radius = transion.scale *(1.0 - (transion.phase /transion.period));
            if (transion.period <= transion.phase)
            {
                unit.animation.vanishAnimation = undefined;
            }
        }
        else
        {
            unit.body.radius = transion.scale *(transion.phase /transion.period);
            if (transion.period <= transion.phase)
            {
                unit.animation.appearAnimation = undefined;
            }
        }
    }
    const scale = transion ? unit.body.radius: unit.scale;
    unit.body.radius = scale *(1 +(accumulateAnimationSize(unit.animation.sizeAnimation, step) *2.0));
    updateFloatAnimation(unit.animation.moveAnimation, step);
    updateAnimations(unit.animation.sizeAnimation, step);
};
const updateLayer = (layer: Layer, timestamp: number, step: number) =>
{
    const shortSide = Math.min(window.innerWidth, window.innerHeight);
    const longSide = Math.max(window.innerWidth, window.innerHeight);
    const validVolume = sumValidAreas(layer);
    const allVolume = sumAllAreas(layer);
    const longSideRatio = 0 < shortSide ? longSide / shortSide: 0;
    const validAreaRatio = validVolume /(longSideRatio *2.0);
    const allAreaRatio = allVolume /Math.min(longSideRatio *2.0, validVolume);
    if (validAreaRatio < 0.5)
    {
        const makeUnitCooldown = 1000 *validAreaRatio;
        if (makeUnitCooldown <= timestamp -layer.lastMadeAt)
        {
            layer.units.push(makeUnit({ x: (pseudoGaussian(1) -0.5) *window.innerWidth/ shortSide, y: (pseudoGaussian(1) -0.5) *window.innerHeight /shortSide, }));
            layer.lastMadeAt = timestamp;
        }
    }
    else
    if (1.0 < allAreaRatio || (0.5 < allAreaRatio && layer.lastRemovedAt +3000 < timestamp))
    {
        const removeUnitCooldown = 1000 /allAreaRatio;
        if (removeUnitCooldown <= timestamp -layer.lastRemovedAt)
        {
            const target = layer.units.filter((unit) => undefined === unit.animation.vanishAnimation)[0];
            if (target)
            {
                target.animation.vanishAnimation =
                {
                    period: config.Layer.unit.vanishAnimation.period,
                    phase: 0,
                    scale: target.scale,
                };
                layer.lastRemovedAt = timestamp;
            }
        }
    }
    layer.units.forEach((unit) => updateUnit(unit, step));
    const gabages = layer.units.filter((unit) => unit.body.radius <= 0);
    gabages.forEach
    (
        (garbage) =>
        {
            const index = layer.units.indexOf(garbage);
            if (0 <= index)
            {
                layer.units.splice(index, 1);
            }
        }
    );
};
const updateStretch = () =>
{
    canvas.width = Data.width = window.innerWidth;
    canvas.height = Data.height = window.innerHeight;
};
const updateData = (timestamp: number) =>
{
    const step = 0 < Data.previousTimestamp ? Math.min(timestamp - Data.previousTimestamp, 500): 0;
    if (window.innerWidth !== Data.width || window.innerHeight !== Data.height)
    {
        updateStretch();
    }
    updateLayer(Data.accent, timestamp, step);
    updateLayer(Data.main, timestamp, step);
    Data.previousTimestamp = timestamp;
};
console.log("Window loaded.");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
let style = "regular" as keyof typeof config["coloring"];
type FusionStatus = "none" | "wired" | "proximity" | "contact" | "inclusion";
const hasFusionPath = (fusionStatus: FusionStatus) =>
    [ "none", "inclusion" ].indexOf(fusionStatus) < 0;
const isContacted = (fusionStatus: FusionStatus) =>
    0 <= [ "contact", "inclusion" ].indexOf(fusionStatus);
interface CirclesConnection
{
    sumRadius: number;
    minRadius: number;
    fusionLimit: number;
    fusionDelta: number;
    //angle: number;
    distance: number;
}
const getFusionStatus = (data: CirclesConnection): FusionStatus =>
{
    if (data.fusionLimit < data.distance)
    {
        return "none";
    }
    if (data.sumRadius +data.fusionDelta *2 <= data.distance)
    {
        return "wired";
    }
    if (data.sumRadius < data.distance)
    {
        return "proximity";
    }
    if (data.sumRadius -data.minRadius *2 < data.distance)
    {
        return "contact";
    }
    return "inclusion";
};
const fusionLimitRate = 3;
const fusionDeltaRate = 0.1;
const minCurveAngleRate = 1.0;
const drawFusionPath = (circles: Circle[], color: string) =>
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
            const fusionDelta = minRadius *fusionDeltaRate;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const angle = Math.atan2(dy, dx);
            const distance = Math.hypot(dx, dy);
            const fusionStatus = getFusionStatus({ sumRadius, minRadius, fusionLimit, fusionDelta, distance, });
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
                const tp1: Point =
                {
                    x: a.x + a.radius * Math.cos(angle + theta1),
                    y: a.y + a.radius * Math.sin(angle + theta1)
                };
                const tp3: Point =
                {
                    x: b.x + b.radius * Math.cos(angle + (Math.PI +theta2)),
                    y: b.y + b.radius * Math.sin(angle + (Math.PI +theta2))
                };

                // 右タンジェント (tp2 on c1, tp4 on c2)
                const tp2: Point =
                {
                    x: a.x + a.radius * Math.cos(angle -theta1),
                    y: a.y + a.radius * Math.sin(angle -theta1)
                };
                const tp4: Point =
                {
                    x: b.x + b.radius * Math.cos(angle +(Math.PI -theta2)),
                    y: b.y + b.radius * Math.sin(angle +(Math.PI -theta2))
                };
                const cp0: Point =
                {
                    x: (tp1.x +tp2.x + tp3.x + tp4.x) /4,
                    y: (tp1.y +tp2.y + tp3.y + tp4.y) /4,
                };
                const contactDist = sumRadius +minRadius;
                const cpRate = contactDist <= distance ? 0:
                    Math.min(1, (contactDist -distance) / (minRadius *2));
                const cp1: Point = contactDist <= distance ?
                cp0:
                {
                    x: cp0.x *(1 -cpRate) + ((tp1.x +tp4.x) /2) *cpRate,
                    y: cp0.y *(1 -cpRate) + ((tp1.y +tp4.y) /2) *cpRate,
                };
                const cp2: Point = contactDist <= distance ?
                cp0:
                {
                    x: cp0.x *(1 -cpRate) + ((tp2.x +tp3.x) /2) *cpRate,
                    y: cp0.y *(1 -cpRate) + ((tp2.y +tp3.y) /2) *cpRate,
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
const drawCircle = (circle: Circle, color: string) =>
{
    if (0 <= circle.radius)
    {
        const shortSide = Math.min(canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        context.beginPath();
        context.arc((circle.x *shortSide) +centerX, (circle.y *shortSide) +centerY, circle.radius *shortSide, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.closePath();
    }
};
const drawLayer = (layer: Layer, color: string) =>
{
    const shortSide = Math.min(canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    drawFusionPath
    (
        layer.units.map(u => u.body)
        // .concat([ { x: 0, y: 0, radius: 0.1, } ])
        .filter(c => !isOutOfCanvas(c))
        .map
        (
            c =>
            ({
                x: (c.x * shortSide) + centerX,
                y: (c.y * shortSide) + centerY,
                radius: c.radius *shortSide,
            })
        ),
        color
    );
    layer.units.forEach
    (
        (unit) =>
        {
            drawCircle(unit.body, color);
        }
    );
    if (layer === Data.main)
    {
        drawFusionPath
        (
            layer.units.map(u => u.body)
            .filter(c => config.eye.appearRate <= c.radius)
            .filter(c => !isOutOfCanvas(c))
            .map
            (
                c =>
                ({
                    x: (c.x * shortSide) + centerX,
                    y: (c.y * shortSide) + centerY,
                    radius: c.radius *shortSide *config.eye.whiteRate,
                })
            ),
            config.coloring[style].base
        );
        drawFusionPath
        (
            layer.units.map(u => u.eye?.white)
            .filter(c => undefined !== c)
            .filter(c => !isOutOfCanvas(c))
            .map
            (
                c =>
                ({
                    x: (c.x * shortSide) + centerX,
                    y: (c.y * shortSide) + centerY,
                    radius: c.radius *shortSide,
                })
            ),
            config.coloring[style].base
        );
        layer.units.forEach
        (
            (unit) =>
            {
                if (config.eye.appearRate <= unit.body.radius && ! isOutOfCanvas(unit.body))
                {
                    drawCircle({ x: unit.body.x, y: unit.body.y, radius: unit.body.radius *config.eye.whiteRate, }, config.coloring[style].base);
                }
            }
        );
        drawFusionPath
        (
            layer.units.map(u => u.body)
            .filter(c => config.eye.appearRate <= c.radius)
            .filter(c => !isOutOfCanvas(c))
            .map
            (
                c =>
                ({
                    x: (c.x * shortSide) + centerX,
                    y: (c.y * shortSide) + centerY,
                    radius: c.radius *shortSide *config.eye.irisRate,
                })
            ),
            config.coloring[style].accent
        );
        drawFusionPath
        (
            layer.units.map(u => u.eye?.iris)
            .filter(c => undefined !== c)
            .filter(c => !isOutOfCanvas(c))
            .map
            (
                c =>
                ({
                    x: (c.x * shortSide) + centerX,
                    y: (c.y * shortSide) + centerY,
                    radius: c.radius *shortSide,
                })
            ),
            config.coloring[style].accent
        );
        layer.units.forEach
        (
            (unit) =>
            {
                if (config.eye.appearRate <= unit.body.radius && ! isOutOfCanvas(unit.body))
                {
                    drawCircle({ x: unit.body.x, y: unit.body.y, radius: unit.body.radius *config.eye.irisRate, }, config.coloring[style].accent);
                }
            }
        );
    }
};
const draw = () =>
{
    context.fillStyle = config.coloring[style].base;
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawLayer(Data.accent, config.coloring[style].accent);
    drawLayer(Data.main, config.coloring[style].main);
    // const body = 0.1;
    // drawCircle({ x: 0, y: 0, radius: body, }, config.coloring[style].main);
    // drawCircle({ x: 0, y: 0, radius: body *config.eye.whiteRate, }, config.coloring[style].base);
    // drawCircle({ x: 0, y: 0, radius: body *config.eye.irisRate, }, config.coloring[style].accent);
};
if (context)
{
    const step = (timestamp: number) =>
    {
        updateData(timestamp);
        draw();
        if (fpsDiv && fpsDiv.style.display !== "none")
        {
            Fps.step(timestamp);
            fpsDiv.innerText = Fps.getText();
        }
        window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
    console.log("Canvas initialized.");
}
else
{
    console.error("Failed to get 2D connection.");
}
if (document.fullscreenEnabled || (<any>document).webkitFullscreenEnabled)
{
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if ("f" === event.key.toLowerCase())
            {
                const elem = document.documentElement;
                if (document.fullscreenEnabled)
                {
                    if ( ! document.fullscreenElement)
                    {
                        elem.requestFullscreen();
                    }
                    else
                    {
                        document.exitFullscreen();
                    }
                }
                else
                {
                    if ((<any>document).webkitFullscreenEnabled)
                    {
                        if ( ! (<any>document).webkitFullscreenElement)
                        {
                            (<any>elem).webkitRequestFullscreen();
                        }
                        else
                        {
                            (<any>document).webkitExitFullscreen();
                        }
                    }
                }
            }
        }
    );
}
if (fpsDiv)
{
    //fpsDiv.style.display = "none";
    document.addEventListener
    (
        "keydown",
        (event) =>
        {
            if ("s" === event.key.toLowerCase())
            {
                if ("none" === fpsDiv.style.display)
                {
                    fpsDiv.style.display = "block";
                }
                else
                {
                    fpsDiv.style.display = "none";
                }
            }
        }
    );
}
document.addEventListener
(
    "click",
    () =>
    {
        const keys = Object.keys(config.coloring) as (keyof typeof config["coloring"])[];
        const currentIndex = keys.indexOf(style);
        const nextIndex = (currentIndex + 1) %keys.length;
        style = keys[nextIndex];
    }
);
export class ToggleClassForWhileTimer
{
    timer: ReturnType<typeof setTimeout> | undefined;
    constructor()
    {
        this.timer = undefined;
    }
    start(element: HTMLElement, token: string, span: number, onEnd?: () => unknown)
    {
        if (this.isInTimer())
        {
            clearTimeout(this.timer);
        }
        element.classList.toggle(token, true);
        this.timer = setTimeout
        (
            () =>
            {
                // if (config.log["ToggleClassForWhileTimer.Timeout"])
                // {
                //     console.log("⌛️ ToggleClassForWhileTimer.Timeout", element, token, span);
                // }
                this.timer = undefined;
                element.classList.toggle(token, false);
                onEnd?.();
            },
            span
        );
    }
    isInTimer = () => undefined !== this.timer;
}
const mouseMoveTimer = new ToggleClassForWhileTimer();
export const mousemove = () =>
    mouseMoveTimer.start(document.body, "mousemove", 3000);
document.addEventListener
(
    "mousemove",
    (_event) =>
    {
        mousemove();
    }
);
