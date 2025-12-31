import config from "@resource/config.json";

interface Point
{
    x: number;
    y: number;
};
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
type animationMode = "gaze" | "float";
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
const makeUnitAnimation = (): UnitAnimation =>
{
    const result: UnitAnimation =
    {

    };
    return result;
};
const makeUnit = (position: Point): Unit =>
{
    const result =
    {
        body:
        {
            x: position.x,
            y: position.y,
            radius: 0,
        },
        animation: makeUnitAnimation(),
    };
    return result;
};
const updateUnit = (unit: Unit, step: number) =>
{
    unit.body.x += accumulateAnimationSineIntegral(unit.animation.moveAnimation.x, step);
    unit.body.y += accumulateAnimationSineIntegral(unit.animation.moveAnimation.y, step);
    updateFloatAnimation(unit.animation.moveAnimation, step);
};
const updateLayer = (layer: Layer, step: number) =>
{
    if (sumAreas(layer) < 0.5)
    {

    }
    layer.units.forEach((unit) => updateUnit(unit, step));
};
const updateData = (timestamp: number) =>
{
    const step = 0 < Data.previousTimestamp ? (timestamp - Data.previousTimestamp): 0;
    updateLayer(Data.accent, step);
    updateLayer(Data.main, step);
    Data.previousTimestamp = timestamp;
};
window.addEventListener
(
    "load",
    () =>
    {
        console.log("Window loaded.");
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        if (context)
        {
            const updateWindowSize = () =>
            {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            updateWindowSize();
            window.addEventListener("resize", () => updateWindowSize());
            window.addEventListener("orientationchange", () => updateWindowSize());
            const style = "regular" as keyof typeof config["coloring"];
            const drawCircle = (circle: Circle, color: string) =>
            {
                context.beginPath();
                context.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                context.fillStyle = color;
                context.fill();
                context.closePath();
            };
            const drawEye = (eye: Unit["eye"]) =>
            {
                if (eye)
                {
                    drawCircle(eye.white, config.coloring[style].base);
                    drawCircle(eye.iris, config.coloring[style].accent);
                }
            };
            const draw = () =>
            {
                context.fillStyle = config.coloring[style].base;
                context.fillRect(0, 0, canvas.width, canvas.height);
                // const shortSide = Math.min(canvas.width, canvas.height);
                // const centerX = canvas.width / 2;
                // const centerY = canvas.height / 2;
                // const radius = shortSide / 4;
                // drawCircle({ x: centerX, y: centerY, radius }, config.coloring[style].main);
                // drawCircle({ x: centerX, y: centerY, radius: radius *0.5}, config.coloring[style].base);
                // drawCircle({ x: centerX, y: centerY, radius: radius *0.25}, config.coloring[style].accent);
                Data.accent.units.forEach
                (
                    (unit) =>
                    {
                        drawCircle(unit.body, config.coloring[style].accent);
                        drawEye(unit.eye);
                    }
                );
                Data.main.units.forEach
                (
                    (unit) =>
                    {
                        drawCircle(unit.body, config.coloring[style].main);
                        drawEye(unit.eye);
                    }
                );
            };
            const step = (timestamp: number) =>
            {
                updateData(timestamp);
                draw();
                window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        }
        else
        {
            console.error("Failed to get 2D context.");
            return;
        }
        console.log("Canvas initialized.");
    }
);