import config from "@resource/config.json";

console.log({ config });

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
            const style = "regular" as const;
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
            const updateWindowSize = () =>
            {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                draw();
            };
            updateWindowSize();
            window.addEventListener("resize", () => updateWindowSize());
            window.addEventListener("orientationchange", () => updateWindowSize());
        }
        else
        {
            console.error("Failed to get 2D context.");
            return;
        }
        console.log("Canvas initialized.");
    }
);