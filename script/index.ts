import config from "@resource/config.json";

interface Point
{
    x: number;
    y: number;
}
interface Inertia
{
    x: number;
    y: number;
}
interface FloatAnimation
{
    angle: number;
    radiusStep: number;
    angularVelocity: number;
    radialVelocity: number;
}
interface UnitAnimation
{
    velocity: Inertia;
    moveAnimation: FloatAnimation;
}
type animationMode = "gaze" | "float";
interface EyeAnimation
{
    //animationMode: animationMode;
    irisVelocity: Inertia;
    moveAnimation: FloatAnimation;
}
interface Circle extends Point
{
    radius: number;
}
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
}
type Layer = Unit[];
const Data =
{
    previousTimestamp: 0,
    accent: [] as Layer,
    main: [] as Layer,
};
const sumAreas = (layer: Layer) =>
    layer.reduce((sum, unit) => sum + Math.PI * unit.body.radius * unit.body.radius, 0);
const updateLayer = (layer: Layer, timestamp: number) =>
{
};
const updateData = (timestamp: number) =>
{
    updateLayer(Data.accent, timestamp);
    updateLayer(Data.main, timestamp);
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
            const drawCircle = (x: number, y: number, radius: number, color: string) =>
            {
                context.beginPath();
                context.arc(x, y, radius, 0, Math.PI * 2);
                context.fillStyle = color;
                context.fill();
                context.closePath();
            };
            const draw = () =>
            {
                context.fillStyle = config.coloring[style].base;
                context.fillRect(0, 0, canvas.width, canvas.height);
                const shortSide = Math.min(canvas.width, canvas.height);
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const radius = shortSide / 4;
                drawCircle(centerX, centerY, radius, config.coloring[style].main);
                drawCircle(centerX, centerY, radius *0.5, config.coloring[style].base);
                drawCircle(centerX, centerY, radius *0.25, config.coloring[style].accent);
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