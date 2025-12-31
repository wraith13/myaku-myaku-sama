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
interface FloatAnimation
{
    angle: number;
    radiusStep: number;
    angularVelocity: number;
    radialVelocity: number;
};
interface SizeAnimation
{
    targetRadius: number;
    sizeVelocity: number;
};
interface UnitAnimation
{
    velocity: Inertia;
    moveAnimation: FloatAnimation;
    sizeAnimation: SizeAnimation;
};
type animationMode = "gaze" | "float";
interface EyeAnimation
{
    //animationMode: animationMode;
    irisVelocity: Inertia;
    moveAnimation: FloatAnimation;
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
const updateLayer = (layer: Layer, timestamp: number) =>
{
    if (sumAreas(layer) < 0.5)
    {

    }
    
};
const updateData = (timestamp: number) =>
{
    updateLayer(Data.accent, timestamp);
    updateLayer(Data.main, timestamp);
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