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
const addPoints = (a: Point, b: Point): Point =>
({
    x: a.x + b.x,
    y: a.y + b.y,
});
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
const sumAreas = (layer: Layer) =>
    layer.units.reduce((sum, unit) => sum + Math.PI * unit.body.radius * unit.body.radius, 0);
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
const makeAnimation = (scaleRate: number, phaseRate: number = Math.random()): Animation =>
{
    const period = 500 +(Math.pow(pseudoGaussian(1), 2) * 300000);
    const result: Animation =
    {
        period,
        phase: period *phaseRate,
        scale: (0.05 + (pseudoGaussian(4) * 0.1)) *scaleRate,
    };
    return result;
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
            x:
            [
                makeAnimation(1.0 *xRatio),
                makeAnimation(0.5 *xRatio),
                makeAnimation(0.25 *xRatio),
                makeAnimation(0.125 *xRatio),
            ],
            y:
            [
                makeAnimation(1.0 *yRatio),
                makeAnimation(0.5 *yRatio),
                makeAnimation(0.25 *yRatio),
                makeAnimation(0.125 *yRatio),
            ],
        },
        sizeAnimation:
        [
            makeAnimation(1.0),
            makeAnimation(1.0),
            makeAnimation(1.0),
            makeAnimation(1.0),
            makeAnimation(1.0),
        ],
    };
    result.sizeAnimation.forEach
    (
        i =>
        {
            i.period += 250;
            //i.period *= 0.5;
            //i.phase *= 0.5;
        }
    );
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
    result.animation.appearAnimation = { period: 3000, phase: 0, scale: result.scale, };
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
    const volume = sumAreas(layer);
    const longSideRatio = 0 < shortSide ? longSide / shortSide: 0;
    const areaRatio = volume /(longSideRatio *2.0);
    if (areaRatio < 1.0)
    {
        const makeUnitCooldown = 1000 *areaRatio;
        if (makeUnitCooldown <= timestamp -layer.lastMadeAt)
        {
            layer.units.push(makeUnit({ x: (pseudoGaussian(1) -0.5) *window.innerWidth/ shortSide, y: (pseudoGaussian(1) -0.5) *window.innerHeight /shortSide, }));
            layer.lastMadeAt = timestamp;
        }
    }
    else
    if (1.0 < areaRatio || (0.5 < areaRatio && layer.lastRemovedAt +3000 < timestamp))
    {
        const removeUnitCooldown = 1000 /areaRatio;
        if (removeUnitCooldown <= timestamp -layer.lastRemovedAt)
        {
            const target = layer.units
                .filter((unit) => undefined === unit.animation.vanishAnimation && undefined === unit.animation.vanishAnimation)
                //.sort(Comparer.make([a => -Math.hypot(a.body.x, a.body.y), a => -a.body.radius]))[0];
                //.sort(Comparer.make(a => -a.body.radius))[0];
                [0];
            if (target)
            {
                target.animation.vanishAnimation = { period: 1500, phase: 0, scale: target.scale, };
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
const updateXAnimationStretch = (animation: Animation, xScale: number) =>
{
    animation.scale *= xScale;
};
const updateYAnimationStretch = (animation: Animation, yScale: number) =>
{
    animation.scale *= yScale;
};
const updateCircleStretch = (circle: Circle, xScale: number, yScale: number) =>
{
    const radiusScale = Data.width <= Data.height ?
        window.innerWidth / Data.width:
        window.innerHeight / Data.height;
    circle.x *= xScale;
    circle.y *= yScale;
    circle.radius *= radiusScale;
};
const updateLayerStretch = (layer: Layer) =>
{
    const xScale = window.innerWidth / Data.width;
    const yScale = window.innerHeight / Data.height;
    layer.units.forEach
    (
        i =>
        {
            updateCircleStretch(i.body, xScale, yScale);
            i.animation.moveAnimation.x.forEach(a => updateXAnimationStretch(a, xScale));
            i.animation.moveAnimation.y.forEach(a => updateYAnimationStretch(a, yScale));
            if (i.eye)
            {
                updateCircleStretch(i.eye.white, xScale, yScale);
                updateCircleStretch(i.eye.iris, xScale, yScale);
            }
        }
    );
}
const updateStretch = () =>
{
    updateLayerStretch(Data.accent);
    updateLayerStretch(Data.main);
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
const context = canvas.getContext("2d");
let style = "regular" as keyof typeof config["coloring"];
if (context)
{
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
    const drawEye = (unit: Unit) =>
    {
        if (unit.eye)
        {
            drawCircle(makeCircle(addPoints(unit.body, unit.eye.white), unit.eye.white.radius), config.coloring[style].base);
            drawCircle(makeCircle(addPoints(unit.body, unit.eye.iris), unit.eye.iris.radius), config.coloring[style].accent);
        }
    };
    const draw = () =>
    {
        context.fillStyle = config.coloring[style].base;
        //context.globalCompositeOperation = "destination-out";
        context.fillRect(0, 0, canvas.width, canvas.height);
        //context.globalCompositeOperation = "source-over";
        Data.accent.units.forEach
        (
            (unit) =>
            {
                drawCircle(unit.body, config.coloring[style].accent);
                drawEye(unit);
            }
        );
        Data.main.units.forEach
        (
            (unit) =>
            {
                drawCircle(unit.body, config.coloring[style].main);
                drawEye(unit);
            }
        );
        //drawCircle({ x: 0, y: 0, radius: 0.1, }, config.coloring[style].main);
        //drawCircle({ x: 0, y: 0, radius: 0.05, }, config.coloring[style].base);
        //drawCircle({ x: 0, y: 0, radius: 0.025, }, config.coloring[style].accent);
    };
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
    console.error("Failed to get 2D context.");
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
