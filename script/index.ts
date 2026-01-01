import config from "@resource/config.json";

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
interface Inertia
{
    x: number;
    y: number;
};
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
    velocity: Inertia;
    moveAnimation: FloatAnimation;
    sizeAnimation: Animation[];
};
//type animationMode = "gaze" | "float";
interface EyeAnimation
{
    //animationMode: animationMode;
    irisVelocity: Inertia;
    moveAnimation: FloatAnimation[];
    appearAnimation: Animation;
    vanishAnimation: Animation;
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
};
const Data =
{
    previousTimestamp: 0,
    width: 0,
    height: 0,
    accent: { units: [], } as Layer,
    main: { units: [], } as Layer,
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
const makeAnimation = (scaleRate: number): Animation =>
{
    const phase = 500 +(Math.random() * 100000);
    const result: Animation =
    {
        period: phase *Math.random(),
        phase,
        scale: (0.05 + Math.random() * 0.1) *scaleRate,
    };
    return result;
};
const makeUnitAnimation = (): UnitAnimation =>
{
    const result: UnitAnimation =
    {
        velocity:
        {
            x: 0,
            y: 0,
        },
        moveAnimation:
        {
            x: [ makeAnimation(1.0), makeAnimation(0.5), makeAnimation(0.25), makeAnimation(0.125), ],
            y: [ makeAnimation(1.0), makeAnimation(0.5), makeAnimation(0.25), makeAnimation(0.125), ],
        },
        sizeAnimation: [ makeAnimation(1.0), ],
    };
    return result;
};
const makeUnit = (point: Point): Unit =>
{
    const result =
    {
        body: makeCircle(point, (Math.random() *0.19) +0.01),
        animation: makeUnitAnimation(),
    };
    return result;
};
const updateUnit = (unit: Unit, step: number) =>
{
    unit.body.x += accumulateAnimationSineIntegral(unit.animation.moveAnimation.x, step /2000);
    unit.body.y += accumulateAnimationSineIntegral(unit.animation.moveAnimation.y, step /2000);
    updateFloatAnimation(unit.animation.moveAnimation, step);
};
const updateLayer = (layer: Layer, step: number) =>
{
    if (sumAreas(layer) < 2.0)
    {
        layer.units.push
        (
            makeUnit
            (
                // { x: Math.random() -0.5, y: Math.random() -0.5, }
                { x: 0, y: 0, }
            )
        );
    }
    layer.units.forEach((unit) => updateUnit(unit, step));
};
const updateCircleStretch = (circle: Circle) =>
{
    const xScale = window.innerWidth / Data.width;
    const yScale = window.innerHeight / Data.height;
    const radiusScale = Math.hypot(window.innerWidth, window.innerHeight) / Math.hypot(Data.width, Data.height);
    circle.x *= xScale;
    circle.y *= yScale;
    circle.radius *= radiusScale;
};
const updateLayerStretch = (layer: Layer) =>
{
    layer.units.forEach
    (
        i =>
        {
            updateCircleStretch(i.body);
            if (i.eye)
            {
                updateCircleStretch(i.eye.white);
                updateCircleStretch(i.eye.iris);
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
    const step = 0 < Data.previousTimestamp ? (timestamp - Data.previousTimestamp): 0;
    if (window.innerWidth !== Data.width || window.innerHeight !== Data.height)
    {
        updateStretch();
    }
    updateLayer(Data.accent, step);
    updateLayer(Data.main, step);
    Data.previousTimestamp = timestamp;
};
console.log("Window loaded.");
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d");
if (context)
{
    const style = "regular" as keyof typeof config["coloring"];
    const drawCircle = (circle: Circle, color: string) =>
    {
        const shortSide = Math.min(canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        context.beginPath();
        context.arc((circle.x *shortSide) +centerX, (circle.y *shortSide) +centerY, circle.radius *shortSide, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.closePath();
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
        context.fillRect(0, 0, canvas.width, canvas.height);
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
        //drawCircle({ x: 0, y: 0, radius: 0.25, }, config.coloring[style].main);
        drawCircle({ x: 0, y: 0, radius: 0.125, }, config.coloring[style].base);
        drawCircle({ x: 0, y: 0, radius: 0.0625, }, config.coloring[style].accent);
    };
    const step = (timestamp: number) =>
    {
        updateData(timestamp);
        draw();
        window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
    console.log("Canvas initialized.");
}
else
{
    console.error("Failed to get 2D context.");
}
